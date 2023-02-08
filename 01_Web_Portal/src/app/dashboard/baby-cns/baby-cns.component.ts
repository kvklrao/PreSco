import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/service/common/common.service";
import { Common } from "../../shared/service/common/common";
import { Subscription } from 'rxjs';
import * as _ from "underscore";
import { DataService } from '../../shared/service/data.service';
import { ReadingDataService } from '../../shared/service/reading-data.service';

@Component({
  selector: "app-baby-cns",
  templateUrl: "./baby-cns.component.html",
  styleUrls: ["./baby-cns.component.css"]
})
export class BabyCnsComponent implements OnInit {
  babyCnsForm: FormGroup;
  formRef: any;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  responseArray = [];
  page: number = 1;
  isEdit: boolean = true;

  @Input() id;
  @Input() hospital_id;
  subscription: Subscription;

  getMedicalRecordNumber: string;
  temp_study_id = 0;
  loggedInUserId:number;
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
    vim.readingDataObj=vim.readingDataService.getReadingFormData('baby_cns') ;
    vim.login_hospital = JSON.parse(
      localStorage.getItem("login_hospital"));
      vim.loggedInUserId=vim.login_hospital['user_id'];
    vim.id = vim.dataServiceObj.study_id;
    vim.createForm(vim.dataServiceObj.study_id);
    vim.temp_study_id = vim.id;
    if(vim.readingDataObj!=undefined){
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.getReadingFormData(this.readingDataObj);
   }
     else{
     if ( vim.dataServiceObj.study_id != undefined) {
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.get_baby_cns(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
    }
    vim.onChanges();
}
    

    this.subscription = this.common_api.getMedicalRecordNumber().subscribe(message => {
      this.getMedicalRecordNumber = message.text;
    });
  }

  createForm(id) {
    const vim = this;
    this.babyCnsForm = this.formBuilder.group({
      study_id: [vim.id],
      features_of_encephalopathy: ["", Validators.required],
      seizures: ["", [Validators.required]],
      abnormal_movements_like_tonic_posturing: ["", Validators.required],
      af_bulge: ["", Validators.required],
      baby_movement: ["", Validators.required]


    });
  }

  updateForm(obj) {
    const vim = this;
    vim.babyCnsForm.patchValue({
      study_id: vim.id,
      features_of_encephalopathy: obj["features_of_encephalopathy"],
      seizures: obj["seizures"],
      abnormal_movements_like_tonic_posturing:
        obj["abnormal_movements_like_tonic_posturing"],
      af_bulge: obj["af_bulge"],
      baby_movement: obj["baby_movement"]


    });
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
      this.isEdit = true;
      this.updateForm(obj);
      this.isEditClicked=true;
    } else {
      this.isEdit = true;
      this.createForm(this.id);
    }
  }

  cnsFormSubmit() {
    const vim = this;
    vim.submitted = true;
    if (vim.babyCnsForm.invalid) {
      return;
    }
   // vim.commonAsyn.showLoader();
    vim.babyCnsForm.value["tab_name"] = "baby_cns_add";
    // const newUser = vim.common_api.baby_cns_add(vim.babyCnsForm.value);
    // newUser.subscribe(
    //   response => {
    //     vim.reset();
    //     vim.success(response, "cnsFormSubmit");
    //   },
    //   error => {
    //     console.error("errro", error);
    //   }
    // );
    this.babyCnsForm.value["reading"] = localStorage.getItem('reading');
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
    if (api_type == "cnsFormSubmit") {
      if (vim.isSuccess(response)) {
        vim.toastr.success(
          "",
          "Information Updated succesfully"
        );
        vim.responseArray = [];
        this.page = 1;
        vim.dataServiceObj = vim.dataService.getOption();
        vim.get_baby_cns(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
      } else {
        if (vim.isAlreadyExist(response)) {
          vim.toastr.warning("Already Exist!!", response["message"]);
        } else {
          vim.errorToasty(response);
        }
      }
    } else if (api_type == "get_baby_cns") {
      if (vim.isSuccess(response)) {
        if (this.page == 1) {
          vim.responseArray = [];
          vim.responseArray = response["response"];
          vim.isEdit=false;
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
          // vim.errorToasty(response);
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
    if (api_type == "cnsFormSubmit") {
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

  get_baby_cns(id, hospital_id, page, reading) {
    const vim = this;
    if (vim.temp_study_id == vim.id) {

    } else {
      vim.page = 1;
      vim.temp_study_id = vim.id;
    }
    const newdata = vim.common_api.get_tabs("patient/baby_cns", id, hospital_id, page, reading);
    newdata.subscribe(
      response => {
        vim.success(response, "get_baby_cns");
        vim.isEdit = false;
        vim.isEditClicked=false;
      },
      error => {
        console.error("errro", error);
      }
    );
  }
  getReadingFormData(formData){
    this.responseArray[0]=formData;
    this.updateForm(this.responseArray[0]);
    this.isEdit=true;
  }

  saveReadingFormData(formData){
    this.readingDataService.setReadingFormData('baby_cns',formData);
  }

  goToNextReadingForm(){
    let vim=this;
    vim.saveReadingFormData(vim.babyCnsForm['value']);
    vim.readingDataService.setComponentFlag('baby-git')
    vim.readingDataService.setActiveTab("baby-gi-tract");
    vim.router.navigate(["dashboard/baby-gi-tract"]);
  }

  onChanges(): void {
    this.babyCnsForm.statusChanges.subscribe(val => {
      if(val==='INVALID'){
        this.readingDataService.setFormValidationStatus('baby_cns',false)
          if(this.readingDataObj!=undefined){
            this.babyCnsForm.value["reading"] = localStorage.getItem('reading');
            this.saveReadingFormData(this.babyCnsForm['value']);
          }
      }
      else{
        this.readingDataService.setFormValidationStatus('baby_cns',true)
        if(this.readingDataObj!=undefined){
          this.babyCnsForm.value["reading"] = localStorage.getItem('reading');
          this.saveReadingFormData(this.babyCnsForm['value']);
        }
      }
    });
  }

  updateCNSForm(){
    if(!this.babyCnsForm.valid){
      return ;
    }
    else{
      this.common_api.updateFormData('patient/update/baby_cns/',this.id,this.readingDataService.reading,this.babyCnsForm['value'],this.loggedInUserId).subscribe(result=>{
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
    this.get_baby_cns(this.dataServiceObj.study_id, this.login_hospital['id'], this.page, this.readingDataService.reading);
    this.isEditClicked=false;
  //  this.saveReadingFormData(undefined);
  }
}
