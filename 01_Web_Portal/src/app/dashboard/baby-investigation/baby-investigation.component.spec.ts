import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask'
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { BabyInvestigationComponent } from './baby-investigation.component';
import { DataService } from '../../shared/service/data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAntibioticComponent{

}

export const routes: Routes = [
  // {
  //   path: '',
  //   component: BabyInvestigationComponent
  // }
  {
    path: 'dashboard', component: MockAntibioticComponent,
    children: [
       {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
    //  {path: 'baby-gi-tract', component: BabyGitComponent},
       {path: 'baby-investigation', component: BabyInvestigationComponent},
       {path: 'anitibiotic-administration', component: MockAntibioticComponent},
    //{path: 'baby-investigation', component: MockBabyInvestComponent},

    ],
    runGuardsAndResolvers: 'always',
  }
];

describe('BabyInvestigationComponent', () => {
  let component: BabyInvestigationComponent;
  let fixture: ComponentFixture<BabyInvestigationComponent>;
  let babyInvestForm: FormGroup;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BabyInvestigationComponent],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        MatIconModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot(),
        NgxMaskModule.forRoot(),
        AngularMultiSelectModule],
      providers: [DataService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BabyInvestigationComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function () {
      return JSON.stringify({ "test": "test" });
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value;
    });
    fixture.detectChanges();
    babyInvestForm = component.invetigationForm;
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92, "hospital_name": "getwell", "hospital_branch_name": "getwell indore", "hospital_branch_id": 59 }));
    expect(component).toBeTruthy();
  });

  //validations

  it('Form Validations', () => {

    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.baby_thyroid_status.setValue('Normal');
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.baby_thyroid_result.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.baby_blood_glucose.setValue(100);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.baby_haemoglobin_levels.setValue(10);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.baby_c_reactive_protien_levels.setValue(0.1);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.micro_esr.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.baby_procalcitonin_levels.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.total_leucocute_count.setValue(8300);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.absolute_neutrophil_count.setValue(10);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.immature_to_mature_neutrophil_ratios.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.thrombocytopenia.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.urine_rest_for_pus_cells.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.urine_culture_test.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.blood_culture_report.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.gram_positive_bacteria.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.gram_negative_bacteria.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.fungi.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.other_organism.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.antibiotic_status_value.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.antibiotic_status_resisitant.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.antibiotic_status_intermediate.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.sodium.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.potassium.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.chlorine.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.calcium.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.phosphate.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.magnesium.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.urea.setValue(213);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.creatinine.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.lactate_levels.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.bilirubin_levels.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.cord_ph.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();


    babyInvestForm.controls.arrhythmia.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.csf_culture.setValue("NA");
    expect(babyInvestForm.valid).toBeFalsy();

    babyInvestForm.controls.csf_culture_tsb_value.setValue(123);
    expect(babyInvestForm.valid).toBeFalsy();
  });

  it("Other Validaters", () => {
    let event = {
      target: {
        name: "BabyThyroidResult",
        value: 2
      }
    }

    component.onInputChange(event);
    expect(component.isBabyThyroidResult).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    component.onInputChange(event);
    expect(component.isBabyThyroidResult).toBeTruthy();

    event["target"]["name"] = "BabyBloodGlucose";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isBabyBloodGlucose).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isBabyBloodGlucose).toBeTruthy();

    event["target"]["name"] = "BabyHaemoglobin";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isBabyHaemoglobin).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isBabyHaemoglobin).toBeTruthy();

    event["target"]["name"] = "BabyProtien";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isBabyProtien).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isBabyProtien).toBeTruthy();

    event["target"]["name"] = "BabyEsr";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isBabyEsr).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isBabyEsr).toBeTruthy();

    event["target"]["name"] = "BabyProcalcitonin";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isBabyProcalcitonin).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isBabyProcalcitonin).toBeTruthy();

    event["target"]["name"] = "Sodium";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isSodium).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isSodium).toBeTruthy();

    event["target"]["name"] = "Potassium";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isPotassium).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isPotassium).toBeTruthy();

    event["target"]["name"] = "Chlorine";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isChlorine).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isChlorine).toBeTruthy();

    event["target"]["name"] = "Calcium";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isCalcium).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isCalcium).toBeTruthy();

    event["target"]["name"] = "Phosphate";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isPhosphate).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isPhosphate).toBeTruthy();

    event["target"]["name"] = "Magnesium";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isMagnesium).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isMagnesium).toBeTruthy();

    event["target"]["name"] = "Urea";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isUrea).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isUrea).toBeTruthy();

    event["target"]["name"] = "Creatinine";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isCreatinine).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isCreatinine).toBeTruthy();

    event["target"]["name"] = "Lactate";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isLactate).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isLactate).toBeTruthy();

    event["target"]["name"] = "Bilirubin";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isBilirubin).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isBilirubin).toBeTruthy();

    event["target"]["name"] = "Cord_pH";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isCord).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isCord).toBeTruthy();

    event["target"]["name"] = "TSBValue";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isTSBValue).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isTSBValue).toBeTruthy();

    event["target"]["name"] = "antibioticSensitive";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isAntibioticSensitive).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isAntibioticSensitive).toBeTruthy();

    event["target"]["name"] = "antibioticResisitant";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isAntibioticResisitant).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isAntibioticResisitant).toBeTruthy();

    event["target"]["name"] = "antibioticIntermediate";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isAntibioticIntermediate).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isAntibioticIntermediate).toBeTruthy();

    event["target"]["name"] = "babyProthrombin";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isprothrombin).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isprothrombin).toBeTruthy();

    event["target"]["name"] = "babyActiveProthrombin";
    event["target"]["value"] = 2;
    component.onInputChange(event);
    expect(component.isActiveProthrombin).toBeFalsy();
    event["target"]["value"] = 1;
    component.onInputChange(event);
    expect(component.isActiveProthrombin).toBeTruthy();

  });

  it("Multiple Selection Validaters", () => {
    let item = {
      itemName: "Others"
    }
    component.onItemSelect(item, "id_gram_positive_bacteria");
    expect(component.isPositiveBactFreeField).toBeTruthy();

    component.onItemSelect(item, "id_gram_negative_bacteria");
    expect(component.isNegativeBactFreeField).toBeTruthy();

  });

  //methods unit testing

  it('ngOnInit method', () => {
    spyOn(component, 'getReadingFormData');
    spyOn(component, 'get_investigation');
    component['dataService'].setOption({ study_id: 123 })
    component.ngOnInit();
    expect(component.get_investigation).toHaveBeenCalled();
    component.readingDataService.setReadingFormData("baby_investigation", {});
    component.ngOnInit();
    expect(component.getReadingFormData).toHaveBeenCalled();
  });

  it('updateForm method', () => {
    let obj:Object = {
      baby_thyroid_status: 'test',
      baby_thyroid_result: 123,
      baby_blood_glucose: 123,
      baby_haemoglobin_levels: 123,
      baby_c_reactive_protien_levels: 123,
      micro_esr: 123,
      baby_procalcitonin_levels: 123,
      total_leucocute_count: 123,
      absolute_neutrophil_count: 123,
      immature_to_mature_neutrophil_ratios: 'test',
      thrombocytopenia: 123,
      urine_rest_for_pus_cells: 'test',
      urine_culture_test: 'test',
      blood_culture_report: 'test',
      gram_positive_bacteria: 'test',
      gram_negative_bacteria: 'test',
      fungi: 'test',
      other_organism: 'test',
      antibiotic_status_value: 'test',
      antibiotic_status_resisitant: 'test',
      antibiotic_status_intermediate: 'test',
      sodium: 123,
      potassium: 123,
      chlorine: 123,
      calcium: 123,
      phosphate: 123,
      magnesium: 123,
      urea: 123,
      creatinine: 123,
      lactate_levels: 123,
      bilirubin_levels: 123,
      cord_ph: 123,
      arrhythmia: 'test',
      csf_culture: 'NA',
      csf_culture_tsb_value: 123,
      gram_positive_bacteria_if_other:'test',
      gram_negative_bacteria_if_other:'test',
      
    }

    let obj2:Object = {
      baby_thyroid_status: 'test',
      baby_thyroid_result: 'NA',
      baby_blood_glucose: 'NA',
      baby_haemoglobin_levels: 'NA',
      baby_c_reactive_protien_levels: 'NA',
      micro_esr: 'NA',
      baby_procalcitonin_levels: 'NA',
      total_leucocute_count: 'NA',
      absolute_neutrophil_count: 'NA',
      immature_to_mature_neutrophil_ratios: 'test',
      thrombocytopenia: 'NA',
      urine_rest_for_pus_cells: 'test',
      urine_culture_test: 'test',
      blood_culture_report: 'test',
      gram_positive_bacteria: 'test',
      gram_negative_bacteria: 'test',
      fungi: 'test',
      other_organism: 'test',
      antibiotic_status_value: 'test',
      antibiotic_status_resisitant: 'test',
      antibiotic_status_intermediate: 'test',
      sodium: 'NA',
      potassium: 'NA',
      chlorine: 'NA',
      calcium: 'NA',
      phosphate: 'NA',
      magnesium: 'NA',
      urea: 'NA',
      creatinine: 'NA',
      lactate_levels: 'NA',
      bilirubin_levels: 'NA',
      cord_ph: 'NA',
      arrhythmia: 'test',
      csf_culture: 'NA',
      csf_culture_tsb_value: 'NA',
      gram_positive_bacteria_if_other:'test',
      gram_negative_bacteria_if_other:'test',
      
    }

    component.updateForm(obj2);
    spyOn(babyInvestForm, 'patchValue');
    component.updateForm(obj);
    expect(babyInvestForm.patchValue).toHaveBeenCalled();

    

  });

  // it('updateForm method', () => {
  //   let obj:Object = {
  //     baby_thyroid_status: 'test',
  //     baby_thyroid_result: 123,
  //     baby_blood_glucose: 123,
  //     baby_haemoglobin_levels: 123,
  //     baby_c_reactive_protien_levels: 123,
  //     micro_esr: 123,
  //     baby_procalcitonin_levels: 123,
  //     total_leucocute_count: 123,
  //     absolute_neutrophil_count: 123,
  //     immature_to_mature_neutrophil_ratios: 'test',
  //     thrombocytopenia: 123,
  //     urine_rest_for_pus_cells: 'test',
  //     urine_culture_test: 'test',
  //     blood_culture_report: 'test',
  //     gram_positive_bacteria: 'test',
  //     gram_negative_bacteria: 'test',
  //     fungi: 'test',
  //     other_organism: 'test',
  //     antibiotic_status_value: 'test',
  //     antibiotic_status_resisitant: 'test',
  //     antibiotic_status_intermediate: 'test',
  //     sodium: 123,
  //     potassium: 123,
  //     chlorine: 123,
  //     calcium: 123,
  //     phosphate: 123,
  //     magnesium: 123,
  //     urea: 123,
  //     creatinine: 123,
  //     lactate_levels: 123,
  //     bilirubin_levels: 123,
  //     cord_ph: 123,
  //     arrhythmia: 'test',
  //     csf_culture: 'NA',
  //     csf_culture_tsb_value: 123,
  //   }

  //   spyOn(babyInvestForm, 'patchValue');
  //   component.updateForm(obj);
  //   expect(babyInvestForm.patchValue).toHaveBeenCalled();
  // });

  it('OnItemDeSelect and onSelectAll and onDeSelectAll method', () => {
    let item = {
      itemName: "Others"
    }

    component.onSelectAll(item,"id_gram_positive_bacteria");
    expect(component.isPositiveBactFreeField).toBeTruthy();

    component.onSelectAll(item,"id_gram_negative_bacteria");
    expect(component.isNegativeBactFreeField).toBeTruthy();

    component.OnItemDeSelect(item,"id_gram_positive_bacteria");
    expect(component.isPositiveBactFreeField).toBeFalsy();

    component.OnItemDeSelect(item,"id_gram_negative_bacteria");
    expect(component.isNegativeBactFreeField).toBeFalsy();

    component.onDeSelectAll(item,"id_gram_positive_bacteria");
    expect(component.isPositiveBactFreeField).toBeFalsy();

    component.onDeSelectAll(item,"id_gram_negative_bacteria");
    expect(component.isNegativeBactFreeField).toBeFalsy();
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

  it('investigationFormSubmit method', () => {
    //spyOn(component,"setData");
    //spyOn(component,"goToNextReadingForm");

    expect(component.investigationFormSubmit()).toBeUndefined();

    babyInvestForm.clearValidators();
    babyInvestForm.clearAsyncValidators();
    babyInvestForm.updateValueAndValidity();
    for(var i in babyInvestForm.controls){
      babyInvestForm.controls[i].clearValidators()
      babyInvestForm.controls[i].clearAsyncValidators()
      babyInvestForm.controls[i].updateValueAndValidity()
    }

    // babyInvestForm.controls.tab_name.setValue('final');
    babyInvestForm.controls.baby_thyroid_status.setValue('Normal');
    babyInvestForm.controls.baby_thyroid_result.setValue('');
    babyInvestForm.controls.baby_blood_glucose.setValue('');
    babyInvestForm.controls.baby_haemoglobin_levels.setValue('');
    babyInvestForm.controls.baby_c_reactive_protien_levels.setValue('');
    babyInvestForm.controls.micro_esr.setValue('');
    babyInvestForm.controls.baby_procalcitonin_levels.setValue('');
    babyInvestForm.controls.total_leucocute_count.setValue('');
    babyInvestForm.controls.absolute_neutrophil_count.setValue('');
    babyInvestForm.controls.immature_to_mature_neutrophil_ratios.setValue("NA");
    babyInvestForm.controls.thrombocytopenia.setValue('');
    babyInvestForm.controls.urine_rest_for_pus_cells.setValue("NA");
    babyInvestForm.controls.urine_culture_test.setValue("NA");
    babyInvestForm.controls.blood_culture_report.setValue("NA");
    babyInvestForm.controls.gram_positive_bacteria.setValue("NA");
    babyInvestForm.controls.gram_negative_bacteria.setValue("NA");
    babyInvestForm.controls.fungi.setValue("NA");
    babyInvestForm.controls.other_organism.setValue("NA");
    babyInvestForm.controls.antibiotic_status_value.setValue("NA");
    babyInvestForm.controls.antibiotic_status_resisitant.setValue("NA");
    babyInvestForm.controls.antibiotic_status_intermediate.setValue("NA");
    babyInvestForm.controls.sodium.setValue('');
    babyInvestForm.controls.potassium.setValue('');
    babyInvestForm.controls.chlorine.setValue('');
    babyInvestForm.controls.calcium.setValue('');
    babyInvestForm.controls.phosphate.setValue('');
    babyInvestForm.controls.magnesium.setValue('');
    babyInvestForm.controls.urea.setValue('');
    babyInvestForm.controls.creatinine.setValue('');
    babyInvestForm.controls.lactate_levels.setValue('');
    babyInvestForm.controls.bilirubin_levels.setValue('');
    babyInvestForm.controls.cord_ph.setValue('');
    babyInvestForm.controls.arrhythmia.setValue("NA");
    babyInvestForm.controls.csf_culture.setValue("NA");
    babyInvestForm.controls.csf_culture_tsb_value.setValue('');

    component.investigationFormSubmit();
    expect(babyInvestForm.value["antibiotic_status_value"]).toBe('NA')
    expect(babyInvestForm.value["antibiotic_status_resisitant"]).toBe('NA')
    expect(babyInvestForm.value["antibiotic_status_intermediate"]).toBe('NA')
    expect(babyInvestForm.value["baby_thyroid_result"]).toBe('NA')
    expect(babyInvestForm.value["baby_blood_glucose"]).toBe('NA')
    expect(babyInvestForm.value["baby_haemoglobin_levels"]).toBe('NA')
    expect(babyInvestForm.value["baby_c_reactive_protien_levels"]).toBe('NA')
    expect(babyInvestForm.value["micro_esr"]).toBe('NA')
    expect(babyInvestForm.value["baby_procalcitonin_levels"]).toBe('NA')
    expect(babyInvestForm.value["sodium"]).toBe('NA')
    expect(babyInvestForm.value["potassium"]).toBe('NA')
    expect(babyInvestForm.value["chlorine"]).toBe('NA')
    expect(babyInvestForm.value["calcium"]).toBe('NA')
    expect(babyInvestForm.value["phosphate"]).toBe('NA')
    expect(babyInvestForm.value["magnesium"]).toBe('NA')
    expect(babyInvestForm.value["urea"]).toBe('NA')
    expect(babyInvestForm.value["creatinine"]).toBe('NA')
    expect(babyInvestForm.value["lactate_levels"]).toBe('NA')
    expect(babyInvestForm.value["bilirubin_levels"]).toBe('NA')
    expect(babyInvestForm.value["cord_ph"]).toBe('NA')
    expect(babyInvestForm.value["csf_culture_tsb_value"]).toBe('NA')
    expect(babyInvestForm.value["total_leucocute_count"]).toBe('NA')
    expect(babyInvestForm.value["absolute_neutrophil_count"]).toBe('NA')
    expect(babyInvestForm.value["thrombocytopenia"]).toBe('NA')
    expect(babyInvestForm.value["prothrombin_type"]).toBe('NA')
    expect(babyInvestForm.value["activated_prothrombin_type"]).toBe('NA')

  });

  it('success method', () => {
    spyOn(component, "isSuccess");
    spyOn(component, "isAlreadyExist");

    component.success({}, "get_investigation");
    expect(component.isAlreadyExist).toHaveBeenCalled();

    component.success({ response: "test" }, "get_investigation");
    component.page =1;
    // expect(component.isBabyInvestEdit).toBeFalsy();
    expect(component.isSuccess).toHaveBeenCalled();
  });

  it("errorHandler method", () => {

    spyOn(component,'errorHandler')
    component.errorHandler(new Error(), "investigationFormSubmit")
    expect(component['errorHandler']).toHaveBeenCalled()

  });

  it("errorToasty method", () => {
    spyOn(component,'errorToasty')
    component.errorHandler(new Error(), "investigationFormSubmit")
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

  it('changeDropdown method', () => {
    spyOn(babyInvestForm,"patchValue");

    component.changeDropdown('NA','absolute_neutrophil_count');
    expect(babyInvestForm.patchValue).toHaveBeenCalled();
    expect(component.isNeutrophilCount).toBeFalsy();
    component.changeDropdown('Yes','absolute_neutrophil_count');
    expect(component.isNeutrophilCount).toBeTruthy();

    component.changeDropdown('NA','total_leucocute_count');
    expect(babyInvestForm.patchValue).toHaveBeenCalled();
    expect(component.isLeucocuteCount).toBeFalsy();
    component.changeDropdown('Yes','total_leucocute_count');
    expect(component.isLeucocuteCount).toBeTruthy();

    component.changeDropdown('NA','thrombocytopenia_unit');
    expect(babyInvestForm.patchValue).toHaveBeenCalled();
    expect(component.isThrombocytopenia).toBeFalsy();
    component.changeDropdown('Yes','thrombocytopenia_unit');
    expect(component.isThrombocytopenia).toBeTruthy();
  });

  it('getReadingFormData method', () => {
    spyOn(component, "updateForm");
    component.getReadingFormData({});
    expect(component.updateForm).toHaveBeenCalled();
  });

  it('checkMultiselectData method', () => {
    component.responseArray = [{
      antibiotic_status_value:"test",
      antibiotic_status_intermediate:"test",
      antibiotic_status_resisitant:"test",
      gram_positive_bacteria:"test",
      gram_negative_bacteria:"test",
      fungi:"test"
    }];

    component.checkMultiselectData();

    expect(component.responseArray[0]["antibiotic_status_value"]).toEqual(jasmine.any(String));
    expect(component.responseArray[0]["antibiotic_status_intermediate"]).toEqual(jasmine.any(String));
    expect(component.responseArray[0]["antibiotic_status_resisitant"]).toEqual(jasmine.any(String));
    expect(component.responseArray[0]["gram_positive_bacteria"]).toEqual(jasmine.any(String));
    expect(component.responseArray[0]["gram_negative_bacteria"]).toEqual(jasmine.any(String));
    expect(component.responseArray[0]["fungi"]).toEqual(jasmine.any(String));
  });

  it('saveReadingFormData method', () => {
    spyOn(component.readingDataService, "setReadingFormData");
    component.saveReadingFormData({});
    expect(component.readingDataService.setReadingFormData).toHaveBeenCalled();
  });

  it('goToNextReadingForm method', () => {
    spyOn(component.readingDataService, "setComponentFlag");
    spyOn(component.readingDataService, "setActiveTab");
    spyOn(component, "saveReadingFormData");

    component.goToNextReadingForm();
    expect(component.readingDataService.setComponentFlag).toHaveBeenCalled();
    expect(component.readingDataService.setActiveTab).toHaveBeenCalled();
    expect(component.saveReadingFormData).toHaveBeenCalled();
  });

  it('checkNAObject method', () => {
    babyInvestForm.controls.gram_positive_bacteria.setValue("NA");
    babyInvestForm.controls.gram_negative_bacteria.setValue("NA");
    babyInvestForm.controls.fungi.setValue("NA");
    babyInvestForm.controls.antibiotic_status_value.setValue("NA");
    babyInvestForm.controls.antibiotic_status_resisitant.setValue("NA");
    babyInvestForm.controls.antibiotic_status_intermediate.setValue("NA");
    
    component.checkNAObject();

    expect(babyInvestForm.value["antibiotic_status_value"]).toEqual(jasmine.any(String));
    expect(babyInvestForm.value["antibiotic_status_intermediate"]).toEqual(jasmine.any(String));
    expect(babyInvestForm.value["antibiotic_status_resisitant"]).toEqual(jasmine.any(String));
    expect(babyInvestForm.value["gram_positive_bacteria"]).toEqual(jasmine.any(String));
    expect(babyInvestForm.value["gram_negative_bacteria"]).toEqual(jasmine.any(String));
    expect(babyInvestForm.value["fungi"]).toEqual(jasmine.any(String));

  });
  
  it('setValidators method', () => {
    babyInvestForm.controls.antibiotic_status_value.setValue("NA");
    spyOn(babyInvestForm.controls["antibiotic_status_value"],"setValidators");
    spyOn(babyInvestForm.controls["antibiotic_status_value"],"updateValueAndValidity");
    component.setValidators("antibiotic_status_value");
    expect(babyInvestForm.controls["antibiotic_status_value"].setValidators).toHaveBeenCalled();
    expect(babyInvestForm.controls["antibiotic_status_value"].updateValueAndValidity).toHaveBeenCalled();
  });

  it('clearValidators method', () => {
    babyInvestForm.controls.antibiotic_status_value.setValue("NA");
    spyOn(babyInvestForm.controls["antibiotic_status_value"],"clearValidators");
    spyOn(babyInvestForm.controls["antibiotic_status_value"],"updateValueAndValidity");
    component.clearValidators("antibiotic_status_value");
    expect(babyInvestForm.controls["antibiotic_status_value"].clearValidators).toHaveBeenCalled();
    expect(babyInvestForm.controls["antibiotic_status_value"].updateValueAndValidity).toHaveBeenCalled();
  });

  it('setData method', () => {
    babyInvestForm.controls.baby_thyroid_status.setValue('Normal');
    babyInvestForm.controls.baby_thyroid_result.setValue('');
    babyInvestForm.controls.baby_blood_glucose.setValue('');
    babyInvestForm.controls.baby_haemoglobin_levels.setValue('');
    babyInvestForm.controls.baby_c_reactive_protien_levels.setValue('');
    babyInvestForm.controls.micro_esr.setValue('');
    babyInvestForm.controls.baby_procalcitonin_levels.setValue('');
    babyInvestForm.controls.total_leucocute_count.setValue('');
    babyInvestForm.controls.absolute_neutrophil_count.setValue('');
    babyInvestForm.controls.immature_to_mature_neutrophil_ratios.setValue("NA");
    babyInvestForm.controls.thrombocytopenia.setValue('');
    babyInvestForm.controls.urine_rest_for_pus_cells.setValue("NA");
    babyInvestForm.controls.urine_culture_test.setValue("NA");
    babyInvestForm.controls.blood_culture_report.setValue("NA");
    babyInvestForm.controls.gram_positive_bacteria.setValue("NA");
    babyInvestForm.controls.gram_negative_bacteria.setValue("NA");
    babyInvestForm.controls.fungi.setValue("NA");
    babyInvestForm.controls.other_organism.setValue("NA");
    babyInvestForm.controls.antibiotic_status_value.setValue("NA");
    babyInvestForm.controls.antibiotic_status_resisitant.setValue("NA");
    babyInvestForm.controls.antibiotic_status_intermediate.setValue("NA");
    babyInvestForm.controls.sodium.setValue('');
    babyInvestForm.controls.potassium.setValue('');
    babyInvestForm.controls.chlorine.setValue('');
    babyInvestForm.controls.calcium.setValue('');
    babyInvestForm.controls.phosphate.setValue('');
    babyInvestForm.controls.magnesium.setValue('');
    babyInvestForm.controls.urea.setValue('');
    babyInvestForm.controls.creatinine.setValue('');
    babyInvestForm.controls.lactate_levels.setValue('');
    babyInvestForm.controls.bilirubin_levels.setValue('');
    babyInvestForm.controls.cord_ph.setValue('');
    babyInvestForm.controls.arrhythmia.setValue("NA");
    babyInvestForm.controls.csf_culture.setValue("NA");
    babyInvestForm.controls.csf_culture_tsb_value.setValue('');

    component.setData();
    expect(babyInvestForm.value["antibiotic_status_value"]).toEqual("NA");
    babyInvestForm.controls.antibiotic_status_value.setValue("test");
    component.selectedItems = ["hello"];
    component.setData();
    expect(babyInvestForm.value["antibiotic_status_value"]).toEqual('["hello"]');

    component.setData();
    expect(babyInvestForm.value["antibiotic_status_resisitant"]).toEqual("NA");
    babyInvestForm.controls.antibiotic_status_resisitant.setValue("test");
    component.selectedResisitantItems = ["hello"];
    component.setData();
    expect(babyInvestForm.value["antibiotic_status_resisitant"]).toEqual('["hello"]');

    component.setData();
    expect(babyInvestForm.value["antibiotic_status_intermediate"]).toEqual("NA");
    babyInvestForm.controls.antibiotic_status_intermediate.setValue("test");
    component.selectedIntermediateItems = ["hello"];
    component.setData();
    expect(babyInvestForm.value["antibiotic_status_intermediate"]).toEqual('["hello"]');

    component.selectedGramPosBacteria = ["hello"];
    component.setData();
    expect(babyInvestForm.value["gram_positive_bacteria"]).toEqual('["hello"]');

    component.selectedGramNegBacItems = ["hello"];
    component.setData();
    expect(babyInvestForm.value["gram_negative_bacteria"]).toEqual('["hello"]');

    component.selectedFungiItem = ["hello"];
    component.setData();
    expect(babyInvestForm.value["fungi"]).toEqual('["hello"]');

    expect(babyInvestForm.value["baby_thyroid_result"]).toBe('NA');
    expect(babyInvestForm.value["baby_blood_glucose"]).toBe('NA');
    expect(babyInvestForm.value["baby_haemoglobin_levels"]).toBe('NA');
    expect(babyInvestForm.value["baby_c_reactive_protien_levels"]).toBe('NA');
    expect(babyInvestForm.value["micro_esr"]).toBe('NA');
    expect(babyInvestForm.value["baby_procalcitonin_levels"]).toBe('NA');
    expect(babyInvestForm.value["sodium"]).toBe('NA');
    expect(babyInvestForm.value["potassium"]).toBe('NA');
    expect(babyInvestForm.value["chlorine"]).toBe('NA');
    expect(babyInvestForm.value["calcium"]).toBe('NA');
    expect(babyInvestForm.value["phosphate"]).toBe('NA');
    expect(babyInvestForm.value["magnesium"]).toBe('NA');
    expect(babyInvestForm.value["urea"]).toBe('NA');
    expect(babyInvestForm.value["creatinine"]).toBe('NA');
    expect(babyInvestForm.value["lactate_levels"]).toBe('NA');
    expect(babyInvestForm.value["bilirubin_levels"]).toBe('NA');
    expect(babyInvestForm.value["cord_ph"]).toBe('NA');
    expect(babyInvestForm.value["csf_culture_tsb_value"]).toBe('NA');
    expect(babyInvestForm.value["total_leucocute_count"]).toBe('NA');
    expect(babyInvestForm.value["absolute_neutrophil_count"]).toBe('NA');
    expect(babyInvestForm.value["thrombocytopenia"]).toBe('NA');
  });

  it('updateSuccessResponse method', () => {
    spyOn(component,'get_investigation');
    component.updateSuccessResponse({});
    expect(component.get_investigation).toHaveBeenCalled();
  });

});
