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
  selector: "app-baby-resp",
  templateUrl: "./baby-resp.component.html",
  styleUrls: ["./baby-resp.component.css"],
  providers: [NgbModalConfig, NgbModal]
})
export class BabyRespComponent implements OnInit, OnChanges {

  public customPatterns = {'S': { pattern: new RegExp('\[a-zA-Z, \]')}};

  babyRespForm: FormGroup;
  formRef: any;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  page: number = 1;
  isBabyRespEdit: boolean = true;

  isSaturation: boolean = true;
  isRate: boolean = true;
  isXrayDiagnosisAnyOther: boolean = false;

  respiratorySupportList = [];
  settings = {};
  selectedRespItems = [];

  @Input() id;
  @Input() hospital_id;
  subscription: Subscription;

  getMedicalRecordNumber: string;

  temp_study_id = 0;

  login_hospital: any = {};
  responseArray = [];
  content:any;
  public dataServiceObj;
  public readingDataObj;
  isEditClicked=false;
  loggedInUserId:number;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private common_api: CommonService,
    private modalService: NgbModal,
    private commonAsyn: Common,
    private dataService:DataService,
    public readingDataService:ReadingDataService
  ) {
    this.dataServiceObj = dataService.getOption(); 
  }

  ngOnInit() {
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
    vim.readingDataObj=vim.readingDataService.getReadingFormData('baby_resp') ;
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.loggedInUserId=vim.login_hospital['user_id'];
    vim.createForm(vim.dataServiceObj.study_id);
    vim.id = vim.dataServiceObj.study_id;
    if(vim.readingDataObj!=undefined){
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
        vim.getReadingFormData(this.readingDataObj);
    }
    else{
    if ( vim.dataServiceObj.study_id != undefined) {
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.get_baby_resp(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
    }
  }
    vim.temp_study_id = vim.id;

    this.respiratorySupportList = [
      { "id": 1, "itemName": "Ventilator" },
      { "id": 2, "itemName": "CPAP" },
      { "id": 3, "itemName": "HFNC" },
      { "id": 4, "itemName": "Nasal High Flow" },
      { "id": 5, "itemName": "Nasal Prongs" },
      { "id": 6, "itemName": "Other" },
      { "id": 7, "itemName": "NA" }
    ];

    this.settings = {
      limitSelection: false,
      badgeShowLimit: 2
    };
  }

  createForm(id) {
    const vim = this;

    vim.isSaturation = true;
    vim.isRate = true;
    vim.isXrayDiagnosisAnyOther = false;

    vim.selectedRespItems = [];

    this.babyRespForm = this.formBuilder.group({
      study_id: id,
      groaning: ["", Validators.required],
      grunting: ["", [Validators.required]],
      stridor: ["", Validators.required],
      retraction: ["", Validators.required],
      fast_breathing: ["", Validators.required],
      oxygen_saturation: ["", Validators.required],
      breathing_rate: ["", Validators.required],
      baby_chest_indrawing: ["", Validators.required],
      x_ray_result: ["", Validators.required],
      x_ray_status_done: ["", Validators.required],
      x_ray_status: ["", Validators.required],
      x_ray_diagnosis_any_other: [""],
      apnea_diagnosis: ["", Validators.required],
      apnea_status: ["", Validators.required],
      baby_respiratory_support: ["", Validators.required],
      baby_respiratory_support_if_yes: ["", Validators.required]
    });

    vim.onChanges();
  }

  updateForm(obj) {
    const vim = this;
    if(obj["oxygen_saturation"] == 'NA'){
      vim.isSaturation = false;
      vim.babyRespForm.controls["oxygen_saturation"].clearValidators();
      vim.babyRespForm.controls["oxygen_saturation"].updateValueAndValidity();
    }else{
      obj["oxygen_saturation"] = obj["oxygen_saturation"].toString();
      vim.isSaturation = true;
    }

    if(obj["breathing_rate"] == 'NA'){
      vim.isRate = false;
      vim.babyRespForm.controls["breathing_rate"].clearValidators();
      vim.babyRespForm.controls["breathing_rate"].updateValueAndValidity();
    }else{
      vim.isRate = true;
    }

    if(obj["x_ray_status"]=='Other'){
      vim.isXrayDiagnosisAnyOther = true;
    }else{
      vim.isXrayDiagnosisAnyOther = false;
      vim.babyRespForm.patchValue({
        x_ray_diagnosis_any_other: ''})
    }

    if (/^[\],:{}\s]*$/.test(obj["baby_respiratory_support"].replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      let selectArray=obj["baby_respiratory_support"];
      vim.selectedRespItems = JSON.parse(selectArray);
      obj["baby_respiratory_support"]=JSON.stringify(obj["baby_respiratory_support"]);
    } else {
      vim.selectedRespItems = [];
    }

      vim.babyRespForm.patchValue({
      study_id: vim.id,
      groaning: obj["groaning"],
      grunting: obj["grunting"],
      stridor: obj["stridor"],
      retraction: obj["retraction"],
      fast_breathing: obj["fast_breathing"],
      oxygen_saturation: obj["oxygen_saturation"],
      breathing_rate: obj["breathing_rate"],
      baby_chest_indrawing: obj["baby_chest_indrawing"],
      x_ray_result: obj["x_ray_result"],
      x_ray_status_done: obj["x_ray_status_done"],
      x_ray_status: obj["x_ray_status"],
      x_ray_diagnosis_any_other: obj["x_ray_diagnosis_any_other"],
      apnea_diagnosis: obj["apnea_diagnosis"],
      apnea_status: obj["apnea_status"],
      baby_respiratory_support: obj["baby_respiratory_support"],
      baby_respiratory_support_if_yes: obj["baby_respiratory_support_if_yes"],
      baby_respiratory_support_if_other: obj["baby_respiratory_support_if_other"]
    });
  }

  onInputChange(event) {
    var vim = this;
    var target = event.target || event.srcElement || event.currentTarget;
    if(target.name=='Saturation'){
      if(target.value == '2') {
        vim.isSaturation = false;
        vim.babyRespForm.patchValue({
          oxygen_saturation: 'NA'})
          vim.babyRespForm.value["oxygen_saturation"] = 'NA';
          
        vim.babyRespForm.controls["oxygen_saturation"].clearValidators();
        vim.babyRespForm.controls["oxygen_saturation"].updateValueAndValidity();
      } else {
        vim.babyRespForm.controls["oxygen_saturation"].setValidators([Validators.required]);
        vim.babyRespForm.controls["oxygen_saturation"].updateValueAndValidity();
        vim.babyRespForm.patchValue({
          oxygen_saturation: ''})
        vim.isSaturation = true;
      }
    }
    if(target.name=='Rate'){
      if(target.value == '2') {
        vim.isRate = false;
        vim.babyRespForm.patchValue({
          breathing_rate: 'NA'})
          vim.babyRespForm.value["breathing_rate"] = 'NA';
          
          vim.babyRespForm.controls["breathing_rate"].clearValidators();
          vim.babyRespForm.controls["breathing_rate"].updateValueAndValidity();
      } else {
        vim.babyRespForm.controls["breathing_rate"].setValidators([Validators.required]);
        vim.babyRespForm.controls["breathing_rate"].updateValueAndValidity();
        vim.babyRespForm.patchValue({
          breathing_rate: ''})
        vim.isRate = true;
      }
    }
  }

  // When scroll down the screen 
  onScroll()  
  {  
    const vim = this;
    this.page = this.page + 5;
  } 

  ngOnChanges() {
    this.createForm(this.id);
  }
  
  reset() {
    this.createForm(null);
  }

  open(content, obj) {
    const vim = this;
    if (!_.isEmpty(obj)) {
      this.isBabyRespEdit = true;
      vim.updateForm(obj);
      this.isEditClicked=true;
    } else {
      this.isBabyRespEdit = true;
      this.createForm(this.id);
    }
  }
  close() {
  }
  
  respiratoryFormSubmit() {
    const vim = this;
    vim.submitted = true;
    if (vim.babyRespForm.invalid) {
      return;
    }

    vim.babyRespForm.value["baby_respiratory_support"] = JSON.stringify(vim.selectedRespItems);
    if(this.babyRespForm.value["oxygen_saturation"] == '') {
      this.babyRespForm.value["oxygen_saturation"] = 'NA';
    }
    else{
      this.babyRespForm.value["oxygen_saturation"] = this.babyRespForm.value["oxygen_saturation"].toString();
    }
    if(this.babyRespForm.value["breathing_rate"] == '') {
      this.babyRespForm.value["breathing_rate"] = 'NA';
    }
    vim.babyRespForm.value["tab_name"] = "baby_resp_add";
    // const newUser = vim.common_api.baby_resp_add(vim.babyRespForm.value);
    // newUser.subscribe(
    //   response => {
    //     vim.reset();
    //     vim.success(response, "respiratoryFormSubmit");
    //     vim.isBabyRespEdit = false;
    //   },
    //   error => {
    //     console.error("errro", error);
    //   }
    // );
    this.babyRespForm.value["reading"] = localStorage.getItem('reading');
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
    if (api_type == "respiratoryFormSubmit") {
      if (vim.isSuccess(response)) {
        vim.responseArray = [];
        this.page=1;
        vim.toastr.success(
          "",
          "Information Updated succesfully"
        );
        vim.dataServiceObj = vim.dataService.getOption();
        vim.get_baby_resp(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
      } else {
        if (vim.isAlreadyExist(response)) {
          vim.toastr.warning("Already Exist!!", response["message"]);
        } else {
          vim.errorToasty(response);
        }
      }
    } else if (api_type == "get_all") {
      if (vim.isSuccess(response)) {
        if(this.page==1){
          vim.responseArray = [];
          vim.responseArray = response["response"];
          vim.isBabyRespEdit=false;
        }else{
          if(response["status"]==404){
          }
          else if(response["response"].length>0){
            vim.temp_study_id = response["response"][0].study_id;
            if(vim.temp_study_id==vim.id){
            }else{
              vim.responseArray = [];
            }

            for(var i=0; i<response["response"].length;i++) {
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
    if (api_type == "respiratoryFormSubmit") {
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
    } else if(response["status"]===404){
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

  get_baby_resp(id, hospital_id,page, reading) {
    const vim = this;
    if(vim.temp_study_id==vim.id){
    
    }else{
      vim.page = 1;
      vim.temp_study_id=vim.id;
      // vim.responseArray = [];
    }
    const newdata = vim.common_api.get_tabs("patient/baby_resp", id, hospital_id, page, reading);
    newdata.subscribe(
      response => {
        //  console.error(response);
        vim.success(response, "get_all");
      },
      error => {
        console.error("errro", error);
      }
    );
  }

  changeDropdown(dropdownVal,dropdownId){
    var vim = this;
    if(dropdownId=='x_ray_status'){
      if(dropdownVal=='Other'){
        vim.isXrayDiagnosisAnyOther = true;
        vim.babyRespForm.controls["x_ray_diagnosis_any_other"].setValidators([Validators.required]);
        vim.babyRespForm.controls["x_ray_diagnosis_any_other"].updateValueAndValidity();
      }else{
        vim.isXrayDiagnosisAnyOther = false;
        vim.babyRespForm.controls["x_ray_diagnosis_any_other"].clearValidators();
        vim.babyRespForm.controls["x_ray_diagnosis_any_other"].updateValueAndValidity();
        vim.babyRespForm.patchValue({
          x_ray_diagnosis_any_other: ''})
      }
    }
    
  }
  getReadingFormData(formData){
    this.responseArray[0]=formData;
    if(typeof this.responseArray[0]['baby_respiratory_support'] != 'string'){
    this.responseArray[0]['baby_respiratory_support']=JSON.stringify(this.responseArray[0]['baby_respiratory_support']);
    }
    this.updateForm(this.responseArray[0]);
    this.isBabyRespEdit=true;
    //console.log(this.responseArray[0],'baby_resp')
  }

  saveReadingFormData(formData){
    this.readingDataService.setReadingFormData('baby_resp',formData);
  }

  goToNextReadingForm(){
    let vim=this;
    vim.saveReadingFormData(vim.babyRespForm['value']);
    vim.readingDataService.setComponentFlag('baby-cv')
    vim.readingDataService.setActiveTab("baby-cardio-vascular")
    vim.router.navigate(["dashboard/baby-cardio-vascular"]);
  }

  onChanges(): void {
    this.babyRespForm.statusChanges.subscribe(val => {
      if(val==='INVALID'){
        this.readingDataService.setFormValidationStatus('baby_resp',false)
          if(this.readingDataObj!=undefined){
            this.babyRespForm.value["reading"] = localStorage.getItem('reading');
            this.babyRespForm.value["tab_name"] = "baby_resp_add";
            this.babyRespForm.value["baby_respiratory_support"] = JSON.stringify(this.selectedRespItems);
            this.saveReadingFormData(this.babyRespForm['value']);
          }
      }
      else{
        this.readingDataService.setFormValidationStatus('baby_resp',true)
        if(this.readingDataObj!=undefined){
          this.babyRespForm.value["reading"] = localStorage.getItem('reading');
          this.babyRespForm.value["tab_name"] = "baby_resp_add";
          this.babyRespForm.value["baby_respiratory_support"] = JSON.stringify(this.selectedRespItems);
          this.saveReadingFormData(this.babyRespForm['value']);
        }
      }
    });
  }

  updateRespForm(){
    if(!this.babyRespForm.valid){
      return ;
    }
    else{
    this.setData();
      this.common_api.updateFormData('patient/update/baby_resp/',this.id,this.readingDataService.reading,this.babyRespForm['value'],this.loggedInUserId).subscribe(result=>{
          if(result['status']!=200){
              this.toastr.error('Error','Some error occured.Please check');
          }
          else{
            this.updateSuccessResponse(result);
          }
      })
    }
  }
  setData(){
    this.babyRespForm.value["baby_respiratory_support"] = JSON.stringify(this.selectedRespItems);

    if (this.babyRespForm.value["oxygen_saturation"] == '') {
      this.babyRespForm.value["oxygen_saturation"] = 'NA';
    } else {
      this.babyRespForm.value["oxygen_saturation"] = this.babyRespForm.value["oxygen_saturation"].toString();
    }
    if (this.babyRespForm.value["breathing_rate"] == '') {
      this.babyRespForm.value["breathing_rate"] = 'NA';
    }
  }

  updateSuccessResponse(result) {
    this.toastr.success('', 'Data Updated Successfully');
    this.get_baby_resp(this.dataServiceObj.study_id, this.login_hospital['id'], this.page, this.readingDataService.reading);
    this.isEditClicked = false;
    //  this.saveReadingFormData(undefined);
  }
}
