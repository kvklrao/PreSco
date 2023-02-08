import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask'
import { MaternalComponent } from './maternal.component';
import { DataService } from '../../shared/service/data.service';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: "test-test",
  template:""
})
class MockBabyGitComponent{
}
export const routes: Routes = [
  {
    path: '',
    component: MaternalComponent
  },
  {
    path: 'dashboard', component: MockBabyGitComponent,
    children: [
      {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
      {path: 'baby-profile', component: MockBabyGitComponent},
      {path: 'mother-profile', component: MaternalComponent},
      {path: 'baby-appearence', component: MockBabyGitComponent},
      {path: 'baby-respiratory', component: MockBabyGitComponent},
      {path: 'baby-cardio-vascular', component: MockBabyGitComponent},
      {path: 'baby-cns', component: MockBabyGitComponent},
      {path: 'baby-gi-tract', component: MockBabyGitComponent},
      {path: 'baby-investigation', component: MockBabyGitComponent},
      {path: 'anitibiotic-administration', component: MockBabyGitComponent},
      {path: 'final-diagnosis', component: MockBabyGitComponent},
    ],
    runGuardsAndResolvers: 'always',
  }
];

describe('MaternalComponent', () => {
  let component: MaternalComponent;
  let fixture: ComponentFixture<MaternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaternalComponent, MockBabyGitComponent],
      imports: [BrowserAnimationsModule,FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        MatIconModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot(),
        NgxMaskModule.forRoot()],
      providers: [DataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaternalComponent);
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
    expect(component).toBeTruthy();
  });

  //validation

  it("Mother Age validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.mother_age.valid).toBeFalsy();

    matForm.controls.mother_age.setValue(21);
    expect(matForm.controls.mother_age.valid).toBeTruthy();

    matForm.controls.mother_age.setValue("dsfsdbfsdf");
    expect(matForm.controls.mother_age.valid).toBeFalsy();

    let ne = fixture.debugElement.nativeElement;

    component.chkMotherAge = false;
    fixture.detectChanges();
    expect(ne.querySelector('#mother_age')).toBeNull();

    component.chkMotherAge = true;
    fixture.detectChanges();
    expect(ne.querySelector('#mother_age').value).toBe('');

  });

  it("Mother Weight validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.mother_weight.valid).toBeFalsy();

    matForm.controls.mother_weight.setValue(51);
    expect(matForm.controls.mother_weight.valid).toBeTruthy();

    matForm.controls.mother_weight.setValue("dsfsdbfsdf");
    expect(matForm.controls.mother_weight.valid).toBeFalsy();

    let ne = fixture.debugElement.nativeElement;

    component.changeDropdown('NA', 'mother_weight');
    fixture.detectChanges();
    expect(ne.querySelector('#mother_weight')).toBeNull();

    component.changeDropdown('Kgs', 'mother_weight');
    fixture.detectChanges();
    expect(ne.querySelector('#mother_weight').value).toBe('');

  });

  it("Mother Height validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.mother_height.valid).toBeFalsy();

    matForm.controls.mother_height.setValue(51);
    expect(matForm.controls.mother_height.valid).toBeTruthy();

    matForm.controls.mother_height.setValue("dsfsdbfsdf");
    expect(matForm.controls.mother_height.valid).toBeFalsy();

    let ne = fixture.debugElement.nativeElement;

    component.changeDropdown('NA', 'mother_height');
    fixture.detectChanges();
    expect(ne.querySelector('#mother_height')).toBeNull();

    component.changeDropdown('ft', 'mother_height');
    fixture.detectChanges();
    expect(ne.querySelector('#mother_height').value).toBe('');

  });

  it("Mother BMI validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.mother_bmi.valid).toBeFalsy();

    matForm.controls.mother_bmi.setValue(51);
    expect(matForm.controls.mother_bmi.valid).toBeTruthy();

    matForm.controls.mother_bmi.setValue("dsfsdbfsdf");
    expect(matForm.controls.mother_bmi.valid).toBeFalsy();

  });

  it("Mother Haemoglobin validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.mother_haemoglobin.valid).toBeFalsy();

    matForm.controls.mother_haemoglobin.setValue(111.11);
    expect(matForm.controls.mother_haemoglobin.valid).toBeTruthy();

    matForm.controls.mother_haemoglobin.setValue("dsfsdbfsdf");
    expect(matForm.controls.mother_haemoglobin.valid).toBeFalsy();

    let ne = fixture.debugElement.nativeElement;

    let mockEvent1 = {
      target: {
        name: "motherHaemoglobin",
        value: "2"
      }
    }
    component.onInputChange(mockEvent1);
    fixture.detectChanges();
    expect(ne.querySelector('#mother_haemoglobin')).toBeNull();

    let mockEvent2 = {
      target: {
        name: "motherHaemoglobin",
        value: "1"
      }
    }
    component.onInputChange(mockEvent2);
    fixture.detectChanges();
    expect(ne.querySelector('#mother_haemoglobin').value).toBe('');

  });

  it("Mother BPS validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.maternal_blood_pressure.valid).toBeFalsy();

    matForm.controls.maternal_blood_pressure.setValue(111);
    expect(matForm.controls.maternal_blood_pressure.valid).toBeTruthy();

    matForm.controls.maternal_blood_pressure.setValue("dsfsdbfsdf");
    expect(matForm.controls.maternal_blood_pressure.valid).toBeFalsy();

    let ne = fixture.debugElement.nativeElement;

    let mockEvent1 = {
      target: {
        name: "maternalBpSys",
        value: "2"
      }
    }
    component.onInputChange(mockEvent1);
    fixture.detectChanges();
    expect(ne.querySelector('#maternal_blood_pressure')).toBeNull();

    let mockEvent2 = {
      target: {
        name: "maternalBpSys",
        value: "1"
      }
    }
    component.onInputChange(mockEvent2);
    fixture.detectChanges();
    expect(ne.querySelector('#maternal_blood_pressure').value).toBe('');

  });

  it("Mother BPD validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.maternal_blood_pressure_diastolic.valid).toBeFalsy();

    matForm.controls.maternal_blood_pressure_diastolic.setValue(111);
    expect(matForm.controls.maternal_blood_pressure_diastolic.valid).toBeTruthy();

    matForm.controls.maternal_blood_pressure_diastolic.setValue("dsfsdbfsdf");
    expect(matForm.controls.maternal_blood_pressure_diastolic.valid).toBeFalsy();

    let ne = fixture.debugElement.nativeElement;

    let mockEvent1 = {
      target: {
        name: "maternalBpDias",
        value: "2"
      }
    }
    component.onInputChange(mockEvent1);
    fixture.detectChanges();
    expect(ne.querySelector('#maternal_blood_pressure_diastolic')).toBeNull();

    let mockEvent2 = {
      target: {
        name: "maternalBpDias",
        value: "1"
      }
    }
    component.onInputChange(mockEvent2);
    fixture.detectChanges();
    expect(ne.querySelector('#maternal_blood_pressure_diastolic').value).toBe('');

  });

  it("Mother Diabetes validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.maternal_diabetes.valid).toBeFalsy();

    matForm.controls.maternal_diabetes.setValue('Yes');
    expect(matForm.controls.maternal_diabetes.valid).toBeTruthy();
    matForm.controls.maternal_diabetes.setValue('No');
    expect(matForm.controls.maternal_diabetes.valid).toBeTruthy();
    matForm.controls.maternal_diabetes.setValue('NA');
    expect(matForm.controls.maternal_diabetes.valid).toBeTruthy();
  });

  it("Mother Fever (present) validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.maternal_fever_basic.valid).toBeFalsy();

    matForm.controls.maternal_fever_basic.setValue('Yes');
    expect(matForm.controls.maternal_fever_basic.valid).toBeTruthy();
    matForm.controls.maternal_fever_basic.setValue('No');
    expect(matForm.controls.maternal_fever_basic.valid).toBeTruthy();
    matForm.controls.maternal_fever_basic.setValue('NA');
    expect(matForm.controls.maternal_fever_basic.valid).toBeTruthy();
  });

  it("Mother Fever (Units) validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.maternal_fever.valid).toBeFalsy();

    matForm.controls.maternal_fever.setValue(51);
    expect(matForm.controls.maternal_fever.valid).toBeTruthy();

    matForm.controls.maternal_fever.setValue("dsfsdbfsdf");
    expect(matForm.controls.maternal_fever.valid).toBeFalsy();

    let ne = fixture.debugElement.nativeElement;

    component.changeDropdown('NA', 'maternal_feverId');
    fixture.detectChanges();
    expect(ne.querySelector('#maternal_feverId')).toBeNull();

    component.changeDropdown('Centigrade', 'maternal_feverId');
    fixture.detectChanges();
    expect(ne.querySelector('#maternal_feverId').value).toBe('');

    component.changeDropdown('Fahrenheit', 'maternal_feverId');
    fixture.detectChanges();
    expect(ne.querySelector('#maternal_feverId').value).toBe('');

  });

  it("Mother Thyroid Function (Normal) validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.maternal_thyroid_function.valid).toBeFalsy();

    matForm.controls.maternal_thyroid_function.setValue('Yes');
    expect(matForm.controls.maternal_thyroid_function.valid).toBeTruthy();
    matForm.controls.maternal_thyroid_function.setValue('No');
    expect(matForm.controls.maternal_thyroid_function.valid).toBeTruthy();
    matForm.controls.maternal_thyroid_function.setValue('NA');
    expect(matForm.controls.maternal_thyroid_function.valid).toBeTruthy();
  });

  it("Mother Thyroid Function (Diagnosis) validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.maternal_thyroid_function_basic.valid).toBeFalsy();

    matForm.controls.maternal_thyroid_function_basic.setValue('Hypo');
    expect(matForm.controls.maternal_thyroid_function_basic.valid).toBeTruthy();
    matForm.controls.maternal_thyroid_function_basic.setValue('Hyper');
    expect(matForm.controls.maternal_thyroid_function_basic.valid).toBeTruthy();
    matForm.controls.maternal_thyroid_function_basic.setValue('NA');
    expect(matForm.controls.maternal_thyroid_function_basic.valid).toBeTruthy();
  });

  it("Mother Thyroid Function (Unit) validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.maternal_thyroid_function_unit_basic.valid).toBeFalsy();

    matForm.controls.maternal_thyroid_function_unit_basic.setValue(51);
    expect(matForm.controls.maternal_thyroid_function_unit_basic.valid).toBeTruthy();

    matForm.controls.maternal_thyroid_function_unit_basic.setValue("dsfsdbfsdf");
    expect(matForm.controls.maternal_thyroid_function_unit_basic.valid).toBeFalsy();

    let ne = fixture.debugElement.nativeElement;

    component.changeDropdown('NA', 'maternal_thyroid_function_unit_basic_id');
    fixture.detectChanges();
    expect(ne.querySelector('#maternal_thyroid_function_unit_basic_id')).toBeNull();

    component.changeDropdown('mU/L', 'maternal_thyroid_function_unit_basic_id');
    fixture.detectChanges();
    expect(ne.querySelector('#maternal_thyroid_function_unit_basic_id').value).toBe('');
  });

  it("More than 3 Vaginal Examinations During Labor validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.more_than_3_vaginal_examinations_during_labor.valid).toBeFalsy();

    matForm.controls.more_than_3_vaginal_examinations_during_labor.setValue('Yes');
    expect(matForm.controls.more_than_3_vaginal_examinations_during_labor.valid).toBeTruthy();
    matForm.controls.more_than_3_vaginal_examinations_during_labor.setValue('No');
    expect(matForm.controls.more_than_3_vaginal_examinations_during_labor.valid).toBeTruthy();
    matForm.controls.more_than_3_vaginal_examinations_during_labor.setValue('NA');
    expect(matForm.controls.more_than_3_vaginal_examinations_during_labor.valid).toBeTruthy();
  });

  it("Leaking PV validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.leaking_pv.valid).toBeFalsy();

    matForm.controls.leaking_pv.setValue('Yes');
    expect(matForm.controls.leaking_pv.valid).toBeTruthy();
    matForm.controls.leaking_pv.setValue('No');
    expect(matForm.controls.leaking_pv.valid).toBeTruthy();
    matForm.controls.leaking_pv.setValue('NA');
    expect(matForm.controls.leaking_pv.valid).toBeTruthy();
  });

  it("Rupture Of Membranes (ROM) validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.rupture_of_membranes_rom.valid).toBeFalsy();

    matForm.controls.rupture_of_membranes_rom.setValue('Yes');
    expect(matForm.controls.rupture_of_membranes_rom.valid).toBeTruthy();
    matForm.controls.rupture_of_membranes_rom.setValue('No');
    expect(matForm.controls.rupture_of_membranes_rom.valid).toBeTruthy();
    matForm.controls.rupture_of_membranes_rom.setValue('NA');
    expect(matForm.controls.rupture_of_membranes_rom.valid).toBeTruthy();
  });

  it("More than 3 Vaginal Examinations During Labor validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.more_than_3_vaginal_examinations_during_labor.valid).toBeFalsy();

    matForm.controls.more_than_3_vaginal_examinations_during_labor.setValue('Yes');
    expect(matForm.controls.more_than_3_vaginal_examinations_during_labor.valid).toBeTruthy();
    matForm.controls.more_than_3_vaginal_examinations_during_labor.setValue('No');
    expect(matForm.controls.more_than_3_vaginal_examinations_during_labor.valid).toBeTruthy();
    matForm.controls.more_than_3_vaginal_examinations_during_labor.setValue('NA');
    expect(matForm.controls.more_than_3_vaginal_examinations_during_labor.valid).toBeTruthy();
  });

  it("Rupture Of Membranes (PROM/SROM) validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.rupture_of_membranes_rom_one.valid).toBeFalsy();

    matForm.controls.rupture_of_membranes_rom_one.setValue('PROM');
    expect(matForm.controls.rupture_of_membranes_rom_one.valid).toBeTruthy();
    matForm.controls.rupture_of_membranes_rom_one.setValue('SROM');
    expect(matForm.controls.rupture_of_membranes_rom_one.valid).toBeTruthy();
    matForm.controls.rupture_of_membranes_rom_one.setValue('NA');
    expect(matForm.controls.rupture_of_membranes_rom_one.valid).toBeTruthy();
  });

  it("Smelly Amniotic Fluid validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.smelly_amniotic_fluid.valid).toBeFalsy();

    matForm.controls.smelly_amniotic_fluid.setValue('Yes');
    expect(matForm.controls.smelly_amniotic_fluid.valid).toBeTruthy();
    matForm.controls.smelly_amniotic_fluid.setValue('No');
    expect(matForm.controls.smelly_amniotic_fluid.valid).toBeTruthy();
    matForm.controls.smelly_amniotic_fluid.setValue('NA');
    expect(matForm.controls.smelly_amniotic_fluid.valid).toBeTruthy();
  });

  it("Chorioamnionitis validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.chorioamnionitis.valid).toBeFalsy();

    matForm.controls.chorioamnionitis.setValue('Yes');
    expect(matForm.controls.chorioamnionitis.valid).toBeTruthy();
    matForm.controls.chorioamnionitis.setValue('No');
    expect(matForm.controls.chorioamnionitis.valid).toBeTruthy();
    matForm.controls.chorioamnionitis.setValue('NA');
    expect(matForm.controls.chorioamnionitis.valid).toBeTruthy();
  });

  it("GBS Infection validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.gbs_infection.valid).toBeFalsy();

    matForm.controls.gbs_infection.setValue('Yes');
    expect(matForm.controls.gbs_infection.valid).toBeTruthy();
    matForm.controls.gbs_infection.setValue('No');
    expect(matForm.controls.gbs_infection.valid).toBeTruthy();
    matForm.controls.gbs_infection.setValue('NA');
    expect(matForm.controls.gbs_infection.valid).toBeTruthy();
  });

  it("Urinary Tract Infection validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.colonisation_or_urinary_tract_infection.valid).toBeFalsy();

    matForm.controls.colonisation_or_urinary_tract_infection.setValue('Yes');
    expect(matForm.controls.colonisation_or_urinary_tract_infection.valid).toBeTruthy();
    matForm.controls.colonisation_or_urinary_tract_infection.setValue('No');
    expect(matForm.controls.colonisation_or_urinary_tract_infection.valid).toBeTruthy();
    matForm.controls.colonisation_or_urinary_tract_infection.setValue('NA');
    expect(matForm.controls.colonisation_or_urinary_tract_infection.valid).toBeTruthy();
  });

  it("Torch Infection validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.torch_infections.valid).toBeFalsy();

    matForm.controls.torch_infections.setValue('Yes');
    expect(matForm.controls.torch_infections.valid).toBeTruthy();
    matForm.controls.torch_infections.setValue('No');
    expect(matForm.controls.torch_infections.valid).toBeTruthy();
    matForm.controls.torch_infections.setValue('NA');
    expect(matForm.controls.torch_infections.valid).toBeTruthy();
  });

  it("Type Of Delivery validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.type_of_delivery.valid).toBeFalsy();

    matForm.controls.type_of_delivery.setValue('Cesarean');
    expect(matForm.controls.type_of_delivery.valid).toBeTruthy();
    matForm.controls.type_of_delivery.setValue('Normal');
    expect(matForm.controls.type_of_delivery.valid).toBeTruthy();
    matForm.controls.type_of_delivery.setValue('NA');
    expect(matForm.controls.type_of_delivery.valid).toBeTruthy();
  });

  it("Delayed Cord Clamping validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.delayed_cord_clamping.valid).toBeFalsy();

    matForm.controls.delayed_cord_clamping.setValue('Yes');
    expect(matForm.controls.delayed_cord_clamping.valid).toBeTruthy();
    matForm.controls.delayed_cord_clamping.setValue('No');
    expect(matForm.controls.delayed_cord_clamping.valid).toBeTruthy();
    matForm.controls.delayed_cord_clamping.setValue('NA');
    expect(matForm.controls.delayed_cord_clamping.valid).toBeTruthy();
  });

  it("Vaginal Swab Culture (Done) validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.vaginal_swab_culture.valid).toBeFalsy();

    matForm.controls.vaginal_swab_culture.setValue('Yes');
    expect(matForm.controls.vaginal_swab_culture.valid).toBeTruthy();
    matForm.controls.vaginal_swab_culture.setValue('No');
    expect(matForm.controls.vaginal_swab_culture.valid).toBeTruthy();
    matForm.controls.vaginal_swab_culture.setValue('NA');
    expect(matForm.controls.vaginal_swab_culture.valid).toBeTruthy();
  });

  it("Vaginal Swab Culture (Result) validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.vaginal_swab_culture_two.valid).toBeFalsy();

    matForm.controls.vaginal_swab_culture_two.setValue('Positive');
    expect(matForm.controls.vaginal_swab_culture_two.valid).toBeTruthy();
    matForm.controls.vaginal_swab_culture_two.setValue('Negative');
    expect(matForm.controls.vaginal_swab_culture_two.valid).toBeTruthy();
    matForm.controls.vaginal_swab_culture_two.setValue('NA');
    expect(matForm.controls.vaginal_swab_culture_two.valid).toBeTruthy();
  });

  it("Amniotic Fluid Culture (Done) validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.amniotic_fluid_culture.valid).toBeFalsy();

    matForm.controls.amniotic_fluid_culture.setValue('Yes');
    expect(matForm.controls.amniotic_fluid_culture.valid).toBeTruthy();
    matForm.controls.amniotic_fluid_culture.setValue('No');
    expect(matForm.controls.amniotic_fluid_culture.valid).toBeTruthy();
    matForm.controls.amniotic_fluid_culture.setValue('NA');
    expect(matForm.controls.amniotic_fluid_culture.valid).toBeTruthy();
  });

  it("Amniotic Fluid Culture (Result) validations", () => {

    let matForm = component.maternalForm;
    expect(matForm.controls.amniotic_fluid_culture_two.valid).toBeFalsy();

    matForm.controls.amniotic_fluid_culture_two.setValue('Positive');
    expect(matForm.controls.amniotic_fluid_culture_two.valid).toBeTruthy();
    matForm.controls.amniotic_fluid_culture_two.setValue('Negative');
    expect(matForm.controls.amniotic_fluid_culture_two.valid).toBeTruthy();
    matForm.controls.amniotic_fluid_culture_two.setValue('NA');
    expect(matForm.controls.amniotic_fluid_culture_two.valid).toBeTruthy();
  });

  it("Rupture Of Membranes(IF PROM) validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.rupture_of_membranes_rom_two.valid).toBeFalsy();

    matForm.controls.rupture_of_membranes_rom_two.setValue(111);
    expect(matForm.controls.rupture_of_membranes_rom_two.valid).toBeTruthy();

    matForm.controls.rupture_of_membranes_rom_two.setValue("dsfsdbfsdf");
    expect(matForm.controls.rupture_of_membranes_rom_two.valid).toBeTruthy();

    let ne = fixture.debugElement.nativeElement;

    let mockEvent1 = {
      target: {
        name: "ruptureIfProm",
        value: "2"
      }
    }
    component.onInputChange(mockEvent1);
    fixture.detectChanges();
    expect(ne.querySelector('#rupture_of_membranes_rom_two')).toBeNull();

    let mockEvent2 = {
      target: {
        name: "ruptureIfProm",
        value: "1"
      }
    }
    component.onInputChange(mockEvent2);
    fixture.detectChanges();
    expect(ne.querySelector('#rupture_of_membranes_rom_two').value).toBe('');

  });

  it("Vaginal Swab Culture validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.vaginal_swab_culture_three.valid).toBeFalsy();

    matForm.controls.vaginal_swab_culture_three.setValue(111);
    expect(matForm.controls.vaginal_swab_culture_three.valid).toBeFalsy();

    matForm.controls.vaginal_swab_culture_three.setValue("dsfsdbfsdf");
    expect(matForm.controls.vaginal_swab_culture_three.valid).toBeTruthy();

    let ne = fixture.debugElement.nativeElement;

    let mockEvent1 = {
      target: {
        name: "vagSwabCulture",
        value: "2"
      }
    }
    component.onInputChange(mockEvent1);
    fixture.detectChanges();
    expect(ne.querySelector('#vaginal_swab_culture_three')).toBeNull();

    let mockEvent2 = {
      target: {
        name: "vagSwabCulture",
        value: "1"
      }
    }
    component.onInputChange(mockEvent2);
    fixture.detectChanges();
   // expect(ne.querySelector('#vaginal_swab_culture_three').value).toBe('');

  });

  it("motherBMI validations", () => {

    let mockEvent1 = {
      target: {
        name: "motherBMI",
        value: "2"
      }
    }
    component.onInputChange(mockEvent1);
    fixture.detectChanges();
    expect(component.hasBmi).toBeFalsy();

    let mockEvent2 = {
      target: {
        name: "motherBMI",
        value: "1"
      }
    }
    component.onInputChange(mockEvent2);
    fixture.detectChanges();
    expect(component.hasBmi).toBeTruthy();

  });


  it("AF Culture (If Positive) validations", () => {
    let matForm = component.maternalForm;
    expect(matForm.controls.amniotic_fluid_culture_three.valid).toBeFalsy();

    matForm.controls.amniotic_fluid_culture_three.setValue(111);
    expect(matForm.controls.amniotic_fluid_culture_three.valid).toBeFalsy();

    matForm.controls.amniotic_fluid_culture_three.setValue("dsfsdbfsdf");
    expect(matForm.controls.amniotic_fluid_culture_three.valid).toBeTruthy();

    let ne = fixture.debugElement.nativeElement;

    let mockEvent1 = {
      target: {
        name: "amnioticFluidCultureIfPos",
        value: "2"
      }
    }
    component.onInputChange(mockEvent1);
    fixture.detectChanges();
    expect(ne.querySelector('#amniotic_fluid_culture_three')).toBeNull();

    let mockEvent2 = {
      target: {
        name: "amnioticFluidCultureIfPos",
        value: "1"
      }
    }
    component.onInputChange(mockEvent2);
    fixture.detectChanges();
    //expect(ne.querySelector('#amniotic_fluid_culture_three').value).toBe('');

  });

  //methods

  it("Bmi calculate method", () => {
    let matForm = component.maternalForm;
    component.calculateBMI();
    matForm.controls.mother_height.setValue(5.6);
    matForm.controls.mother_weight.setValue(50);
    expect(matForm.value["mother_bmi"]).toBe('17.79');
  });

  it("ngOnChanges method", () => {
    spyOn(component, 'createForm');
    component.ngOnChanges();
    expect(component.createForm).toHaveBeenCalled();
  });

  it("reset method", () => {
    spyOn(component, 'createForm');
    component.reset();
    expect(component.createForm).toHaveBeenCalled();
  });

  it("reset again method", () => {
    spyOn(component, 'createForm');
    component.reset();
    expect(component.createForm).toHaveBeenCalled();
  });

  it("open method", () => {
    expect(component.updateFlag).toBeFalsy();
    spyOn(component, 'createForm');
    component.open(null, {});
    expect(component.createForm).toHaveBeenCalled();

    let obj = {
      study_id: 'NA',
      mother_age: 'NA',
      mother_weight_unit: 'NA',
      mother_weight: 'NA',
      mother_height: 'NA',
      mother_height_unit: 'NA',
      mother_haemoglobin: 'NA',
      mother_bmi: 'NA',
      maternal_blood_pressure: 'NA',
      maternal_blood_pressure_diastolic: 'NA',
      maternal_diabetes: 'NA',
      maternal_fever: 'NA',
      maternal_fever_unit: 'NA',
      maternal_fever_basic: 'NA',
      maternal_thyroid_function: 'NA',
      maternal_thyroid_function_basic:'NA',
      maternal_thyroid_function_unit_basic: 'NA',
      maternal_thyroid_function_unit_basic_unit: 'NA',
      more_than_3_vaginal_examinations_during_labor: 'NA',
      rupture_of_membranes_rom_two: 'NA',
      rupture_of_membranes_rom_one:'NA',
      rupture_of_membranes_rom: 'NA',
      leaking_pv: 'NA',
      smelly_amniotic_fluid: 'NA',
      chorioamnionitis: 'NA',
      gbs_infection: 'NA',
      colonisation_or_urinary_tract_infection: 'NA',
      torch_infections: 'NA',
      type_of_delivery: 'NA',
      delayed_cord_clamping: 'NA',
      vaginal_swab_culture: 'NA',
      vaginal_swab_culture_two: 'NA',
      vaginal_swab_culture_three: 'NA',
      amniotic_fluid_culture: 'NA',
      amniotic_fluid_culture_three: 'NA',
      amniotic_fluid_culture_two: 'NA'
    }
    component.open(null, obj);
    expect(component.updateFlag).toBeTruthy();
  });

  it("updateForm method", () => {
    component.maternalForm.patchValue({  mother_height: 5.5})
    spyOn(component, 'clearValidators');
    spyOn(component, 'setValidators');
    let obj = {
      study_id: 'NA',
      mother_age: 'NA',
      mother_weight_unit: 'NA',
      mother_weight: 'NA',
      mother_height: 'NA',
      mother_height_unit: 'NA',
      mother_haemoglobin: 'NA',
      mother_bmi: 'NA',
      maternal_blood_pressure: 'NA',
      maternal_blood_pressure_diastolic: 'NA',
      maternal_diabetes: 'NA',
      maternal_fever: 'NA',
      maternal_fever_unit: 'NA',
      maternal_fever_basic: 'NA',
      maternal_thyroid_function: 'NA',
      maternal_thyroid_function_basic:'NA',
      maternal_thyroid_function_unit_basic: 'NA',
      maternal_thyroid_function_unit_basic_unit: 'NA',
      more_than_3_vaginal_examinations_during_labor: 'NA',
      rupture_of_membranes_rom_two: 'NA',
      rupture_of_membranes_rom_one:'NA',
      rupture_of_membranes_rom: 'NA',
      leaking_pv: 'NA',
      smelly_amniotic_fluid: 'NA',
      chorioamnionitis: 'NA',
      gbs_infection: 'NA',
      colonisation_or_urinary_tract_infection: 'NA',
      torch_infections: 'NA',
      type_of_delivery: 'NA',
      delayed_cord_clamping: 'NA',
      vaginal_swab_culture: 'NA',
      vaginal_swab_culture_two: 'NA',
      vaginal_swab_culture_three: 'NA',
      amniotic_fluid_culture: 'NA',
      amniotic_fluid_culture_three: 'NA',
      amniotic_fluid_culture_two: 'NA'
    }
    component.updateForm(obj);
    expect(component.clearValidators).toHaveBeenCalled();

    let obj2 = {
      study_id: 'testTest',
      mother_age: 'testTest',
      mother_weight_unit: 'testTest',
      mother_weight: 'testTest',
      mother_height: 'testTest',
      mother_height_unit: 'testTest',
      mother_haemoglobin: 'testTest',
      mother_bmi: 'testTest',
      maternal_blood_pressure: 'testTest',
      maternal_blood_pressure_diastolic: 'testTest',
      maternal_diabetes: 'testTest',
      maternal_fever: 'testTest',
      maternal_fever_unit: 'testTest',
      maternal_fever_basic: 'testTest',
      maternal_thyroid_function: 'testTest',
      maternal_thyroid_function_basic:'testTest',
      maternal_thyroid_function_unit_basic: 'testTest',
      maternal_thyroid_function_unit_basic_unit: 'testTest',
      more_than_3_vaginal_examinations_during_labor: 'testTest',
      rupture_of_membranes_rom_two: 'testTest',
      rupture_of_membranes_rom_one:'testTest',
      rupture_of_membranes_rom: 'testTest',
      leaking_pv: 'testTest',
      smelly_amniotic_fluid: 'testTest',
      chorioamnionitis: 'testTest',
      gbs_infection: 'testTest',
      colonisation_or_urinary_tract_infection: 'testTest',
      torch_infections: 'testTest',
      type_of_delivery: 'testTest',
      delayed_cord_clamping: 'testTest',
      vaginal_swab_culture: 'testTest',
      vaginal_swab_culture_two: 'testTest',
      vaginal_swab_culture_three: 'testTest',
      amniotic_fluid_culture: 'testTest',
      amniotic_fluid_culture_three: 'testTest',
      amniotic_fluid_culture_two: 'testTest'
    }
    component.updateForm(obj2);
    expect(component.setValidators).toHaveBeenCalled();
  });

  it("onInputChange method", () => {
    spyOn(component, 'clearValidators');
    let obj = {
      target:{
        name: "mother_age",
        value: 2
      }
    }
    component.onInputChange(obj);
    expect(component.clearValidators).toHaveBeenCalled();

    let obj2 = {
      target:{
        name: "mother_age",
        value: 1
      }
    }
    component.onInputChange(obj2);
    expect(component.chkMotherAge).toBeTruthy();


  });

  it("maternalFormSubmit method", () => {
    expect(component.submitted).toBeFalsy();
    component.maternalFormSubmit();
    expect(component.submitted).toBeTruthy();
  });

  it("findInvalidControls method", () => {
    expect(component.findInvalidControls().length).toBe(31);
  });

  it("errorHandler method", () => {

    spyOn(component,'errorHandler')
    component.errorHandler(new Error(), "MaternalFormSubmit")
    expect(component['errorHandler']).toHaveBeenCalled()

  });

  it("errorToasty method", () => {
    spyOn(component,'errorToasty')
    component.errorHandler(new Error(), "MaternalFormSubmit")
    expect(component['errorToasty']).toHaveBeenCalled()
  });

  it("when Success method is called",()=>{
     
    let res = {
      status:404,
      response:[{data:"test"}]
    }

    spyOn(component['toastr'],'error');
    component.success(res, "MaternalFormSubmit");
    expect(component['toastr'].error).toHaveBeenCalled();

    res = {
      status:200,
      response:[{data:"test"}]
    }

    component.success(res, "MaternalFormSubmit");
    expect(component.is_api_call).toBeTruthy();

    res = {
      status:404,
      response:[{data:"test"}]
    }

    component.success(res, "get_all");
    expect(component.is_api_call).toBeTruthy();

  });

  it("when update_maternal_form method is called",()=>{
    component.update_maternal_form();
    expect(component.submitted).toBeTruthy();
  });
  
  it("changeDropdown method", () => {
    spyOn(component, 'clearValidators');

    component.changeDropdown('NA',"mother_height");
    expect(component.clearValidators).toHaveBeenCalled();
    component.changeDropdown(12,"mother_height");
    expect(component.clearValidators).toHaveBeenCalled();

    component.changeDropdown('NA',"mother_weight");
    expect(component.clearValidators).toHaveBeenCalled();
    component.changeDropdown(121,"mother_weight");
    expect(component.clearValidators).toHaveBeenCalled();

    component.changeDropdown('NA',"maternal_thyroid_function_unit_basic_id");
    expect(component.clearValidators).toHaveBeenCalled();
    component.changeDropdown(12,"maternal_thyroid_function_unit_basic_id");
    expect(component.clearValidators).toHaveBeenCalled();
    
    component.changeDropdown('NA',"maternal_feverId");
    expect(component.clearValidators).toHaveBeenCalled();
    component.changeDropdown(12,"maternal_feverId");
    expect(component.clearValidators).toHaveBeenCalled();
  });

  it("setFormData method", () => {
    component.setFormData();
    let matForm = component.maternalForm;
    expect(matForm.value["mother_age"]).toBe('NA');
    expect(matForm.value["mother_haemoglobin"]).toBe('NA');
    expect(matForm.value["maternal_blood_pressure"]).toBe('NA');
    expect(matForm.value["maternal_blood_pressure_diastolic"]).toBe('NA');
    expect(matForm.value["rupture_of_membranes_rom_two"]).toBe('NA');
    expect(matForm.value["vaginal_swab_culture_three"]).toBe('NA');
    expect(matForm.value["amniotic_fluid_culture_three"]).toBe('NA');
    expect(matForm.value["mother_height"]).toBe('NA');
    expect(matForm.value["mother_weight"]).toBe('NA');
    expect(matForm.value["maternal_thyroid_function_unit_basic"]).toBe('NA');
    expect(matForm.value["maternal_fever"]).toBe('NA');
    expect(matForm.value["study_id"]).toBeNull();
  });
});
