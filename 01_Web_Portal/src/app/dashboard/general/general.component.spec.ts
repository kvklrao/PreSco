import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule, getMatIconFailedToSanitizeUrlError } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { GeneralComponent } from './general.component';
import { DataService } from '../../shared/service/data.service';
import { componentFactoryName } from '@angular/compiler';
import { exec } from 'child_process';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
declare var $: any;
export const routes: Routes = [
  {
    path: '',
    component: GeneralComponent
  }
];

describe('GeneralComponent', () => {
  let component: GeneralComponent;
  let fixture: ComponentFixture<GeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        MatIconModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot(),
        NgxMaskModule.forRoot(),
        BsDatepickerModule.forRoot()],
      providers: [DataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function () {
      return JSON.stringify({ "test": "test" });
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value;
    });

    $('body').on('paste', 'input, textarea', function (e) {
      e.preventDefault()
    });
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92, "hospital_name": "getwell", "hospital_branch_name": "getwell indore", "hospital_branch_id": 59 }))
    expect(component).toBeTruthy();
  });

  it('Baby Medical Record is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let babyMedicalRecord = component.generalForm.controls['babyMedicalRecord'];
    babyMedicalRecord.setValue('babyMedicalRecord');
    errors = babyMedicalRecord.errors || {};
    expect(errors['required']).toBeFalsy();
    babyMedicalRecord.setValue("");
    errors = babyMedicalRecord.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('Baby MOther Medical Report is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let babyMotherMedicalRecord = component.generalForm.controls['babyMotherMedicalRecord'];
    babyMotherMedicalRecord.setValue('babyMotherMedicalRecord');
    errors = babyMotherMedicalRecord.errors || {};
    expect(errors['required']).toBeFalsy();
    babyMotherMedicalRecord.setValue("");
    errors = babyMotherMedicalRecord.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it(' Record type is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let record_type = component.generalForm.controls['record_type'];
    record_type.setValue('record_type');
    errors = record_type.errors || {};
    expect(errors['required']).toBeFalsy();
    record_type.setValue("");
    errors = record_type.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('Baby admission type is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let baby_admission_type = component.generalForm.controls['baby_admission_type'];
    baby_admission_type.setValue('baby_admission_type');
    errors = baby_admission_type.errors || {};
    expect(errors['required']).toBeFalsy();
    baby_admission_type.setValue("");
    errors = baby_admission_type.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('Baby Birth Date is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let baby_birth_date = component.generalForm.controls['baby_birth_date'];
    baby_birth_date.setValue('baby_birth_date');
    errors = baby_birth_date.errors || {};
    expect(errors['required']).toBeFalsy();
    baby_birth_date.setValue("");
    errors = baby_birth_date.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('Baby Place of Birth Pincode is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let baby_place_of_birth_pin_code = component.generalForm.controls['baby_place_of_birth_pin_code'];
    baby_place_of_birth_pin_code.setValue('baby_place_of_birth_pin_code');
    errors = baby_place_of_birth_pin_code.errors || {};
    expect(errors['required']).toBeFalsy();
    baby_place_of_birth_pin_code.setValue("");
    errors = baby_place_of_birth_pin_code.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('Baby Place of Birth Name is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let baby_place_of_birth_name = component.generalForm.controls['baby_place_of_birth_name'];
    baby_place_of_birth_name.setValue('baby_place_of_birth_name');
    errors = baby_place_of_birth_name.errors || {};
    expect(errors['required']).toBeFalsy();
    baby_place_of_birth_name.setValue("");
    errors = baby_place_of_birth_name.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('baby birth time hours is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let baby_birth_time_hours = component.generalForm.controls['baby_birth_time_hours'];
    baby_birth_time_hours.setValue('baby_birth_time_hours');
    errors = baby_birth_time_hours.errors || {};
    expect(errors['required']).toBeFalsy();
    baby_birth_time_hours.setValue("");
    errors = baby_birth_time_hours.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('baby birth time minit is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let baby_birth_time_minit = component.generalForm.controls['baby_birth_time_minit'];
    baby_birth_time_minit.setValue('baby_birth_time_minit');
    errors = baby_birth_time_minit.errors || {};
    expect(errors['required']).toBeFalsy();
    baby_birth_time_minit.setValue("");
    errors = baby_birth_time_minit.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it('baby age of admission is empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm();
    let errors = {};
    let baby_age_of_admission = component.generalForm.controls['baby_age_of_admission'];
    baby_age_of_admission.setValue('baby_age_of_admission');
    errors = baby_age_of_admission.errors || {};
    expect(errors['required']).toBeFalsy();
    baby_age_of_admission.setValue("");
    errors = baby_age_of_admission.errors || {};
    expect(errors['required']).toBeTruthy();
  });
  it("On Creating a General form class", () => {
    expect(component.submitted).toBeFalsy();
    expect(component.already_exist_status).toBe(422);
    expect(component.success_status).toBe(200);
    expect(component.page).toBe(1);
    expect(component.chkBabyPlaceBirthPin).toBeTruthy();
    expect(component.chkBabyPlaceBirthName).toBeTruthy();
    expect(component.chkBabyDOB).toBeTruthy();
    expect(component.chkBabyTimeOfBirth).toBeTruthy();
    expect(component.chkBabyAgeAdmission).toBeTruthy();
    expect(component.chkBabyApgarSc1).toBeTruthy();
    expect(component.chkBabyApgarSc5).toBeTruthy();
    expect(component.chkBabyApgarSc10).toBeTruthy();
    expect(component.chkBabyGestationalAge).toBeTruthy();
    expect(component.chkBabyDayEvent).toBeTruthy();
    expect(component.chkBabyDateAdmission).toBeTruthy();
    expect(component.chkBabyCondOnSuspectOtherIfAny).toBeTruthy();
    expect(component.chkWeightAtBirth).toBeTruthy();
    expect(component.chkWeightAtAdmission).toBeTruthy();
    expect(component.is_update).toBeFalsy();
    expect(component.isDisableDiv).toBeFalsy();
    expect(component.radiochecked).toBeTruthy();
    expect(component.radiochecked1).toBeFalsy();
    expect(component.isHide).toBeTruthy();
    expect(component.isBabyEditGeneral).toBeFalsy();
    expect(component.isBabyCreateGeneral).toBeFalsy();
    expect(component.updateFlag).toBeFalsy();
  });
  it("when onChange method is called", () => {
    component.ngOnChanges();
    expect(component.page).toBe(1);
    expect(component.is_api_call).toBeTruthy();
    expect(component.isBabyEditGeneral).toBeFalsy();
    expect(component.isBabyCreateGeneral).toBeFalsy();
  });
  it("When reset Component method is called", () => {
    component.resetComponent();
    expect(component.isBabyEditGeneral).toBeFalsy();
    expect(component.is_api_call).toBeTruthy();
  });
  it("when updateForm method is called", () => {
    var obj = {
      active_flag: null,
      baby_admission_type: "Inborn",
      baby_age_of_admission: "NA",
      baby_apgar_score_five_min: "NA",
      baby_apgar_score_one_min: "NA",
      baby_apgar_score_ten_min: "NA",
      baby_appear_score: null,
      baby_birth_date: "NA",
      baby_birth_time_hours: "NA",
      baby_birth_time_minit: "NA",
      baby_condition_aga_suspect: "Yes",
      baby_condition_anemia_suspect: "Yes",
      baby_condition_dextrocordia_suspect: "Yes",
      baby_condition_jaundice_suspect: "Yes",
      baby_condition_lbw_suspect: "Yes",
      baby_condition_lga_suspect: "Yes",
      baby_condition_other_if_suspect: "NA",
      baby_condition_rds_yes_no: "Yes",
      baby_condition_sga_suspect: "Yes",
      baby_condition_suspect: "Yes",
      baby_condition_ttnb_suspect: "Yes",
      baby_condition_yes_eos_los: "Eos",
      baby_date_of_admission: "NA",
      baby_day_of_event: "NA",
      baby_gender: "Male",
      baby_gestational_age: "NA",
      baby_gestational_age_unit: "week",
      baby_medical_record_number: "1000",
      baby_mother_medical_record_number: "NA",
      baby_place_of_birth_name: "NA",
      baby_place_of_birth_pin_code: "NA",
      baby_preterm: "Yes",
      baby_shock_aga_suspect: "Yes",
      baby_weight_at_admission1: "NA",
      baby_weight_at_admission2: "01/01/2000",
      baby_weight_at_admission_unit: "Lbs",
      baby_weight_at_birth: "NA",
      baby_weight_at_birth_unit: "Lbs",
      birth_facility: "NICU",
      createdAt: "2019-09-10T12:27:54.000Z",
      deleted_flag: null,
      hospital_branch_id: null,
      hospital_branch_name: "apollo",
      hospital_id: 26,
      hospital_name: "apollo",
      id: 327,
      is_update: 0,
      mother_age: null,
      place_of_delivery: "Hospital",
      prelim_diagnosis_feeding_intolerence: "Yes",
      prelim_diagnosis_gastroenteritis: "Yes",
      prelim_diagnosis_hypocalcemia: "Yes",
      prelim_diagnosis_hypoglycemia: "Yes",
      prelim_diagnosis_perinatal: "Yes",
      record_type: "Current",
      study_id: 361,
      updatedAt: "2019-09-10T12:27:54.000Z",
      updatedBy: null,
    }
    component.createForm(100);
    component.updateForm(obj);
    fixture.detectChanges();
    expect(obj.baby_weight_at_admission1).toBe("NA");
    expect(component.chkWeightAtAdmission).toBeTruthy();
    //fixture.detectChanges();
    obj.baby_weight_at_admission1 = "21";
    component.chkWeightAtAdmission = false;
    expect(obj.baby_weight_at_admission1).toBe("21");
    expect(component.chkWeightAtAdmission).toBeFalsy();
    // fixture.detectChanges();
    expect(obj.baby_weight_at_birth).toBe("NA");
    expect(component.chkWeightAtBirth).toBeFalsy();
    //fixture.detectChanges();
    expect(obj.baby_place_of_birth_pin_code).toBe("NA");
    expect(component.chkBabyPlaceBirthPin).toBeFalsy();
    //fixture.detectChanges();
    obj.baby_place_of_birth_pin_code = "123456";
    component.chkBabyPlaceBirthPin = true;
    expect(component.chkBabyPlaceBirthPin).toBeTruthy();
    // fixture.detectChanges();
    expect(obj.baby_place_of_birth_name).toBe("NA");
    expect(component.chkBabyPlaceBirthName).toBeFalsy();
    // fixture.detectChanges();
    obj.baby_place_of_birth_name = "demoname";
    component.chkBabyPlaceBirthName = true;
    expect(component.chkBabyPlaceBirthName).toBeTruthy();
    //fixture.detectChanges();
    expect(obj.baby_birth_date).toBe("NA");
    expect(component.chkBabyDOB).toBeFalsy();
    obj.baby_birth_date = "01/01/2000";
    component.chkBabyDOB = true;
    expect(component.chkBabyDOB).toBeTruthy();
    //fixture.detectChanges();
    expect(obj.baby_birth_time_hours).toBe("NA");
    expect(component.chkBabyTimeOfBirth).toBeFalsy();
    obj.baby_birth_time_hours = "12";
    component.chkBabyTimeOfBirth = true;
    expect(component.chkBabyTimeOfBirth).toBeTruthy();
    //fixture.detectChanges();
    expect(obj.baby_age_of_admission).toBe("NA");
    expect(component.chkBabyAgeAdmission).toBeFalsy();
    obj.baby_age_of_admission = "1";
    component.chkBabyAgeAdmission = true;
    expect(component.chkBabyAgeAdmission).toBeTruthy();

    expect(obj.baby_apgar_score_one_min).toBe("NA");
    expect(component.chkBabyApgarSc1).toBeFalsy();
    obj.baby_apgar_score_one_min = "10";
    component.chkBabyApgarSc1 = true;
    expect(component.chkBabyApgarSc1).toBeTruthy();
    //fixture.detectChanges();
    expect(obj.baby_apgar_score_five_min).toBe("NA");
    expect(component.chkBabyApgarSc5).toBeFalsy();
    obj.baby_apgar_score_five_min = "10";
    component.chkBabyApgarSc5 = true;
    expect(component.chkBabyApgarSc5).toBeTruthy();
    //fixture.detectChanges();
    expect(obj.baby_apgar_score_ten_min).toBe("NA");
    expect(component.chkBabyApgarSc10).toBeFalsy();
    obj.baby_apgar_score_ten_min = "10";
    component.chkBabyApgarSc10 = true;
    expect(component.chkBabyApgarSc10).toBeTruthy();
  
    let obj1={
      baby_place_of_birth_name:"indore"
    }
    component.updateForm(1);
    expect(component.chkBabyPlaceBirthName).toBeTruthy();
    let obj2={
      baby_gestational_age:40
    }
    component.updateForm(1);
   // expect(component.chkBabyPlaceBirthName).toBeTruthy();
  });
  it("when Date transform method is called", () => {
    let date = {
      baby_birth_date: "01/01/2001",
      baby_date_of_admission: ""
    }
    component.transformDate(date);
    expect(date.baby_birth_date).toBe("01/01/2001");
  }); 
  it("when checkLength method is called", () => {
    let value1 = 12;
    component.createForm(100);
    component.checkLength(value1);
    expect(component.is_limit).toBeFalsy();
    expect(component.generalForm.controls.baby_place_of_birth_pin_code.value).toBe("");
  });
  it("when BabyProfileSubmitForm method is called", () => {
    let component = fixture.debugElement.componentInstance;
    component.createForm(100);
    component.babyProfileFormSubmit();
    expect(component.generalForm.controls['baby_place_of_birth_pin_code'].value).toBe("");
    component.generalForm.controls['baby_place_of_birth_pin_code'].setValue('NA');
    expect(component.generalForm.controls['baby_place_of_birth_pin_code'].value).toBe('NA');
    expect(component.generalForm.controls['baby_place_of_birth_name'].value).toBe("");
    component.generalForm.controls['baby_place_of_birth_name'].setValue('NA');
    expect(component.generalForm.controls['baby_place_of_birth_name'].value).toBe('NA');
    expect(component.generalForm.controls['baby_age_of_admission'].value).toBe("");
    component.generalForm.controls['baby_age_of_admission'].setValue('NA');
    expect(component.generalForm.controls['baby_age_of_admission'].value).toBe('NA');
    expect(component.generalForm.controls['baby_apgar_score_one_min'].value).toBe("");
    component.generalForm.controls['baby_apgar_score_one_min'].setValue('NA');
    expect(component.generalForm.controls['baby_apgar_score_one_min'].value).toBe('NA');
    expect(component.generalForm.controls['baby_apgar_score_five_min'].value).toBe("");
    component.generalForm.controls['baby_apgar_score_five_min'].setValue('NA');
    expect(component.generalForm.controls['baby_apgar_score_five_min'].value).toBe('NA');
    expect(component.generalForm.controls['baby_apgar_score_ten_min'].value).toBe("");
    component.generalForm.controls['baby_apgar_score_ten_min'].setValue('NA');
    expect(component.generalForm.controls['baby_apgar_score_ten_min'].value).toBe('NA');
    expect(component.generalForm.controls['baby_gestational_age'].value).toBe("");
    component.generalForm.controls['baby_gestational_age'].setValue('NA');
    expect(component.generalForm.controls['baby_gestational_age'].value).toBe('NA');
    expect(component.generalForm.controls['baby_day_of_event'].value).toBe("");
    component.generalForm.controls['baby_day_of_event'].setValue('NA');
    expect(component.generalForm.controls['baby_day_of_event'].value).toBe('NA');

    expect(component.generalForm.controls['baby_condition_other_if_suspect'].value).toBe("");
    component.generalForm.controls['baby_condition_other_if_suspect'].setValue('NA');
    expect(component.generalForm.controls['baby_condition_other_if_suspect'].value).toBe('NA');
    expect(component.generalForm.controls['baby_weight_at_birth'].value).toBe("");
    component.generalForm.controls['baby_weight_at_birth'].setValue('NA');
    expect(component.generalForm.controls['baby_weight_at_birth'].value).toBe('NA');
    expect(component.generalForm.controls['baby_weight_at_admission'].value).toBe("");
    component.generalForm.controls['baby_weight_at_admission'].setValue('NA');
    expect(component.generalForm.controls['baby_weight_at_admission'].value).toBe('NA');
    expect(component.generalForm.controls['baby_birth_time_hours'].value).toBe("");
    component.generalForm.controls['baby_birth_time_hours'].setValue('NA');
    expect(component.generalForm.controls['baby_birth_time_hours'].value).toBe('NA');
    expect(component.generalForm.controls['baby_birth_time_minit'].value).toBe("");
    component.generalForm.controls['baby_birth_time_minit'].setValue('NA');
    expect(component.generalForm.controls['baby_birth_time_minit'].value).toBe('NA');
   
  });
  it("when open method is called", () => {
    var obj = {
      active_flag: null,
      baby_admission_type: "Inborn",
      baby_age_of_admission: "NA",
      baby_apgar_score_five_min: "NA",
      baby_apgar_score_one_min: "NA",
      baby_apgar_score_ten_min: "NA",
      baby_appear_score: null,
      baby_birth_date: "NA",
      baby_birth_time_hours: "NA",
      baby_birth_time_minit: "NA",
      baby_condition_aga_suspect: "Yes",
      baby_condition_anemia_suspect: "Yes",
      baby_condition_dextrocordia_suspect: "Yes",
      baby_condition_jaundice_suspect: "Yes",
      baby_condition_lbw_suspect: "Yes",
      baby_condition_lga_suspect: "Yes",
      baby_condition_other_if_suspect: "NA",
      baby_condition_rds_yes_no: "Yes",
      baby_condition_sga_suspect: "Yes",
      baby_condition_suspect: "Yes",
      baby_condition_ttnb_suspect: "Yes",
      baby_condition_yes_eos_los: "Eos",
      baby_date_of_admission: "NA",
      baby_day_of_event: "NA",
      baby_gender: "Male",
      baby_gestational_age: "NA",
      baby_gestational_age_unit: "week",
      baby_medical_record_number: "1000",
      baby_mother_medical_record_number: "NA",
      baby_place_of_birth_name: "NA",
      baby_place_of_birth_pin_code: "NA",
      baby_preterm: "Yes",
      baby_shock_aga_suspect: "Yes",
      baby_weight_at_admission1: "NA",
      baby_weight_at_admission2: "01/01/2000",
      baby_weight_at_admission_unit: "Lbs",
      baby_weight_at_birth: "NA",
      baby_weight_at_birth_unit: "Lbs",
      birth_facility: "NICU",
      createdAt: "2019-09-10T12:27:54.000Z",
      deleted_flag: null,
      hospital_branch_id: null,
      hospital_branch_name: "apollo",
      hospital_id: 26,
      hospital_name: "apollo",
      id: 327,
      is_update: 0,
      mother_age: null,
      place_of_delivery: "Hospital",
      prelim_diagnosis_feeding_intolerence: "Yes",
      prelim_diagnosis_gastroenteritis: "Yes",
      prelim_diagnosis_hypocalcemia: "Yes",
      prelim_diagnosis_hypoglycemia: "Yes",
      prelim_diagnosis_perinatal: "Yes",
      record_type: "Current",
      study_id: 361,
      updatedAt: "2019-09-10T12:27:54.000Z",
      updatedBy: null,
    }
    component.open(100, obj);
    expect(component.submitted).toBeFalsy();
    expect(component.isBabyEditGeneral).toBeTruthy();
    expect(component.isBabyCreateGeneral).toBeFalsy();
    expect(component.is_update).toBeTruthy();
    expect(component.updateFlag).toBeTruthy();
  });
  it("when changeOptions method is called",()=>{
    var event={}
    component.createForm(100);
    component.changeOptions(event);
  });
  it("when isAlready Exists method is called",()=>{
    var response={}
    component.isAlreadyExist(response);
    expect(component.isAlreadyExist(response)).toBeFalsy();
  });
  it("when isSuccess method is called",()=>{
    var response={}
    component.isSuccess(response);
    expect(component.isSuccess(response)).toBeFalsy();
  });
  it("when reset method is called",()=>{
    component.reset();
  });
  it("when updateGeneralForm method is called",()=>{
    let component = fixture.debugElement.componentInstance;
    component.createForm(100);
    component.updateGeneralForm();
  });

  it("when errorToasty method is called",()=>{
    var error={};
    component.errorToasty(error);
    expect(component.isHide).toBeTruthy();
  });

  it("when errorHandler method is called", () => {

    spyOn(component,'errorHandler')
    component.errorHandler(new Error(), "BabyProfileFormSubmit")
    expect(component['errorHandler']).toHaveBeenCalled()

  });

  it("when onInputChange method is called",()=>{
    var event_1={
      target:{
        value:"2",
        name:"babyPlaceBirthPin"}
    }
    var event_2={
      target:{value:"2",name:"babyPlaceBirthName",}
    }
    var event_3={
      target:{value:"2",name:"babyDOB", }
    }
    var event_4={
      target:{value:"2",name:"babyTimeOfBirth",}
    }
    var event_5={
      target:{value:"2",name:"babyAgeAdmission",}
    }
    var event_6={
      target:{
        value:"2",
        name:"babyApgarSc1",
      }
    }
    var event_7={
      target:{value:"2",name:"babyApgarSc5",}
    }
    var event_8={
      target:{value:"2",name:"babyApgarSc10",}
    }
    var event_9={
      target:{value:"2",name:"babyGestationalAge",}
     }
    var event_10={
      target:{value:"2",name:"babyDayEvent",}
    }
    var event_11={
      target:{value:"2",name:"babyDateAdmission",}
    }
    var event_12={
      target:{value:"2",name:"babyCondOnSuspectOtherIfAny",}
    }
    var event_13={
      target:{value:"1",name:"babyDayEvent",}
    }
    var event_14={
      target:{value:"2",name:"motherMRNo",}
    }
    var event_15={
      target:{value:"1",name:"motherMRNo",}
    }

    var event_16={
      target:{value:"1",name:"babyTimeOfBirth",}
    }

    var event_17={
      target:{
        value:"1",
        name:"babyPlaceBirthPin"}
    }
    var event_18={
      target:{value:"1",name:"babyPlaceBirthName",}
    }

    var event_19={
      target:{value:"1",name:"babyDOB", }
    }
    var event_20={
      target:{value:"1",name:"babyAgeAdmission",}
    }
    var event_21={
      target:{value:"1",name:"babyCondOnSuspectOtherIfAny",}
    }

    component.createForm(100);
    component.onInputChange(event_1);
    expect(event_1.target.name).toBe("babyPlaceBirthPin");
    expect(event_1.target.value).toBe("2");


    fixture.detectChanges();
    component.onInputChange(event_13);
    expect(component.chkBabyDayEvent).toBeTruthy();
    expect(event_13.target.value).toBe("1");

    fixture.detectChanges();
    component.onInputChange(event_14);
    expect(component.motherMRNo).toBeFalsy();
    expect(event_14.target.value).toBe("2");

    fixture.detectChanges();
    component.onInputChange(event_15);
    expect(component.motherMRNo).toBeTruthy();
    expect(event_15.target.value).toBe("1");

    fixture.detectChanges();
    component.onInputChange(event_16);
    expect(component.chkBabyTimeOfBirth).toBeTruthy();
    expect(event_16.target.value).toBe("1");

    fixture.detectChanges();
    component.onInputChange(event_17);
    expect(component.chkBabyPlaceBirthPin).toBeTruthy();
    expect(event_17.target.value).toBe("1");

    fixture.detectChanges();
    component.onInputChange(event_18);
    expect(component.chkBabyPlaceBirthName).toBeTruthy();
    expect(event_18.target.value).toBe("1");

    fixture.detectChanges();
    component.onInputChange(event_19);
    expect(component.chkBabyDOB).toBeTruthy();
    expect(event_19.target.value).toBe("1");

    fixture.detectChanges();
    component.onInputChange(event_20);
    expect(component.chkBabyAgeAdmission).toBeTruthy();
    expect(event_20.target.value).toBe("1");

    fixture.detectChanges();
    component.onInputChange(event_21);
    expect(component.chkBabyCondOnSuspectOtherIfAny).toBeTruthy();
    expect(event_21.target.value).toBe("1");

    fixture.detectChanges();
    component.onInputChange(event_2);
    expect(event_2.target.name).toBe("babyPlaceBirthName");
    expect(event_2.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_3);
    expect(event_3.target.name).toBe("babyDOB");
    expect(event_3.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_4);
    expect(event_4.target.name).toBe("babyTimeOfBirth");
    expect(event_4.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_5);
    expect(event_5.target.name).toBe("babyAgeAdmission");
    expect(event_5.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_6);
    expect(event_6.target.name).toBe("babyApgarSc1");
    expect(event_6.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_7);
    expect(event_7.target.name).toBe("babyApgarSc5");
    expect(event_7.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_8);
    expect(event_8.target.name).toBe("babyApgarSc10");
    expect(event_8.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_9);
    expect(event_9.target.name).toBe("babyGestationalAge");
    expect(event_9.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_10);
    expect(event_10.target.name).toBe("babyDayEvent");
    expect(event_10.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_11);
    expect(event_11.target.name).toBe("babyDateAdmission");
    expect(event_11.target.value).toBe("2");
    fixture.detectChanges();
    component.onInputChange(event_12);
    expect(event_12.target.name).toBe("babyCondOnSuspectOtherIfAny");
    expect(event_12.target.value).toBe("2");
  });
  it("when success method is called",()=>{
    var response="";
    var apti_type="BabyProfileFormSubmit";
    component.success(response,apti_type);
    expect(apti_type).toBe("BabyProfileFormSubmit");
    //expect(component.is_api_call).toBeTruthy();
    //expect(component.showMrNumber).toBeTruthy();
  });
 it('convertDateFormat method',()=>{
   let formValue={
    baby_birth_date:"12/01/2001",
    baby_date_of_admission:""
   }
   component.convertDateFormat(formValue);
 });
 it('changeDropdown method',()=>{
   component.createForm(1);
   component.changeDropdown('NA','babyWeightAtBirthId');
   expect(component.chkWeightAtBirth).toBeFalsy();
   component.changeDropdown('NA','baby_weight_at_admission');

 });

 


});
 