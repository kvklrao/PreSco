import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask'
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { AntibioticAdministrationComponent } from './antibiotic-administration.component';
import { DataService } from '../../shared/service/data.service';
import { DatePipe } from '@angular/common';
import { DateLevelPipe } from 'src/app/shared/pipes/date-level.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockFinalComponent{
}

export const routes: Routes = [
  {
    path: 'dashboard', component: MockFinalComponent,
    children: [
      {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
      {path: 'anitibiotic-administration', component: AntibioticAdministrationComponent},

      {path: 'final-diagnosis', component: MockFinalComponent},


    ],
    runGuardsAndResolvers: 'always',
  }
];



describe('AntibioticAdministrationComponent', () => {
  let component: AntibioticAdministrationComponent;
  let fixture: ComponentFixture<AntibioticAdministrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AntibioticAdministrationComponent, DateLevelPipe],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        MatIconModule,
        AngularMultiSelectModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot(),
        NgxMaskModule.forRoot(),
        BsDatepickerModule.forRoot(), BrowserAnimationsModule],
      providers: [DataService, DatePipe]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AntibioticAdministrationComponent);
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
    localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92, "hospital_name": "getwell", "hospital_branch_name": "getwell indore", "hospital_branch_id": 59 }))
    // localStorage.setItem("hospital_name",JSON.stringify({"hospital_name":"testname","hospital_branch_name":"testbname"}))
    expect(component).toBeTruthy();
  });

  //validations
  it('Form Validation', () => {
    let abAdminForm = component.antibioticAdministrationForm;

    console.log(abAdminForm);
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.antibiotic_given.setValue('Yes');
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.date_of_administration_of_antiobiotic.setValue('NA');
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.time_of_administration_of_antiobiotic_hours.setValue(10);
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.time_of_administration_of_antiobiotic_minute.setValue(10);
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.antibiotic_name.setValue('NA');
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.antibiotic_name_if_other.setValue('Yes');
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.date_of_blood_samples_sent_for_culture_test.setValue('14/04/2017');
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.time_of_blood_samples_sent_for_culture_test_hours.setValue(10);
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.time_of_blood_samples_sent_for_culture_test_minute.setValue(10);
    expect(abAdminForm.valid).toBeFalsy();

    abAdminForm.controls.blood_sample_taken_prior_to_antiobiotic_administration.setValue("NA");
    expect(abAdminForm.valid).toBeTruthy();
  });

  it('Date of administration validations', () => {
    let abAdminForm = component.antibioticAdministrationForm;
    let event1 = {
      target: {
        name: "DateAdministration",
        value: 1
      }
    }
    component.onInputChange(event1);
    expect(abAdminForm.value.date_of_administration_of_antiobiotic).toBe('');

    let event2 = {
      target: {
        name: "DateAdministration",
        value: 2
      }
    }
    component.onInputChange(event2);
    expect(abAdminForm.value.date_of_administration_of_antiobiotic).toBe('NA');
  });

  it('Time of administration validations', () => {
    let event1 = {
      target: {
        name: "TimeAdministration",
        value: 1
      }
    }

    let event2 = {
      target: {
        name: "TimeAdministration",
        value: 2
      }
    }

    component.onInputChange(event1);
    expect(component.isTimeAdministration).toBeTruthy();

    component.onInputChange(event2);
    expect(component.isTimeAdministration).toBeFalsy();
  });

  it('Antibiotic Name validations', () => {
    let abAdminForm = component.antibioticAdministrationForm;
    let event2 = {
      target: {
        name: "antibiotic_name",
        value: 2
      }
    }
    component.onInputChange(event2);
    expect(abAdminForm.value.antibiotic_name).toBe('NA');
    expect(abAdminForm.value.antibiotic_name_if_other).toBe('');
  });

  it('Blood Samples for Culture test validations', () => {
    let event1 = {
      target: {
        name: "date_of_blood",
        value: 1
      }
    }

    let event2 = {
      target: {
        name: "date_of_blood",
        value: 2
      }
    }

    component.onInputChange(event1);
    expect(component.isDateBloodSample).toBeTruthy();

    component.onInputChange(event2);
    expect(component.isDateBloodSample).toBeFalsy();
  });

  it('Time of Blood Samples validations', () => {
    let event1 = {
      target: {
        name: "time_of_blood",
        value: 1
      }
    }

    let event2 = {
      target: {
        name: "time_of_blood",
        value: 2
      }
    }

    component.onInputChange(event1);
    expect(component.isTimeBloodSample).toBeTruthy();

    component.onInputChange(event2);
    expect(component.isTimeBloodSample).toBeFalsy();
  });

  //methods

  it('transformDate method', () => {
    let abAdminForm = component.antibioticAdministrationForm;
    let date = new Date();
    let day = (date.getDate() < 10) ? ('0'.concat(date.getDate().toString())) : date.getDate().toString();
    let month = (date.getMonth() + 1 < 10) ? ('0'.concat((date.getMonth() + 1).toString())) : (date.getMonth() + 1).toString();
    let dmy = day + '/' + month + '/' + date.getFullYear();
    abAdminForm.value['date_of_administration_of_antiobiotic'] = date;
    component.transformDate(abAdminForm.value);

    expect(abAdminForm.value['date_of_administration_of_antiobiotic']).toBe(dmy);
  });

  it('ngOnInit method', () => {
    spyOn(component, 'getReadingFormData');
    spyOn(component, 'onChanges');

    component.ngOnInit();
    expect(component.onChanges).toHaveBeenCalled();

    component.readingDataService.setReadingFormData("baby_antibiotic", {});
    component.ngOnInit();
    expect(component.getReadingFormData).toHaveBeenCalled();
  });

  it('updateForm method', () => {
    let abAdminForm = component.antibioticAdministrationForm;
    let obj = {
      antibiotic_name_if_other: 'test',
      date_of_administration_of_antiobiotic: 'test',
      time_of_administration_of_antiobiotic_hours: 'test',
      antibiotic_name: 'test',
      date_of_blood_samples_sent_for_culture_test: 'test',
      time_of_blood_samples_sent_for_culture_test_hours: 'test',
      time_of_blood_samples_sent_for_culture_test_minute: 'test',
    }

    spyOn(abAdminForm, 'patchValue');
    component.updateForm(obj);
    expect(abAdminForm.patchValue).toHaveBeenCalled();
  });

  it('onItemSelect and OnItemDeSelect and onSelectAll and onDeSelectAll method', () => {
    expect(component.isAntibioticFreeField).toBeFalsy();
    let obj = {
      itemName: "Other"
    };

    component.onItemSelect(obj);
    expect(component.isAntibioticFreeField).toBeTruthy();

    component.OnItemDeSelect(obj);
    expect(component.isAntibioticFreeField).toBeFalsy();

    component.onSelectAll(obj);
    expect(component.isAntibioticFreeField).toBeTruthy();

    component.onDeSelectAll(obj);
    expect(component.isAntibioticFreeField).toBeFalsy();
  });

  it('ngOnChanges and reset and open method', () => {
    spyOn(component, "createForm");
    spyOn(component, "updateForm");


    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();

    component.reset();
    expect(component.createForm).toHaveBeenCalled();

    let obj = {};
    component.open(null, obj);
    expect(component.createForm).toHaveBeenCalled();
    obj = {
      test: 'test'
    };
    component.open(null, obj);
    expect(component.updateForm).toHaveBeenCalled();
  });

  it('antibioticFormSubmit method', () => {
    expect(component.antibioticFormSubmit()).toBeUndefined();
    spyOn(component, "transformDate");
    spyOn(component, "setData");
    spyOn(component, "goToNextReadingForm");
    let abAdminForm = component.antibioticAdministrationForm;

    let obj = {
      study_id: 123,
      antibiotic_name_if_other: 'test',
      date_of_administration_of_antiobiotic: 'test',
      time_of_administration_of_antiobiotic_hours: 12,
      antibiotic_name: 'test',
      date_of_blood_samples_sent_for_culture_test: 'test',
      time_of_blood_samples_sent_for_culture_test_hours: 12,
      time_of_blood_samples_sent_for_culture_test_minute: 12,
      antibiotic_given: "test",
      blood_sample_taken_prior_to_antiobiotic_administration: "test",
      time_of_administration_of_antiobiotic_minute: 12
    }
    abAdminForm.setValue(obj);
    component.antibioticFormSubmit();
    expect(component.transformDate).toHaveBeenCalled();
    expect(component.setData).toHaveBeenCalled();
    expect(component.goToNextReadingForm).toHaveBeenCalled();
  });

  it('success method', () => {
    spyOn(component, "isSuccess");
    spyOn(component, "isAlreadyExist");

    component.success({}, "get_antibiotic");
    expect(component.isAlreadyExist).toHaveBeenCalled();

    component.success({ response: "test" }, "get_antibiotic");
    expect(component.isSuccess).toHaveBeenCalled();
  });

  it("errorHandler method", () => {

    spyOn(component,'errorHandler')
    component.errorHandler(new Error(), "antibioticFormSubmit")
    expect(component['errorHandler']).toHaveBeenCalled()

  });

  it("errorToasty method", () => {
    spyOn(component,'errorToasty')
    component.errorHandler(new Error(), "antibioticFormSubmit")
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

  it('goToNextReadingForm method', () => {
    spyOn(component.readingDataService, "setActiveTab");
    component.goToNextReadingForm();
    expect(component.readingDataService.setActiveTab).toHaveBeenCalled();
  });

  it('setFormValidationAndValue method', () => {
    spyOn(component, "saveReadingFormData");
    component.readingDataObj = {};
    component.setFormValidationAndValue("harsh", 0);
    expect(component.saveReadingFormData).toHaveBeenCalled();
  });

  it('updateSuccessResponse method', () => {
    spyOn(component, "get_antibiotic");
    component.dataServiceObj["study_id"] = 123;
    component.login_hospital["id"] = 123;
    component.updateSuccessResponse({});
    expect(component.get_antibiotic).toHaveBeenCalled();
  });

  it('setData method', () => {
    spyOn(component,'transformDate');
    component.setData();
    expect(component.transformDate).toHaveBeenCalled();
  });




});
