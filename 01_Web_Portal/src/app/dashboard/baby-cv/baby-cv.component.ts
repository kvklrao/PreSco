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
  selector: "app-baby-cv",
  templateUrl: "./baby-cv.component.html",
  styleUrls: ["./baby-cv.component.css"],
  providers: [NgbModalConfig, NgbModal]
})
export class BabyCvComponent implements OnInit {

  public customPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z, \]') } };

  babyCvForm: FormGroup;
  formRef: any;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;

  responseArray = [];
  page: number = 1;
  isBabyCvEdit: boolean = true;

  isHeartRate: boolean = true;
  isBpArterial: boolean = true;
  isUpperLimb: boolean = true;
  isLowerLimb: boolean = true;
  isEchoResult: boolean = true;
  isEditClicked: boolean = false;

  getMedicalRecordNumber: string;

  @Input() id;
  @Input() hospital_id;
  subscription: Subscription;
  loggedInUserId:number;
  temp_study_id = 0;
  login_hospital: any = {};
  content:any;
  public dataServiceObj;
  public readingDataObj;

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
    vim.readingDataObj=vim.readingDataService.getReadingFormData('baby_cv') ;
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.loggedInUserId=vim.login_hospital['user_id'];
    vim.temp_study_id = vim.id;

    vim.createForm(vim.dataServiceObj.study_id);
    vim.id = vim.dataServiceObj.study_id;

    if(vim.readingDataObj!=undefined){
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.getReadingFormData(this.readingDataObj);
    }
  else{
    if (vim.dataServiceObj.study_id != undefined) {
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.get_cv(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
    }
}
  vim.onChanges();
  }

  createForm(id) {
    const vim = this;

    vim.isHeartRate = true;
    vim.isBpArterial = true;
    vim.isUpperLimb = true;
    vim.isLowerLimb = true;
    vim.isEchoResult = true;

    this.babyCvForm = this.formBuilder.group({
      study_id: id,
      heart_rate: ["", Validators.required],
      urine_output: ["", [Validators.required]],
      baby_blood_pressure_mean_arterial_bp: ["", Validators.required],
      baby_blood_pressure_upper_limb: ["", Validators.required],
      baby_blood_pressure_lower_limb: ["", Validators.required],
      capillary_refill_unit: ["", Validators.required],
      low_peripheral_pulse_volume: ["", Validators.required],
      cool_peripheries: ["", Validators.required],
      two_d_echo_done: ["", Validators.required],
      two_d_echo_done_if_yes: ["", Validators.required],
      baby_on_ionotropes: ["", Validators.required],
      central_line: ["", Validators.required],
      infusion_of_blood_products: ["", Validators.required]
    });
  }

  updateForm(obj) {
    const vim = this;

    if (obj["heart_rate"] == 'NA') {
      vim.isHeartRate = false;
      vim.babyCvForm.controls["heart_rate"].clearValidators();
      vim.babyCvForm.controls["heart_rate"].updateValueAndValidity();
    } else {
      vim.isHeartRate = true;
    }

    if (obj["baby_blood_pressure_mean_arterial_bp"] == 'NA') {
      vim.isBpArterial = false;
      vim.babyCvForm.controls["baby_blood_pressure_mean_arterial_bp"].clearValidators();
      vim.babyCvForm.controls["baby_blood_pressure_mean_arterial_bp"].updateValueAndValidity();
    } else {
      vim.isBpArterial = true;
    }

    if (obj["baby_blood_pressure_upper_limb"] == 'NA') {
      vim.isUpperLimb = false;
      vim.babyCvForm.controls["baby_blood_pressure_upper_limb"].clearValidators();
      vim.babyCvForm.controls["baby_blood_pressure_upper_limb"].updateValueAndValidity();
    } else {
      vim.isUpperLimb = true;
    }

    if (obj["baby_blood_pressure_lower_limb"] == 'NA') {
      vim.isLowerLimb = false;
      vim.babyCvForm.controls["baby_blood_pressure_lower_limb"].clearValidators();
      vim.babyCvForm.controls["baby_blood_pressure_lower_limb"].updateValueAndValidity();
    } else {
      vim.isLowerLimb = true;
    }

    if (obj["two_d_echo_done_if_yes"] == 'NA') {
      vim.isEchoResult = false;
    } else {
      vim.isEchoResult = true;
    }


    vim.babyCvForm.patchValue({
      study_id: vim.id,
      heart_rate: obj["heart_rate"],
      urine_output: obj["urine_output"],
      baby_blood_pressure_mean_arterial_bp:
        obj["baby_blood_pressure_mean_arterial_bp"],
      baby_blood_pressure_upper_limb: obj["baby_blood_pressure_upper_limb"],
      baby_blood_pressure_lower_limb: obj["baby_blood_pressure_lower_limb"],
      capillary_refill_unit: obj["capillary_refill_unit"],
      low_peripheral_pulse_volume: obj["low_peripheral_pulse_volume"],
      cool_peripheries: obj["cool_peripheries"],
      two_d_echo_done: obj["two_d_echo_done"],
      two_d_echo_done_if_yes: obj["two_d_echo_done_if_yes"],
      baby_on_ionotropes: obj["baby_on_ionotropes"],
      central_line: obj["central_line"],
      infusion_of_blood_products: obj["infusion_of_blood_products"]
    });
  }

  onInputChange(event) {
    var vim = this;
    var target = event.target || event.srcElement || event.currentTarget;
    if (target.name == 'heart_rate') {
      if (target.value == '2') {
        vim.isHeartRate = false;
        vim.babyCvForm.patchValue({
          heart_rate: 'NA'
        })
        vim.babyCvForm.value["heart_rate"] = 'NA';

        vim.babyCvForm.controls["heart_rate"].clearValidators();
        vim.babyCvForm.controls["heart_rate"].updateValueAndValidity();
      } else {
        vim.isHeartRate = true;
        vim.babyCvForm.controls["heart_rate"].setValidators([Validators.required]);
        vim.babyCvForm.controls["heart_rate"].updateValueAndValidity();
        vim.babyCvForm.patchValue({
          heart_rate: ''
        })
      }
    }

    if (target.name == 'Arterial_BP') {
      if (target.value == '2') {
        vim.isBpArterial = false;
        vim.babyCvForm.patchValue({
          baby_blood_pressure_mean_arterial_bp: 'NA'
        })
        vim.babyCvForm.value["baby_blood_pressure_mean_arterial_bp"] = 'NA';

        vim.babyCvForm.controls["baby_blood_pressure_mean_arterial_bp"].clearValidators();
        vim.babyCvForm.controls["baby_blood_pressure_mean_arterial_bp"].updateValueAndValidity();
      } else {
        vim.babyCvForm.controls["baby_blood_pressure_mean_arterial_bp"].setValidators([Validators.required]);
        vim.babyCvForm.controls["baby_blood_pressure_mean_arterial_bp"].updateValueAndValidity();
        vim.babyCvForm.patchValue({
          baby_blood_pressure_mean_arterial_bp: ''
        })
        vim.isBpArterial = true;
      }
    }

    if (target.name == 'upper_limb') {
      if (target.value == '2') {
        vim.isUpperLimb = false;
        vim.babyCvForm.patchValue({
          baby_blood_pressure_upper_limb: 'NA'
        })
        vim.babyCvForm.value["baby_blood_pressure_upper_limb"] = 'NA';

        vim.babyCvForm.controls["baby_blood_pressure_upper_limb"].clearValidators();
        vim.babyCvForm.controls["baby_blood_pressure_upper_limb"].updateValueAndValidity();
      } else {
        vim.babyCvForm.controls["baby_blood_pressure_upper_limb"].setValidators([Validators.required]);
        vim.babyCvForm.controls["baby_blood_pressure_upper_limb"].updateValueAndValidity();
        vim.babyCvForm.patchValue({
          baby_blood_pressure_upper_limb: ''
        })
        vim.isUpperLimb = true;
      }
    }

    if (target.name == 'lower_limb') {
      if (target.value == '2') {
        vim.isLowerLimb = false;
        vim.babyCvForm.patchValue({
          baby_blood_pressure_lower_limb: 'NA'
        })
        vim.babyCvForm.value["baby_blood_pressure_lower_limb"] = 'NA';

        vim.babyCvForm.controls["baby_blood_pressure_lower_limb"].clearValidators();
        vim.babyCvForm.controls["baby_blood_pressure_lower_limb"].updateValueAndValidity();
      } else {
        vim.babyCvForm.controls["baby_blood_pressure_lower_limb"].setValidators([Validators.required]);
        vim.babyCvForm.controls["baby_blood_pressure_lower_limb"].updateValueAndValidity();
        vim.babyCvForm.patchValue({
          baby_blood_pressure_lower_limb: ''
        })
        vim.isLowerLimb = true;
      }
    }

    if (target.name == 'echo_result') {
      if (target.value == '2') {
        vim.isEchoResult = false;
        vim.babyCvForm.patchValue({
          two_d_echo_done_if_yes: 'NA'
        })
        vim.babyCvForm.value["two_d_echo_done_if_yes"] = 'NA';

        vim.babyCvForm.controls["two_d_echo_done_if_yes"].clearValidators();
        vim.babyCvForm.controls["two_d_echo_done_if_yes"].updateValueAndValidity();
      } else {
        vim.isEchoResult = true;
        vim.babyCvForm.controls["two_d_echo_done_if_yes"].setValidators([Validators.required]);
        vim.babyCvForm.controls["two_d_echo_done_if_yes"].updateValueAndValidity();
        vim.babyCvForm.patchValue({
          two_d_echo_done_if_yes: ''
        })
      }
    }
  }

  // When scroll down the screen  
  onScroll() {
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
    this.submitted = false;
    if (!_.isEmpty(obj)) {
      this.isBabyCvEdit = true;
      this.isEditClicked = true;
      this.updateForm(obj);
    } else {

      this.isBabyCvEdit = true;
      this.createForm(this.id);
    }
  }

  close() {
  }

  babyCVFormSubmit() {
    const vim = this;
    vim.submitted = true;
    if (vim.babyCvForm.invalid) {
      return;
    }
    // vim.commonAsyn.showLoader();

    if (this.babyCvForm.value["heart_rate"] == '') {
      this.babyCvForm.value["heart_rate"] = 'NA';
    }
    if (this.babyCvForm.value["baby_blood_pressure_mean_arterial_bp"] == '') {
      this.babyCvForm.value["baby_blood_pressure_mean_arterial_bp"] = 'NA';
    }
    if (this.babyCvForm.value["baby_blood_pressure_upper_limb"] == '') {
      this.babyCvForm.value["baby_blood_pressure_upper_limb"] = 'NA';
    }
    if (this.babyCvForm.value["baby_blood_pressure_lower_limb"] == '') {
      this.babyCvForm.value["baby_blood_pressure_lower_limb"] = 'NA';
    }
    if (this.babyCvForm.value["two_d_echo_done_if_yes"] == '') {
      this.babyCvForm.value["two_d_echo_done_if_yes"] = 'NA';
    }

    // const newUser = vim.common_api.baby_cv_add(vim.babyCvForm.value);
    // newUser.subscribe(
    //   response => {
    //     vim.reset();
    //     vim.success(response, "babyCVFormSubmit");
    //     vim.isBabyCvEdit = false;
    //   },
    //   error => {
    //     console.error("errro", error);
    //   }
    // );
    this.babyCvForm.value["reading"] = localStorage.getItem('reading');
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
    if (api_type == "babyCVFormSubmit") {
      if (vim.isSuccess(response)) {

        vim.toastr.success(
          "",
          "Information Updated succesfully"
        );
        vim.responseArray = [];
        this.page = 1;
        vim.dataServiceObj = vim.dataService.getOption();
        vim.get_cv(vim.dataServiceObj.study_id, vim.login_hospital['id'], this.page, vim.readingDataService.reading);
      } else {
        if (vim.isAlreadyExist(response)) {
          vim.toastr.warning("Already Exist!!", response["message"]);
        } else {
          vim.errorToasty(response);
        }
      }
    } else if (api_type == "get_cv") {

      if (vim.isSuccess(response)) {
        if (this.page == 1) {
          vim.responseArray = [];
          vim.responseArray = response["response"];
          vim.isBabyCvEdit=false;
          //vim.isBabyCvEdit=false;
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
    if (api_type == "babyCVFormSubmit") {
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

  get_cv(id, hospital_id, page, reading) {
    const vim = this;
    if (vim.temp_study_id == vim.id) {
    } else {
      vim.page = 1;
      vim.temp_study_id = vim.id;
    }
    const newdata = vim.common_api.get_tabs("patient/baby_cv", id, hospital_id, vim.page, reading);

    newdata.subscribe(
      response => {
        vim.success(response, "get_cv");
      },
      error => {
        console.error("errro", error);
      }
    );
  }

  getReadingFormData(formData){
    this.responseArray[0]=formData;
    this.updateForm(this.responseArray[0]);
    this.isBabyCvEdit=true;
  }

  saveReadingFormData(formData){
    this.readingDataService.setReadingFormData('baby_cv',formData);
  }

  goToNextReadingForm(){
    let vim=this;
    vim.saveReadingFormData(vim.babyCvForm['value']);
    vim.readingDataService.setComponentFlag('baby-cns')
    vim.readingDataService.setActiveTab("baby-cns");
    vim.router.navigate(["dashboard/baby-cns"]);
  }

  onChanges(): void {
    this.babyCvForm.statusChanges.subscribe(val => {
      if(val==='INVALID'){
        this.readingDataService.setFormValidationStatus('baby_cv',false)
          if(this.readingDataObj!=undefined){
            this.babyCvForm.value["reading"] = localStorage.getItem('reading');
            this.saveReadingFormData(this.babyCvForm['value']);
          }
      }
      else{
        this.readingDataService.setFormValidationStatus('baby_cv',true)
        if(this.readingDataObj!=undefined){
          this.babyCvForm.value["reading"] = localStorage.getItem('reading');
          this.saveReadingFormData(this.babyCvForm['value']);
        }
      }
    });
  }

  update_cv_form() {
    var vim = this;
    vim.submitted = true;
    if(vim.babyCvForm.invalid) {
      return;
    } else {

      if (this.babyCvForm.value["heart_rate"] == '') {
        this.babyCvForm.value["heart_rate"] = 'NA';
      }
      if (this.babyCvForm.value["baby_blood_pressure_mean_arterial_bp"] == '') {
        this.babyCvForm.value["baby_blood_pressure_mean_arterial_bp"] = 'NA';
      }
      if (this.babyCvForm.value["baby_blood_pressure_upper_limb"] == '') {
        this.babyCvForm.value["baby_blood_pressure_upper_limb"] = 'NA';
      }
      if (this.babyCvForm.value["baby_blood_pressure_lower_limb"] == '') {
        this.babyCvForm.value["baby_blood_pressure_lower_limb"] = 'NA';
      }
      if (this.babyCvForm.value["two_d_echo_done_if_yes"] == '') {
        this.babyCvForm.value["two_d_echo_done_if_yes"] = 'NA';
      }

    vim.common_api.updateFormData('patient/update/baby_cv/', vim.id, vim.readingDataService.reading, vim.babyCvForm.value,vim.loggedInUserId)
    .subscribe(result => {
      if(result['status'] != 200) {
        vim.toastr.error(result['message']);
      } else {
        vim.toastr.success(
          "",
          "Data Updated Succesfully"
        );
        vim.isEditClicked = false;
        vim.get_cv(vim.dataServiceObj.study_id, vim.login_hospital['id'], this.page, vim.readingDataService.reading);
      }
    })
    }
  }

}
