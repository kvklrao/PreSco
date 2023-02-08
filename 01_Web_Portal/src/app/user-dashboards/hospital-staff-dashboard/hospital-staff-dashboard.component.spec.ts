import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalStaffDashboardComponent } from './hospital-staff-dashboard.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppHelper } from 'src/app/shared/helper/app.helper';
import { ToastrModule } from 'ngx-toastr';
import { CommonService } from 'src/app/shared/service/common/common.service';
import { of } from 'rxjs';
import { emptyDataPipe } from 'src/app/shared/pipes/empty-data.pipe';
import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: "test-test",
  template:""
})
class MockBabyGitComponent{
}
export const routes: Routes = [
  {
    path: 'dashboard', component: MockBabyGitComponent,
  }
];

describe('HospitalStaffDashboardComponent', () => {
  let component: HospitalStaffDashboardComponent;
  let fixture: ComponentFixture<HospitalStaffDashboardComponent>;
  let commonService:CommonService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalStaffDashboardComponent,MockBabyGitComponent,emptyDataPipe ],
      imports:[
        ReactiveFormsModule,
        FormsModule,
        NgbModalModule,
        BrowserAnimationsModule,
        NgxPaginationModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot(),
      ],
      providers:[
        AppHelper,
        CommonService
      ]
    })
    .compileComponents();
    commonService = TestBed.get(CommonService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalStaffDashboardComponent);
    component = fixture.componentInstance;

    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify({ "id": 125, "hospital_branch_id":12345 });
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value;
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  it('should create', () => {
    localStorage.setItem("login_hospital",JSON.stringify({"id":92,"hospital_branch_id":12345}));

    expect(component).toBeTruthy();
  });
  it('onDropDownChange method',()=>{
    spyOn(component,'getMedicalRecords');
    component.onDropDownChange(10);
    expect(component.getMedicalRecords).toHaveBeenCalled();
  });
  it('nextPage method',()=>{
    spyOn(component,'getMedicalRecords');
    component.nextPage(1);
    expect(component.getMedicalRecords).toHaveBeenCalled();
  });
  it('getMedicalRecords method',()=>{
    let res = {
      response:{
      records:"baby"
      }
    }
      var spy = spyOn(commonService,'getMedicalRecords').and.returnValue(of(res));
      component.getMedicalRecords(100);
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      });
  })
  it('readingDashboard method',()=>{
    component.readingDashboard("test1");
  });
  it('getMedicalRecordsCount method',()=>{
    let res = {
      response:{
      records:"baby"
      }
    }
      var spy = spyOn(commonService,'getMedicalRecordsCount').and.returnValue(of(res));
      component.getMedicalRecordsCount(100);
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      });
  });
  it('hasPermission method',()=>{
    component.hasPermission("dataEntry");
  });
  it('getOpinions method',()=>{
    let res = {
      response:{
      records:"baby"
      }
    }
      var spy = spyOn(commonService,'getOpinions').and.returnValue(of(res));
      component.getOpinions(1);
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
        expect(commonService).toBe(res);
      });
  });
  it('changeBranch method',()=>{
    let event = {
      target: {
        name: "HospitalAdminInfo",
        value: 2
      }
    }
    component.changeBranch(event);
  })
  it('medicalRecordSearch method',()=>{
    component.searchText='test';
    component.medicalRecordSearch();
    expect(component.page).toBe(1);
    component.searchText="";
    component.medicalRecordSearch();
    expect(component.searchText).toBe(null);
  });

  it('close method',()=>{
     component.open('open',{});
     spyOn(component.formRef,'close');
     component.close();
     expect(component.formRef.close).toHaveBeenCalled();
  });
 
});
