import { Component, OnInit, Input, OnChanges, AfterViewInit, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../../shared/service/common/common.service";
import * as _ from "underscore";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbDateStruct, NgbCalendar } from "@ng-bootstrap/ng-bootstrap";
import { MalihuScrollbarService } from "ngx-malihu-scrollbar";
import { Common } from "../../shared/service/common/common";
import { Subscription } from 'rxjs';
declare var $: any;
import { NgxSpinnerService } from "ngx-spinner";
import { PerfectScrollbarConfigInterface, PerfectScrollbarComponent, PerfectScrollbarDirective } from "ngx-perfect-scrollbar";
import { DatePipe } from '@angular/common';
import { AppConstant } from 'src/app/shared/constant/app-constant';
import { DataService } from '../../shared/service/data.service';
import { ReadingDataService } from '../../shared/service/reading-data.service';

@Component({
  selector: "app-general",
  templateUrl: "./general.component.html",
  styleUrls: ["./general.component.css"],
  providers: [NgbModalConfig, NgbModal, DatePipe]
})
export class GeneralComponent implements OnInit {
  generalForm: FormGroup;
  config1: PerfectScrollbarConfigInterface = {};
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  page: number = 1;

  @Input() id;
  hospital_id: number;
  subscription: Subscription;
  temp_study_id = 0;
  getMedicalRecordNumber: string;
  showMrNumber=false;
  login_hospital: any = {};
  hospital_name = '';
  hospital_branch_name = '';

  responseArray = [];
  formRef: any;
  pin_code: any = "";
  is_limit = false;
  is_api_call = true;

  chkBabyPlaceBirthPin: boolean = true;
  chkBabyPlaceBirthName: boolean = true;
  chkBabyDOB: boolean = true;
  chkBabyTimeOfBirth: boolean = true;
  chkBabyAgeAdmission: boolean = true;
  chkBabyApgarSc1: boolean = true;
  chkBabyApgarSc5: boolean = true;
  chkBabyApgarSc10: boolean = true;
  chkBabyGestationalAge: boolean = true;
  chkBabyDayEvent: boolean = true;
  chkBabyDateAdmission: boolean = true;
  chkBabyCondOnSuspectOtherIfAny: boolean = true;
  chkWeightAtBirth: boolean = true;
  chkWeightAtAdmission: boolean = true;
  is_update: boolean = false;
  isDisableDiv = false;
  motherMRNo=true;
  radiochecked: boolean = true;
  radiochecked1: boolean = false;

