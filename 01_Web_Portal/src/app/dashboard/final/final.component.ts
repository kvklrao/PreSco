import { Component, OnInit, Input, OnChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { ToastrService } from "ngx-toastr";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/service/common/common.service";
import * as _ from "underscore";
import { Common } from "../../shared/service/common/common";
import { DatePipe } from '@angular/common';
import { DataService } from '../../shared/service/data.service';
import { ReadingDataService } from '../../shared/service/reading-data.service';


@Component({
  selector: "app-final",
  templateUrl: "./final.component.html",
  styleUrls: ["./final.component.css"],
  providers: [NgbModalConfig, NgbModal, DatePipe]
})
export class FinalComponent implements OnInit {
  babyFinalForm: FormGroup;
  formRef: any;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  isFinalEdit = true;
  responseArray = [];
  page: number = 1;
  chkBabyDischargeDate: boolean = true;
  chkDaysOfStayHospital: boolean = true;
  ifFinalDiagnosisOther: boolean = true;
  isEditClicked: boolean = false;
  invalidForm=false;
  readingData;
  allFormData:any;
  messageString:string;
  @Input() id;
  @Input() hospital_id;

  getDOA: string;

  temp_study_id = 0;
  subscription: Subscription;
  subscriptionForMR: Subscription;
  loggedInUserId:number;
  getMedicalRecordNumber: string;
  login_hospital: any = {};
  content:any;
  public dataServiceObj;
  public readingDataObj;
  @ViewChild('saveReadingContent') saveReadingContent;

  public customPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z,/\]') } };
  public specialCharPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z, /\]') } };

  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private common_api: CommonService,
    private modalService: NgbModal,
    private commonAsyn: Common,
    private datePipe: DatePipe,
    private dataService: DataService,
    public readingDataService:ReadingDataService
    
  ) {
    this.dataServiceObj = dataService.getOption();
  }

  transformDate(date) {
    if (Object.prototype.toString.call(date['baby_discharge_date']) === "[object Date]") {
      date['baby_discharge_date'] = this.datePipe.transform(date['baby_discharge_date'], 'dd/MM/yyyy');
    }
  }

  ngOnInit() {
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
    vim.readingDataObj=vim.readingDataService.getReadingFormData('baby_final') ;
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
      //console.log(vim.dataServiceObj)
      this.getDOA = vim.dataServiceObj.baby_date_of_admission
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.get_final(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
    }

}
    vim.temp_study_id = vim.id;
    vim.onChanges();
  }

  createForm(id) {
    const vim = this;

    vim.chkBabyDischargeDate = true;
    vim.chkDaysOfStayHospital = true;

    this.babyFinalForm = this.formBuilder.group({
      study_id: id,
      days_of_stay_in_hospital: ["", Validators.required],
      final_diagnosis_sepsis: ["", Validators.required],
      final_diagnosis_rds: ["", Validators.required],
      final_diagnosis_ttnb: ["", Validators.required],
      final_diagnosis_jaundice: ["", Validators.required],
      final_diagnosis_lbw: ["", Validators.required],
      baby_lga_sga_aga_suspect: ["", Validators.required],
      // final_diagnosis_aga: ["", Validators.required],
      final_diagnosis_anemia: ["", Validators.required],
      final_diagnosis_dextochordia: ["", Validators.required],
      final_diagnosis_hypoglycemia: ["", Validators.required],
      final_diagnosis_hypocalcemia: ["", Validators.required],
      final_diagnosis_gastroenteritis: ["", Validators.required],
      final_diagnosis_perinatal_respiratory_depression: [
        "",
        Validators.required
      ],
      final_diagnosis_shock: ["", Validators.required],
      final_diagnosis_feeding_intolerence: ["", Validators.required],
      baby_discharge_date: ["", Validators.required],
      // final_diagnosis_sga: ["", Validators.required],
      final_diagnosis_eos_los: ["", Validators.required],
      final_diagnosis_other: ["", Validators.required],
      meningitis:["",Validators.required],
      hypoxia:["",Validators.required],
      metabolic_acidosis:["",Validators.required],
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
    });
  }

  updateForm(obj) {
    const vim = this;
    if (obj["baby_discharge_date"] == 'NA') {
      vim.chkBabyDischargeDate = false;
    } else {

      vim.chkBabyDischargeDate = true;
    }

    if (obj["days_of_stay_in_hospital"] == 'NA') {
      vim.chkDaysOfStayHospital = false;
      vim.babyFinalForm.controls["days_of_stay_in_hospital"].clearValidators();
      vim.babyFinalForm.controls["days_of_stay_in_hospital"].updateValueAndValidity();
    } else {
      vim.chkDaysOfStayHospital = true;
      vim.babyFinalForm.controls["days_of_stay_in_hospital"].setValidators([Validators.required]);
      vim.babyFinalForm.controls["days_of_stay_in_hospital"].updateValueAndValidity();
    }

    if (obj["final_diagnosis_other"] == 'NA') {
      vim.ifFinalDiagnosisOther = false;
    } else {
      vim.ifFinalDiagnosisOther = true;
    }

    vim.babyFinalForm.patchValue({
      study_id: vim.id,
      days_of_stay_in_hospital: obj["days_of_stay_in_hospital"],
      final_diagnosis_sepsis: obj["final_diagnosis_sepsis"],
      final_diagnosis_rds: obj["final_diagnosis_rds"],
      final_diagnosis_ttnb: obj["final_diagnosis_ttnb"],
      final_diagnosis_jaundice: obj["final_diagnosis_jaundice"],
      final_diagnosis_lbw: obj["final_diagnosis_lbw"],
      baby_lga_sga_aga_suspect: obj["baby_lga_sga_aga_suspect"],
      // final_diagnosis_aga: obj["final_diagnosis_aga"],
      final_diagnosis_anemia: obj["final_diagnosis_anemia"],
      final_diagnosis_dextochordia: obj["final_diagnosis_dextochordia"],
      final_diagnosis_hypoglycemia: obj["final_diagnosis_hypoglycemia"],
      final_diagnosis_hypocalcemia: obj["final_diagnosis_hypocalcemia"],
      final_diagnosis_gastroenteritis: obj["final_diagnosis_gastroenteritis"],
      final_diagnosis_perinatal_respiratory_depression:
        obj["final_diagnosis_perinatal_respiratory_depression"],
      final_diagnosis_shock: obj["final_diagnosis_shock"],
      final_diagnosis_feeding_intolerence:
        obj["final_diagnosis_feeding_intolerence"],
      baby_discharge_date: obj["baby_discharge_date"],
      // final_diagnosis_sga: obj["final_diagnosis_sga"],
      final_diagnosis_eos_los: obj["final_diagnosis_eos_los"],
      final_diagnosis_other: obj["final_diagnosis_other"],
      meningitis:obj["meningitis"],
      hypoxia:obj["hypoxia"],
      metabolic_acidosis:obj["metabolic_acidosis"],
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
    });
  }

  calculateDate() {
    var getDischargeDate = this.babyFinalForm.controls["baby_discharge_date"].value;
    var discharge_date = (getDischargeDate.getMonth() + 1) + '/' + getDischargeDate.getDate() + '/' + getDischargeDate.getFullYear();

    var chunks = this.getDOA.split('/');
    var formattedDate = [chunks[1], chunks[0], chunks[2]].join("/");
    var milliseconds = Date.parse(formattedDate);
    var milliseconds1 = Date.parse(discharge_date);

    var result = milliseconds1 - milliseconds;

    result = result / (24 * 60 * 60 * 1000);
    this.babyFinalForm.patchValue({
      days_of_stay_in_hospital: result
    })
  }

  onInputChange(event) {
    var vim = this;
    var target = event.target || event.srcElement || event.currentTarget;

    if (target.name == 'babyDischargeDate') {
      if (target.value == '2') {
        vim.chkBabyDischargeDate = false;
        vim.babyFinalForm.patchValue({
          baby_discharge_date: 'NA'
        })
      } else {
        vim.chkBabyDischargeDate = true;
        vim.babyFinalForm.patchValue({
          baby_discharge_date: ''
        })
      }
    }

    if (target.name == 'daysOfStayHospital') {
      if (target.value == '2') {
        vim.chkDaysOfStayHospital = false;
        vim.babyFinalForm.patchValue({
          days_of_stay_in_hospital: 'NA'
        })
        vim.babyFinalForm.value["days_of_stay_in_hospital"] = 'NA';

        vim.babyFinalForm.controls["days_of_stay_in_hospital"].clearValidators();
        vim.babyFinalForm.controls["days_of_stay_in_hospital"].updateValueAndValidity();
      } else {
        vim.chkDaysOfStayHospital = true;
        vim.babyFinalForm.controls["days_of_stay_in_hospital"].setValidators([Validators.required]);
        vim.babyFinalForm.controls["days_of_stay_in_hospital"].updateValueAndValidity();
        vim.babyFinalForm.patchValue({
          days_of_stay_in_hospital: ''
        })
      }
    }

    if (target.name == 'FinalDiagnosisOther') {
      if (target.value == '2') {
        vim.ifFinalDiagnosisOther = false;
        vim.babyFinalForm.patchValue({
          final_diagnosis_other: 'NA'
        })
        vim.babyFinalForm.value["final_diagnosis_other"] = 'NA';

        vim.babyFinalForm.controls["final_diagnosis_other"].clearValidators();
        vim.babyFinalForm.controls["final_diagnosis_other"].updateValueAndValidity();
      } else {
        vim.ifFinalDiagnosisOther = true;
        vim.babyFinalForm.controls["final_diagnosis_other"].setValidators([Validators.required]);
        vim.babyFinalForm.controls["final_diagnosis_other"].updateValueAndValidity();
        vim.babyFinalForm.patchValue({
          final_diagnosis_other: ''
        })
      }
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
      this.isFinalEdit = true;
      this.isEditClicked = true;
      this.updateForm(obj);
    } else {
      this.isFinalEdit = true;
      this.createForm(this.id);
    }
  }

  finalFormSubmit() {
    const vim = this;
    vim.transformDate(vim.babyFinalForm.value);
    vim.submitted = true;
    if (vim.babyFinalForm.invalid) {
      return;
    }

    if (this.babyFinalForm.value["days_of_stay_in_hospital"] == '') {
      this.babyFinalForm.value["days_of_stay_in_hospital"] = 'NA';
    }

    if (this.babyFinalForm.value["final_diagnosis_other"] == '') {
      this.babyFinalForm.value["final_diagnosis_other"] = 'NA';
    }

    //vim.commonAsyn.showLoader();
    vim.babyFinalForm.value["tab_name"] = "genral";
    // const newUser = vim.common_api.final_add(vim.babyFinalForm.value);
    // newUser.subscribe(
    //   response => {
    //     vim.reset();
    //     vim.success(response, "finalFormSubmit");
    //   },
    //   error => {
    //     console.error("errro", error);
    //   }
    // );
    vim.babyFinalForm.value["reading"] = localStorage.getItem('reading');
    vim.saveReadingFormData(vim.babyFinalForm['value']);
    //vim.readingDataService.showSaveReadingButton=false;
    vim.openModal();
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
    if (api_type == "finalFormSubmit") {
      if (vim.isSuccess(response)) {
        vim.toastr.success(
          "",
          "Information Updated succesfully"
        );
        vim.responseArray = [];
        this.page = 1;
        vim.dataServiceObj = vim.dataService.getOption();
        vim.get_final(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
      } else {
        if (vim.isAlreadyExist(response)) {
          vim.toastr.warning("Already Exist!!", response["message"]);
        } else {
          vim.errorToasty(response);
        }
      }
    } else if (api_type == "get_final") {
      if (vim.isSuccess(response)) {
        if (this.page == 1) {
          vim.responseArray = [];
          vim.responseArray = response["response"];
          vim.isFinalEdit=false;
        } else {
          if (response["status"] == 404) {
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
    if (api_type == "finalFormSubmit") {
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

  get_final(id, hospital_id, page, reading) {
    const vim = this;
    if (vim.temp_study_id == vim.id) {

    } else {
      vim.page = 1;
      vim.temp_study_id = vim.id;
    }
    const newdata = vim.common_api.get_tabs("patient/baby_final", id, hospital_id, page, reading);
    newdata.subscribe(
      response => {
        vim.success(response, "get_final");
        this.isFinalEdit = false;
      },
      error => {
        console.error("errro", error);
      }
    );
  }
  getReadingFormData(formData){
    this.responseArray[0]=formData;
    this.updateForm(this.responseArray[0]);
    this.isFinalEdit=true;
  }

  saveReadingFormData(formData){
    this.readingDataService.setReadingFormData('baby_final',formData);
  }

  onChanges(): void {
    this.babyFinalForm.statusChanges.subscribe(val => {
      if(val==='INVALID'){
        this.readingDataService.setFormValidationStatus('baby_final',false)
          if(this.readingDataObj!=undefined){
            this.babyFinalForm.value["reading"] = localStorage.getItem('reading');
            this.saveReadingFormData(this.babyFinalForm['value']);
          }
      }
      else{
        this.readingDataService.setFormValidationStatus('baby_final',true)
        if(this.readingDataObj!=undefined){
          this.babyFinalForm.value["reading"] = localStorage.getItem('reading');
          this.saveReadingFormData(this.babyFinalForm['value']);
        }
      }
    });
  }

  update_final_form() {
    var vim = this;
    vim.submitted = true;
    vim.transformDate(vim.babyFinalForm.value);
    if(vim.babyFinalForm.invalid) {
      return;
    } else {

      if (this.babyFinalForm.value["days_of_stay_in_hospital"] == '') {
        this.babyFinalForm.value["days_of_stay_in_hospital"] = 'NA';
      }
  
      if (this.babyFinalForm.value["final_diagnosis_other"] == '') {
        this.babyFinalForm.value["final_diagnosis_other"] = 'NA';
      }
      
    vim.common_api.updateFormData('patient/update/baby_final/', vim.id, vim.readingDataService.reading, vim.babyFinalForm.value,vim.loggedInUserId)
    .subscribe(result => {
      if(result['status'] != 200) {
        vim.toastr.error(result['message']);
      } else {
        vim.toastr.success(
          "",
          "Data Updated Succesfully"
        );
        vim.isEditClicked = false;
        vim.get_final(vim.dataServiceObj.study_id, vim.login_hospital['id'], this.page, vim.readingDataService.reading);
      }
    })
    }
  }
    openModal() {
    this.formRef = this.modalService.open(this.saveReadingContent, { size: "sm" });
  }

  close() {
    this.formRef.close();
  }

  saveReading(){
    var vim = this;
    console.log(this.readingDataService.getAllFormData(),'final forms save data')
    if(vim.validateAllFormData()){
      this.close();
      this.commonAsyn.showLoader();
      this.readingData=this.readingDataService.getAllFormData();
        const newUser = vim.common_api.create_new_reading(this.readingData,this.loggedInUserId);
        newUser.subscribe(
          response => {
           if(response['status']!=200){
            vim.toastr.error('',response['message']);
            this.commonAsyn.isHide();
           }else{
             this.commonAsyn.isHide();
           vim.toastr.success('',response['message']);
           vim.readingDataService.clearReadingFormData();
          //  vim.readingDataService.reset();
          this.readingDataService.showSaveReadingButton=true;
          vim.readingDataService.setActiveTab("baby-appearence")
           vim.router.navigate(['dashboard/baby-appearence']);
          }
          },
          error => {
            console.error("errro", error);
          }
        );
    }
  }
  validateAllFormData(){
    this.messageString='';
    this.invalidForm=false;
    this.allFormData=this.readingDataService.getFormValidationStatus();
    console.log(this.allFormData,'checkForms')
    if( this.allFormData['baby_appears']==false){
      this.setMessage('Baby Appears')
         this.invalidForm=true;
    }
    if( this.allFormData['baby_antibiotic']==false){
     this.setMessage('Baby Antibiotic')
      this.invalidForm=true;
    }
    if( this.allFormData['baby_cns']==false){
     this.setMessage('Baby CNS')
     this.invalidForm=true;
   }
   if(this.allFormData['baby_cv']==false){
     this.setMessage('Baby Cardio Vascular')
     this.invalidForm=true;
   }
   if(this.allFormData['baby_git']==false){
     this.setMessage('Baby GIT')
     this.invalidForm=true;
   }
   if( this.allFormData['baby_investigation']==false){
     this.setMessage('Baby Investigation')
     this.invalidForm=true;
   }
   if( this.allFormData['baby_resp']==false){
     this.setMessage('Baby Respiratory')
     this.invalidForm=true;
   }
   if(this.allFormData['baby_final']==false){
     this.setMessage('Baby Final')
     this.invalidForm=true;
   }
   if(this.invalidForm){
     this.toastr.error('','You have some unfilled entries in ' + this.messageString +'.'+'Please check');
     return false;
   }
     return true;
  }

  setMessage(formName){
    if(this.messageString!==''){
          this.messageString=this.messageString+', '+formName;
    }
    else{
        this.messageString=formName;
    }
 }

}
