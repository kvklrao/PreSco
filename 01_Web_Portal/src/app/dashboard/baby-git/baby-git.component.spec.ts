import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask'
import { BabyGitComponent } from './baby-git.component';
import { By } from '@angular/platform-browser';
import { DataService } from '../../shared/service/data.service';

class MockBabyInvestComponent{
}

export const routes: Routes = [
  {
    path: 'dashboard', component: MockBabyInvestComponent,
    children: [
      {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
      {path: 'baby-gi-tract', component: BabyGitComponent},
      {path: 'baby-investigation', component: MockBabyInvestComponent},

    ],
    runGuardsAndResolvers: 'always',
  }
];

describe('BabyGitComponent', () => {
  let component: BabyGitComponent;
  let fixture: ComponentFixture<BabyGitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BabyGitComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        MatIconModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot(),
        NgxMaskModule.forRoot()],
      providers: [DataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyGitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Abdominal Distension field should be valid', () => {
    let abdomial_distension = component.babyGitForm.controls['abdominal_dystension'];
    expect(abdomial_distension.valid).toBeFalsy();

    abdomial_distension.setValue('Yes')
    expect(abdomial_distension.valid).toBeTruthy();
  });
  it("diarrhea field should be valid", () => {
    let diarrhea = component.babyGitForm.controls['diarrhea'];
    expect(diarrhea.valid).toBeFalsy();

    diarrhea.setValue('Yes')
    expect(diarrhea.valid).toBeTruthy();
  });
  it("vomiting field should be valid", () => {
    let vomiting = component.babyGitForm.controls['vomiting'];
    expect(vomiting.valid).toBeFalsy();

    vomiting.setValue('Yes')
    expect(vomiting.valid).toBeTruthy();
  });
  it("feeding_intolerance field should be valid", () => {
    let feeding_intolerance = component.babyGitForm.controls['feeding_intolerance'];
    expect(feeding_intolerance.valid).toBeFalsy();

    feeding_intolerance.setValue('Yes')
    expect(feeding_intolerance.valid).toBeTruthy();
  });

  it("when update_git_form method is called", () => {

    component.update_git_form();
    expect(component.submitted).toBeTruthy();
  });

  it('baby git form should be created on component load', () => {
    let component = fixture.debugElement.componentInstance;
    spyOn(component, 'createForm');
    component.ngOnInit();
    expect(component.createForm).toHaveBeenCalledTimes(1);
  });
  it("when goToNextReadingForm method is called", () => {
    component.goToNextReadingForm();
  });
  it("when updateForm method is called", () => {
    var obj = {
      abdominal_dystension: "NA",
      frequency_of_stools: "NA",
      diarrhea: "NA",
      vomiting: "NA",
      feeding_intolerance: "NA",
      baby_movement: "NA"
    }
    component.updateForm(obj);
    expect(obj.frequency_of_stools).toBe("NA");
    expect(component.isStools).toBeFalsy();
    component.isStools = true;
    expect(component.isStools).toBeTruthy();
  });

  it("when onInputChange method is called", () => {
    var event_1 = {
      target: { value: "2", name: "Frequency" }
    }
    component.onInputChange(event_1);
    expect(event_1.target.name).toBe("Frequency");
    expect(event_1.target.value).toBe("2");

    var event_2 = {
      target: { value: "1", name: "Frequency" }
    }

    component.onInputChange(event_2);
    expect(component.isStools).toBeTruthy();

  });
  it("when ngOnChanges method is called", () => {
    spyOn(component, "createForm");
    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();
  });
  it("when reset method is called", () => {
    spyOn(component, "createForm");
    component.reset();
    expect(component.createForm).toHaveBeenCalled();
  });

  it("open method", () => {
    spyOn(component, 'createForm');
    component.open(null, {});
    expect(component.createForm).toHaveBeenCalled();
    component.open(null, { 'abdominal_dystension': '17' });
  });

  it("when BabyGitFormSubmit method is called", () => {
    expect(component.submitted).toBeFalsy();
    component.babyGitFormSubmit();
    expect(component.submitted).toBeTruthy();
  });

  it("when success method is called", () => {

    var response = "";
    var apti_type = "get_baby_git";
    component.success(response, apti_type);
    expect(component.isGitFormEdit).toBeFalsy();
  });

  it("when getReadingFormData method is called", () => {
    var formdata = {
      abdominal_dystension: "NA",
      frequency_of_stools: "NA",
      diarrhea: "NA",
      vomiting: "NA",
      feeding_intolerance: "NA",
      baby_movement: "NA"
    }
    component.getReadingFormData(formdata);
  });

  it("when get_baby_git method is called", () => {
    component.get_baby_git(1, 100, 20, "reading");
  });

  it("when set validator method is called", () => {
    component.setValidators("abdominal_dystension");
  });

});
