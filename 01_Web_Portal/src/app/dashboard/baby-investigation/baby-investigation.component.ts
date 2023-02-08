import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/service/common/common.service";
import * as _ from "underscore";
import { Common } from "../../shared/service/common/common";
import { Subscription } from 'rxjs';
import { DataService } from '../../shared/service/data.service';
import { ReadingDataService } from '../../shared/service/reading-data.service';

@Component({
  selector: "app-baby-investigation",
  templateUrl: "./baby-investigation.component.html",
  styleUrls: ["./baby-investigation.component.css"],
  providers: [NgbModalConfig, NgbModal]
})
export class BabyInvestigationComponent implements OnInit, OnChanges {

  public customPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z, \]') } };

  invetigationForm: FormGroup;
  formRef: any;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  responseArray = [];
  page: number = 1;
  isBabyInvestEdit: boolean = true;

  isNeutrophilCount: boolean = true;
  isLeucocuteCount: boolean = true;
  isThrombocytopenia: boolean = true;

  isBabyThyroidResult: boolean = true;
  isBabyBloodGlucose: boolean = true;
  isBabyHaemoglobin: boolean = true;
  isBabyProtien: boolean = true;
  isBabyEsr: boolean = true;
  isBabyProcalcitonin: boolean = true;
  isSodium: boolean = true;
  isPotassium: boolean = true;
  isChlorine: boolean = true;
  isCalcium: boolean = true;
  isPhosphate: boolean = true;
  isMagnesium: boolean = true;
  isUrea: boolean = true;
  isCreatinine: boolean = true;
  isLactate: boolean = true;
  isBilirubin: boolean = true;
  isCord: boolean = true;
  isTSBValue: boolean = true;
  isAntibioticSensitive: boolean = true;
  isAntibioticResisitant: boolean = true;
  isAntibioticIntermediate: boolean = true;
  dropdownList = [];
  gramPostBacteriaList = [];
  gramNegBacList = [];
  fungiList = [];
  settings = {};
  selectedItems = [];
  selectedResisitantItems = [];
  selectedIntermediateItems = [];
  selectedGramPosBacteria = [];
  selectedGramNegBacItems = [];
  selectedFungiItem = [];

  isPositiveBactFreeField: boolean = false;
  isNegativeBactFreeField: boolean = false;
  loggedInUserId:number;
  isprothrombin=false;
  isActiveProthrombin=false

  @Input() id;
  @Input() hospital_id;
  subscription: Subscription;

  getMedicalRecordNumber: string;

  temp_study_id = 0;

  login_hospital: any = {};
  content:any;
  public dataServiceObj;
  public readingDataObj;
  isEditClicked=false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private common_api: CommonService,
    private modalService: NgbModal,
    private commonAsyn: Common,
    private dataService: DataService,
    public readingDataService:ReadingDataService
  ) {
    this.dataServiceObj = dataService.getOption();
  }

  ngOnInit() {
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
    vim.readingDataObj=vim.readingDataService.getReadingFormData('baby_investigation') ;
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.loggedInUserId=vim.login_hospital['user_id'];
    vim.id = vim.dataServiceObj.study_id;
    vim.createForm(vim.dataServiceObj.study_id);
    if(vim.readingDataObj!=undefined){
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.getReadingFormData(this.readingDataObj);
  }
  else{
    if ( vim.dataServiceObj.study_id != undefined) {
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.get_investigation(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
    }
}
    vim.temp_study_id = vim.id;

    this.fungiList = [
      { "id": 1, "itemName": "Candida auris" },
      { "id": 2, "itemName": "Candida non albicans spp" },
      { "id": 3, "itemName": "Candida spp" },
      { "id": 4, "itemName": "Candida Tropicalis" },
      { "id": 5, "itemName": "NA" },
    ];

    this.gramNegBacList = [
      { "id": 1, "itemName": "Acinetobacter baumanii" },
      { "id": 2, "itemName": "Acinetobacter haemolyticus" },
      { "id": 3, "itemName": "urkholderia cepacia" },
      { "id": 4, "itemName": "E Coli" },
      { "id": 5, "itemName": "Enterobacter spp" },
      { "id": 6, "itemName": "Klebsiella_spp_10_5_CFU_ml" },
      { "id": 7, "itemName": "Klebsiella pneumoniae" },
      { "id": 8, "itemName": "Non fermenting Gram negative bacilli" },
      { "id": 9, "itemName": "Pseudomonas aeruginosa" },
      { "id": 10, "itemName": "Skin flora" },
      { "id": 11, "itemName": "Sphingomonas paucimobilis" },
      { "id": 12, "itemName": "Others" },
      { "id": 13, "itemName": "NA" },
    ];

    this.gramPostBacteriaList = [
      { "id": 1, "itemName": "Coagulase negative Staphylococci" },
      { "id": 2, "itemName": "Cocci" },
      { "id": 3, "itemName": "Staphylococcus aureus" },
      { "id": 4, "itemName": "Staphylococcus epidermidis" },
      { "id": 5, "itemName": "Staphylococcus hominis hominis" },
      { "id": 6, "itemName": "Others" },
      { "id": 7, "itemName": "NA" }
    ];

    this.dropdownList = [
      { "id": 1, "itemName": "Amikacin" },
      { "id": 2, "itemName": "Amoxyclav" },
      { "id": 3, "itemName": "Amphotericin B" },
      { "id": 4, "itemName": "Ampicillin" },
      { "id": 5, "itemName": "Aztreonam" },
      { "id": 6, "itemName": "Caspofungin" },
      { "id": 7, "itemName": "Cefepime" },
      { "id": 8, "itemName": "cefixime" },
      { "id": 9, "itemName": "Cefuroxime Axetil" },
      { "id": 10, "itemName": "Cephepime" },
      { "id": 11, "itemName": "Cephoperazone" },
      { "id": 12, "itemName": "Ciprofloxacin" },
      { "id": 13, "itemName": "Clavulanic acid" },
      { "id": 14, "itemName": "Clindamycin" },
      { "id": 15, "itemName": "Colistin" },
      { "id": 16, "itemName": "Comoxicillin" },
      { "id": 17, "itemName": "Cotrimoxazole" },
      { "id": 18, "itemName": "Erythromycin" },
      { "id": 19, "itemName": "Fluconazole" },
      { "id": 20, "itemName": "Gentamicin" },
      { "id": 21, "itemName": "Imipenem" },
      { "id": 22, "itemName": "Levofloxacin" },
      { "id": 23, "itemName": "Linezolid" },
      { "id": 24, "itemName": "Meropenem" },
      { "id": 25, "itemName": "Micafungin" },
      { "id": 26, "itemName": "Netilmicin" },
      { "id": 27, "itemName": "Ofloxacin" },
      { "id": 28, "itemName": "Oxacillin" },
      { "id": 29, "itemName": "Pencillin" },
      { "id": 30, "itemName": "Piperacillin" },
      { "id": 31, "itemName": "PolymyzinB" },
      { "id": 32, "itemName": "Sulbactam" },
      { "id": 33, "itemName": "Sulfamethoxazole" },
      { "id": 34, "itemName": "Tazobactam" },
      { "id": 35, "itemName": "Tetracycline" },
      { "id": 36, "itemName": "Tigecycline" },
      { "id": 37, "itemName": "Tobramycin" },
      { "id": 38, "itemName": "Trimethoprim" },
      { "id": 39, "itemName": "Vancomycin" },
      { "id": 40, "itemName": "Voriconalzole" },
      { "id": 41, "itemName": "NA" },

    ];

    this.settings = {
      limitSelection: false,
      badgeShowLimit: 2
    };

    vim.onChanges();
  }


  createForm(id) {
    const vim = this;

    vim.isBabyThyroidResult = true;
    vim.isBabyBloodGlucose = true;
    vim.isBabyHaemoglobin = true;
    vim.isBabyProtien = true;
    vim.isBabyEsr = true;
    vim.isBabyProcalcitonin = true;
    vim.isSodium = true;
    vim.isPotassium = true;
    vim.isChlorine = true;
    vim.isCalcium = true;
    vim.isPhosphate = true;
    vim.isMagnesium = true;
    vim.isUrea = true;
    vim.isCreatinine = true;
    vim.isLactate = true;
    vim.isBilirubin = true;
    vim.isCord = true;
    vim.isTSBValue = true;
    vim.isprothrombin=true;
    vim.isActiveProthrombin=true;
    vim.selectedGramPosBacteria = [];
    vim.selectedItems = [];
    vim.selectedGramNegBacItems = [];
    vim.selectedFungiItem = [];
    vim.selectedIntermediateItems = [];
    vim.selectedResisitantItems = [];

    this.invetigationForm = this.formBuilder.group({
      study_id: [vim.id],
      baby_thyroid_status: ["", Validators.required],
      baby_thyroid_result: ["", Validators.required],
      baby_blood_glucose: ["", [Validators.required]],
      baby_haemoglobin_levels: ["", Validators.required],
      baby_c_reactive_protien_levels: ['', Validators.required],
      micro_esr: ['', Validators.required],
      baby_procalcitonin_levels: ['', Validators.required],
      total_leucocute_count_unit: ['cu mm', Validators.required],
      total_leucocute_count: ['', Validators.required],
      absolute_neutrophil_count: ['', Validators.required],
      absolute_neutrophil_count_unit: ['cu mm', Validators.required],
      immature_to_mature_neutrophil_ratios: ['', Validators.required],
      thrombocytopenia_unit: ['Count', Validators.required],
      thrombocytopenia: ['', Validators.required],
      urine_rest_for_pus_cells: ['', Validators.required],
      urine_culture_test: ['', Validators.required],
      blood_culture_report: ['', Validators.required],
      gram_positive_bacteria: ['', Validators.required],
      gram_positive_bacteria_if_other: [''],
      gram_negative_bacteria: ['', Validators.required],
      gram_negative_bacteria_if_other: [''],
      fungi: ['', Validators.required],
      other_organism: ['', Validators.required],
      antibiotic_status_resisitant: ['', Validators.required],
      antibiotic_status_intermediate: ['', Validators.required],
      antibiotic_status_value: ['', Validators.required],
      sodium: ['', Validators.required],
      potassium: ['', Validators.required],
      chlorine: ['', Validators.required],
      calcium: ['', Validators.required],
      phosphate: ['', Validators.required],
      magnesium: ['', Validators.required],
      urea: ['', Validators.required],
      creatinine: ['', Validators.required],
      lactate_levels: ['', Validators.required],
      bilirubin_levels: ['', Validators.required],
      cord_ph: ['', Validators.required],
      arrhythmia: ['', Validators.required],
      csf_culture: ['', Validators.required],
      csf_culture_tsb_value: ['', Validators.required],
      prothrombin_type: ['', Validators.required],
      activated_prothrombin_type: ['', Validators.required],
      
    });
  }

  updateForm(obj) {
    console.log(obj)
    const vim = this;

    if (obj["gram_positive_bacteria_if_other"] != '' && obj["gram_positive_bacteria_if_other"] != null) {
      vim.invetigationForm.controls["gram_positive_bacteria_if_other"].setValidators([Validators.required]);
      vim.invetigationForm.controls["gram_positive_bacteria_if_other"].updateValueAndValidity();
      this.isPositiveBactFreeField = true;
    } else {
      this.isPositiveBactFreeField = false;
    }

    if (obj["gram_negative_bacteria_if_other"] != '' && obj["gram_negative_bacteria_if_other"] != null) {
      vim.invetigationForm.controls["gram_negative_bacteria_if_other"].setValidators([Validators.required]);
      vim.invetigationForm.controls["gram_negative_bacteria_if_other"].updateValueAndValidity();
      this.isNegativeBactFreeField = true;
    } else {
      this.isNegativeBactFreeField = false;
    }

    if (obj["baby_thyroid_result"] == 'NA') {
      vim.invetigationForm.controls["baby_thyroid_result"].clearValidators();
      vim.invetigationForm.controls["baby_thyroid_result"].updateValueAndValidity();
      vim.isBabyThyroidResult = false;
    } else {
      vim.invetigationForm.controls["baby_thyroid_result"].setValidators([Validators.required]);
      vim.invetigationForm.controls["baby_thyroid_result"].updateValueAndValidity();
      vim.isBabyThyroidResult = true;
    }


    if (obj["baby_blood_glucose"] == 'NA') {
      vim.invetigationForm.controls["baby_blood_glucose"].clearValidators();
      vim.invetigationForm.controls["baby_blood_glucose"].updateValueAndValidity();
      vim.isBabyBloodGlucose = false;
    } else {
      vim.invetigationForm.controls["baby_blood_glucose"].setValidators([Validators.required]);
      vim.invetigationForm.controls["baby_blood_glucose"].updateValueAndValidity();
      vim.isBabyBloodGlucose = true;
    }

    if (obj["baby_haemoglobin_levels"] == 'NA') {
      vim.invetigationForm.controls["baby_haemoglobin_levels"].clearValidators();
      vim.invetigationForm.controls["baby_haemoglobin_levels"].updateValueAndValidity();
      vim.isBabyHaemoglobin = false;
    } else {
      vim.invetigationForm.controls["baby_haemoglobin_levels"].setValidators([Validators.required]);
      vim.invetigationForm.controls["baby_haemoglobin_levels"].updateValueAndValidity();
      vim.isBabyHaemoglobin = true;
    }

    if (obj["baby_c_reactive_protien_levels"] == 'NA') {
      vim.invetigationForm.controls["baby_c_reactive_protien_levels"].clearValidators()
      vim.invetigationForm.controls["baby_c_reactive_protien_levels"].updateValueAndValidity();
      vim.isBabyProtien = false;
    } else {
      vim.invetigationForm.controls["baby_c_reactive_protien_levels"].setValidators([Validators.required]);
      vim.invetigationForm.controls["baby_c_reactive_protien_levels"].updateValueAndValidity();
      vim.isBabyProtien = true;
    }

    if (obj["micro_esr"] == 'NA') {
      vim.invetigationForm.controls["micro_esr"].clearValidators()
      vim.invetigationForm.controls["micro_esr"].updateValueAndValidity();
      vim.isBabyEsr = false;
    } else {
      vim.invetigationForm.controls["micro_esr"].setValidators([Validators.required]);
      vim.invetigationForm.controls["micro_esr"].updateValueAndValidity();
      vim.isBabyEsr = true;
    }

    if (obj["baby_procalcitonin_levels"] == 'NA') {
      vim.invetigationForm.controls["baby_procalcitonin_levels"].clearValidators()
      vim.invetigationForm.controls["baby_procalcitonin_levels"].updateValueAndValidity();
      vim.isBabyProcalcitonin = false;
    } else {
      vim.invetigationForm.controls["baby_procalcitonin_levels"].setValidators([Validators.required]);
      vim.invetigationForm.controls["baby_procalcitonin_levels"].updateValueAndValidity();
      vim.isBabyProcalcitonin = true;
    }

    if (obj["sodium"] == 'NA') {
      vim.invetigationForm.controls["sodium"].clearValidators();
      vim.invetigationForm.controls["sodium"].updateValueAndValidity();
      vim.isSodium = false;
    } else {
      vim.invetigationForm.controls["sodium"].setValidators([Validators.required]);
      vim.invetigationForm.controls["sodium"].updateValueAndValidity();
      vim.isSodium = true;
    }

    if (obj["potassium"] == 'NA') {
      vim.invetigationForm.controls["potassium"].clearValidators();
      vim.invetigationForm.controls["potassium"].updateValueAndValidity();
      vim.isPotassium = false;
    } else {
      vim.invetigationForm.controls["potassium"].setValidators([Validators.required]);
      vim.invetigationForm.controls["potassium"].updateValueAndValidity();
      vim.isPotassium = true;
    }

    if (obj["chlorine"] == 'NA') {
      vim.invetigationForm.controls["chlorine"].clearValidators();
      vim.invetigationForm.controls["chlorine"].updateValueAndValidity();
      vim.isChlorine = false;
    } else {
      vim.invetigationForm.controls["chlorine"].setValidators([Validators.required]);
      vim.invetigationForm.controls["chlorine"].updateValueAndValidity();
      vim.isChlorine = true;
    }

    if (obj["calcium"] == 'NA') {
      vim.invetigationForm.controls["calcium"].clearValidators();
      vim.invetigationForm.controls["calcium"].updateValueAndValidity();
      vim.isCalcium = false;
    } else {
      vim.invetigationForm.controls["calcium"].setValidators([Validators.required]);
      vim.invetigationForm.controls["calcium"].updateValueAndValidity();
      vim.isCalcium = true;
    }

    if (obj["phosphate"] == 'NA') {
      vim.invetigationForm.controls["phosphate"].clearValidators();
      vim.invetigationForm.controls["phosphate"].updateValueAndValidity();
      vim.isPhosphate = false;
    } else {
      vim.invetigationForm.controls["phosphate"].setValidators([Validators.required]);
      vim.invetigationForm.controls["phosphate"].updateValueAndValidity();
      vim.isPhosphate = true;
    }

    if (obj["magnesium"] == 'NA') {
      vim.invetigationForm.controls["magnesium"].clearValidators();
      vim.invetigationForm.controls["magnesium"].updateValueAndValidity();
      vim.isMagnesium = false;
    } else {
      vim.invetigationForm.controls["magnesium"].setValidators([Validators.required]);
      vim.invetigationForm.controls["magnesium"].updateValueAndValidity();
      vim.isMagnesium = true;
    }

    if (obj["urea"] == 'NA') {
      vim.invetigationForm.controls["urea"].clearValidators()
      vim.invetigationForm.controls["urea"].updateValueAndValidity();
      vim.isUrea = false;
    } else {
      vim.invetigationForm.controls["urea"].setValidators([Validators.required]);
      vim.invetigationForm.controls["urea"].updateValueAndValidity();
      vim.isUrea = true;
    }

    if (obj["creatinine"] == 'NA') {
      vim.invetigationForm.controls["creatinine"].clearValidators();
      vim.invetigationForm.controls["creatinine"].updateValueAndValidity();
      vim.isCreatinine = false;
    } else {
      vim.invetigationForm.controls["creatinine"].setValidators([Validators.required]);
      vim.invetigationForm.controls["creatinine"].updateValueAndValidity();
      vim.isCreatinine = true;
    }

    if (obj["lactate_levels"] == 'NA') {
      vim.invetigationForm.controls["lactate_levels"].clearValidators()
      vim.invetigationForm.controls["lactate_levels"].updateValueAndValidity();
      vim.isLactate = false;
    } else {
      vim.invetigationForm.controls["lactate_levels"].setValidators([Validators.required]);
      vim.invetigationForm.controls["lactate_levels"].updateValueAndValidity();
      vim.isLactate = true;
    }

    if (obj["bilirubin_levels"] == 'NA') {
      vim.invetigationForm.controls["bilirubin_levels"].clearValidators();
      vim.invetigationForm.controls["bilirubin_levels"].updateValueAndValidity();
      vim.isBilirubin = false;
    } else {
      vim.invetigationForm.controls["bilirubin_levels"].setValidators([Validators.required]);
      vim.invetigationForm.controls["bilirubin_levels"].updateValueAndValidity();
      vim.isBilirubin = true;
    }

    if (obj["cord_ph"] == 'NA') {
      vim.invetigationForm.controls["cord_ph"].clearValidators()
      vim.invetigationForm.controls["cord_ph"].updateValueAndValidity();
      vim.isCord = false;
    } else {
      vim.invetigationForm.controls["cord_ph"].setValidators([Validators.required]);
      vim.invetigationForm.controls["cord_ph"].updateValueAndValidity();
      vim.isCord = true;
    }

    if (obj["csf_culture_tsb_value"] == 'NA') {
      vim.invetigationForm.controls["csf_culture_tsb_value"].clearValidators();
      vim.invetigationForm.controls["csf_culture_tsb_value"].updateValueAndValidity();
      vim.isTSBValue = false;
    } else {
      vim.invetigationForm.controls["csf_culture_tsb_value"].setValidators([Validators.required]);
      vim.invetigationForm.controls["csf_culture_tsb_value"].updateValueAndValidity();
      vim.isTSBValue = true;
    }
    if (obj["total_leucocute_count"] == 'NA') {
      vim.invetigationForm.value["total_leucocute_count"] = 'NA';
      this.isLeucocuteCount = false;
      vim.invetigationForm.controls["total_leucocute_count"].clearValidators();
      vim.invetigationForm.controls["total_leucocute_count"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        total_leucocute_count: 'NA'
      });
    } else {
      vim.invetigationForm.controls["total_leucocute_count"].setValidators([Validators.required]);
      vim.invetigationForm.controls["total_leucocute_count"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        total_leucocute_count: ''
      })
      this.isLeucocuteCount = true;

      vim.invetigationForm.patchValue({
        total_leucocute_count: obj["total_leucocute_count"]
      })
    }

    if (obj["absolute_neutrophil_count"] == 'NA') {
      vim.invetigationForm.value["absolute_neutrophil_count"] = 'NA';
      this.isNeutrophilCount = false;
      vim.invetigationForm.controls["absolute_neutrophil_count"].clearValidators();
      vim.invetigationForm.controls["absolute_neutrophil_count"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        absolute_neutrophil_count: 'NA'
      });

    } else {

      vim.invetigationForm.controls["absolute_neutrophil_count"].setValidators([Validators.required]);
      vim.invetigationForm.controls["absolute_neutrophil_count"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        absolute_neutrophil_count: ''
      })
      this.isNeutrophilCount = true;

      vim.invetigationForm.patchValue({
        absolute_neutrophil_count: obj["absolute_neutrophil_count"]
      })
    }

    if (obj["thrombocytopenia"] == 'NA') {
      vim.invetigationForm.value["thrombocytopenia"] = 'NA';
      this.isThrombocytopenia = false;
      vim.invetigationForm.controls["thrombocytopenia"].clearValidators();
      vim.invetigationForm.controls["thrombocytopenia"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        thrombocytopenia: 'NA'
      });

    } else {

      vim.invetigationForm.controls["thrombocytopenia"].setValidators([Validators.required]);
      vim.invetigationForm.controls["thrombocytopenia"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        thrombocytopenia: ''
      })
      this.isThrombocytopenia = true;

      vim.invetigationForm.patchValue({
        thrombocytopenia: obj["thrombocytopenia"]
      })
    }

    if (obj["antibiotic_status_value"] == 'NA') {
      vim.isAntibioticSensitive = false;
    } else {
      vim.isAntibioticSensitive = true;
      vim.selectedItems = [];
    }

    if (obj["antibiotic_status_resisitant"] == 'NA') {
      vim.isAntibioticResisitant = false;
    } else {
      vim.isAntibioticResisitant = true;
      vim.selectedResisitantItems = [];
    }

    if (obj["antibiotic_status_intermediate"] == 'NA') {
      vim.isAntibioticIntermediate = false;
    } else {
      vim.isAntibioticIntermediate = true;
      vim.selectedIntermediateItems = [];
    }

    if (/^[\],:{}\s]*$/.test(obj["antibiotic_status_value"].replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        let anitbiotic=obj["antibiotic_status_value"]
      vim.selectedItems = JSON.parse(anitbiotic);
    } else {
      vim.selectedItems = [];
    }

    if (/^[\],:{}\s]*$/.test(obj["antibiotic_status_intermediate"].replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        let intermediateItems=obj["antibiotic_status_intermediate"];
      vim.selectedIntermediateItems = JSON.parse(intermediateItems);
    } else {
      vim.selectedIntermediateItems = [];
    }

    if (/^[\],:{}\s]*$/.test(obj["antibiotic_status_resisitant"].replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        let resistentItems=obj["antibiotic_status_resisitant"]
      vim.selectedResisitantItems = JSON.parse(resistentItems);
    } else {
      vim.selectedResisitantItems = [];
    }

    if (/^[\],:{}\s]*$/.test(obj["gram_positive_bacteria"].replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        let gramPosBacteria=obj["gram_positive_bacteria"];
      vim.selectedGramPosBacteria = JSON.parse(gramPosBacteria);
    } else {
      vim.selectedGramPosBacteria = [];
    }


    if (/^[\],:{}\s]*$/.test(obj["gram_negative_bacteria"].replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        let gramNegBacteria=obj["gram_negative_bacteria"];
      vim.selectedGramNegBacItems = JSON.parse(gramNegBacteria);
    } else {
      vim.selectedGramNegBacItems = [];
    }

    if (/^[\],:{}\s]*$/.test(obj["fungi"].replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        let fungiList=obj["fungi"];
      vim.selectedFungiItem = JSON.parse(fungiList);
    } else {
      vim.selectedFungiItem = [];
    }

    if (obj["prothrombin_type"] == 'NA') {
      vim.invetigationForm.value["prothrombin_type"] = 'NA';
      this.isprothrombin = false;
      vim.invetigationForm.controls["prothrombin_type"].clearValidators();
      vim.invetigationForm.controls["prothrombin_type"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        prothrombin_type: 'NA'
      });

    } else {
      vim.invetigationForm.controls["prothrombin_type"].setValidators([Validators.required]);
      vim.invetigationForm.controls["prothrombin_type"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        prothrombin_type: ''
      })
      this.isprothrombin = true;
      vim.invetigationForm.patchValue({
        prothrombin_type: obj["prothrombin_type"]
      })
    }

    if (obj["activated_prothrombin_type"] == 'NA') {
      vim.invetigationForm.value["activated_prothrombin_type"] = 'NA';
      this.isActiveProthrombin = false;
      vim.invetigationForm.controls["activated_prothrombin_type"].clearValidators();
      vim.invetigationForm.controls["activated_prothrombin_type"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        activated_prothrombin_type: 'NA'
      });

    } else {
      vim.invetigationForm.controls["activated_prothrombin_type"].setValidators([Validators.required]);
      vim.invetigationForm.controls["activated_prothrombin_type"].updateValueAndValidity();
      vim.invetigationForm.patchValue({
        activated_prothrombin_type: ''
      })
      this.isActiveProthrombin = true;
      vim.invetigationForm.patchValue({
        activated_prothrombin_type: obj["activated_prothrombin_type"]
      })
    }


    vim.invetigationForm.patchValue({
      study_id: vim.id,
      baby_thyroid_status: obj["baby_thyroid_status"],
      baby_thyroid_result: obj["baby_thyroid_result"],
      baby_blood_glucose: obj["baby_blood_glucose"],
      baby_haemoglobin_levels: obj["baby_haemoglobin_levels"],
      baby_c_reactive_protien_levels: obj["baby_c_reactive_protien_levels"],
      micro_esr: obj["micro_esr"],
      baby_procalcitonin_levels: obj["baby_procalcitonin_levels"],
      total_leucocute_count_unit: obj["total_leucocute_count_unit"],
      total_leucocute_count: obj["total_leucocute_count"],
      absolute_neutrophil_count: obj["absolute_neutrophil_count"],
      absolute_neutrophil_count_unit: obj["absolute_neutrophil_count_unit"],
      immature_to_mature_neutrophil_ratios:obj["immature_to_mature_neutrophil_ratios"],
      thrombocytopenia_unit: obj["thrombocytopenia_unit"],
      thrombocytopenia: obj["thrombocytopenia"],
      urine_rest_for_pus_cells: obj["urine_rest_for_pus_cells"],
      urine_culture_test: obj["urine_culture_test"],
      blood_culture_report: obj["blood_culture_report"],
      gram_positive_bacteria: obj["gram_positive_bacteria"],
      gram_positive_bacteria_if_other: obj["gram_positive_bacteria_if_other"],
      gram_negative_bacteria: obj["gram_negative_bacteria"],
      gram_negative_bacteria_if_other: obj["gram_negative_bacteria_if_other"],
      fungi: obj["fungi"],
      other_organism: obj["other_organism"],
      antibiotic_status_resisitant: obj["antibiotic_status_resisitant"],
      antibiotic_status_intermediate: obj["antibiotic_status_intermediate"],
      antibiotic_status_value: obj["antibiotic_status_value"],
      sodium: obj["sodium"],
      potassium: obj["potassium"],
      chlorine: obj["chlorine"],
      calcium: obj["calcium"],
      phosphate: obj["phosphate"],
      magnesium: obj["magnesium"],
      urea: obj["urea"],
      creatinine: obj["creatinine"],
      lactate_levels: obj["lactate_levels"],
      bilirubin_levels: obj["bilirubin_levels"],
      cord_ph: obj["cord_ph"],
      arrhythmia: obj["arrhythmia"],
     csf_culture: obj["csf_culture"],
      csf_culture_tsb_value: obj["csf_culture_tsb_value"],
      prothrombin_type : obj["prothrombin_type"],
      activated_prothrombin_type: obj["activated_prothrombin_type"]
    });
  }

  onInputChange(event) {
    var vim = this;
    var target = event.target || event.srcElement || event.currentTarget;
    if (target.name == 'BabyThyroidResult') {
      if (target.value == '2') {
        vim.isBabyThyroidResult = false;
        vim.invetigationForm.patchValue({
          baby_thyroid_result: 'NA'
        })
        vim.invetigationForm.value["baby_thyroid_result"] = 'NA';

        vim.invetigationForm.controls["baby_thyroid_result"].clearValidators();
        vim.invetigationForm.controls["baby_thyroid_result"].updateValueAndValidity();
      } else {
        vim.isBabyThyroidResult = true;
        vim.invetigationForm.patchValue({
          baby_thyroid_result: ''
        })
        vim.invetigationForm.controls["baby_thyroid_result"].setValidators([Validators.required]);
        vim.invetigationForm.controls["baby_thyroid_result"].updateValueAndValidity();
      }
    }

    if (target.name == 'BabyBloodGlucose') {
      if (target.value == '2') {
        vim.isBabyBloodGlucose = false;
        vim.invetigationForm.patchValue({
          baby_blood_glucose: 'NA'
        })
        vim.invetigationForm.value["baby_blood_glucose"] = 'NA';

        vim.invetigationForm.controls["baby_blood_glucose"].clearValidators();
        vim.invetigationForm.controls["baby_blood_glucose"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          baby_blood_glucose: ''
        })
        vim.isBabyBloodGlucose = true;
        vim.invetigationForm.controls["baby_blood_glucose"].setValidators([Validators.required]);
        vim.invetigationForm.controls["baby_blood_glucose"].updateValueAndValidity();
      }
    }

    if (target.name == 'BabyHaemoglobin') {
      if (target.value == '2') {
        vim.isBabyHaemoglobin = false;
        vim.invetigationForm.patchValue({
          baby_haemoglobin_levels: 'NA'
        })
        vim.invetigationForm.value["baby_haemoglobin_levels"] = 'NA';

        vim.invetigationForm.controls["baby_haemoglobin_levels"].clearValidators();
        vim.invetigationForm.controls["baby_haemoglobin_levels"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          baby_haemoglobin_levels: ''
        })
        vim.isBabyHaemoglobin = true;
        vim.invetigationForm.controls["baby_haemoglobin_levels"].setValidators([Validators.required]);
        vim.invetigationForm.controls["baby_haemoglobin_levels"].updateValueAndValidity();
      }
    }

    if (target.name == 'BabyProtien') {
      if (target.value == '2') {
        vim.isBabyProtien = false;
        vim.invetigationForm.patchValue({
          baby_c_reactive_protien_levels: 'NA'
        })
        vim.invetigationForm.value["baby_c_reactive_protien_levels"] = 'NA';

        vim.invetigationForm.controls["baby_c_reactive_protien_levels"].clearValidators();
        vim.invetigationForm.controls["baby_c_reactive_protien_levels"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          baby_c_reactive_protien_levels: ''
        })
        vim.isBabyProtien = true;
        vim.invetigationForm.controls["baby_c_reactive_protien_levels"].setValidators([Validators.required]);
        vim.invetigationForm.controls["baby_c_reactive_protien_levels"].updateValueAndValidity();
      }
    }

    if (target.name == 'BabyEsr') {
      if (target.value == '2') {
        vim.isBabyEsr = false;
        vim.invetigationForm.patchValue({
          micro_esr: 'NA'
        })
        vim.invetigationForm.value["micro_esr"] = 'NA';

        vim.invetigationForm.controls["micro_esr"].clearValidators();
        vim.invetigationForm.controls["micro_esr"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          micro_esr: ''
        })
        vim.isBabyEsr = true;
        vim.invetigationForm.controls["micro_esr"].setValidators([Validators.required]);
        vim.invetigationForm.controls["micro_esr"].updateValueAndValidity();
      }
    }

    if (target.name == 'BabyProcalcitonin') {
      if (target.value == '2') {
        vim.isBabyProcalcitonin = false;
        vim.invetigationForm.patchValue({
          baby_procalcitonin_levels: 'NA'
        })
        vim.invetigationForm.value["baby_procalcitonin_levels"] = 'NA';

        vim.invetigationForm.controls["baby_procalcitonin_levels"].clearValidators();
        vim.invetigationForm.controls["baby_procalcitonin_levels"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          baby_procalcitonin_levels: ''
        })
        vim.isBabyProcalcitonin = true;
        vim.invetigationForm.controls["baby_procalcitonin_levels"].setValidators([Validators.required]);
        vim.invetigationForm.controls["baby_procalcitonin_levels"].updateValueAndValidity();
      }
    }

    if (target.name == 'Sodium') {
      if (target.value == '2') {
        vim.isSodium = false;
        vim.invetigationForm.patchValue({
          sodium: 'NA'
        })
        vim.invetigationForm.value["sodium"] = 'NA';

        vim.invetigationForm.controls["sodium"].clearValidators();
        vim.invetigationForm.controls["sodium"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          sodium: ''
        })
        vim.isSodium = true;
        vim.invetigationForm.controls["sodium"].setValidators([Validators.required]);
        vim.invetigationForm.controls["sodium"].updateValueAndValidity();
      }
    }

    if (target.name == 'Potassium') {
      if (target.value == '2') {
        vim.isPotassium = false;
        vim.invetigationForm.patchValue({
          potassium: 'NA'
        })
        vim.invetigationForm.value["potassium"] = 'NA';

        vim.invetigationForm.controls["potassium"].clearValidators();
        vim.invetigationForm.controls["potassium"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          potassium: ''
        })
        vim.isPotassium = true;
        vim.invetigationForm.controls["potassium"].setValidators([Validators.required]);
        vim.invetigationForm.controls["potassium"].updateValueAndValidity();
      }
    }

    if (target.name == 'Chlorine') {
      if (target.value == '2') {
        vim.isChlorine = false;
        vim.invetigationForm.patchValue({
          chlorine: 'NA'
        })
        vim.invetigationForm.value["chlorine"] = 'NA';

        vim.invetigationForm.controls["chlorine"].clearValidators();
        vim.invetigationForm.controls["chlorine"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          chlorine: ''
        })
        vim.isChlorine = true;
        vim.invetigationForm.controls["chlorine"].setValidators([Validators.required]);
        vim.invetigationForm.controls["chlorine"].updateValueAndValidity();
      }
    }

    if (target.name == 'Calcium') {
      if (target.value == '2') {
        vim.isCalcium = false;
        vim.invetigationForm.patchValue({
          calcium: 'NA'
        })
        vim.invetigationForm.value["calcium"] = 'NA';

        vim.invetigationForm.controls["calcium"].clearValidators();
        vim.invetigationForm.controls["calcium"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          calcium: ''
        })
        vim.isCalcium = true;
        vim.invetigationForm.controls["calcium"].setValidators([Validators.required]);
        vim.invetigationForm.controls["calcium"].updateValueAndValidity();
      }
    }

    if (target.name == 'Phosphate') {
      if (target.value == '2') {
        vim.isPhosphate = false;
        vim.invetigationForm.patchValue({
          phosphate: 'NA'
        })
        vim.invetigationForm.value["phosphate"] = 'NA';

        vim.invetigationForm.controls["phosphate"].clearValidators();
        vim.invetigationForm.controls["phosphate"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          phosphate: ''
        })
        vim.isPhosphate = true;
        vim.invetigationForm.controls["phosphate"].setValidators([Validators.required]);
        vim.invetigationForm.controls["phosphate"].updateValueAndValidity();
      }
    }

    if (target.name == 'Magnesium') {
      if (target.value == '2') {
        vim.isMagnesium = false;
        vim.invetigationForm.patchValue({
          magnesium: 'NA'
        })
        vim.invetigationForm.value["magnesium"] = 'NA';

        vim.invetigationForm.controls["magnesium"].clearValidators();
        vim.invetigationForm.controls["magnesium"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          magnesium: ''
        })
        vim.isMagnesium = true;
        vim.invetigationForm.controls["magnesium"].setValidators([Validators.required]);
        vim.invetigationForm.controls["magnesium"].updateValueAndValidity();
      }
    }

    if (target.name == 'Urea') {
      if (target.value == '2') {
        vim.isUrea = false;
        vim.invetigationForm.patchValue({
          urea: 'NA'
        })
        vim.invetigationForm.value["urea"] = 'NA';

        vim.invetigationForm.controls["urea"].clearValidators();
        vim.invetigationForm.controls["urea"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          urea: ''
        })
        vim.isUrea = true;
        vim.invetigationForm.controls["urea"].setValidators([Validators.required]);
        vim.invetigationForm.controls["urea"].updateValueAndValidity();
      }
    }

    if (target.name == 'Creatinine') {
      if (target.value == '2') {
        vim.isCreatinine = false;
        vim.invetigationForm.patchValue({
          creatinine: 'NA'
        })
        vim.invetigationForm.value["creatinine"] = 'NA';

        vim.invetigationForm.controls["creatinine"].clearValidators();
        vim.invetigationForm.controls["creatinine"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          creatinine: ''
        })
        vim.isCreatinine = true;
        vim.invetigationForm.controls["creatinine"].setValidators([Validators.required]);
        vim.invetigationForm.controls["creatinine"].updateValueAndValidity();
      }
    }

    if (target.name == 'Lactate') {
      if (target.value == '2') {
        vim.isLactate = false;
        vim.invetigationForm.patchValue({
          lactate_levels: 'NA'
        })
        vim.invetigationForm.value["lactate_levels"] = 'NA';

        vim.invetigationForm.controls["lactate_levels"].clearValidators();
        vim.invetigationForm.controls["lactate_levels"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          lactate_levels: ''
        })
        vim.isLactate = true;
        vim.invetigationForm.controls["lactate_levels"].setValidators([Validators.required]);
        vim.invetigationForm.controls["lactate_levels"].updateValueAndValidity();
      }
    }

    if (target.name == 'Bilirubin') {
      if (target.value == '2') {
        vim.isBilirubin = false;
        vim.invetigationForm.patchValue({
          bilirubin_levels: 'NA'
        })
        vim.invetigationForm.value["bilirubin_levels"] = 'NA';

        vim.invetigationForm.controls["bilirubin_levels"].clearValidators();
        vim.invetigationForm.controls["bilirubin_levels"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          bilirubin_levels: ''
        })
        vim.isBilirubin = true;
        vim.invetigationForm.controls["bilirubin_levels"].setValidators([Validators.required]);
        vim.invetigationForm.controls["bilirubin_levels"].updateValueAndValidity();
      }
    }

    if (target.name == 'Cord_pH') {
      if (target.value == '2') {
        vim.isCord = false;
        vim.invetigationForm.patchValue({
          cord_ph: 'NA'
        })
        vim.invetigationForm.value["cord_ph"] = 'NA';

        vim.invetigationForm.controls["cord_ph"].clearValidators();
        vim.invetigationForm.controls["cord_ph"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          cord_ph: ''
        })
        vim.isCord = true;
        vim.invetigationForm.controls["cord_ph"].setValidators([Validators.required]);
        vim.invetigationForm.controls["cord_ph"].updateValueAndValidity();
      }
    }

    if (target.name == 'TSBValue') {
      if (target.value == '2') {
        vim.isTSBValue = false;
        vim.invetigationForm.patchValue({
          csf_culture_tsb_value: 'NA'
        })
        vim.invetigationForm.value["csf_culture_tsb_value"] = 'NA';

        vim.invetigationForm.controls["csf_culture_tsb_value"].clearValidators();
        vim.invetigationForm.controls["csf_culture_tsb_value"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          csf_culture_tsb_value: ''
        })
        vim.isTSBValue = true;
        vim.invetigationForm.controls["csf_culture_tsb_value"].setValidators([Validators.required]);
        vim.invetigationForm.controls["csf_culture_tsb_value"].updateValueAndValidity();
      }
    }

    if (target.name == 'antibioticSensitive') {
      if (target.value == '2') {
        vim.isAntibioticSensitive = false;
        vim.invetigationForm.patchValue({
          antibiotic_status_value: 'NA'
        })
      } else {
        vim.selectedItems = [];
        vim.isAntibioticSensitive = true;
      }
    }

    if (target.name == 'antibioticResisitant') {
      if (target.value == '2') {
        vim.isAntibioticResisitant = false;
        vim.invetigationForm.patchValue({
          antibiotic_status_resisitant: 'NA'
        })
      } else {
        vim.selectedResisitantItems = [];
        vim.isAntibioticResisitant = true;
      }
    }

    if (target.name == 'antibioticIntermediate') {
      if (target.value == '2') {
        vim.isAntibioticIntermediate = false;
        vim.invetigationForm.patchValue({
          antibiotic_status_intermediate: 'NA'
        })
      } else {
        vim.selectedIntermediateItems = [];
        vim.isAntibioticIntermediate = true;
      }
    }
    if (target.name == 'babyProthrombin') {
      if (target.value == '2') {
        vim.isprothrombin = false;
        vim.invetigationForm.patchValue({
          prothrombin_type: 'NA'
        })
        vim.invetigationForm.value["prothrombin_type"] = 'NA';

        vim.invetigationForm.controls["prothrombin_type"].clearValidators();
        vim.invetigationForm.controls["prothrombin_type"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          prothrombin_type: ''
        })
        vim.isprothrombin = true;
        vim.invetigationForm.controls["prothrombin_type"].setValidators([Validators.required]);
        vim.invetigationForm.controls["prothrombin_type"].updateValueAndValidity();
      }
    }
    if (target.name == 'babyActiveProthrombin') {
      if (target.value == '2') {
        vim.isActiveProthrombin = false;
        vim.invetigationForm.patchValue({
          activated_prothrombin_type: 'NA'
        })
        vim.invetigationForm.value["activated_prothrombin_type"] = 'NA';

        vim.invetigationForm.controls["activated_prothrombin_type"].clearValidators();
        vim.invetigationForm.controls["activated_prothrombin_type"].updateValueAndValidity();
      } else {
        vim.invetigationForm.patchValue({
          activated_prothrombin_type: ''
        })
        vim.isActiveProthrombin = true;
        vim.invetigationForm.controls["activated_prothrombin_type"].setValidators([Validators.required]);
        vim.invetigationForm.controls["activated_prothrombin_type"].updateValueAndValidity();
      }
    
  }
  }

  onItemSelect(item: any, id) {
    // console.log(item, id);
    // console.log(item.itemName);
    if (item.itemName == 'Others' && id == 'id_gram_positive_bacteria') {
      this.isPositiveBactFreeField = true;
      this.invetigationForm.controls["gram_positive_bacteria_if_other"].setValidators([Validators.required]);
      this.invetigationForm.controls["gram_positive_bacteria_if_other"].updateValueAndValidity();
    }

    if (item.itemName == 'Others' && id == 'id_gram_negative_bacteria') {
      this.isNegativeBactFreeField = true;
      this.invetigationForm.controls["gram_negative_bacteria_if_other"].setValidators([Validators.required]);
      this.invetigationForm.controls["gram_negative_bacteria_if_other"].updateValueAndValidity();
    }
  }

  OnItemDeSelect(item: any, id) {
    if (item.itemName == 'Others' && id == 'id_gram_positive_bacteria') {
      this.invetigationForm.patchValue({
        gram_positive_bacteria_if_other: ''
      })
      this.isPositiveBactFreeField = false;
      this.invetigationForm.controls["gram_positive_bacteria_if_other"].clearValidators();
      this.invetigationForm.controls["gram_positive_bacteria_if_other"].updateValueAndValidity();
    }

    if (item.itemName == 'Others' && id == 'id_gram_negative_bacteria') {
      this.invetigationForm.patchValue({
        gram_negative_bacteria_if_other: ''
      })
      this.isNegativeBactFreeField = false;
      this.invetigationForm.controls["gram_negative_bacteria_if_other"].clearValidators();
      this.invetigationForm.controls["gram_negative_bacteria_if_other"].updateValueAndValidity();
    }
  }

  onSelectAll(items: any, id) {
    if (id == 'id_gram_positive_bacteria') {
      this.isPositiveBactFreeField = true;
      this.invetigationForm.controls["gram_positive_bacteria_if_other"].setValidators([Validators.required]);
      this.invetigationForm.controls["gram_positive_bacteria_if_other"].updateValueAndValidity();
    }

    if (id == 'id_gram_negative_bacteria') {
      this.isNegativeBactFreeField = true;
      this.invetigationForm.controls["gram_negative_bacteria_if_other"].setValidators([Validators.required]);
      this.invetigationForm.controls["gram_negative_bacteria_if_other"].updateValueAndValidity();
    }
  }

  onDeSelectAll(items: any, id) {
    if (id == 'id_gram_positive_bacteria') {
      this.invetigationForm.patchValue({
        gram_positive_bacteria_if_other: ''
      })
      this.isPositiveBactFreeField = false;
      this.invetigationForm.controls["gram_positive_bacteria_if_other"].clearValidators();
      this.invetigationForm.controls["gram_positive_bacteria_if_other"].updateValueAndValidity();
    }

    if (id == 'id_gram_negative_bacteria') {
      this.invetigationForm.patchValue({
        gram_negative_bacteria_if_other: ''
      })
      this.isNegativeBactFreeField = false;
      this.invetigationForm.controls["gram_negative_bacteria_if_other"].clearValidators();
      this.invetigationForm.controls["gram_negative_bacteria_if_other"].updateValueAndValidity();
    }
  }

  ngOnChanges() {
    this.createForm(this.id);
  }
  reset() {
    this.createForm(null);
  }

  open(content, obj) {
    this.submitted = false;
    if (!_.isEmpty(obj)) {
      this.isBabyInvestEdit = true;
      this.updateForm(obj);
      this.isEditClicked=true;
    } else {
      this.isBabyInvestEdit = true;
      this.createForm(this.id);
    }
  }

  investigationFormSubmit() {
    const vim = this;
    vim.submitted = true;
    if (vim.invetigationForm.invalid) {
      return;
    }
  //  vim.commonAsyn.showLoader();

    vim.invetigationForm.value["tab_name"] = "final";

    if (vim.invetigationForm.controls["antibiotic_status_value"].value == 'NA') {
      vim.invetigationForm.value["antibiotic_status_value"] = 'NA';
    } else {
      vim.invetigationForm.value["antibiotic_status_value"] = JSON.stringify(vim.selectedItems);
    }

    if (vim.invetigationForm.controls["antibiotic_status_resisitant"].value == 'NA') {
      vim.invetigationForm.value["antibiotic_status_resisitant"] = 'NA';
    } else {
      vim.invetigationForm.value["antibiotic_status_resisitant"] = JSON.stringify(vim.selectedResisitantItems);
    }

    if (vim.invetigationForm.controls["antibiotic_status_intermediate"].value == 'NA') {
      vim.invetigationForm.value["antibiotic_status_intermediate"] = 'NA';
    } else {
      vim.invetigationForm.value["antibiotic_status_intermediate"] = JSON.stringify(vim.selectedIntermediateItems);
    }

    vim.invetigationForm.value["gram_positive_bacteria"] = JSON.stringify(vim.selectedGramPosBacteria);
    vim.invetigationForm.value["gram_negative_bacteria"] = JSON.stringify(vim.selectedGramNegBacItems);
    vim.invetigationForm.value["fungi"] = JSON.stringify(vim.selectedFungiItem);

    if (this.invetigationForm.value["baby_thyroid_result"] == '') {
      this.invetigationForm.value["baby_thyroid_result"] = 'NA';
    }
    if (this.invetigationForm.value["baby_blood_glucose"] == '') {
      this.invetigationForm.value["baby_blood_glucose"] = 'NA';
    }
    if (this.invetigationForm.value["baby_haemoglobin_levels"] == '') {
      this.invetigationForm.value["baby_haemoglobin_levels"] = 'NA';
    }
    if (this.invetigationForm.value["baby_c_reactive_protien_levels"] == '') {
      this.invetigationForm.value["baby_c_reactive_protien_levels"] = 'NA';
    }
    if (this.invetigationForm.value["micro_esr"] == '') {
      this.invetigationForm.value["micro_esr"] = 'NA';
    }
    if (this.invetigationForm.value["baby_procalcitonin_levels"] == '') {
      this.invetigationForm.value["baby_procalcitonin_levels"] = 'NA';
    }
    if (this.invetigationForm.value["sodium"] == '') {
      this.invetigationForm.value["sodium"] = 'NA';
    }
    if (this.invetigationForm.value["potassium"] == '') {
      this.invetigationForm.value["potassium"] = 'NA';
    }
    if (this.invetigationForm.value["chlorine"] == '') {
      this.invetigationForm.value["chlorine"] = 'NA';
    }
    if (this.invetigationForm.value["calcium"] == '') {
      this.invetigationForm.value["calcium"] = 'NA';
    }
    if (this.invetigationForm.value["phosphate"] == '') {
      this.invetigationForm.value["phosphate"] = 'NA';
    }
    if (this.invetigationForm.value["magnesium"] == '') {
      this.invetigationForm.value["magnesium"] = 'NA';
    }
    if (this.invetigationForm.value["urea"] == '') {
      this.invetigationForm.value["urea"] = 'NA';
    }
    if (this.invetigationForm.value["creatinine"] == '') {
      this.invetigationForm.value["creatinine"] = 'NA';
    }
    if (this.invetigationForm.value["lactate_levels"] == '') {
      this.invetigationForm.value["lactate_levels"] = 'NA';
    }
    if (this.invetigationForm.value["bilirubin_levels"] == '') {
      this.invetigationForm.value["bilirubin_levels"] = 'NA';
    }
    if (this.invetigationForm.value["cord_ph"] == '') {
      this.invetigationForm.value["cord_ph"] = 'NA';
    }
    if (this.invetigationForm.value["csf_culture_tsb_value"] == '') {
      this.invetigationForm.value["csf_culture_tsb_value"] = 'NA';
    }
    if (this.invetigationForm.value["total_leucocute_count"] == '') {
      this.invetigationForm.value["total_leucocute_count"] = 'NA';
    }
    if (this.invetigationForm.value["absolute_neutrophil_count"] == '') {
      this.invetigationForm.value["absolute_neutrophil_count"] = 'NA';
    }
    if (this.invetigationForm.value["thrombocytopenia"] == '') {
      this.invetigationForm.value["thrombocytopenia"] = 'NA';
    }
    if (this.invetigationForm.value["prothrombin_type"] == '') {
      this.invetigationForm.value["prothrombin_type"] = 'NA';
    }
    if (this.invetigationForm.value["activated_prothrombin_type"] == '') {
      this.invetigationForm.value["activated_prothrombin_type"] = 'NA';
    }

    // const newUser = vim.common_api.baby_investigation_add(
    //   vim.invetigationForm.value
    // );
    // newUser.subscribe(
    //   response => {
    //     vim.reset();
    //     vim.success(response, "investigationFormSubmit");
    //     vim.isBabyInvestEdit = false;
    //   },
    //   error => {
    //     console.error("errro", error);
    //   }
    // );
    vim.invetigationForm.value["reading"] = localStorage.getItem('reading');
   vim.goToNextReadingForm();
  }
  /**
   *
   * @param response
   * @param api_type
   * @method: success
   * @purpose :-  it is a common helper
   */
  success(response, api_type) {
    const vim = this;
    if (api_type == "investigationFormSubmit") {
      if (vim.isSuccess(response)) {
        vim.toastr.success(
          "",
          "Information Updated succesfully"
        );
        vim.responseArray = [];
        this.page = 1;
        vim.dataServiceObj = vim.dataService.getOption();
        vim.get_investigation(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
      } else {
        if (vim.isAlreadyExist(response)) {
          vim.toastr.warning("Already Exist!!", response["message"]);
        } else {
          vim.errorToasty(response);
        }
      }
    } else if (api_type == "get_investigation") {
      if (vim.isSuccess(response)) {
        if (this.page == 1) {
          vim.responseArray = [];
          vim.responseArray = response["response"];
          vim.isBabyInvestEdit=false;
        } else {
          if (response["status"] == 404) {
            // vim.responseArray = [];
          }
          else if (response["response"].length > 0) {
            vim.temp_study_id = response["response"][0].study_id;
            if (vim.temp_study_id == vim.id) {
            } else {
              vim.responseArray = [];
            }

            for (var i = 0; i < response["response"].length; i++) {
              vim.responseArray.push(response["response"][i]);
              vim.temp_study_id = vim.id;
            }
          }
        }
        vim.commonAsyn.isHide();
      } else {
        vim.responseArray = [];
        vim.commonAsyn.isHide();
        if (vim.isAlreadyExist(response)) {
        } else {
        }
      }
    }
  }



  /**
   *
   * @param error
   * @param api_type
   * @purpose :-  This is error handler method is called.
   * @method: errorHandler
   */
  errorHandler(error, api_type) {
    const vim = this;
    if (api_type == "investigationFormSubmit") {
      vim.errorToasty(error);
    }
  }

  /**
   *
   * @param response
   * @method: it is a common herlper for check the status is 200 or not
   */
  isSuccess(response) {
    const vim = this;
    if (
      response.hasOwnProperty("status") &&
      response["status"] === vim.success_status
    ) {
      return true;
    } else if (response["status"] === 404) {
      return true;
    }
    return false;
  }
  /**
   *
   * @param response
   * @method :- isAlreadyExist
   * @purpose :- check if User Already Exist.
   */
  isAlreadyExist(response) {
    const vim = this;
    if (
      response.hasOwnProperty("status") &&
      response["status"] === vim.already_exist_status
    ) {
      return true;
    }
    return false;
  }
  /**
   * @method :- errorToasty
   */
  errorToasty(error) {
    const vim = this;
    if (error.hasOwnProperty("message")) {
      vim.toastr.error("Error!", error["message"]);
    } else {
      vim.toastr.error("Error!", "Somethink wrong!!!..");
    }
  }

  get_investigation(id, hospital_id, page, reading) {
    const vim = this;
    if (vim.temp_study_id == vim.id) {

    } else {
      vim.page = 1;
      vim.temp_study_id = vim.id;
      // vim.responseArray = [];
    }
    const newdata = vim.common_api.get_tabs("patient/baby_investigation", id, hospital_id, page, reading);
    newdata.subscribe(
      response => {
        vim.success(response, "get_investigation");
      },
      error => {
        console.error("errro", error);
      }
    );
  }

  changeDropdown(dropdownVal, dropdownId) {
    var vim = this;

    if (dropdownId == 'absolute_neutrophil_count') {
      if (dropdownVal == 'NA') {
        this.isNeutrophilCount = false;
        vim.invetigationForm.value["absolute_neutrophil_count"] = 'NA';

        vim.invetigationForm.controls["absolute_neutrophil_count"].clearValidators();
        vim.invetigationForm.controls["absolute_neutrophil_count"].updateValueAndValidity();
        vim.invetigationForm.patchValue({
          absolute_neutrophil_count: 'NA'
        });

      } else {
        vim.invetigationForm.controls["absolute_neutrophil_count"].setValidators([Validators.required]);
        vim.invetigationForm.controls["absolute_neutrophil_count"].updateValueAndValidity();
        vim.invetigationForm.patchValue({
          absolute_neutrophil_count: ''
        })
        this.isNeutrophilCount = true;
      }
    }

    if (dropdownId == 'total_leucocute_count') {
      if (dropdownVal == 'NA') {
        this.isLeucocuteCount = false;
        vim.invetigationForm.value["total_leucocute_count"] = 'NA';

        vim.invetigationForm.controls["total_leucocute_count"].clearValidators();
        vim.invetigationForm.controls["total_leucocute_count"].updateValueAndValidity();
        vim.invetigationForm.patchValue({
          total_leucocute_count: 'NA'
        });

      } else {
        vim.invetigationForm.controls["total_leucocute_count"].setValidators([Validators.required]);
        vim.invetigationForm.controls["total_leucocute_count"].updateValueAndValidity();
        vim.invetigationForm.patchValue({
          total_leucocute_count: ''
        })
        this.isLeucocuteCount = true;
      }
    }

    if (dropdownId == 'thrombocytopenia_unit') {
      if (dropdownVal == 'NA') {
        this.isThrombocytopenia = false;
        vim.invetigationForm.value["thrombocytopenia"] = 'NA';

        vim.invetigationForm.controls["thrombocytopenia"].clearValidators();
        vim.invetigationForm.controls["thrombocytopenia"].updateValueAndValidity();
        vim.invetigationForm.patchValue({
          thrombocytopenia: 'NA'
        });

      } else {
        vim.invetigationForm.controls["thrombocytopenia"].setValidators([Validators.required]);
        vim.invetigationForm.controls["thrombocytopenia"].updateValueAndValidity();
        vim.invetigationForm.patchValue({
          thrombocytopenia: ''
        })
        this.isThrombocytopenia = true;
      }
    }
  }

  getReadingFormData(formData){
    this.responseArray[0]=formData;
    this.checkMultiselectData();
    this.updateForm(this.responseArray[0]);
    this.isBabyInvestEdit=true;
  }

  checkMultiselectData(){
    if(typeof this.responseArray[0]['antibiotic_status_value'] != 'string'){
      this.responseArray[0]['antibiotic_status_value']=JSON.stringify(this.responseArray[0]['antibiotic_status_value']);
      }
    if(typeof this.responseArray[0]['antibiotic_status_intermediate'] != 'string'){
        this.responseArray[0]['antibiotic_status_intermediate']=JSON.stringify(this.responseArray[0]['antibiotic_status_intermediate']);
      }
    if(typeof this.responseArray[0]['antibiotic_status_resisitant'] != 'string'){
          this.responseArray[0]['antibiotic_status_resisitant']=JSON.stringify(this.responseArray[0]['antibiotic_status_resisitant']);
        }
     if(typeof this.responseArray[0]['gram_positive_bacteria'] != 'string'){
            this.responseArray[0]['gram_positive_bacteria']=JSON.stringify(this.responseArray[0]['gram_positive_bacteria']);
          }
      if(typeof this.responseArray[0]['gram_negative_bacteria'] != 'string'){
              this.responseArray[0]['gram_negative_bacteria']=JSON.stringify(this.responseArray[0]['gram_negative_bacteria']);
         }
      if(typeof this.responseArray[0]['fungi'] != 'string'){
          this.responseArray[0]['fungi']=JSON.stringify(this.responseArray[0]['fungi']);
     }
  }

  saveReadingFormData(formData){
    this.readingDataService.setReadingFormData('baby_investigation',formData);
  }

  goToNextReadingForm(){
    let vim=this;
    vim.saveReadingFormData(vim.invetigationForm['value']);
    vim.readingDataService.setComponentFlag('baby-antibiotic')
    vim.readingDataService.setActiveTab("anitibiotic-administration");
    vim.router.navigate(["dashboard/anitibiotic-administration"]);
  }

  onChanges(): void {
    this.invetigationForm.statusChanges.subscribe(val => {
      if(val==='INVALID'){
        this.readingDataService.setFormValidationStatus('baby_investigation',false)
          if(this.readingDataObj!=undefined){
           this.checkNAObject();
            this.invetigationForm.value["reading"] = localStorage.getItem('reading');
            this.invetigationForm.value["tab_name"] = "final";
            this.saveReadingFormData(this.invetigationForm['value']);
          }
      }
      else{
        this.readingDataService.setFormValidationStatus('baby_investigation',true)
        if(this.readingDataObj!=undefined){
         this.checkNAObject();
          this.invetigationForm.value["reading"] = localStorage.getItem('reading');
          this.invetigationForm.value["tab_name"] = "final";
          this.saveReadingFormData(this.invetigationForm['value']);
        }
      }
    });
  }

  checkNAObject(){
    if(this.invetigationForm.value["antibiotic_status_value"]!='NA'){
      this.invetigationForm.value["antibiotic_status_value"] = JSON.stringify(this.selectedItems);
      }
      if(this.invetigationForm.value["antibiotic_status_resisitant"]!='NA'){
      this.invetigationForm.value["antibiotic_status_resisitant"] = JSON.stringify(this.selectedResisitantItems);
      }
      if(this.invetigationForm.value["antibiotic_status_intermediate"]!='NA'){
      this.invetigationForm.value["antibiotic_status_intermediate"] = JSON.stringify(this.selectedIntermediateItems);
      }
      if(this.invetigationForm.value["gram_positive_bacteria"]!='NA'){
      this.invetigationForm.value["gram_positive_bacteria"] = JSON.stringify(this.selectedGramPosBacteria);
      }
      if(this.invetigationForm.value["gram_negative_bacteria"]!='NA'){
      this.invetigationForm.value["gram_negative_bacteria"] = JSON.stringify(this.selectedGramNegBacItems);
      }
      if(this.invetigationForm.value["fungi"]!='NA'){
        this.invetigationForm.value["fungi"] = JSON.stringify(this.selectedFungiItem);
      }
  }

  updateInvestigationForm(){
    this.setData();
    if(!this.invetigationForm.valid){
      return ;
    }
    else{
      console.log(this.invetigationForm['value'])
      this.common_api.updateFormData('patient/update/baby_investigation/',this.id,this.readingDataService.reading,this.invetigationForm['value'],this.loggedInUserId).subscribe(result=>{
          if(result['status']!=200){
              this.toastr.error('Error','Some error occured.Please check');
          }
          else{
            this.updateSuccessResponse(result);
          }
      })
    }
  }

  updateSuccessResponse(result){
    this.toastr.success('','Data Updated Successfully');
    this.get_investigation(this.dataServiceObj.study_id, this.login_hospital['id'], this.page, this.readingDataService.reading);
    this.isEditClicked=false;
  //  this.saveReadingFormData(undefined);
  }

  setData(){
    this.invetigationForm.value["reading"] = localStorage.getItem('reading');
    this.invetigationForm.value["tab_name"] = "baby_investigation";

    if (this.invetigationForm.controls["antibiotic_status_value"].value == 'NA') {
      this.invetigationForm.value["antibiotic_status_value"] = 'NA';
    } else {
      this.invetigationForm.value["antibiotic_status_value"] = JSON.stringify(this.selectedItems);
    }

    if (this.invetigationForm.controls["antibiotic_status_resisitant"].value == 'NA') {
      this.invetigationForm.value["antibiotic_status_resisitant"] = 'NA';
    } else {
      this.invetigationForm.value["antibiotic_status_resisitant"] = JSON.stringify(this.selectedResisitantItems);
    }

    if (this.invetigationForm.controls["antibiotic_status_intermediate"].value == 'NA') {
      this.invetigationForm.value["antibiotic_status_intermediate"] = 'NA';
    } else {
      this.invetigationForm.value["antibiotic_status_intermediate"] = JSON.stringify(this.selectedIntermediateItems);
    }

    this.invetigationForm.value["gram_positive_bacteria"] = JSON.stringify(this.selectedGramPosBacteria);
    this.invetigationForm.value["gram_negative_bacteria"] = JSON.stringify(this.selectedGramNegBacItems);
    this.invetigationForm.value["fungi"] = JSON.stringify(this.selectedFungiItem);

    if (this.invetigationForm.value["baby_thyroid_result"] == '') {
      this.invetigationForm.value["baby_thyroid_result"] = 'NA';
    }
    if (this.invetigationForm.value["baby_blood_glucose"] == '') {
      this.invetigationForm.value["baby_blood_glucose"] = 'NA';
    }
    if (this.invetigationForm.value["baby_haemoglobin_levels"] == '') {
      this.invetigationForm.value["baby_haemoglobin_levels"] = 'NA';
    }
    if (this.invetigationForm.value["baby_c_reactive_protien_levels"] == '') {
      this.invetigationForm.value["baby_c_reactive_protien_levels"] = 'NA';
    }
    if (this.invetigationForm.value["micro_esr"] == '') {
      this.invetigationForm.value["micro_esr"] = 'NA';
    }
    if (this.invetigationForm.value["baby_procalcitonin_levels"] == '') {
      this.invetigationForm.value["baby_procalcitonin_levels"] = 'NA';
    }
    if (this.invetigationForm.value["sodium"] == '') {
      this.invetigationForm.value["sodium"] = 'NA';
    }
    if (this.invetigationForm.value["potassium"] == '') {
      this.invetigationForm.value["potassium"] = 'NA';
    }
    if (this.invetigationForm.value["chlorine"] == '') {
      this.invetigationForm.value["chlorine"] = 'NA';
    }
    if (this.invetigationForm.value["calcium"] == '') {
      this.invetigationForm.value["calcium"] = 'NA';
    }
    if (this.invetigationForm.value["phosphate"] == '') {
      this.invetigationForm.value["phosphate"] = 'NA';
    }
    if (this.invetigationForm.value["magnesium"] == '') {
      this.invetigationForm.value["magnesium"] = 'NA';
    }
    if (this.invetigationForm.value["urea"] == '') {
      this.invetigationForm.value["urea"] = 'NA';
    }
    if (this.invetigationForm.value["creatinine"] == '') {
      this.invetigationForm.value["creatinine"] = 'NA';
    }
    if (this.invetigationForm.value["lactate_levels"] == '') {
      this.invetigationForm.value["lactate_levels"] = 'NA';
    }
    if (this.invetigationForm.value["bilirubin_levels"] == '') {
      this.invetigationForm.value["bilirubin_levels"] = 'NA';
    }
    if (this.invetigationForm.value["cord_ph"] == '') {
      this.invetigationForm.value["cord_ph"] = 'NA';
    }
    if (this.invetigationForm.value["csf_culture_tsb_value"] == '') {
      this.invetigationForm.value["csf_culture_tsb_value"] = 'NA';
    }
    if (this.invetigationForm.value["total_leucocute_count"] == '') {
      this.invetigationForm.value["total_leucocute_count"] = 'NA';
    }
    if (this.invetigationForm.value["absolute_neutrophil_count"] == '') {
      this.invetigationForm.value["absolute_neutrophil_count"] = 'NA';
    }
    if (this.invetigationForm.value["thrombocytopenia"] == '') {
      this.invetigationForm.value["thrombocytopenia"] = 'NA';
    }
  }

  setValidators(fieldName){
    this.invetigationForm.controls[fieldName].setValidators([Validators.required]);
    this.invetigationForm.controls[fieldName].updateValueAndValidity();
  }
  clearValidators(fieldName){
    this.invetigationForm.value[fieldName] = 'NA';
    this.invetigationForm.controls[fieldName].clearValidators();
    this.invetigationForm.controls[fieldName].updateValueAndValidity();
  }
}
