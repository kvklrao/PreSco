import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { MatIconModule } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask'
import { BabyAppearComponent } from './baby-appear.component';
import { DataService } from '../../shared/service/data.service';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DateLevelPipe } from 'src/app/shared/pipes/date-level.pipe';
import { CommonService } from 'src/app/shared/service/common/common.service';
import { ReadingDataService } from 'src/app/shared/service/reading-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockBbyRespComponent{
}

export const routes: Routes = [
  {
    path: 'dashboard', component: MockBbyRespComponent,
    children: [
      {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
      {path: 'baby-appearence', component: BabyAppearComponent},
      {path: 'baby-respiratory', component: MockBbyRespComponent},
    ],
    runGuardsAndResolvers: 'always',
  }
];


describe('BabyAppearComponent', () => {
  let component: BabyAppearComponent;
  let fixture: ComponentFixture<BabyAppearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BabyAppearComponent, DateLevelPipe,],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        MatIconModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot(),
        BsDatepickerModule.forRoot(),///
        NgxMaskModule.forRoot()],
      providers: [DataService, CommonService, ToastrService, ReadingDataService, CommonService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyAppearComponent);
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
  it("Form should be invalid when all fields are empty", () => {
    component.babyApears['value']['reading_date'] = "";
    component.babyApears['value']['time_of_reading_hours'] = "";
    component.babyApears['value']['time_of_reading_minute'] = "";
    component.babyApears['value']['baby_weight_at_birth'] = "";
    component.babyApears['value']['baby_weight_at_birth_unit'] = "";
    component.babyApears['value']['baby_appearance'] = "";
    component.babyApears['value']['baby_skin_colour'] = "";
    component.babyApears['value']['baby_cry_sound'] = "";
    component.babyApears['value']['baby_cry_sound_status'] = "";
    component.babyApears['value']['hypotonia_muscular_response_one_min_after_birth'] = "";

    component.babyApears['value']['hypotonia_muscular_response_five_min_after_birth'] = "";
    component.babyApears['value']['excessive_sleeping'] = "";
    component.babyApears['value']['hypothermia'] = "";
    component.babyApears['value']['hypothermia_status'] = "";
    component.babyApears['value']['hypothermia_status_value'] = "";
    component.babyApears['value']['baby_feeding_status'] = "";
    component.babyApears['value']['baby_presence_of_convulsions'] = "";
    component.babyApears['value']['baby_jaundice'] = "";

    component.babyApears['value']['breast_feeding_initiation'] = "";
    component.babyApears['value']['kangaroo_mother_care'] = "";
    component.babyApears['value']['umbilical_discharge'] = "";
    expect(component.babyApears.valid).toBeFalsy();
  });
  it("when transform date method is called", () => {
    spyOn(component['datePipe'],"transform")
    var date = {
      reading_date:new Date()
    };
    component.transformDate(date);
    expect(component['datePipe'].transform).toHaveBeenCalled();
  });
  it("when reset method is called", () => {
    spyOn(component, "createForm");
    spyOn(component,'getReadingFormData')
    component['dataService'].setOption({study_id:123})
    component.resetComponent();
    expect(component.createForm).toHaveBeenCalled();
    var data={}
    component['readinDataService'].setReadingFormData("baby_appears",data)
    component.resetComponent();
    expect(component['getReadingFormData']).toHaveBeenCalled()
  });
  it("when update appears form method is called", () => {
    component.update_appears_form();
    expect(component.submitted).toBeTruthy();
    component.setData();
    expect(component.isEditClicked).toBeFalsy();
  });
  it("when updateForm method is called", () => {
    var obj = {
      reading_date: "NA",
      time_of_reading_hours: "NA",
      time_of_reading_minute: "NA",
      baby_weight_at_birth: "NA",
      baby_weight_at_birth_unit: "NA",
      baby_appearance: "NA",
      baby_skin_colour: "NA",
      baby_cry_sound: "NA",
      baby_cry_sound_status: "NA",
      hypotonia_muscular_response_one_min_after_birth: "NA",
      hypotonia_muscular_response_five_min_after_birth: "NA",
      excessive_sleeping: "NA",
      hypothermia: "NA",
      hypothermia_status: "NA",
      hypothermia_status_value: "NA",
      baby_feeding_status: "NA",
      baby_presence_of_convulsions: "NA",
      baby_jaundice: "NA",
      breast_feeding_initiation: "NA",
      kangaroo_mother_care: "NA",
      umbilical_discharge: "NA"
    }
    component.updateForm(obj);
    expect(obj.reading_date).toBe("NA");
    expect(component.isDateReading).toBeFalsy();
    expect(obj.time_of_reading_hours).toBe("NA");
    expect(component.isTimeReading).toBeFalsy();
    expect(obj.baby_cry_sound_status).toBe("NA");
    expect(component.isCrySound).toBeFalsy();
    expect(obj.hypothermia_status_value).toBe("NA");
    expect(component.isHypothermiaUnit).toBeFalsy();
    expect(obj.baby_weight_at_birth).toBe("NA");
    expect(component.chkWeightAtBirth).toBeFalsy();
  });

  it("when onInputChange method is called", () => {
    var event_1 = {
      target: { value: "2", name: "DateReading" }
    }
    var event_2 = {
      target: { value: "2", name: "cry_sound", }
    }
    var event_3 = {
      target: { value: "2", name: "TimeReading", }
    }
    component.onInputChange(event_1);
    expect(event_1.target.name).toBe("DateReading");
    expect(event_1.target.value).toBe("2");
    component.onInputChange(event_2);
    expect(event_2.target.name).toBe("cry_sound");
    expect(event_2.target.value).toBe("2");
    component.onInputChange(event_3);
    expect(event_3.target.name).toBe("TimeReading");
    expect(event_3.target.value).toBe("2");

    event_1['target'].value = '3'
    event_2['target'].value = '3'
    event_3['target'].value = '3'
    component.onInputChange(event_1);
    expect(component.isDateReading).toBeTruthy()
    component.onInputChange(event_2);
    expect(component.isCrySound).toBeTruthy()
    component.onInputChange(event_3);
    expect(component.isTimeReading).toBeTruthy()
  });
  
  it("when onScroll Method is called", () => {
    component.onScroll();
  });
  it("when ngOnChange method is called", () => {
    spyOn(component, "createForm");
    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();
  });
  it("when reset method is called", () => {
    spyOn(component, "createForm");
    component.reset();
    expect(component.createForm).toHaveBeenCalled();
  });
  it("when goToNextReadingForm method is called", () => {
    component.goToNextReadingForm();
  });
  it("when getReadingFormData method is called", () => {
    var obj = {
      reading_date: "NA",
      time_of_reading_hours: "NA",
      time_of_reading_minute: "NA",
      baby_weight_at_birth: "NA",
      baby_weight_at_birth_unit: "NA",
      baby_appearance: "NA",
      baby_skin_colour: "NA",
      baby_cry_sound: "NA",
      baby_cry_sound_status: "NA",
      hypotonia_muscular_response_one_min_after_birth: "NA",
      hypotonia_muscular_response_five_min_after_birth: "NA",
      excessive_sleeping: "NA",
      hypothermia: "NA",
      hypothermia_status: "NA",
      hypothermia_status_value: "NA",
      baby_feeding_status: "NA",
      baby_presence_of_convulsions: "NA",
      baby_jaundice: "NA",
      breast_feeding_initiation: "NA",
      kangaroo_mother_care: "NA",
      umbilical_discharge: "NA"
    }
    component.getReadingFormData(obj);
  });
  it("when changeDropdown method is called", () => {
    var dropdown1 = { dropdownVal: "NA", dropdownId: "hypothermia_status_value_id" }
    var dropdown2 = { dropdownVal: "NA", dropdownId: "babyWeightAtBirthId" }
    component.changeDropdown(dropdown1.dropdownVal, dropdown1.dropdownId);
    component.changeDropdown(dropdown2.dropdownVal, dropdown2.dropdownId);

  });
  it("when BabyAppearFormSubmit method is called", () => {
    spyOn(component,'goToNextReadingForm')
    component.babyApearsFormSubmit();
    expect(component.submitted).toBeTruthy();
  
    component.babyApears.clearAsyncValidators();
    component.babyApears.clearValidators();
    component.babyApears.updateValueAndValidity();
    for(var i in component.babyApears.controls){
      component.babyApears.controls[i].clearValidators();
      component.babyApears.controls[i].clearAsyncValidators();
      component.babyApears.controls[i].updateValueAndValidity();
    }
    component.babyApearsFormSubmit();
    expect(component.goToNextReadingForm).toHaveBeenCalled();
    component.createForm(100);
    expect(component.babyApears.invalid).toBeTruthy();
  });
  it("open method", () => {
    spyOn(component, 'createForm');
    component.open(null, {});
    expect(component.createForm).toHaveBeenCalled();
    component.open(null, { 'mother_bmi': '17.79' });
  });

  it("when success method is called", () => {
    var response = {
      status:200
    };
    var apti_type = "babyApearsFormSubmit";
    component.success(response, apti_type);
    expect(component.page).toBe(1);

    apti_type = "get_baby_appears"
    component.success(response, apti_type);
    expect(component.isBabyAppearEdit).toBeFalsy();
  });
  it("when errorToasty method is called", () => {
    var error = {};
    component.errorToasty(error);
  });
  it("when isAlready Exists method is called", () => {
    var response = {}
    component.isAlreadyExist(response);
    expect(component.isAlreadyExist(response)).toBeFalsy();
  });
  it("when isSuccess method is called", () => {
    var response = {}
    component.isSuccess(response);
    expect(component.isSuccess(response)).toBeFalsy();
  });
  it("when get_baby_apears method is called", () => {
    component.get_baby_apears(1, 100, 20, "reading");
  });

  it("ngOnInit method", () => {
    spyOn(component,'getReadingFormData')
    spyOn(component,'get_baby_apears')
    var data={}
    component['dataService'].setOption({study_id:123})
    component.ngOnInit()
    expect(component['get_baby_apears']).toHaveBeenCalled()
    component['readinDataService'].setReadingFormData("baby_appears",data)
    component.ngOnInit()
    expect(component['getReadingFormData']).toHaveBeenCalled()
  });

  it("errorHandler method", () => {

    spyOn(component,'errorHandler')
    component.errorHandler(new Error(), "babyApearsFormSubmit")
    expect(component['errorHandler']).toHaveBeenCalled()

  });

  it("errorToasty method", () => {
    spyOn(component,'errorToasty')
    component.errorHandler(new Error(), "babyApearsFormSubmit")
    expect(component['errorToasty']).toHaveBeenCalled()
  });
});