  pretermArr = ['Yes', 'No', 'NA'];
  content:any;
  navigationSubscription;
  model: NgbDateStruct;
  isHide = true;
  custom_date: { year: number; month: number };
  isBabyEditGeneral: boolean = false;
  isBabyCreateGeneral: boolean = false;
  public dataServiceObj;
  public scrollbarOptions = { axis: "yx", theme: "minimal-dark" };
  updateFlag=false;
  studyId:number;
  public babyReadingData;
  public customPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z,/\]') } };
  public specialCharPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z, /\]') } };
  public onlyNumbersWithComma = { 'S': { pattern: new RegExp('\[0-9,\]') } };

  babyMedicalRecordNumber:string;
  motherMedicalRecordNumber:string;loggedInUserId:number;
  @Output() tabsEvent: EventEmitter<any> = new EventEmitter();
  
  constructor(private formBuilder: FormBuilder, private router: Router, private toastr: ToastrService,
    private common_api: CommonService, public config: NgbModalConfig, private modalService: NgbModal,
    private commonAsyn: Common, private spinner: NgxSpinnerService, private datePipe: DatePipe, private appConstant: AppConstant,
    private dataService: DataService,
    public readingDataService: ReadingDataService, private route: ActivatedRoute,) {
    this.dataServiceObj = dataService.getOption();

    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.resetComponent();
      }
    });
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  resetComponent(){
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
    vim.babyReadingData=JSON.parse(localStorage.getItem('staffMedicalRecord'));

    if (!( _.isEmpty(vim.babyReadingData)) && ( _.isEmpty(vim.dataServiceObj))) {
      vim.id=vim.babyReadingData['study_id'];
      vim.hospital_id=vim.babyReadingData['hospital_id']
      vim.babyMedicalRecordNumber=vim.babyReadingData['baby_medical_record_number']
      vim.motherMedicalRecordNumber=vim.babyReadingData['baby_mother_medical_record_number'];
      vim.dataServiceObj=vim.babyReadingData;
    }
    vim.isBabyEditGeneral=false;
    vim.is_api_call = true;
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.loggedInUserId=vim.login_hospital['user_id'];
    vim.hospital_name = vim.login_hospital.hospital_name;
    vim.hospital_branch_name = vim.login_hospital.hospital_branch_name;

    if (vim.dataServiceObj != undefined || vim.dataServiceObj.study_id != undefined) {
      vim.showMrNumber=true;
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.get_general(vim.dataServiceObj.study_id,  vim.login_hospital['id'], vim.page);
    }

    vim.readingDataService.openForm.subscribe(message => {
     if(message==="openBabyProfileForm")
      vim.open(vim.content,{});
    })

    $('body').on('paste', 'input, textarea', function (e) {
      e.preventDefault()
    });
  }

  transformDate(date) {
    if (Object.prototype.toString.call(date['baby_birth_date']) === "[object Date]") {
      date['baby_birth_date'] = this.datePipe.transform(date['baby_birth_date'], 'dd/MM/yyyy');
    }
    if (Object.prototype.toString.call(date['baby_date_of_admission']) === "[object Date]") {
      date['baby_date_of_admission'] = this.datePipe.transform(date['baby_date_of_admission'], 'dd/MM/yyyy');
    }
  }

  ngOnInit() {
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
    vim.babyReadingData=JSON.parse(localStorage.getItem('staffMedicalRecord'));
    if (!( _.isEmpty(vim.babyReadingData)) && ( _.isEmpty(vim.dataServiceObj))) {
      vim.id=vim.babyReadingData['study_id'];
      vim.hospital_id=vim.babyReadingData['hospital_id']
      vim.babyMedicalRecordNumber=vim.babyReadingData['baby_medical_record_number']
      vim.motherMedicalRecordNumber=vim.babyReadingData['baby_mother_medical_record_number'];
      vim.dataServiceObj=vim.babyReadingData;
    }
    vim.is_api_call = true;
    vim.isBabyEditGeneral=false;
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.loggedInUserId=vim.login_hospital['user_id'];
    vim.hospital_name = vim.login_hospital.hospital_name;
    vim.hospital_branch_name = vim.login_hospital.hospital_branch_name;

    if (vim.dataServiceObj != undefined || vim.dataServiceObj.study_id != undefined) {

      vim.get_general(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page);
    }

    vim.readingDataService.openForm.subscribe(message => {
      console.log(message);
      if(message==="openBabyProfileForm")
       vim.open(vim.content,{});
     })

    $('body').on('paste', 'input, textarea', function (e) {
      e.preventDefault()
    });
  }

  ngOnChanges() {
    this.page = 1;
    this.is_api_call = true;
    this.createForm(this.id);
    this.hospital_id = this.hospital_id;
    this.isBabyEditGeneral = false;
    this.isBabyCreateGeneral = false;
  }

  checkLength(val) {
    const numbers = /^[0-9]+$/;
    if (numbers.test(val)) {
      const vim = this;
      if (val.length > 6) {
        vim.is_limit = true;
      } else {
        vim.is_limit = false;
      }
    } else {
      this.generalForm["control"]["baby_place_of_birth_pin_code"]["value"] = "";
      this.generalForm["control"]["baby_place_of_birth_pin_code"]["errors"][
        "pattern"
      ] = false;
    }
    // return true;
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.generalForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  createForm(id) {
    const vim = this;
    const numbers = /^[0-9]+$/;

    vim.chkBabyPlaceBirthPin = true;
    vim.chkBabyPlaceBirthName = true;
    vim.chkBabyDOB = true;
    vim.chkBabyTimeOfBirth = true;
    vim.chkBabyAgeAdmission = true;
    vim.chkBabyApgarSc1 = true;
    vim.chkBabyApgarSc5 = true;
    vim.chkBabyApgarSc10 = true;
    vim.chkBabyGestationalAge = true;
    vim.chkBabyDayEvent = true;
    vim.chkBabyDateAdmission = true;
    vim.chkBabyCondOnSuspectOtherIfAny = true;
    vim.motherMRNo=true;

    vim.generalForm = vim.formBuilder.group({
      hospital_id: vim.hospital_id,
      hospital_name: vim.hospital_name,
      hospital_branch_name: vim.hospital_branch_name,
      babyMedicalRecord: [vim.babyMedicalRecordNumber, Validators.required],
      babyMotherMedicalRecord: [vim.motherMedicalRecordNumber, Validators.required],
      record_type: ["", Validators.required],
      baby_admission_type: ["", Validators.required],
      baby_birth_date: ["", Validators.required],
      study_id: [vim.id],
      baby_place_of_birth_pin_code: [
        vim.pin_code,
        [Validators.required, Validators.minLength(6)]
      ],

      baby_place_of_birth_name: ["", Validators.required],
      baby_birth_time_hours: ["", Validators.required],
      baby_birth_time_minit: ["", Validators.required],
      baby_age_of_admission: ["", Validators.required],
      baby_apgar_score_one_min: ["", Validators.required],
      baby_apgar_score_five_min: ["", Validators.required],
      baby_apgar_score_ten_min: ["", Validators.required],
      baby_preterm: ["", Validators.required],
      baby_condition_yes_eos_los: ["", Validators.required],
      baby_condition_rds_yes_no: ["", Validators.required],
      baby_gender: ["", Validators.required],
      baby_condition_jaundice_suspect: ["", Validators.required],
      baby_condition_ttnb_suspect: ["", Validators.required],
      baby_lga_sga_aga_suspect: ["", Validators.required],
      baby_shock_aga_suspect: ["", Validators.required],
      baby_condition_dextrocordia_suspect: ["", Validators.required],
      baby_condition_anemia_suspect: ["", Validators.required],
      baby_condition_lbw_suspect: ["", Validators.required],
      place_of_delivery: ["", Validators.required],
      // birth_facility: ["", Validators.required],
      baby_gestational_age: ["", Validators.required],
      baby_gestational_age_unit: ["week"],
      baby_weight_at_birth: ["", Validators.required],
      baby_weight_at_birth_unit: ["Kgs", Validators.required],
      baby_condition_suspect: ["", Validators.required],
      baby_day_of_event: ["", Validators.required],
      baby_weight_at_admission: ["", Validators.required],
      baby_condition_other_if_suspect: ["", Validators.required],
      prelim_diagnosis_perinatal: ["", Validators.required],
      prelim_diagnosis_hypoglycemia: ["", Validators.required],
      prelim_diagnosis_hypocalcemia: ["", Validators.required],
      prelim_diagnosis_feeding_intolerence: ["", Validators.required],
      prelim_diagnosis_gastroenteritis: ["", Validators.required],
      baby_weight_at_admission_unit: ["Kgs", Validators.required],
      baby_date_of_admission: ["", Validators.required],
      meningitis:["", Validators.required],
      asphyxia:["", Validators.required],
      septic_arthritis:["", Validators.required],
      endocarditis:["", Validators.required],
      peritonitis:["", Validators.required],
      soft_tissue_abscess:["", Validators.required],
      coagulopathy:["", Validators.required],
      uti:["", Validators.required],
      umblical_sepsis:["", Validators.required],
      bleeding_manifestation:["", Validators.required],
      central_peripheral:["", Validators.required],
      hypoxia:["", Validators.required],
      metabolic_acidosis:["", Validators.required],
    });

  }

  updateForm(obj) {
    const vim = this;
    if (obj["baby_weight_at_admission"] == 'NA') {
      vim.generalForm.value["baby_weight_at_admission"] = 'NA';
      this.chkWeightAtAdmission = false;

      vim.generalForm.controls["baby_weight_at_admission"].clearValidators();
      vim.generalForm.controls["baby_weight_at_admission"].updateValueAndValidity();
      vim.generalForm.patchValue({
        baby_weight_at_admission: 'NA'
      });
    } else {
      vim.generalForm.controls["baby_weight_at_admission"].clearValidators();
      vim.generalForm.controls["baby_weight_at_admission"].updateValueAndValidity();
      vim.generalForm.patchValue({
        baby_weight_at_admission: ''
      })
      this.chkWeightAtAdmission = true;

      vim.generalForm.patchValue({
        baby_weight_at_admission: obj["baby_weight_at_admission"]
      })
    }

    if (obj["baby_weight_at_birth"] == 'NA') {

      vim.generalForm.value["baby_weight_at_birth"] = 'NA';
      this.chkWeightAtBirth = false;

      vim.generalForm.controls["baby_weight_at_birth"].clearValidators();
      vim.generalForm.controls["baby_weight_at_birth"].updateValueAndValidity();

      vim.generalForm.patchValue({
        baby_weight_at_birth: 'NA'
      });
    } else {
      vim.generalForm.controls["baby_weight_at_birth"].setValidators([Validators.required]);
      vim.generalForm.controls["baby_weight_at_birth"].updateValueAndValidity();
      vim.generalForm.patchValue({
        baby_weight_at_birth: ''
      })

      this.chkWeightAtBirth = true;
      vim.generalForm.patchValue({
        baby_weight_at_birth: obj["baby_weight_at_birth"]
      })

    }

    if (obj["baby_place_of_birth_pin_code"] == 'NA') {
      vim.chkBabyPlaceBirthPin = false;
      vim.generalForm.controls["baby_place_of_birth_pin_code"].clearValidators();
      vim.generalForm.controls["baby_place_of_birth_pin_code"].updateValueAndValidity();
    } else {
      vim.chkBabyPlaceBirthPin = true;
      vim.generalForm.controls["baby_place_of_birth_pin_code"].setValidators([Validators.required, Validators.minLength(6)]);
      vim.generalForm.controls["baby_place_of_birth_pin_code"].updateValueAndValidity();
    }

    if (obj["baby_place_of_birth_name"] == 'NA') {
      vim.chkBabyPlaceBirthName = false;
    } else {
      vim.chkBabyPlaceBirthName = true;
    }

    if (obj["baby_birth_date"] == 'NA') {
      vim.chkBabyDOB = false;
    } else {
      vim.chkBabyDOB = true;
    }

    if (obj["baby_birth_time_hours"] == 'NA') {
      vim.chkBabyTimeOfBirth = false;
    } else {
      vim.chkBabyTimeOfBirth = true;
    }

    if (obj["baby_age_of_admission"] == 'NA') {
      vim.chkBabyAgeAdmission = false;
    } else {
      vim.chkBabyAgeAdmission = true;
    }

    if (obj["baby_apgar_score_one_min"] == 'NA') {
      vim.chkBabyApgarSc1 = false;
    } else {
      vim.chkBabyApgarSc1 = true;
    }

    if (obj["baby_apgar_score_five_min"] == 'NA') {
      vim.chkBabyApgarSc5 = false;
    } else {
      vim.chkBabyApgarSc5 = true;
    }

    if (obj["baby_apgar_score_ten_min"] == 'NA') {
      vim.chkBabyApgarSc10 = false;
    } else {
      vim.chkBabyApgarSc10 = true;
    }

    if (obj["baby_gestational_age"] == 'NA') {
      vim.chkBabyGestationalAge = false;
    } else {
      vim.chkBabyGestationalAge = true;
    }

    if (obj["baby_day_of_event"] == 'NA') {
      vim.chkBabyDayEvent = false;
    } else {
      vim.chkBabyDayEvent = true;
    }

    if (obj["baby_date_of_admission"] == 'NA') {
      vim.chkBabyDateAdmission = false;
    } else {
      vim.chkBabyDateAdmission = true;
    }

    if (obj["baby_condition_other_if_suspect"] == 'NA') {
      vim.chkBabyCondOnSuspectOtherIfAny = false;
    } else {
      vim.chkBabyCondOnSuspectOtherIfAny = true;
    }
    if (obj["baby_mother_medical_record_number"] == 'NA') {
      vim.motherMRNo = false;
    } else {
      vim.motherMRNo = true;
    }

    if (obj['baby_gestational_age'] > 36) {
      vim.pretermArr = ['No', 'NA'];
      vim.generalForm.controls["baby_preterm"].setValidators([Validators.required]);
      vim.generalForm.controls["baby_preterm"].updateValueAndValidity();
    } if(obj['baby_gestational_age'] < 37){
      vim.pretermArr = ['Yes', 'NA'];
      vim.generalForm.controls["baby_preterm"].setValidators([Validators.required]);
      vim.generalForm.controls["baby_preterm"].updateValueAndValidity();
    } 
    if(obj['baby_gestational_age'] == 'NA') {
      vim.pretermArr = ['Yes', 'No', 'NA'];
      vim.generalForm.controls["baby_preterm"].setValidators([Validators.required]);
      vim.generalForm.controls["baby_preterm"].updateValueAndValidity();
    }
      vim.studyId=obj['study_id'];
    vim.generalForm.patchValue({
      study_id: obj['study_id'],
      hospital_id: vim.hospital_id,
      hospital_name: vim.hospital_name,
      hospital_branch_name: vim.hospital_branch_name,
      isCreateForm: vim.isBabyCreateGeneral,
      record_type: obj["record_type"],
      babyMedicalRecord: obj["baby_medical_record_number"],
      babyMotherMedicalRecord: obj["baby_mother_medical_record_number"],
      baby_admission_type: obj["baby_admission_type"],
      baby_place_of_birth_pin_code: obj["baby_place_of_birth_pin_code"],
      patient_admission_type: obj["patient_admission_type"],
      baby_place_of_birth_name: obj["baby_place_of_birth_name"],
      baby_birth_date: obj["baby_birth_date"],
      baby_birth_time_hours: obj["baby_birth_time_hours"],
      baby_birth_time_minit: obj["baby_birth_time_minit"],
      baby_apgar_score_one_min: obj["baby_apgar_score_one_min"],
      baby_apgar_score_five_min: obj["baby_apgar_score_five_min"],
      baby_apgar_score_ten_min: obj["baby_apgar_score_ten_min"],
      baby_age_of_admission: obj["baby_age_of_admission"],
      baby_gender: obj["baby_gender"],
      baby_preterm: obj["baby_preterm"],
      place_of_delivery: obj["place_of_delivery"],
      // birth_facility: obj["birth_facility"],
      baby_gestational_age: obj["baby_gestational_age"],
      baby_gestational_age_unit: obj["baby_gestational_age_unit"],
      baby_weight_at_birth: obj["baby_weight_at_birth"],
      baby_condition_suspect: obj["baby_condition_suspect"],
      baby_day_of_event: obj["baby_day_of_event"],
      patient_region: obj["patient_region"],
      baby_weight_at_admission: obj["baby_weight_at_admission"],
      baby_condition_yes_eos_los: obj["baby_condition_yes_eos_los"],
      baby_condition_rds_yes_no: obj["baby_condition_rds_yes_no"],
      baby_condition_jaundice_suspect: obj["baby_condition_jaundice_suspect"],
      baby_condition_lbw_suspect: obj["baby_condition_lbw_suspect"],
      baby_condition_ttnb_suspect: obj["baby_condition_ttnb_suspect"],
      baby_lga_sga_aga_suspect: obj["baby_lga_sga_aga_suspect"],
      baby_condition_anemia_suspect: obj["baby_condition_anemia_suspect"],
      baby_condition_other_if_suspect: obj["baby_condition_other_if_suspect"],
      prelim_diagnosis_perinatal: obj["prelim_diagnosis_perinatal"],
      prelim_diagnosis_hypoglycemia: obj["prelim_diagnosis_hypoglycemia"],
      prelim_diagnosis_hypocalcemia: obj["prelim_diagnosis_hypocalcemia"],
      prelim_diagnosis_feeding_intolerence: obj["prelim_diagnosis_feeding_intolerence"],
      prelim_diagnosis_gastroenteritis: obj["prelim_diagnosis_gastroenteritis"],
      baby_shock_aga_suspect: obj["baby_shock_aga_suspect"],
      baby_condition_dextrocordia_suspect:
        obj["baby_condition_dextrocordia_suspect"],
      baby_weight_at_birth_unit: obj["baby_weight_at_birth_unit"],
      baby_weight_at_admission_unit: obj["baby_weight_at_admission_unit"],
      baby_date_of_admission: obj["baby_date_of_admission"],
      meningitis: obj["meningitis"],
      asphyxia:obj["asphyxia"],
      septic_arthritis:obj["septic_arthritis"],
      endocarditis:obj["endocarditis"],
      peritonitis:obj["peritonitis"],
      soft_tissue_abscess:obj["soft_tissue_abscess"],
      coagulopathy:obj["coagulopathy"],
      uti:obj["uti"],
      umblical_sepsis:obj["umblical_sepsis"],
      bleeding_manifestation:obj["bleeding_manifestation"],
      central_peripheral:obj["central_peripheral"],
      hypoxia:obj["hypoxia"],
      metabolic_acidosis:obj["metabolic_acidosis"],
    });
  }


  onInputChange(event) {
    var vim = this;
    var target = event.target || event.srcElement || event.currentTarget;

    if (target.name == 'babyPlaceBirthPin') {
      if (target.value == '2') {
        vim.chkBabyPlaceBirthPin = false;
        vim.generalForm.patchValue({
          baby_place_of_birth_pin_code: 'NA'
        })
        vim.generalForm.value["baby_place_of_birth_pin_code"] = 'NA';
        vim.generalForm.controls["baby_place_of_birth_pin_code"].clearValidators();
        vim.generalForm.controls["baby_place_of_birth_pin_code"].updateValueAndValidity();
      } else {
        vim.chkBabyPlaceBirthPin = true;

        vim.generalForm.patchValue({
          baby_place_of_birth_pin_code: ''
        })
        vim.generalForm.controls["baby_place_of_birth_pin_code"].setValidators([Validators.required, Validators.minLength(6)]);
        vim.generalForm.controls["baby_place_of_birth_pin_code"].updateValueAndValidity();
      }
    }

    if (target.name == 'babyPlaceBirthName') {
      if (target.value == '2') {
        vim.chkBabyPlaceBirthName = false;
        vim.generalForm.patchValue({
          baby_place_of_birth_name: 'NA'
        })
        vim.generalForm.value["baby_place_of_birth_name"] = 'NA';
        vim.generalForm.controls["baby_place_of_birth_name"].clearValidators();
        vim.generalForm.controls["baby_place_of_birth_name"].updateValueAndValidity();
      } else {
        vim.chkBabyPlaceBirthName = true;
        vim.generalForm.patchValue({
          baby_place_of_birth_name: ''
        })
        vim.generalForm.controls["baby_place_of_birth_name"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_place_of_birth_name"].updateValueAndValidity();
      }
    }

    if (target.name == 'babyDOB') {
      if (target.value == '2') {
        vim.chkBabyDOB = false;
        vim.generalForm.patchValue({
          baby_birth_date: 'NA'
        })
      } else {
        vim.chkBabyDOB = true;
        vim.generalForm.patchValue({
          baby_birth_date: ''
        })
      }
    }

    if (target.name == 'babyTimeOfBirth') {
      if (target.value == '2') {
        vim.chkBabyTimeOfBirth = false;
        vim.generalForm.patchValue({
          baby_birth_time_hours: 'NA'
        })
        vim.generalForm.patchValue({
          baby_birth_time_minit: 'NA'
        })
        vim.generalForm.value["baby_birth_time_hours"] = 'NA';
        vim.generalForm.value["baby_birth_time_minit"] = 'NA';

        vim.generalForm.controls["baby_birth_time_hours"].clearValidators();
        vim.generalForm.controls["baby_birth_time_hours"].updateValueAndValidity();
        vim.generalForm.controls["baby_birth_time_minit"].clearValidators();
        vim.generalForm.controls["baby_birth_time_minit"].updateValueAndValidity();
      } else {
        vim.generalForm.controls["baby_birth_time_hours"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_birth_time_hours"].updateValueAndValidity();
        vim.generalForm.controls["baby_birth_time_minit"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_birth_time_minit"].updateValueAndValidity();
        vim.chkBabyTimeOfBirth = true;
        vim.generalForm.patchValue({
          baby_birth_time_hours: ''
        })
        vim.generalForm.patchValue({
          baby_birth_time_minit: ''
        })
      }
    }

    if (target.name == 'babyAgeAdmission') {
      if (target.value == '2') {
        vim.chkBabyAgeAdmission = false;
        vim.generalForm.patchValue({
          baby_age_of_admission: 'NA'
        })
        vim.generalForm.value["baby_age_of_admission"] = 'NA';
        vim.generalForm.controls["baby_age_of_admission"].clearValidators();
        vim.generalForm.controls["baby_age_of_admission"].updateValueAndValidity();
      } else {
        vim.chkBabyAgeAdmission = true;
        vim.generalForm.patchValue({
          baby_age_of_admission: ''
        })
        vim.generalForm.controls["baby_age_of_admission"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_age_of_admission"].updateValueAndValidity();
      }
    }

    if (target.name == 'babyApgarSc1') {
      if (target.value == '2') {
        vim.chkBabyApgarSc1 = false;
        vim.generalForm.patchValue({
          baby_apgar_score_one_min: 'NA'
        })
        vim.generalForm.value["baby_apgar_score_one_min"] = 'NA';
        vim.generalForm.controls["baby_apgar_score_one_min"].clearValidators();
        vim.generalForm.controls["baby_apgar_score_one_min"].updateValueAndValidity();
      } else {
        vim.chkBabyApgarSc1 = true;
        vim.generalForm.patchValue({
          baby_apgar_score_one_min: ''
        })
        vim.generalForm.controls["baby_apgar_score_one_min"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_apgar_score_one_min"].updateValueAndValidity();
      }
    }

    if (target.name == 'babyApgarSc5') {
      if (target.value == '2') {
        vim.chkBabyApgarSc5 = false;
        vim.generalForm.patchValue({
          baby_apgar_score_five_min: 'NA'
        })
        vim.generalForm.value["baby_apgar_score_five_min"] = 'NA';
        vim.generalForm.controls["baby_apgar_score_five_min"].clearValidators();
        vim.generalForm.controls["baby_apgar_score_five_min"].updateValueAndValidity();
      } else {
        vim.chkBabyApgarSc5 = true;
        vim.generalForm.patchValue({
          baby_apgar_score_five_min: ''
        })
        vim.generalForm.controls["baby_apgar_score_five_min"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_apgar_score_five_min"].updateValueAndValidity();
      }
    }

    if (target.name == 'babyApgarSc10') {
      if (target.value == '2') {
        vim.chkBabyApgarSc10 = false;
        vim.generalForm.patchValue({
          baby_apgar_score_ten_min: 'NA'
        })
        vim.generalForm.value["baby_apgar_score_ten_min"] = 'NA';
        vim.generalForm.controls["baby_apgar_score_ten_min"].clearValidators();
        vim.generalForm.controls["baby_apgar_score_ten_min"].updateValueAndValidity();
      } else {
        vim.chkBabyApgarSc10 = true;
        vim.generalForm.patchValue({
          baby_apgar_score_ten_min: ''
        })
        vim.generalForm.controls["baby_apgar_score_ten_min"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_apgar_score_ten_min"].updateValueAndValidity();
      }
    }

    if (target.name == 'babyGestationalAge') {
      if (target.value == '2') {
        vim.chkBabyGestationalAge = false;
        vim.generalForm.patchValue({
          baby_gestational_age: 'NA'
        })
        vim.generalForm.value["baby_gestational_age"] = 'NA';
        vim.generalForm.controls["baby_gestational_age"].clearValidators();
        vim.generalForm.controls["baby_gestational_age"].updateValueAndValidity();

        this.pretermArr = ['Yes', 'No', 'NA'];
      this.generalForm.controls["baby_preterm"].setValidators([Validators.required]);
      this.generalForm.controls["baby_preterm"].updateValueAndValidity();
      // this.generalForm.controls["baby_preterm"].setValue('');
      } else {
        vim.chkBabyGestationalAge = true;
        vim.generalForm.patchValue({
          baby_gestational_age: ''
        })
        vim.generalForm.controls["baby_gestational_age"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_gestational_age"].updateValueAndValidity();
      }
    }

    if (target.name == 'babyDayEvent') {
      if (target.value == '2') {
        vim.chkBabyDayEvent = false;
        vim.generalForm.patchValue({
          baby_day_of_event: 'NA'
        })
        vim.generalForm.value["baby_day_of_event"] = 'NA';
        vim.generalForm.controls["baby_day_of_event"].clearValidators();
        vim.generalForm.controls["baby_day_of_event"].updateValueAndValidity();
      } else {
        vim.chkBabyDayEvent = true;
        vim.generalForm.patchValue({
          baby_day_of_event: ''
        })
        vim.generalForm.controls["baby_day_of_event"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_day_of_event"].updateValueAndValidity();
      }
    }

    if (target.name == 'babyDateAdmission') {
      if (target.value == '2') {
        vim.chkBabyDateAdmission = false;
        vim.generalForm.patchValue({
          baby_date_of_admission: 'NA'
        })
      } else {
        vim.chkBabyDateAdmission = true;
        vim.generalForm.patchValue({
          baby_date_of_admission: ''
        })
      }
    }

    if (target.name == 'babyCondOnSuspectOtherIfAny') {
      if (target.value == '2') {
        vim.chkBabyCondOnSuspectOtherIfAny = false;
        vim.generalForm.patchValue({
          baby_condition_other_if_suspect: 'NA'
        })
        vim.generalForm.value["baby_condition_other_if_suspect"] = 'NA';
        vim.generalForm.controls["baby_condition_other_if_suspect"].clearValidators();
        vim.generalForm.controls["baby_condition_other_if_suspect"].updateValueAndValidity();
      } else {
        vim.chkBabyCondOnSuspectOtherIfAny = true;
        vim.generalForm.patchValue({
          baby_condition_other_if_suspect: ''
        })
        vim.generalForm.controls["baby_condition_other_if_suspect"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_condition_other_if_suspect"].updateValueAndValidity();
      }
    }

    if (target.name == 'motherMRNo') {
      if (target.value == '2') {
        vim.motherMRNo = false;
        vim.generalForm.patchValue({
          babyMotherMedicalRecord: 'NA'
        })
        vim.generalForm.value["babyMotherMedicalRecord"] = 'NA';
        vim.generalForm.controls["babyMotherMedicalRecord"].clearValidators();
        vim.generalForm.controls["babyMotherMedicalRecord"].updateValueAndValidity();
      } else {
        vim.motherMRNo = true;
        vim.generalForm.patchValue({
          babyMotherMedicalRecord: ''
        })
        vim.generalForm.controls["babyMotherMedicalRecord"].setValidators([Validators.required]);
        vim.generalForm.controls["babyMotherMedicalRecord"].updateValueAndValidity();
      }
    }

  }

  open(content, obj) {
    const vim = this;
    vim.submitted = false;
    if (!_.isEmpty(obj)) {
      this.isBabyEditGeneral = true;
      this.isBabyCreateGeneral = false;
      this.is_update = true;
      vim.createForm(vim.id);
      vim.updateForm(obj);
      this.updateFlag=true;
    } else {
      this.isBabyEditGeneral = true;
      this.isBabyCreateGeneral = true;
      this.is_update = false;
      vim.createForm(vim.id);
      this.showMrNumber=false;
    }
  }
  close() {

  }

  reset() {
    this.createForm(null);
  }

  babyProfileFormSubmit() {
    var local_data_info = localStorage.getItem("login_hospital");
    let a = JSON.parse(local_data_info);
    this.generalForm.value['hospital_id'] = a.id;
    this.hospital_id = this.generalForm.value['hospital_id']
    // alert(this.hospital_id); return false;
    const vim = this;
    vim.getMedicalRecordNumber=this.generalForm.value['babyMedicalRecord'];
    vim.transformDate(vim.generalForm.value);
    vim.submitted = true;
    vim.findInvalidControls();
    if (vim.generalForm.invalid) {
      return;
    }

    if (this.generalForm.value["baby_place_of_birth_pin_code"] == '') {
      this.generalForm.value["baby_place_of_birth_pin_code"] = 'NA';
    }

    if (this.generalForm.value["baby_place_of_birth_name"] == '') {
      this.generalForm.value["baby_place_of_birth_name"] = 'NA';
    }

    if (this.generalForm.value["baby_age_of_admission"] == '') {
      this.generalForm.value["baby_age_of_admission"] = 'NA';
    }

    if (this.generalForm.value["baby_apgar_score_one_min"] == '') {
      this.generalForm.value["baby_apgar_score_one_min"] = 'NA';
    }

    if (this.generalForm.value["baby_apgar_score_five_min"] == '') {
      this.generalForm.value["baby_apgar_score_five_min"] = 'NA';
    }

    if (this.generalForm.value["baby_apgar_score_ten_min"] == '') {
      this.generalForm.value["baby_apgar_score_ten_min"] = 'NA';
    }

    if (this.generalForm.value["baby_gestational_age"] == '') {
      this.generalForm.value["baby_gestational_age"] = 'NA';
    }

    if (this.generalForm.value["baby_day_of_event"] == '') {
      this.generalForm.value["baby_day_of_event"] = 'NA';
    }

    if (this.generalForm.value["baby_condition_other_if_suspect"] == '') {
      this.generalForm.value["baby_condition_other_if_suspect"] = 'NA';
    }

    if (this.generalForm.value["baby_weight_at_birth"] == '') {
      this.generalForm.value["baby_weight_at_birth"] = 'NA';
    }

    if (this.generalForm.value["baby_weight_at_admission"] == '') {
      this.generalForm.value["baby_weight_at_admission"] = 'NA';
    }

    if (this.generalForm.value["baby_birth_time_hours"] == '') {
      this.generalForm.value["baby_birth_time_hours"] = 'NA';
    }

    if (this.generalForm.value["baby_birth_time_minit"] == '') {
      this.generalForm.value["baby_birth_time_minit"] = 'NA';
    }
    if (this.generalForm.value["babyMotherMedicalRecord"] == '') {
      this.generalForm.value["babyMotherMedicalRecord"] = 'NA';
    }

    this.generalForm.value["is_update"] = vim.is_update;

    vim.commonAsyn.showLoader();
    vim.generalForm.value["tab_name"] = "genral";
    vim.generalForm.value["isCreateForm"] = vim.isBabyCreateGeneral;

    const newUser = vim.common_api.patient_general_info_updated(
      vim.generalForm.value,vim.loggedInUserId
    );
    // const newUser = vim.common_api.patient_general_info_updated(
    //   vim.generalForm.value
    // );
    newUser.subscribe(
      response => {
        if(response['status']!=200){
          vim.toastr.error('',response["message"])
          vim.commonAsyn.isHide();
        }
        else{
        vim.reset();
        vim.success(response, "BabyProfileFormSubmit");
        vim.isBabyEditGeneral = false;
        vim.isBabyCreateGeneral = false;
        vim.readingDataService.setComponentFlag('mother-profile')
        vim.readingDataService.showBabyProfileForm("message");
        vim.readingDataService.setActiveTab("mother-profile")
        vim.router.navigate(["dashboard/mother-profile"]);
        }
      },
      error => {
        console.error("errro", error);
      }
    );
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
    if (api_type == "BabyProfileFormSubmit") {
      if (vim.isSuccess(response)) {
        vim.responseArray = [];
        this.page = 1;
        vim.toastr.success(
          "",
          "Data Inserted Succesfully"
        );
        vim.is_api_call = true;
        vim.id = response['response'].study_id;
        vim.dataServiceObj["study_id"] = response["response"].study_id;
        vim.dataServiceObj["baby_medical_record_number"] = vim.getMedicalRecordNumber;
        vim.dataService.setOption(vim.dataServiceObj);
        vim.showMrNumber=true;
        vim.get_general(vim.dataServiceObj.study_id, this.hospital_id, vim.page);
      } else {
        if (vim.isAlreadyExist(response)) {
          vim.toastr.warning("Already Exist!!", response["message"]);
        } else {
          vim.errorToasty(response);
        }
      }
    } else if (api_type == "get_general") {

      if (vim.isSuccess(response)) {

        if (this.page == 1 && response['status']==200) {

          vim.responseArray = [];
          vim.responseArray = response["response"];

        } else {
          if (response["status"] == 404) {
            // vim.responseArray = [];
            vim.is_api_call = false;
            vim.open(this.content,{});
            // localStorage.setItem('reading','R1');
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

  changeOptions(event) {
    if (this.generalForm.controls["baby_gestational_age"].value > 36) {
      this.pretermArr = ['No', 'NA'];
      this.generalForm.controls["baby_preterm"].setValidators([Validators.required]);
      this.generalForm.controls["baby_preterm"].updateValueAndValidity();
      this.generalForm.controls["baby_preterm"].setValue(this.pretermArr[0]);
    } if(this.generalForm.controls["baby_gestational_age"].value < 37) {
      this.pretermArr = ['Yes', 'NA'];
      this.generalForm.controls["baby_preterm"].setValidators([Validators.required]);
      this.generalForm.controls["baby_preterm"].updateValueAndValidity();
      this.generalForm.controls["baby_preterm"].setValue(this.pretermArr[0]);
    } 
    if (this.generalForm.controls["baby_gestational_age"].value == '') {
      this.pretermArr = ['Yes', 'No', 'NA'];
      this.generalForm.controls["baby_preterm"].setValidators([Validators.required]);
      this.generalForm.controls["baby_preterm"].updateValueAndValidity();
      this.generalForm.controls["baby_preterm"].setValue('');
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
    vim.commonAsyn.isHide();
    if (api_type == "BabyProfileFormSubmit") {
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
    vim.commonAsyn.isHide();
    if (error.hasOwnProperty("message")) {
      vim.toastr.error("Error!", error["message"]);
    } else {
      vim.toastr.error("Error!", "Somethink wrong!!!..");
    }
  }

  get_general(id, hospital_id, page) {
    const vim = this;
    if (vim.temp_study_id == vim.id) {

    } else {
      vim.page = 1;
      vim.temp_study_id = vim.id;
      // vim.responseArray = [];
    }
    const newdata = vim.common_api.get_tabs_general("patient/get_general", id, hospital_id, page);
    newdata.subscribe(
      response => {
        if (response["response"].length > 0) {
          vim.dataServiceObj["baby_date_of_admission"] = response["response"][0].baby_date_of_admission;
        vim.dataService.setOption(vim.dataServiceObj);
        }
        vim.success(response, "get_general");
      },
      error => {
        console.error("errro", error);
      }
    );
  }

  changeDropdown(dropdownVal, dropdownId) {
    var vim = this;

    if (dropdownId == 'babyWeightAtBirthId') {
      if (dropdownVal == 'NA') {
        vim.chkWeightAtBirth = false;
        vim.generalForm.patchValue({
          baby_weight_at_birth: 'NA'
        });

        vim.generalForm.value["baby_weight_at_birth"] = 'NA';
        vim.generalForm.controls["baby_weight_at_birth"].clearValidators();
        vim.generalForm.controls["baby_weight_at_birth"].updateValueAndValidity();
      } else {
        vim.chkWeightAtBirth = true;
        vim.generalForm.patchValue({
          baby_weight_at_birth: ''
        })
        vim.generalForm.controls["baby_weight_at_birth"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_weight_at_birth"].updateValueAndValidity();
      }
    }

    if (dropdownId == 'baby_weight_at_admission') {
      if (dropdownVal == 'NA') {
        vim.chkWeightAtAdmission = false;
        vim.generalForm.patchValue({
          baby_weight_at_admission: 'NA'
        });
        vim.generalForm.value["baby_weight_at_admission"] = 'NA';

        vim.generalForm.controls["baby_weight_at_admission"].clearValidators();
        vim.generalForm.controls["baby_weight_at_admission"].updateValueAndValidity();
      } else {
        vim.chkWeightAtAdmission = true;
        vim.generalForm.patchValue({
          baby_weight_at_admission: ''
        })
        vim.generalForm.controls["baby_weight_at_admission"].setValidators([Validators.required]);
        vim.generalForm.controls["baby_weight_at_admission"].updateValueAndValidity();
      }
    }
  }

  updateGeneralForm(){
    var local_data_info = localStorage.getItem("login_hospital");
    let a = JSON.parse(local_data_info);
    this.generalForm.value['hospital_id'] = a.id;
    this.hospital_id = this.generalForm.value['hospital_id']
    // alert(this.hospital_id); return false;
    const vim = this;
    vim.getMedicalRecordNumber=this.generalForm.value['babyMedicalRecord'];
    vim.transformDate(vim.generalForm.value);
    vim.submitted = true;
    vim.findInvalidControls();
    if (vim.generalForm.invalid) {
      return;
    }

    if (this.generalForm.value["baby_place_of_birth_pin_code"] == '') {
      this.generalForm.value["baby_place_of_birth_pin_code"] = 'NA';
    }

    if (this.generalForm.value["baby_place_of_birth_name"] == '') {
      this.generalForm.value["baby_place_of_birth_name"] = 'NA';
    }

    if (this.generalForm.value["baby_age_of_admission"] == '') {
      this.generalForm.value["baby_age_of_admission"] = 'NA';
    }

    if (this.generalForm.value["baby_apgar_score_one_min"] == '') {
      this.generalForm.value["baby_apgar_score_one_min"] = 'NA';
    }

    if (this.generalForm.value["baby_apgar_score_five_min"] == '') {
      this.generalForm.value["baby_apgar_score_five_min"] = 'NA';
    }

    if (this.generalForm.value["baby_apgar_score_ten_min"] == '') {
      this.generalForm.value["baby_apgar_score_ten_min"] = 'NA';
    }

    if (this.generalForm.value["baby_gestational_age"] == '') {
      this.generalForm.value["baby_gestational_age"] = 'NA';
    }

    if (this.generalForm.value["baby_day_of_event"] == '') {
      this.generalForm.value["baby_day_of_event"] = 'NA';
    }

    if (this.generalForm.value["baby_condition_other_if_suspect"] == '') {
      this.generalForm.value["baby_condition_other_if_suspect"] = 'NA';
    }

    if (this.generalForm.value["baby_weight_at_birth"] == '') {
      this.generalForm.value["baby_weight_at_birth"] = 'NA';
    }

    if (this.generalForm.value["baby_weight_at_admission"] == '') {
      this.generalForm.value["baby_weight_at_admission"] = 'NA';
    }

    if (this.generalForm.value["baby_birth_time_hours"] == '') {
      this.generalForm.value["baby_birth_time_hours"] = 'NA';
    }

    if (this.generalForm.value["baby_birth_time_minit"] == '') {
      this.generalForm.value["baby_birth_time_minit"] = 'NA';
    }
    if (this.generalForm.value["babyMotherMedicalRecord"] == '') {
      this.generalForm.value["babyMotherMedicalRecord"] = 'NA';
    }

    this.generalForm.value["is_update"] = vim.is_update;

    vim.commonAsyn.showLoader();
    vim.generalForm.value["tab_name"] = "genral";
    vim.generalForm.value["isCreateForm"] = vim.isBabyCreateGeneral;
   
        this.common_api.updateBabyProfile(this.studyId,this.generalForm['value'],this.loggedInUserId).subscribe(result=>{
          if(result['status']!=200){
              this.toastr.error('',result['message']);
          }
          else{
            this.toastr.success('',result['message']);
            this.updateFlag=false;
            this.isBabyEditGeneral = false;
            this.get_general(vim.dataServiceObj.study_id,  vim.login_hospital['id'], vim.page);
          }
        })
    
  }
  calculateAgeAtAdmission(){
    debugger;
    if(this.generalForm['value']['baby_birth_date']!="NA" && this.generalForm['value']['baby_birth_date']!="" && this.generalForm['value']['baby_date_of_admission']!="NA" && this.generalForm['value']['baby_date_of_admission']!="" ){
      this.convertDateFormat(this.generalForm['value']);
      var date1=new Date(this.generalForm['value']['baby_birth_date']);
      var date2=new Date(this.generalForm['value']['baby_date_of_admission']);
      if(date2<date1){
              this.toastr.error("Date of admission cannot be less than Date of Birth");
              this.generalForm['value']['baby_date_of_admission']='';
              this.generalForm.patchValue({
                baby_date_of_admission: '',
                baby_age_of_admission:''
              })
              return ;
      }else{
      var timeDifference = Math.abs(date1.getTime() - date2.getTime()) / 1000;
         var days = Math.floor(timeDifference / 86400);
         this.generalForm.patchValue({
          baby_age_of_admission: days
        })
    }
  }

  }

  convertDateFormat(formValue){
    if(typeof formValue['baby_birth_date'] =='string'){
      formValue['baby_birth_date']= this.datePipe.transform(formValue['baby_birth_date'], 'dd/MM/yyyy');
    }
    if(typeof formValue['baby_date_of_admission']=='string'){
      formValue['baby_date_of_admission']= this.datePipe.transform(formValue['baby_date_of_admission'], 'dd/MM/yyyy');
    }
  }
}