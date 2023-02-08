import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask'
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BabyRespComponent } from './baby-resp.component';
import { DataService } from '../../shared/service/data.service';
import { of } from 'rxjs';


class MockBbyCVComponent {
}

export const routes: Routes = [
  {
    path: 'dashboard', component: MockBbyCVComponent,
    children: [
      { path: '', redirectTo: 'baby-profile', pathMatch: 'prefix' },
      { path: 'baby-respiratory', component: BabyRespComponent },
      { path: 'baby-cardio-vascular', component: MockBbyCVComponent },


    ],
    runGuardsAndResolvers: 'always',
  }
];


describe('BabyRespComponent', () => {
  let component: BabyRespComponent;
  let fixture: ComponentFixture<BabyRespComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BabyRespComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        MatIconModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot(),
        NgxMaskModule.forRoot(),
        AngularMultiSelectModule],
      providers: [DataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyRespComponent);
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
  it("ngOnInit method", () => {
    spyOn(component, 'getReadingFormData')
    spyOn(component, 'get_baby_resp');
    component['dataService'].setOption({ study_id: 123 })
    component.ngOnInit();
    expect(component.get_baby_resp).toHaveBeenCalled();
    var data = {}
    component['readingDataService'].setReadingFormData("baby_resp", data)
    component.ngOnInit()
    expect(component['getReadingFormData']).toHaveBeenCalled()
  });
  it("when reset method is called", () => {
    spyOn(component, 'createForm');
    component.reset();
    expect(component.createForm).toHaveBeenCalled();
  });
  it("when goToNextReadingForm method is called", () => {
    component.goToNextReadingForm();
  });
  it("when updateForm method is called", () => {
    let BRes = component.babyRespForm;
    let obj = {
      groaning: "NA",
      grunting: "NA",
      stridor: "NA",
      retraction: "NA",
      fast_breathing: "NA",
      oxygen_saturation: "NA",
      breathing_rate: "NA",
      baby_chest_indrawing: "NA",
      x_ray_result: "NA",
      x_ray_status_done: "NA",
      x_ray_status: "Other",
      x_ray_diagnosis_any_other: "NA",
      apnea_diagnosis: "NA",
      apnea_status: "NA",
      baby_respiratory_support: "NA",
      baby_respiratory_support_if_yes: "NA"
    }
    spyOn(BRes, 'patchValue');
    component.updateForm(obj);
    expect(obj.oxygen_saturation).toBe("NA");
    expect(obj.breathing_rate).toBe("NA");
    expect(obj.x_ray_status).toBe("Other");
    expect(component.isXrayDiagnosisAnyOther).toBeTruthy();
    expect(BRes.patchValue).toHaveBeenCalled();

    let obj2 = {
      groaning: "test",
      grunting: "test",
      stridor: "test",
      retraction: "test",
      fast_breathing: "test",
      oxygen_saturation: "test",
      breathing_rate: "test",
      baby_chest_indrawing: "test",
      x_ray_result: "test",
      x_ray_status_done: "test",
      x_ray_status: "test",
      x_ray_diagnosis_any_other: "test",
      apnea_diagnosis: "test",
      apnea_status: "test",
      baby_respiratory_support: "test",
      baby_respiratory_support_if_yes: "test"
    }
    component.updateForm(obj2);
    expect(component.isSaturation).toBeTruthy()
    expect(component.isRate).toBeTruthy()
    expect(component.isXrayDiagnosisAnyOther).toBeFalsy()
    expect(component.selectedRespItems.length).toBe(0)

  });
  it(' groaning field should be valid', () => {
    let RespForm = component.babyRespForm;
    expect(RespForm.controls.groaning.valid).toBeFalsy();

    RespForm.controls.groaning.setValue("21");
    expect(RespForm.controls.groaning.valid).toBeTruthy();
  });
  it(' grunting field should be valid', () => {
    let RespForm = component.babyRespForm;
    expect(RespForm.controls.grunting.valid).toBeFalsy();

    RespForm.controls.grunting.setValue("21");
    expect(RespForm.controls.grunting.valid).toBeTruthy();
  });
  it(' stridor field should be valid', () => {
    let RespForm = component.babyRespForm;
    expect(RespForm.controls.stridor.valid).toBeFalsy();

    RespForm.controls.stridor.setValue("21");
    expect(RespForm.controls.stridor.valid).toBeTruthy();
  });
  it(' retraction field should be valid', () => {
    let RespForm = component.babyRespForm;
    expect(RespForm.controls.retraction.valid).toBeFalsy();

    RespForm.controls.retraction.setValue("21");
    expect(RespForm.controls.retraction.valid).toBeTruthy();
  });
  it(' fast_breathing field should be valid', () => {
    let RespForm = component.babyRespForm;
    expect(RespForm.controls.fast_breathing.valid).toBeFalsy();

    RespForm.controls.fast_breathing.setValue("21");
    expect(RespForm.controls.fast_breathing.valid).toBeTruthy();
  });
  it(' oxygen_saturation field should be valid', () => {
    let RespForm = component.babyRespForm;
    expect(RespForm.controls.oxygen_saturation.valid).toBeFalsy();

    RespForm.controls.oxygen_saturation.setValue("21");
    expect(RespForm.controls.oxygen_saturation.valid).toBeTruthy();
  });
  it(' breathing_rate field should be valid', () => {
    let RespForm = component.babyRespForm;
    expect(RespForm.controls.breathing_rate.valid).toBeFalsy();

    RespForm.controls.breathing_rate.setValue("21");
    expect(RespForm.controls.breathing_rate.valid).toBeTruthy();
  });
  it("when respiratoryFormSubmit method is called", () => {
    expect(component.submitted).toBeFalsy();
    component.respiratoryFormSubmit();
    expect(component.submitted).toBeTruthy();

    component.babyRespForm.clearValidators();
    component.babyRespForm.clearAsyncValidators();
    component.babyRespForm.updateValueAndValidity();
    for (var i in component.babyRespForm.controls) {
      component.babyRespForm.controls[i].clearValidators()
      component.babyRespForm.controls[i].clearAsyncValidators()
      component.babyRespForm.controls[i].updateValueAndValidity()
    }
    component.respiratoryFormSubmit();

  });
  it("when onInputChange method is called", () => {
    var event_1 = {
      target: { value: "2", name: "Saturation" }
    }
    var event_2 = {
      target: { value: "2", name: "Rate", }
    }
    component.onInputChange(event_1);
    expect(event_1.target.name).toBe("Saturation");
    expect(event_1.target.value).toBe("2");
    component.onInputChange(event_2);
    expect(event_2.target.name).toBe("Rate");
    expect(event_2.target.value).toBe("2");
    event_1.target.value = "5"
    event_2.target.value = "5"

    component.onInputChange(event_1);
    expect(component.isSaturation).toBeTruthy()
    component.onInputChange(event_2);
    expect(component.isRate).toBeTruthy()
  });
  it("when ngOnChange method is called", () => {
    spyOn(component, 'createForm');
    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();
  });
  it("when open method is called", () => {
    spyOn(component, 'createForm');
    var content = {};
    let obj = {
      groaning: "NA",
      grunting: "NA",
      stridor: "NA",
      retraction: "NA",
      fast_breathing: "NA",
      oxygen_saturation: "NA",
      breathing_rate: "NA",
      baby_chest_indrawing: "NA",
      x_ray_result: "NA",
      x_ray_status_done: "NA",
      x_ray_status: "Other",
      x_ray_diagnosis_any_other: "NA",
      apnea_diagnosis: "NA",
      apnea_status: "NA",
      baby_respiratory_support: "NA",
      baby_respiratory_support_if_yes: "NA"
    }

    expect(component.isBabyRespEdit).toBeTruthy();
    let obj2 = {}
    component.open(content, obj2);
    component.open(content, obj);
    expect(component.createForm).toHaveBeenCalled();

  });
  it("when getReadingFormData method is called", () => {
    let obj = {
      groaning: "NA",
      grunting: "NA",
      stridor: "NA",
      retraction: "NA",
      fast_breathing: "NA",
      oxygen_saturation: "NA",
      breathing_rate: "NA",
      baby_chest_indrawing: "NA",
      x_ray_result: "NA",
      x_ray_status_done: "NA",
      x_ray_status: "NA",
      x_ray_diagnosis_any_other: "NA",
      apnea_diagnosis: "NA",
      apnea_status: "NA",
      baby_respiratory_support: "NA",
      baby_respiratory_support_if_yes: "NA"
    }
    component.getReadingFormData(obj);
  });
  it("when changeDropdown method is called", () => {
    var dropdown1 = { dropdownVal: "Other", dropdownId: "x_ray_status" }
    component.changeDropdown(dropdown1.dropdownVal, dropdown1.dropdownId);
  });
  it("when success method is called", () => {
    var response = {
      status: 200
    };
    var apti_type = "respiratoryFormSubmit";
    component.success(response, apti_type);
    expect(component.page).toBe(1);

    apti_type = "get_all"
    component.page = 1;
    component.success(response, apti_type);
    expect(component.isBabyRespEdit).toBeFalsy();
  });
  it("when close method is called", () => {
    component.close();
  });
  it("when setData method is called", () => {
    component.createForm(100);
    component.setData();
  });
  it("when onChange method is called", () => {
    component.onChanges();
  });
  it("when updateRespForm method is called", () => {
    component.updateRespForm();
    expect(component.babyRespForm.invalid).toBeTruthy();
    component.babyRespForm.clearAsyncValidators();
    component.babyRespForm.clearValidators();
    component.babyRespForm.updateValueAndValidity();
    for (var i in component.babyRespForm.controls) {
      component.babyRespForm.controls[i].clearValidators()
      component.babyRespForm.controls[i].clearAsyncValidators()
      component.babyRespForm.controls[i].updateValueAndValidity()
    }
    spyOn(component, 'updateSuccessResponse')
    spyOn(component['toastr'], 'error')
    let spy = spyOn(component['common_api'], 'updateFormData').and.returnValue(of({ status: 200 }))
    component.updateRespForm();
    spy.calls.mostRecent().returnValue.subscribe((data) => {
      expect(component.updateSuccessResponse).toHaveBeenCalled()
    })
    spy.and.returnValue(of({ status: 600 }))
    component.updateRespForm();
    spy.calls.mostRecent().returnValue.subscribe((data) => {
      expect(component['toastr'].error).toHaveBeenCalled()
    })
  });
  it("when get_baby_resp method is called", () => {
    component.get_baby_resp(11, 100, 20, "reading");
  });
  it("when saveReadingFormData method is called", () => {
    let obj = {
      groaning: "NA",
      grunting: "NA",
      stridor: "NA",
      retraction: "NA",
      fast_breathing: "NA",
      oxygen_saturation: "NA",
      breathing_rate: "NA",
      baby_chest_indrawing: "NA",
      x_ray_result: "NA",
      x_ray_status_done: "NA",
      x_ray_status: "NA",
      x_ray_diagnosis_any_other: "NA",
      apnea_diagnosis: "NA",
      apnea_status: "NA",
      baby_respiratory_support: "NA",
      baby_respiratory_support_if_yes: "NA"

    }
    component.saveReadingFormData(obj);
  })

  it("onScroll method", () => {
    component.page = 5;
    component.onScroll();
    expect(component.page).toBe(10);
  });

  it("errorHandler method", () => {

    spyOn(component,'errorHandler')
    component.errorHandler(new Error(), "respiratoryFormSubmit")
    expect(component['errorHandler']).toHaveBeenCalled()

  });

  it("errorToasty method", () => {
    spyOn(component,'errorToasty')
    component.errorHandler(new Error(), "respiratoryFormSubmit")
    expect(component['errorToasty']).toHaveBeenCalled()
  });

  it("updateSuccessResponse method", () => {
    component.updateSuccessResponse({})
    expect(component.isEditClicked).toBeFalsy()
  });

  // fit("onChanges method", () => {
  //   let spy = spyOn(component.babyRespForm, "statusChanges").and.returnValue(of(component.babyRespForm.status))
  //   // component.onChanges();
  //   // spy.calls.mostRecent().returnValue.subscribe((data) => {
  //   //   expect(component.saveReadingFormData).toHaveBeenCalled()
  //   // });
  //   component.readingDataObj = {}
  //   component.babyRespForm.clearValidators();
  //   component.babyRespForm.clearAsyncValidators();
  //   component.babyRespForm.updateValueAndValidity();
  //   for (var i in component.babyRespForm.controls) {
  //     component.babyRespForm.controls[i].clearValidators()
  //     component.babyRespForm.controls[i].clearAsyncValidators()
  //     component.babyRespForm.controls[i].updateValueAndValidity()
  //   }
  //   spyOn(component, 'saveReadingFormData')

  //   spy.and.returnValue(of(component.babyRespForm.status))
  //   component.onChanges();
  //   spy.calls.mostRecent().returnValue.subscribe((data) => {
  //     expect(component.saveReadingFormData).toHaveBeenCalled()
  //   });
    
  // });


});
