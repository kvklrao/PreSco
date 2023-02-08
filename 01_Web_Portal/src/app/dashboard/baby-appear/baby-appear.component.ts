import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, NavigationEnd } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/service/common/common.service";
import { Common } from "../../shared/service/common/common";
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as _ from "underscore";
import { DataService } from '../../shared/service/data.service';
import {ReadingDataService} from '../../shared/service/reading-data.service';

@Component({
  selector: "app-baby-appear",
  templateUrl: "./baby-appear.component.html",
  styleUrls: ["./baby-appear.component.css"],
  providers: [NgbModalConfig, NgbModal, DatePipe]
})
export class BabyAppearComponent implements OnInit, OnChanges {
  babyApears: FormGroup;
  formRef: any;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  page: number = 1;
  isBabyAppearEdit: boolean = true;
  isEditClicked: boolean = false;
  chkWeightAtBirth: boolean = true;

  isCrySound: boolean = true;
  isHypothermiaUnit: boolean = true;
  isTimeReading: boolean = true;
  isDateReading: boolean = true;

  @Input() id;
  @Input() hospital_id;

  subscription: Subscription;

  getMedicalRecordNumber: string;
  navigationSubscription;
loggedInUserId:number;
  temp_study_id = 0;
  login_hospital: any = {};
  responseArray = [];
  public dataServiceObj;
  public readinDataObj; 
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private common_api: CommonService,
    private modalService: NgbModal,
    private commonAsyn: Common,
    private dataService: DataService,
    private datePipe: DatePipe,
    public readinDataService:ReadingDataService
  ) {
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

  transformDate(date) {
    if (Object.prototype.toString.call(date['reading_date']) === "[object Date]") {
      date['reading_date'] = this.datePipe.transform(date['reading_date'], 'dd/MM/yyyy');
    }
  }

  ngOnInit() {
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
    vim.readinDataObj=vim.readinDataService.getReadingFormData('baby_appears');
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.loggedInUserId=vim.login_hospital['user_id'];
    vim.createForm(vim.dataServiceObj.study_id);
    vim.id = vim.dataServiceObj.study_id;
    // this.subscription = this.common_api.getMedicalRecordNumber().subscribe(message => {
    //   this.getMedicalRecordNumber = message.text;
    // });
    if(vim.readinDataObj!=undefined){
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.getReadingFormData(vim.readinDataObj);
    }
    if(vim.readinDataObj==undefined){
      if (vim.dataServiceObj.study_id != undefined) {
        vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
        vim.get_baby_apears(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readinDataService.reading);
      }
    }

    vim.temp_study_id = vim.id;
    vim. onChanges();
  }

  resetComponent(){
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
    vim.readinDataObj=vim.readinDataService.getReadingFormData('baby_appears');
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.loggedInUserId=vim.login_hospital['user_id'];
    vim.createForm(vim.dataServiceObj.study_id);
    vim.id = vim.dataServiceObj.study_id;
    if(vim.readinDataObj!=undefined){
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.getReadingFormData(vim.readinDataObj);
    }
    if(vim.readinDataObj==undefined){
      if (vim.dataServiceObj.study_id != undefined) {
        vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
        vim.get_baby_apears(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readinDataService.reading);
      }
    }

    vim.temp_study_id = vim.id;
    vim. onChanges();
    this.isEditClicked=false;
  }

  createForm(id) {
    const vim = this;
    vim.isCrySound = true;
    vim.babyApears = vim.formBuilder.group({
      study_id: id,
      reading_date: ["", Validators.required],
      time_of_reading_hours: ["", Validators.required],
      time_of_reading_minute: ["", Validators.required],
      baby_weight_at_birth: ["", Validators.required],
      baby_weight_at_birth_unit: ["Kgs", Validators.required],
      baby_appearance: ["", Validators.required],
      baby_skin_colour: ["", [Validators.required]],
      baby_cry_sound: ["", Validators.required],
      baby_cry_sound_status: ["", Validators.required],
      hypotonia_muscular_response_one_min_after_birth: [
        "",
        Validators.required
      ],
      hypotonia_muscular_response_five_min_after_birth: [
        "",
        Validators.required
      ],
      excessive_sleeping: ["", Validators.required],
      hypothermia: ["", Validators.required],
      hypothermia_status: ["Centigrade", Validators.required],
      hypothermia_status_value: ["", Validators.required],
      baby_feeding_status: ["", Validators.required],
      baby_presence_of_convulsions: ["", Validators.required],
      baby_jaundice: ["", Validators.required],
      breast_feeding_initiation: ["", Validators.required],
      kangaroo_mother_care: ["", Validators.required],
      umbilical_discharge: ["", Validators.required],
      skin_pustules: ["", Validators.required],
    });
  }

  updateForm(obj) {
    const vim = this;
    if (obj["reading_date"] == 'NA') {
      vim.isDateReading = false;
    } else {
      vim.isDateReading = true;
    }

    if (obj["time_of_reading_hours"] == 'NA' || obj["time_of_reading_minute"] == 'NA') {
      vim.isTimeReading = false;
      vim.babyApears.controls["time_of_reading_hours"].clearValidators();
      vim.babyApears.controls["time_of_reading_hours"].updateValueAndValidity();
      vim.babyApears.controls["time_of_reading_minute"].clearValidators();
      vim.babyApears.controls["time_of_reading_minute"].updateValueAndValidity();
    } else {
      vim.isTimeReading = true;
    }

    if (obj["baby_cry_sound_status"] == 'NA') {
      vim.isCrySound = false;
      vim.babyApears.controls["baby_cry_sound_status"].clearValidators();
      vim.babyApears.controls["baby_cry_sound_status"].updateValueAndValidity();
    } else {
      vim.isCrySound = true;
    }
    if (obj["hypothermia_status_value"] == 'NA') {
      vim.babyApears.value["hypothermia_status_value"] = 'NA';
      this.isHypothermiaUnit = false;
      vim.babyApears.controls["hypothermia_status_value"].clearValidators();
      vim.babyApears.controls["hypothermia_status_value"].updateValueAndValidity();
      vim.babyApears.patchValue({
        hypothermia_status_value: 'NA'
      });
    } else {
      vim.babyApears.controls["hypothermia_status_value"].setValidators([Validators.required]);
      vim.babyApears.controls["hypothermia_status_value"].updateValueAndValidity();
      vim.babyApears.patchValue({
        hypothermia_status_value: ''
      })
      this.isHypothermiaUnit = true;

      vim.babyApears.patchValue({
        hypothermia_status_value: obj["hypothermia_status_value"]
      });
    }

    if (obj["baby_weight_at_birth"] == 'NA') {
      vim.babyApears.value["baby_weight_at_birth"] = 'NA';
      this.chkWeightAtBirth = false;
      vim.babyApears.controls["baby_weight_at_birth"].clearValidators();
      vim.babyApears.controls["baby_weight_at_birth"].updateValueAndValidity();
      vim.babyApears.patchValue({
        baby_weight_at_birth: 'NA'
      });
    } else {
      vim.babyApears.controls["baby_weight_at_birth"].setValidators([Validators.required]);
      vim.babyApears.controls["baby_weight_at_birth"].updateValueAndValidity();
      vim.babyApears.patchValue({
        baby_weight_at_birth: ''
      })
      this.chkWeightAtBirth = true;
      vim.babyApears.patchValue({
        baby_weight_at_birth: obj["baby_weight_at_birth"]
      })
    }

    vim.babyApears.patchValue({
      study_id: vim.id,
      reading_date: obj["reading_date"],
      time_of_reading_hours: obj["time_of_reading_hours"],
      time_of_reading_minute: obj["time_of_reading_minute"],
      baby_weight_at_birth: obj["baby_weight_at_birth"],
      baby_weight_at_birth_unit: obj["baby_weight_at_birth_unit"],
      baby_appearance: obj["baby_appearance"],
      baby_skin_colour: obj["baby_skin_colour"],
      baby_cry_sound: obj["baby_cry_sound"],
      baby_cry_sound_status: obj["baby_cry_sound_status"],
      hypotonia_muscular_response_one_min_after_birth:
        obj["hypotonia_muscular_response_one_min_after_birth"],
      hypotonia_muscular_response_five_min_after_birth:
        obj["hypotonia_muscular_response_five_min_after_birth"],
      excessive_sleeping: obj["excessive_sleeping"],
      hypothermia: obj["hypothermia"],
      hypothermia_status: obj["hypothermia_status"],
      baby_feeding_status: obj["baby_feeding_status"],
      baby_presence_of_convulsions: obj["baby_presence_of_convulsions"],
      baby_jaundice: obj["baby_jaundice"],
      breast_feeding_initiation: obj["breast_feeding_initiation"],
      kangaroo_mother_care: obj["kangaroo_mother_care"],
      umbilical_discharge: obj["umbilical_discharge"],
      hypothermia_status_value: obj["hypothermia_status_value"],
      skin_pustules: obj["skin_pustules"],
    });
  }

  onInputChange(event) {
    var vim = this;
    var target = event.target || event.srcElement || event.currentTarget;

    if (target.name == 'DateReading') {
      if (target.value == '2') {
        vim.isDateReading = false;
        vim.babyApears.patchValue({
          reading_date: 'NA'
        })
      } else {
        vim.babyApears.patchValue({
          reading_date: ''
        })
        vim.isDateReading = true;
      }
    }

    if (target.name == 'cry_sound') {
      if (target.value == '2') {
        vim.isCrySound = false;
        vim.babyApears.patchValue({
          baby_cry_sound_status: 'NA'
        })
        vim.babyApears.value["baby_cry_sound_status"] = 'NA';

        vim.babyApears.controls["baby_cry_sound_status"].clearValidators();
        vim.babyApears.controls["baby_cry_sound_status"].updateValueAndValidity();
      } else {
        vim.isCrySound = true;
        vim.babyApears.controls["baby_cry_sound_status"].setValidators([Validators.required]);
        vim.babyApears.controls["baby_cry_sound_status"].updateValueAndValidity();
        vim.babyApears.patchValue({
          baby_cry_sound_status: ''
        })
      }
    }

    if (target.name == 'TimeReading') {
      if (target.value == '2') {
        vim.isTimeReading = false;
        vim.babyApears.patchValue({
          time_of_reading_hours: 'NA',
          time_of_reading_minute: 'NA'
        })
        vim.babyApears.value["time_of_reading_hours"] = 'NA';
        vim.babyApears.value["time_of_reading_minute"] = 'NA';

        vim.babyApears.controls["time_of_reading_hours"].clearValidators();
        vim.babyApears.controls["time_of_reading_hours"].updateValueAndValidity();
        vim.babyApears.controls["time_of_reading_minute"].clearValidators();
        vim.babyApears.controls["time_of_reading_minute"].updateValueAndValidity();
      } else {
        vim.babyApears.controls["time_of_reading_hours"].setValidators([Validators.required]);
        vim.babyApears.controls["time_of_reading_hours"].updateValueAndValidity();
        vim.babyApears.controls["time_of_reading_minute"].setValidators([Validators.required]);
        vim.babyApears.controls["time_of_reading_minute"].updateValueAndValidity();
        vim.babyApears.patchValue({
          time_of_reading_hours: '',
          time_of_reading_minute: ''
        })
        vim.isTimeReading = true;
      }
    }
  }

  // When scroll down the screen  
  onScroll() {
    const vim = this;
    this.page = this.page + 5;
    //this.get_baby_apears(vim.id, vim.hospital_id, vim.page);
  }

  ngOnChanges() {
    this.createForm(this.id);
  }
  reset() {
    this.createForm(null);
  }

  open(content, obj) {
    const vim = this;
    vim.submitted = false;
    if (!_.isEmpty(obj)) {
      this.isBabyAppearEdit = true;
      this.isEditClicked = true;
      vim.updateForm(obj);
    } else {
      this.babyApears.reset();
      this.isBabyAppearEdit = true;
      vim.createForm(this.id);
    }
  }
  close() {
  }

  babyApearsFormSubmit() {
    this.transformDate(this.babyApears.value);
    const vim = this;
    vim.submitted = true;
    
    if (vim.babyApears.invalid) {
      return;
    }
   this.setData();
    this.babyApears.value["reading"] = localStorage.getItem('reading');
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
    if (api_type == "babyApearsFormSubmit") {
      if (vim.isSuccess(response)) {
        vim.toastr.success(
          "",
          "Information Updated succesfully"
        );
        vim.responseArray = [];
        this.page = 1;
        vim.dataServiceObj = vim.dataService.getOption();
        vim.get_baby_apears(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readinDataService.reading);
      } else {
        if (vim.isAlreadyExist(response)) {
          vim.toastr.warning("Already Exist!!", response["message"]);
        } else {
          vim.errorToasty(response);
        }
      }
    } else if (api_type == "get_baby_appears") {
      if (vim.isSuccess(response)) {
        if (this.page == 1) {
          vim.responseArray = [];
          vim.responseArray = response["response"];
          vim.isBabyAppearEdit=false;
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
    if (api_type == "babyApearsFormSubmit") {
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
  /**
   *
   * @param id
   */

  get_baby_apears(id, hospital_id, page, reading) {
    const vim = this;
    if (vim.temp_study_id == vim.id) {

    } else {
      vim.page = 1;
      vim.temp_study_id = vim.id;
    }
    const newdata = vim.common_api.get_tabs("patient/baby_appears", id, hospital_id, page, reading);
    newdata.subscribe(
      response => {
        vim.success(response, "get_baby_appears");
      },
      error => {
        console.error("errro", error);
      }
    );
  }


  changeDropdown(dropdownVal, dropdownId) {
    var vim = this;

    if (dropdownId == 'hypothermia_status_value_id') {
      if (dropdownVal == 'NA') {
        this.isHypothermiaUnit = false;
        vim.babyApears.value["hypothermia_status_value"] = 'NA';
        vim.babyApears.controls["hypothermia_status_value"].clearValidators();
        vim.babyApears.controls["hypothermia_status_value"].updateValueAndValidity();
        vim.babyApears.patchValue({
          hypothermia_status_value: 'NA'
        });

      } else {
        vim.babyApears.controls["hypothermia_status_value"].setValidators([Validators.required]);
        vim.babyApears.controls["hypothermia_status_value"].updateValueAndValidity();
        vim.babyApears.patchValue({
          hypothermia_status_value: ''
        })
        this.isHypothermiaUnit = true;
      }
    }

    if (dropdownId == 'babyWeightAtBirthId') {
      if (dropdownVal == 'NA') {
        vim.chkWeightAtBirth = false;
        vim.babyApears.patchValue({
          baby_weight_at_birth: 'NA'
        });

        vim.babyApears.value["baby_weight_at_birth"] = 'NA';
        vim.babyApears.controls["baby_weight_at_birth"].clearValidators();
        vim.babyApears.controls["baby_weight_at_birth"].updateValueAndValidity();
      } else {
        vim.chkWeightAtBirth = true;
        vim.babyApears.patchValue({
          baby_weight_at_birth: ''
        })
        vim.babyApears.controls["baby_weight_at_birth"].setValidators([Validators.required]);
        vim.babyApears.controls["baby_weight_at_birth"].updateValueAndValidity();
      }
    }
  }

  getReadingFormData(formData){
    this.responseArray[0]=formData;
    this.updateForm(this.responseArray[0]);
    this.isBabyAppearEdit=true;
    //console.log(this.responseArray[0],'baby_appears')
  }

  saveReadingFormData(formData){
    this.readinDataService.setReadingFormData('baby_appears',formData);
  }

  goToNextReadingForm(){
    let vim=this;
    vim.saveReadingFormData(this.babyApears['value']);
    vim.readinDataService.setComponentFlag('baby-resp')
    vim.readinDataService.setActiveTab("baby-respiratory")
    vim.router.navigate(["dashboard/baby-respiratory"]);
  }

  onChanges(): void {
    this.babyApears.statusChanges.subscribe(val => {
      if(val==='INVALID'){
        this.readinDataService.setFormValidationStatus('baby_appears',false)
          if(this.readinDataObj!=undefined){
            this.babyApears.value["reading"] = localStorage.getItem('reading');
            this.saveReadingFormData(this.babyApears['value']);
          }
      }
      else{
        this.readinDataService.setFormValidationStatus('baby_appears',true)
        if(this.readinDataObj!=undefined){
          this.babyApears.value["reading"] = localStorage.getItem('reading');
          this.saveReadingFormData(this.babyApears['value']);
        }
      }
    });
  }

  update_appears_form() {
    this.transformDate(this.babyApears.value);
    var vim = this;
    vim.submitted = true;
    if(vim.babyApears.invalid) {
      return;
    } else {
  this.setData();
    vim.common_api.updateFormData('patient/update/baby_appears/', vim.id, vim.readinDataService.reading, vim.babyApears.value,vim.loggedInUserId)
    .subscribe(result => {
      if(result['status'] != 200) {
        vim.toastr.error(result['message']);
      } else {
        vim.toastr.success(
          "",
          "Data Updated Succesfully"
        );
        vim.isEditClicked = false;
        vim.get_baby_apears(vim.dataServiceObj.study_id, vim.login_hospital['id'], this.page, vim.readinDataService.reading);
      }
    })
    }
  }
  setData(){
    if (this.babyApears.value["baby_cry_sound_status"] == '') {
      this.babyApears.value["baby_cry_sound_status"] = 'NA';
    }

    if (this.babyApears.value["time_of_reading_hours"] == '') {
      this.babyApears.value["time_of_reading_hours"] = 'NA';
    }

    if (this.babyApears.value["time_of_reading_minute"] == '') {
      this.babyApears.value["time_of_reading_minute"] = 'NA';
    }

    if (this.babyApears.value["hypothermia_status_value"] == '') {
      this.babyApears.value["hypothermia_status_value"] = 'NA';
    }

    if (this.babyApears.value["baby_weight_at_birth"] == '') {
      this.babyApears.value["baby_weight_at_birth"] = 'NA';
    }
  }
}
