import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask'
import { BabyCvComponent } from './baby-cv.component';
import { DataService } from '../../shared/service/data.service';

class MockBabyCNSComponent {
}

export const routes: Routes = [
  {
    path: 'dashboard', component: MockBabyCNSComponent,
    children: [
      { path: '', redirectTo: 'baby-profile', pathMatch: 'prefix' },
      { path: 'baby-cardio-vascular', component: BabyCvComponent },
      { path: 'baby-cns', component: MockBabyCNSComponent },


    ],
    runGuardsAndResolvers: 'always',
  }
];

describe('BabyCvComponent', () => {
  let component: BabyCvComponent;
  let fixture: ComponentFixture<BabyCvComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BabyCvComponent],
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
    fixture = TestBed.createComponent(BabyCvComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function () {
      return JSON.stringify({ "test": "test" });
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
    localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92, "hospital_name": "getwell", "hospital_branch_name": "getwell indore", "hospital_branch_id": 59, "staff_id": 12 }))
    expect(component).toBeTruthy();
  });
  it(' heart_rate field should be valid', () => {
    let CvForm = component.babyCvForm;
    expect(CvForm.controls.heart_rate.valid).toBeFalsy();

    CvForm.controls.heart_rate.setValue("21");
    expect(CvForm.controls.heart_rate.valid).toBeTruthy();
  });
  it(' urine_output field should be valid', () => {
    let CvForm = component.babyCvForm;
    expect(CvForm.controls.urine_output.valid).toBeFalsy();

    CvForm.controls.urine_output.setValue("21");
    expect(CvForm.controls.urine_output.valid).toBeTruthy();
  });
  it(' baby_blood_pressure_mean_arterial_bp field should be valid', () => {
    let CvForm = component.babyCvForm;
    expect(CvForm.controls.baby_blood_pressure_mean_arterial_bp.valid).toBeFalsy();

    CvForm.controls.baby_blood_pressure_mean_arterial_bp.setValue("21");
    expect(CvForm.controls.baby_blood_pressure_mean_arterial_bp.valid).toBeTruthy();
  });
  it(' baby_blood_pressure_lower_limb field should be valid', () => {
    let CvForm = component.babyCvForm;
    expect(CvForm.controls.baby_blood_pressure_lower_limb.valid).toBeFalsy();

    CvForm.controls.baby_blood_pressure_lower_limb.setValue("21");
    expect(CvForm.controls.baby_blood_pressure_lower_limb.valid).toBeTruthy();
  });
  it(' baby_blood_pressure_upper_limb field should be valid', () => {
    let CvForm = component.babyCvForm;
    expect(CvForm.controls.baby_blood_pressure_upper_limb.valid).toBeFalsy();

    CvForm.controls.baby_blood_pressure_upper_limb.setValue("21");
    expect(CvForm.controls.baby_blood_pressure_upper_limb.valid).toBeTruthy();
  });
  it(' capillary_refill_unit field should be valid', () => {
    let CvForm = component.babyCvForm;
    expect(CvForm.controls.capillary_refill_unit.valid).toBeFalsy();

    CvForm.controls.capillary_refill_unit.setValue("21");
    expect(CvForm.controls.capillary_refill_unit.valid).toBeTruthy();
  });
  it(' low_peripheral_pulse_volume field should be valid', () => {
    let CvForm = component.babyCvForm;
    expect(CvForm.controls.low_peripheral_pulse_volume.valid).toBeFalsy();

    CvForm.controls.low_peripheral_pulse_volume.setValue("21");
    expect(CvForm.controls.low_peripheral_pulse_volume.valid).toBeTruthy();
  });
  it(' cool_peripheries field should be valid', () => {
    let CvForm = component.babyCvForm;
    expect(CvForm.controls.cool_peripheries.valid).toBeFalsy();

    CvForm.controls.cool_peripheries.setValue("21");
    expect(CvForm.controls.cool_peripheries.valid).toBeTruthy();
  });
  it(' two_d_echo_done field should be valid', () => {
    let CvForm = component.babyCvForm;
    expect(CvForm.controls.two_d_echo_done.valid).toBeFalsy();

    CvForm.controls.two_d_echo_done.setValue("21");
    expect(CvForm.controls.two_d_echo_done.valid).toBeTruthy();
  });



  it("ngOnInit method", () => {
    spyOn(component, 'getReadingFormData')
    spyOn(component, 'createForm');
    component['dataService'].setOption({ study_id: 123 })
    component.ngOnInit();
    expect(component.createForm).toHaveBeenCalled();
    var data = {}
    component['readingDataService'].setReadingFormData("baby_cv", data)
    component.ngOnInit()
    expect(component['getReadingFormData']).toHaveBeenCalled()
  });
  it("when updateForm method is called", () => {
    let Bcv = component.babyCvForm;
    let obj = {
      study_id: "NA",
      heart_rate: "NA",
      urine_output: "NA",
      baby_blood_pressure_mean_arterial_bp: "NA",
      baby_blood_pressure_upper_limb: "NA",
      baby_blood_pressure_lower_limb: "NA",
      capillary_refill_unit: "NA",
      low_peripheral_pulse_volume: "NA",
      cool_peripheries: "NA",
      two_d_echo_done: "NA",
      two_d_echo_done_if_yes: "NA",
      baby_on_ionotropes: "NA",
      central_line: "NA",
      skin_pustules: "NA",
      infusion_of_blood_products: "NA"
    }
    spyOn(Bcv, 'patchValue');
    component.updateForm(obj);
    expect(obj.heart_rate).toBe("NA");
    expect(obj.baby_blood_pressure_mean_arterial_bp).toBe("NA");
    expect(obj.baby_blood_pressure_upper_limb).toBe("NA");
    expect(obj.baby_blood_pressure_lower_limb).toBe("NA");
    expect(obj.two_d_echo_done_if_yes).toBe("NA");
    expect(Bcv.patchValue).toHaveBeenCalled();
  });
  it("when OnInputChange method is called", () => {
    let Bcv = component.babyCvForm;
    var event_1 = {
      target: { value: "2", name: "heart_rate" }
    }
    var event_2 = {
      target: { value: "2", name: "Arterial_BP", }
    }
    var event_3 = {
      target: { value: "2", name: "upper_limb", }
    }
    var event_4 = {
      target: { value: "2", name: "lower_limb", }
    }
    var event_5 = {
      target: { value: "2", name: "echo_result", }
    }
    spyOn(Bcv, 'patchValue');
    component.onInputChange(event_1);
    expect(event_1.target.name).toBe("heart_rate");
    expect(event_1.target.value).toBe("2");
    expect(Bcv.patchValue).toHaveBeenCalled();

    component.onInputChange(event_2);
    expect(event_2.target.name).toBe("Arterial_BP");
    expect(event_2.target.value).toBe("2");
    expect(Bcv.patchValue).toHaveBeenCalled();

    component.onInputChange(event_3);
    expect(event_3.target.name).toBe("upper_limb");
    expect(event_3.target.value).toBe("2");
    expect(Bcv.patchValue).toHaveBeenCalled();

    component.onInputChange(event_4);
    expect(event_4.target.name).toBe("lower_limb");
    expect(event_4.target.value).toBe("2");
    expect(Bcv.patchValue).toHaveBeenCalled();

    component.onInputChange(event_5);
    expect(event_5.target.name).toBe("echo_result");
    expect(event_5.target.value).toBe("2");
    expect(Bcv.patchValue).toHaveBeenCalled();

    event_1.target.value = '3'
    event_2.target.value = '3'
    event_3.target.value = '3'
    event_4.target.value = '3'
    event_5.target.value = '3'

    component.onInputChange(event_1);
    expect(component.isHeartRate).toBeTruthy();

    component.onInputChange(event_2);
    expect(component.isBpArterial).toBeTruthy();

    component.onInputChange(event_3);
    expect(component.isUpperLimb).toBeTruthy();

    component.onInputChange(event_4);
    expect(component.isLowerLimb).toBeTruthy();

    component.onInputChange(event_5);
    expect(component.isEchoResult).toBeTruthy();

  });
  it("when ngOnChange method is called", () => {
    spyOn(component, 'createForm');
    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();
  });
  it("when reset method is called", () => {
    spyOn(component, 'createForm');
    component.reset();
    expect(component.createForm).toHaveBeenCalled();
  });
  it("when goToNextReadingForm method is called", () => {
    component.goToNextReadingForm();
  })
  it("when open method is called", () => {
    spyOn(component, 'createForm');
    component.open(null, {});
    expect(component.createForm).toHaveBeenCalled();
    component.open(null, { 'heart_rate': '50' });
  });
  it("when success method is called", () => {
    spyOn(component["commonAsyn"],'isHide')
    var response = {
      status:200,
      response:[{study_id:1}]
    };
    var apti_type = "babyCVFormSubmit";
    component.success(response, apti_type);
    expect(component.page).toBe(1);

    apti_type = "get_cv"
    component.page =1
    component.success(response, apti_type);
    expect(component.isBabyCvEdit).toBeFalsy()

    component.page =2
    component.success(response, apti_type);
    expect(component["commonAsyn"].isHide).toHaveBeenCalled();

  });
  it("when babyCVFormSubmit method is called", () => {
    component.babyCvForm.patchValue({
      study_id: 123,
      heart_rate: "",
      urine_output: "",
      baby_blood_pressure_mean_arterial_bp: "",
      baby_blood_pressure_upper_limb: "",
      baby_blood_pressure_lower_limb: "",
      capillary_refill_unit: "",
      low_peripheral_pulse_volume: "",
      cool_peripheries: "",
      two_d_echo_done: "",
      two_d_echo_done_if_yes: "",
      baby_on_ionotropes: "",
      central_line: "",
      infusion_of_blood_products: "",
    })

    component.babyCvForm.clearValidators()
    component.babyCvForm.clearAsyncValidators()
    component.babyCvForm.updateValueAndValidity()
    for(var i in component.babyCvForm.controls){
      component.babyCvForm.controls[i].clearValidators()
      component.babyCvForm.controls[i].clearAsyncValidators()
      component.babyCvForm.controls[i].updateValueAndValidity()
    }
    expect(component.submitted).toBeFalsy();

    component.babyCVFormSubmit();
    expect(component.babyCvForm.value['heart_rate']).toBe('NA')
    expect(component.babyCvForm.value['baby_blood_pressure_mean_arterial_bp']).toBe('NA')
    expect(component.babyCvForm.value['baby_blood_pressure_upper_limb']).toBe('NA')
    expect(component.babyCvForm.value['baby_blood_pressure_lower_limb']).toBe('NA')
    expect(component.babyCvForm.value['two_d_echo_done_if_yes']).toBe('NA')
    expect(component.submitted).toBeTruthy();
    component.createForm(100);
    expect(component.babyCvForm.invalid).toBeTruthy();
  });
  it("when getReadingFormData method is called", () => {
    let obj = {
      study_id: "NA",
      heart_rate: "NA",
      urine_output: "NA",
      baby_blood_pressure_mean_arterial_bp: "NA",
      baby_blood_pressure_upper_limb: "NA",
      baby_blood_pressure_lower_limb: "NA",
      capillary_refill_unit: "NA",
      low_peripheral_pulse_volume: "NA",
      cool_peripheries: "NA",
      two_d_echo_done: "NA",
      two_d_echo_done_if_yes: "NA",
      baby_on_ionotropes: "NA",
      central_line: "NA",
      skin_pustules: "NA",
      infusion_of_blood_products: "NA"
    }
    component.getReadingFormData(obj);
  });
  it("whebn get_cv method is called", () => {
    component.get_cv(1, 100, 20, "reading");
  });
  it("when update_cv_form method is called", () => {
    expect(component.submitted).toBeFalsy();
    component.update_cv_form();
    expect(component.submitted).toBeTruthy();
  });

  it("onScroll method", () => {
    component.page = 5;
    component.onScroll();
    expect(component.page).toBe(10);
  });

  it("errorHandler method", () => {

    spyOn(component,'errorHandler')
    component.errorHandler(new Error(), "babyCVFormSubmit")
    expect(component['errorHandler']).toHaveBeenCalled()

  });

  it("errorToasty method", () => {
    spyOn(component,'errorToasty')
    component.errorHandler(new Error(), "babyCVFormSubmit")
    expect(component['errorToasty']).toHaveBeenCalled()
  });

});
