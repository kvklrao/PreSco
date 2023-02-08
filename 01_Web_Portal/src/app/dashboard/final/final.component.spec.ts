import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FinalComponent } from './final.component';
import { DataService } from '../../shared/service/data.service';
import { GeneralComponent } from '../general/general.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const routes: Routes = [
  {
    path: '',
    component: FinalComponent
  },
  {
    path: 'dashboard/baby-profile',
    component: GeneralComponent
  }
];

describe('FinalComponent', () => {
  let component: FinalComponent;
  let fixture: ComponentFixture<FinalComponent>;
  let babyFinalForm: FormGroup;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinalComponent, GeneralComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        MatIconModule,
        NgbModalModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot(),
        NgxMaskModule.forRoot(),
        BsDatepickerModule.forRoot(), BrowserAnimationsModule],
      providers: [DataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function () {
      return JSON.stringify({ "test": "test" });
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value;
    });
    fixture.detectChanges();
    babyFinalForm = component.babyFinalForm;
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  it('should create', () => {
    localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92 }))
    expect(component).toBeTruthy();
  });

  //validations

  it('Form Validations', () => {

    expect(babyFinalForm.valid).toBeFalsy();

    babyFinalForm.controls.baby_discharge_date.setValue('12/12/12');
    expect(babyFinalForm.valid).toBeFalsy();

    babyFinalForm.controls.days_of_stay_in_hospital.setValue(123);
    expect(babyFinalForm.valid).toBeFalsy();

    babyFinalForm.controls.final_diagnosis_other.setValue("test");
    expect(babyFinalForm.valid).toBeFalsy();

    babyFinalForm.controls.final_diagnosis_sepsis.setValue("Yes");
    expect(babyFinalForm.valid).toBeFalsy();

    babyFinalForm.controls.final_diagnosis_rds.setValue("Yes");
    expect(babyFinalForm.valid).toBeFalsy();

    babyFinalForm.controls.final_diagnosis_ttnb.setValue("Yes");
    expect(babyFinalForm.valid).toBeFalsy();

    babyFinalForm.controls.final_diagnosis_jaundice.setValue("Yes");
    expect(babyFinalForm.valid).toBeFalsy();

    babyFinalForm.controls.final_diagnosis_lbw.setValue("Yes");
    expect(babyFinalForm.valid).toBeFalsy();

  });


  it("Other Validaters", () => {
    let event = {
      target: {
        name: "babyDischargeDate",
        value: 2
      }
    }

    component.onInputChange(event);
    expect(component.chkBabyDischargeDate).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.chkBabyDischargeDate).toBeTruthy();

    event["target"]["name"] = "daysOfStayHospital";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.chkDaysOfStayHospital).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.chkDaysOfStayHospital).toBeTruthy();

    event["target"]["name"] = "FinalDiagnosisOther";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.ifFinalDiagnosisOther).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.ifFinalDiagnosisOther).toBeTruthy();
  });

  //methods unit testing

  it('transformDate method', () => {
    let date = new Date();
    let day = (date.getDate() < 10) ? ('0'.concat(date.getDate().toString())) : date.getDate().toString();
    let month = (date.getMonth() + 1 < 10) ? ('0'.concat((date.getMonth() + 1).toString())) : (date.getMonth() + 1).toString();
    let dmy = day + '/' + month + '/' + date.getFullYear();
    babyFinalForm.value['baby_discharge_date'] = date;
    component.transformDate(babyFinalForm.value);

    expect(babyFinalForm.value['baby_discharge_date']).toBe(dmy);
  });

  it('ngOnInit method', () => {
    spyOn(component, 'getReadingFormData');
    spyOn(component, 'get_final');

    component.login_hospital = {id:123}
    component["dataServiceObj"] = {
      study_id : 123,
      baby_date_of_admission:123,
      baby_medical_record_number:123
    }
    component['dataService'].setOption({ study_id: 123 })
    component.ngOnInit();
    expect(component.get_final).toHaveBeenCalled();

    component.readingDataService.setReadingFormData("baby_final", {});
    component.ngOnInit(); 
    expect(component.getReadingFormData).toHaveBeenCalled();
  });

  it('updateForm method', () => {
    let obj:Object = {
      days_of_stay_in_hospital: 'NA',
      final_diagnosis_sepsis: 123,
      final_diagnosis_rds:"Yes",
      final_diagnosis_ttnb:"Yes",
      final_diagnosis_jaundice:"Yes",
      final_diagnosis_lbw:"Yes",
      final_diagnosis_lga:"Yes",
      final_diagnosis_aga:"Yes",
      final_diagnosis_anemia:"Yes",
      final_diagnosis_dextochordia:"Yes",
      final_diagnosis_hypoglycemia:"Yes",
      final_diagnosis_hypocalcemia:"Yes",
      final_diagnosis_gastroenteritis:"Yes",
      final_diagnosis_perinatal_respiratory_depression:"Yes",
      final_diagnosis_shock:"Yes",
      final_diagnosis_feeding_intolerence:"Yes",
      baby_discharge_date:"NA",
      final_diagnosis_sga:"Yes",
      final_diagnosis_eos_los:"Yes",
      final_diagnosis_other:"NA",
    }
    spyOn(babyFinalForm, 'patchValue');
    component.updateForm(obj);
    expect(component.chkBabyDischargeDate).toBeFalsy();
    expect(component.chkDaysOfStayHospital).toBeFalsy();
    expect(component.ifFinalDiagnosisOther).toBeFalsy();
    expect(babyFinalForm.patchValue).toHaveBeenCalled();

    obj["final_diagnosis_other"] = 'test';
    obj["baby_discharge_date"] = '12/12/12';
    obj["days_of_stay_in_hospital"] = '24';
    component.updateForm(obj);
    expect(component.chkBabyDischargeDate).toBeTruthy();
    expect(component.chkDaysOfStayHospital).toBeTruthy();
    expect(component.ifFinalDiagnosisOther).toBeTruthy();
  });

  it('calculateDate method', () => {
    babyFinalForm.controls.baby_discharge_date.setValue(new Date());
    expect(babyFinalForm.value["days_of_stay_in_hospital"]).toBeFalsy();
    component.getDOA = "12/12/2012";
    component.calculateDate();
    expect(babyFinalForm.value["days_of_stay_in_hospital"]).toBeTruthy();
  });

  it('ngOnChanges method', () => {
    spyOn(component,"createForm");
    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();
  });

  it('reset method', () => {
    spyOn(component,"createForm");
    component.reset();
    expect(component.createForm).toHaveBeenCalled();
  });

  it('open method', () => {
    spyOn(component,"updateForm");
    spyOn(component,"createForm");

    component.open(null,{test:123});
    expect(component.updateForm).toHaveBeenCalled();

    component.open(null,{});
    expect(component.createForm).toHaveBeenCalled();
  });

  it('finalFormSubmit method', () => {
    expect(component.finalFormSubmit()).toBeUndefined();
    component.babyFinalForm.clearValidators()
    component.babyFinalForm.clearAsyncValidators()
    component.babyFinalForm.updateValueAndValidity()
    for(var i in component.babyFinalForm.controls){
      component.babyFinalForm.controls[i].clearValidators()
      component.babyFinalForm.controls[i].clearAsyncValidators()
      component.babyFinalForm.controls[i].updateValueAndValidity()
    }
    component.babyFinalForm.patchValue({
      days_of_stay_in_hospital:"",
      final_diagnosis_other:""
    })
    spyOn(component,'saveReadingFormData')
    component.finalFormSubmit()
    expect(component.saveReadingFormData).toHaveBeenCalled()
  });

  it('success method', () => {
    spyOn(component["commonAsyn"],'isHide')
    var response = {
      status:200,
      response:[{study_id:1}]
    };
    var apti_type = "finalFormSubmit";
    component.success(response, apti_type);
    expect(component.page).toBe(1);

    apti_type = "get_final"
    component.page =1
    component.success(response, apti_type);
    expect(component.isFinalEdit).toBeFalsy()

    component.page =2
    component.success(response, apti_type);
    expect(component["commonAsyn"].isHide).toHaveBeenCalled();
  });

  it("errorHandler method", () => {

    spyOn(component,'errorHandler')
    component.errorHandler(new Error(), "finalFormSubmit")
    expect(component['errorHandler']).toHaveBeenCalled()

  });

  it("errorToasty method", () => {
    spyOn(component,'errorToasty')
    component.errorHandler(new Error(), "finalFormSubmit")
    expect(component['errorToasty']).toHaveBeenCalled()
  });

  it('isSuccess method', () => {
    expect(component.isSuccess({})).toBeFalsy();

    let obj: Object = {
      status: 200
    };
    expect(component.isSuccess(obj)).toBeTruthy();

    obj["status"] = 404;
    expect(component.isSuccess(obj)).toBeTruthy();
  });

  it('isAlreadyExist method', () => {
    expect(component.isAlreadyExist({})).toBeFalsy();

    let obj: Object = {
      status: 422
    };
    expect(component.isAlreadyExist(obj)).toBeTruthy();
  });

  it('getReadingFormData method', () => {
    spyOn(component, "updateForm");
    component.getReadingFormData({});
    expect(component.updateForm).toHaveBeenCalled();
  });

  it('saveReadingFormData method', () => {
    spyOn(component.readingDataService, "setReadingFormData");
    component.saveReadingFormData({});
    expect(component.readingDataService.setReadingFormData).toHaveBeenCalled();
  });

  it('update_final_form method', () => {
    spyOn(component,"transformDate");
    component.update_final_form();
    expect(component.transformDate).toHaveBeenCalled();
    expect(component.update_final_form()).toBeUndefined();
  });

  it('openModal method', () => {
    expect(component.formRef).toBeUndefined();
    component.openModal();
    expect(component.formRef).toBeTruthy();
  });

  it('close method', () => {
    component.openModal();
    spyOn(component.formRef,'close');
    component.close();
    expect(component.formRef.close).toHaveBeenCalled();
  });

  it('validateAllFormData method', () => {
    component.readingDataService.setFormValidationStatus("baby_appears",false);
    component.readingDataService.setFormValidationStatus("baby_antibiotic",false);
    component.readingDataService.setFormValidationStatus("baby_cns",false);
    component.readingDataService.setFormValidationStatus("baby_git",false);
    component.readingDataService.setFormValidationStatus("baby_investigation",false);
    component.readingDataService.setFormValidationStatus("baby_resp",false);
    component.readingDataService.setFormValidationStatus("baby_final",false);
    expect(component.validateAllFormData()).toBeFalsy();

    component.readingDataService.setFormValidationStatus("baby_appears",true);
    component.readingDataService.setFormValidationStatus("baby_antibiotic",true);
    component.readingDataService.setFormValidationStatus("baby_cns",true);
    component.readingDataService.setFormValidationStatus("baby_git",true);
    component.readingDataService.setFormValidationStatus("baby_investigation",true);
    component.readingDataService.setFormValidationStatus("baby_resp",true);
    component.readingDataService.setFormValidationStatus("baby_final",true);
    expect(component.validateAllFormData()).toBeTruthy();
  });

  it('setMessage method', () => {
    component.messageString = '';
    component.setMessage('test');
    expect(component.messageString).toBe('test');

    component.messageString = 'test';
    component.setMessage('test');
    expect(component.messageString).toBe('test, test');
  });

});
