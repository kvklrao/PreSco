import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {Router, Routes} from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule } from "@angular/material";
import { BabyCnsComponent } from './baby-cns.component';
import { DataService } from '../../shared/service/data.service';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from '../dashboard.component';
import { BabyGitComponent } from '../baby-git/baby-git.component';
import { Component } from '@angular/core';

@Component({
  selector: "test-test",
  template:""
})
class MockBabyGitComponent{
}

export const routes: Routes = [
  {
    path: 'dashboard', component: MockBabyGitComponent,
    children: [
      {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
      {path: 'baby-cns', component: BabyCnsComponent},
      {path: 'baby-gi-tract', component: MockBabyGitComponent}
    ],
    runGuardsAndResolvers: 'always',
  }
];

describe('BabyCnsComponent', () => {
  let component: BabyCnsComponent;
  let fixture: ComponentFixture<BabyCnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BabyCnsComponent, MockBabyGitComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule,BrowserAnimationsModule,
        MatIconModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot()],
      providers:[DataService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyCnsComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function() {
      return JSON.stringify({"test":"test"});
    });
     spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
        return store[key]=value;
      });
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  it('should create', () => {
    localStorage.setItem("login_hospital",JSON.stringify({"username":"getwell","email":"get@yahoo.com","user_type":"Hospital","id":92,"hospital_name":"getwell","hospital_branch_name":"getwell indore","hospital_branch_id":59,"staff_id":12}))
    expect(component).toBeTruthy();
  });

  it('Baby CNS form validate', () => {
    let babyFrom = component.babyCnsForm;
    expect(babyFrom.valid).toBeFalsy();

    babyFrom.controls.features_of_encephalopathy.setValue('Normal');
    expect(babyFrom.valid).toBeFalsy();

    babyFrom.controls.seizures.setValue('No');
    expect(babyFrom.valid).toBeFalsy();

    babyFrom.controls.abnormal_movements_like_tonic_posturing.setValue('No');
    expect(babyFrom.valid).toBeFalsy();

    babyFrom.controls.af_bulge.setValue('No');
    expect(babyFrom.valid).toBeFalsy();
  });

  //methods

  it('updateForm method', () => {
    let babyFrom = component.babyCnsForm;
    spyOn(babyFrom,'patchValue');
    let obj = {
      features_of_encephalopathy:"test",
      seizures:"test",
      abnormal_movements_like_tonic_posturing:"test",
      af_bulge:"test",
    }
    component.updateForm(obj);
    expect(babyFrom.patchValue).toHaveBeenCalled();
  });

  it('ngOnChanges method', () => {
    spyOn(component,'createForm');
    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();
  });

  it('reset method', () => {
    spyOn(component,'createForm');
    component.reset();
    expect(component.createForm).toHaveBeenCalled();
  });

  it('open method', () => {
    spyOn(component,'createForm');
    spyOn(component,'updateForm');

    component.open(null,{});
    expect(component.createForm).toHaveBeenCalled();

    component.open(null,{"test":"test"});
    expect(component.updateForm).toHaveBeenCalled();
  });

  it('cnsFormSubmit method', () => {
    expect(component.cnsFormSubmit()).toBeUndefined();
    let babyFrom = component.babyCnsForm;
    //spyOn(component,'goToNextReadingForm');
    babyFrom.controls.features_of_encephalopathy.setValue('Normal');
    babyFrom.controls.seizures.setValue('No');
    babyFrom.controls.abnormal_movements_like_tonic_posturing.setValue('No');
    babyFrom.controls.af_bulge.setValue('No');
    component.cnsFormSubmit();
   // expect(component.goToNextReadingForm).toHaveBeenCalled();
  });

  it('success method', () => {
    expect(component.isEdit).toBeTruthy();
    component.success({"response":[]},"get_baby_cns");
    expect(component.isEdit).toBeTruthy();
  });

  it('getReadingFormData method', () => {
    spyOn(component,'updateForm');
    component.getReadingFormData({});
    expect(component.updateForm).toHaveBeenCalled();
  });

  it('saveReadingFormData method', () => {
    spyOn(component.readingDataService,'setReadingFormData');
    component.saveReadingFormData({});
    expect(component.readingDataService.setReadingFormData).toHaveBeenCalled();
  });

  it('goToNextReadingForm method', () => {
    spyOn(component,'saveReadingFormData');
    component.goToNextReadingForm();
    expect(component.saveReadingFormData).toHaveBeenCalled();
  });
  it('ngOnInit method',()=>{
    let res = {
      response:{
        message:"sucess"
      }
  }
      var spy = spyOn(component['common_api'],'getMedicalRecordNumber').and.returnValue(of(res));
      component.ngOnInit();
      spy.calls.mostRecent().returnValue.subscribe(response=>{
          expect(response).toBe(res);
      }) 
  })

  it('onChanges method', () => {
    spyOn(component.babyCnsForm.statusChanges,'subscribe');
    component.onChanges();
    expect(component.babyCnsForm.statusChanges.subscribe).toHaveBeenCalled();
  });

  it('updateSuccessResponse method', () => {
    spyOn(component,'get_baby_cns');
    component.login_hospital = { id:123 }
    component.updateSuccessResponse(null);
    expect(component.get_baby_cns).toHaveBeenCalled();
  });

  it('ngOnInit method', () => {
    spyOn(component,'getReadingFormData');
    spyOn(component,'onChanges');

    component.ngOnInit();
    expect(component.onChanges).toHaveBeenCalled();

    component.readingDataService.setReadingFormData("baby_cns",{});
    component.ngOnInit();
    expect(component.getReadingFormData).toHaveBeenCalled();
  });

  it('success method called', () => {
    let dummyData={status:200}
    spyOn(component,'get_baby_cns');
    component.success(dummyData,'cnsFormSubmit')
    expect(component.get_baby_cns).toHaveBeenCalled();
    component.page=1;
    component.success(dummyData,'get_baby_cns');
    expect(component.isEdit).toBeFalsy();
  });


  it('onChanges method called', () => {
    spyOn(component,'createForm');
    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();
    component.reset();
    expect(component.createForm).toHaveBeenCalled();
  });

  it('open method called', () => {
    spyOn(component,'updateForm');
    component.open('content',{data:123});
    expect(component.updateForm).toHaveBeenCalled();
    expect(component.isEdit).toBeTruthy();
    expect(component.isEditClicked).toBeTruthy();
    spyOn(component,'createForm');
    component.open('content',{});
    expect(component.createForm).toHaveBeenCalled();
    expect(component.isEdit).toBeTruthy();
  });

  it('get_baby_cns method called', () => {
    let res = {
      response:{
        message:"sucess"
      }
  }
      var spy = spyOn(component['common_api'],'get_tabs').and.returnValue(of(res));
      component.get_baby_cns(100,100,1,"R1");
      spy.calls.mostRecent().returnValue.subscribe(response=>{
          expect(response).toBe(res);
      }) 
  });

  it('updateCNSForm method called', () => {
    component.createForm(1);
    component.readingDataService['reading']="R1";
    component.id=100;
    component.loggedInUserId=400;
    component.babyCnsForm.patchValue({
      study_id: 12,
      features_of_encephalopathy: "yes",
      seizures: "yes",
      abnormal_movements_like_tonic_posturing:
        "NA",
      af_bulge: "NA",
      baby_movement: "NA"


    });
    let res = {
      response:{
        message:"sucess"
      }
  }
      var spy = spyOn(component['common_api'],'updateFormData').and.returnValue(of(res));
      component.updateCNSForm();
      spy.calls.mostRecent().returnValue.subscribe(response=>{
          expect(response).toBe(res);
      }) 
  });

  it('errorToasty method called', () => {
    spyOn(component['toastr'],'error');
    component.errorToasty({message:"test"})
    expect(component['toastr'].error).toHaveBeenCalled();
    component.errorToasty({})
    expect(component['toastr'].error).toHaveBeenCalled();
  });
  

});
