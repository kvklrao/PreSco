import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from "../../shared/service/common/common.service";
import * as _ from "underscore";
import { Common } from "../../shared/service/common/common";
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { DataService } from '../../shared/service/data.service';
import { ReadingDataService } from '../../shared/service/reading-data.service';

@Component({
  selector: "app-antibiotic-administration",
  templateUrl: "./antibiotic-administration.component.html",
  styleUrls: ["./antibiotic-administration.component.css"],
  providers: [NgbModalConfig, NgbModal, DatePipe]
})
export class AntibioticAdministrationComponent implements OnInit {

  public customPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z, \]') } };

  antibioticAdministrationForm: FormGroup;
  formRef: any;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  isAntibioticEdit = true;
  responseArray = [];
  page: number = 1;

  isDateAdministration: boolean = true;
  isTimeAdministration: boolean = true;
  isAntibioticName: boolean = true;
  isGradeAntibiotic: boolean = true;
  isDateBloodSample: boolean = true;
  isTimeBloodSample: boolean = true;

  isAntibioticFreeField: boolean = false;

  // for multiselect
  antibioticNameList = [];
  settings = {};
  selectedItems = [];

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
loggedInUserId:number;
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
    if (Object.prototype.toString.call(date['date_of_administration_of_antiobiotic']) === "[object Date]") {
      date['date_of_administration_of_antiobiotic'] = this.datePipe.transform(date['date_of_administration_of_antiobiotic'], 'dd/MM/yyyy');
    }
    if (Object.prototype.toString.call(date['date_of_blood_samples_sent_for_culture_test']) === "[object Date]") {
      date['date_of_blood_samples_sent_for_culture_test'] = this.datePipe.transform(date['date_of_blood_samples_sent_for_culture_test'], 'dd/MM/yyyy');
    }
  }

  ngOnInit() {
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
    vim.readingDataObj=vim.readingDataService.getReadingFormData('baby_antibiotic') ;
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
      vim.get_antibiotic(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
    }
   // vim.onChanges();
}
    vim.temp_study_id = vim.id;

    this.antibioticNameList = [
      { "id": 1, "itemName": "Amikacin" },
      { "id": 2, "itemName": "Piptaz" },
      { "id": 3, "itemName": "Vancomycin" },
      { "id": 4, "itemName": "Augmentic" },
      { "id": 5, "itemName": "Cefotaxim" },
      { "id": 6, "itemName": "Tozobactum" },
      { "id": 7, "itemName": "Other" },
      { "id": 8, "itemName": "NA" }
    ];

    this.settings = {
      limitSelection: false,
      badgeShowLimit: 2
    };
    vim.onChanges();
  }

  createForm(id) {
    const vim = this;
    vim.isDateAdministration = true;
    vim.isTimeAdministration = true;
    vim.isAntibioticName = true;
    vim.isGradeAntibiotic = true;
    vim.isDateBloodSample = true;
    vim.isTimeBloodSample = true;

    vim.selectedItems = [];

    this.antibioticAdministrationForm = this.formBuilder.group({
      study_id: [vim.id],
      antibiotic_given: ["", Validators.required],
      date_of_administration_of_antiobiotic: ["", [Validators.required]],
      time_of_administration_of_antiobiotic_hours: ["", Validators.required],
      time_of_administration_of_antiobiotic_minute: ["", Validators.required],
      antibiotic_name: ["", Validators.required],
      antibiotic_name_if_other: [""],
      date_of_blood_samples_sent_for_culture_test: ["", Validators.required],
      time_of_blood_samples_sent_for_culture_test_hours: [
        "",
        Validators.required
      ],
      time_of_blood_samples_sent_for_culture_test_minute: [
        "",
        Validators.required
      ],
      blood_sample_taken_prior_to_antiobiotic_administration: [
        "",
        Validators.required
      ]
    });
  }

  updateForm(obj) {
    const vim = this;
    if (obj["antibiotic_name_if_other"] != '') {
      vim.antibioticAdministrationForm.controls["antibiotic_name_if_other"].setValidators([Validators.required]);
      vim.antibioticAdministrationForm.controls["antibiotic_name_if_other"].updateValueAndValidity();
      this.isAntibioticFreeField = true;
    } else {
      this.isAntibioticFreeField = false;
    }

    if (obj["date_of_administration_of_antiobiotic"] == 'NA') {
      vim.isDateAdministration = false;
    } else {
      vim.isDateAdministration = true;
    }

    if (obj["time_of_administration_of_antiobiotic_hours"] == 'NA' || obj["time_of_administration_of_antiobiotic_minute"] == 'NA') {
      vim.isTimeAdministration = false;
      vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_hours"].clearValidators();
      vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_hours"].updateValueAndValidity();
      vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_minute"].clearValidators();
      vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_minute"].updateValueAndValidity();
    } else {
      vim.isTimeAdministration = true;
    }

    if (obj["antibiotic_name"] == 'NA') {
      vim.isAntibioticName = false;
    } else {
      vim.isAntibioticName = true;
      vim.selectedItems = [];
    }

    if (obj["date_of_blood_samples_sent_for_culture_test"] == 'NA') {
      vim.isDateBloodSample = false;
    } else {
      vim.isDateBloodSample = true;
    }

    if (obj["time_of_blood_samples_sent_for_culture_test_hours"] == 'NA' || obj["time_of_blood_samples_sent_for_culture_test_minute"] == 'NA') {
      vim.isTimeBloodSample = false;
      vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_hours"].clearValidators();
      vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_hours"].updateValueAndValidity();
      vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_minute"].clearValidators();
      vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_minute"].updateValueAndValidity();
    } else {
      vim.isTimeBloodSample = true;
    }

    if (/^[\],:{}\s]*$/.test(obj["antibiotic_name"].replace(/\\["\\\/bfnrtu]/g, '@').
      replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
      replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
      vim.selectedItems = JSON.parse(obj["antibiotic_name"]);
    } else {
      vim.selectedItems = [];
    }

    vim.antibioticAdministrationForm.patchValue({
      study_id: vim.id,
      antibiotic_given: obj["antibiotic_given"],
      date_of_administration_of_antiobiotic:
        obj["date_of_administration_of_antiobiotic"],
      time_of_administration_of_antiobiotic_hours:
        obj["time_of_administration_of_antiobiotic_hours"],
      time_of_administration_of_antiobiotic_minute:
        obj["time_of_administration_of_antiobiotic_minute"],
      antibiotic_name: obj["antibiotic_name"],
      antibiotic_name_if_other: obj["antibiotic_name_if_other"],
      date_of_blood_samples_sent_for_culture_test:
        obj["date_of_blood_samples_sent_for_culture_test"],
      time_of_blood_samples_sent_for_culture_test_hours:
        obj["time_of_blood_samples_sent_for_culture_test_hours"],
      time_of_blood_samples_sent_for_culture_test_minute:
        obj["time_of_blood_samples_sent_for_culture_test_minute"],
      blood_sample_taken_prior_to_antiobiotic_administration:
        obj["blood_sample_taken_prior_to_antiobiotic_administration"]
    });
  }

  onInputChange(event) {
    var vim = this;
    var target = event.target || event.srcElement || event.currentTarget;
    if (target.name == 'DateAdministration') {
      if (target.value == '2') {
        vim.isDateAdministration = false;
        vim.antibioticAdministrationForm.patchValue({
          date_of_administration_of_antiobiotic: 'NA'
        })
      } else {
        vim.antibioticAdministrationForm.patchValue({
          date_of_administration_of_antiobiotic: ''
        })
        vim.isDateAdministration = true;
      }
    }

    if (target.name == 'TimeAdministration') {
      if (target.value == '2') {
        vim.isTimeAdministration = false;
        vim.antibioticAdministrationForm.patchValue({
          time_of_administration_of_antiobiotic_hours: 'NA',
          time_of_administration_of_antiobiotic_minute: 'NA'
        })
        vim.antibioticAdministrationForm.value["time_of_administration_of_antiobiotic_hours"] = 'NA';
        vim.antibioticAdministrationForm.value["time_of_administration_of_antiobiotic_minute"] = 'NA';

        vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_hours"].clearValidators();
        vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_hours"].updateValueAndValidity();
        vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_minute"].clearValidators();
        vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_minute"].updateValueAndValidity();
      } else {
        vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_hours"].setValidators([Validators.required]);
        vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_hours"].updateValueAndValidity();
        vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_minute"].setValidators([Validators.required]);
        vim.antibioticAdministrationForm.controls["time_of_administration_of_antiobiotic_minute"].updateValueAndValidity();
        vim.antibioticAdministrationForm.patchValue({
          time_of_administration_of_antiobiotic_hours: '',
          time_of_administration_of_antiobiotic_minute: ''
        })
        vim.isTimeAdministration = true;
      }
    }

    if (target.name == 'antibiotic_name') {
      if (target.value == '2') {
        vim.isAntibioticName = false;
        this.isAntibioticFreeField = false;
        vim.antibioticAdministrationForm.patchValue({
          antibiotic_name: 'NA'
        })
        this.antibioticAdministrationForm.patchValue({
          antibiotic_name_if_other: ''
        })
        this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].clearValidators();
        this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].updateValueAndValidity();
      } else {
        vim.selectedItems = [];
        vim.isAntibioticName = true;
      }
    }

    if (target.name == 'date_of_blood') {
      if (target.value == '2') {
        vim.isDateBloodSample = false;
        vim.antibioticAdministrationForm.patchValue({
          date_of_blood_samples_sent_for_culture_test: 'NA'
        })
      } else {
        vim.antibioticAdministrationForm.patchValue({
          date_of_blood_samples_sent_for_culture_test: ''
        })
        vim.isDateBloodSample = true;
      }
    }

    if (target.name == 'time_of_blood') {
      if (target.value == '2') {
        vim.isTimeBloodSample = false;
        vim.antibioticAdministrationForm.patchValue({
          time_of_blood_samples_sent_for_culture_test_hours: 'NA',
          time_of_blood_samples_sent_for_culture_test_minute: 'NA'
        })
        vim.antibioticAdministrationForm.value["time_of_blood_samples_sent_for_culture_test_hours"] = 'NA';
        vim.antibioticAdministrationForm.value["time_of_blood_samples_sent_for_culture_test_minute"] = 'NA';

        vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_hours"].clearValidators();
        vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_hours"].updateValueAndValidity();
        vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_minute"].clearValidators();
        vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_minute"].updateValueAndValidity();
      } else {
        vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_hours"].setValidators([Validators.required]);
        vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_hours"].updateValueAndValidity();
        vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_minute"].setValidators([Validators.required]);
        vim.antibioticAdministrationForm.controls["time_of_blood_samples_sent_for_culture_test_minute"].updateValueAndValidity();
        vim.antibioticAdministrationForm.patchValue({
          time_of_blood_samples_sent_for_culture_test_hours: '',
          time_of_blood_samples_sent_for_culture_test_minute: ''
        })
        vim.isTimeBloodSample = true;
      }
    }
  }

  onItemSelect(item: any) {
    if (item.itemName == 'Other') {
      this.isAntibioticFreeField = true;
      this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].setValidators([Validators.required]);
      this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].updateValueAndValidity();
    }
  }

  OnItemDeSelect(item: any) {
    if (item.itemName == 'Other') {
      this.antibioticAdministrationForm.patchValue({
        antibiotic_name_if_other: ''
      })
      this.isAntibioticFreeField = false;
      this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].clearValidators();
      this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].updateValueAndValidity();
    }
  }

  onSelectAll(items: any) {
    this.isAntibioticFreeField = true;
    this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].setValidators([Validators.required]);
    this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].updateValueAndValidity();
  }

  onDeSelectAll(items: any) {
    this.antibioticAdministrationForm.patchValue({
      antibiotic_name_if_other: '',
      antibiotic_name:''
    })
    this.isAntibioticFreeField = false;
    this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].clearValidators();
    this.antibioticAdministrationForm.controls["antibiotic_name_if_other"].updateValueAndValidity();
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
      this.isAntibioticEdit = true;
      this.updateForm(obj);
      this.isEditClicked=true;
    } else {
      this.isAntibioticEdit = true;
      this.createForm(this.id);
    }
  }

  antibioticFormSubmit() {
    const vim = this;
    vim.transformDate(vim.antibioticAdministrationForm.value);
    vim.submitted = true;
    if (vim.antibioticAdministrationForm.invalid) {
      return;
    }
    this.antibioticAdministrationForm.value["reading"] = localStorage.getItem('reading');
   this.setData()
   vim.goToNextReadingForm();
  }
 
  success(response, api_type) {
    const vim = this;
    if (api_type == "get_antibiotic") {
      if (vim.isSuccess(response)) {
        if (this.page == 1) {
          vim.responseArray = [];
          vim.responseArray = response["response"];
        } 
        vim.commonAsyn.isHide();
      } else {
        vim.responseArray = [];
        vim.commonAsyn.isHide();
        if (vim.isAlreadyExist(response)) {
        } else {  }
      }
    }
  }

  isAlphabet(event) {
    var regex = new RegExp("^[a-zA-Z- \b]+$");
    var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

    if (!regex.test(key)) {
      event.preventDefault();
      return false;
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
    if (api_type == "antibioticFormSubmit") {
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

  get_antibiotic(id, hospital_id, page, reading) {
    const vim = this;
    if (vim.temp_study_id == vim.id) {

    } else {
      vim.page = 1;
      vim.temp_study_id = vim.id;
    }
    const newdata = vim.common_api.get_tabs("patient/baby_antibiotic", id, hospital_id, page, reading);
    newdata.subscribe(
      response => {
        vim.success(response, "get_antibiotic");
        vim.isAntibioticEdit = false;
      },
      error => {
        console.error("errro", error);
      }
    );
  }
  getReadingFormData(formData){
    this.responseArray[0]=formData;
    this.checkMultiselectData();
    this.updateForm(this.responseArray[0]);
    this.isAntibioticEdit=true;
  }

  saveReadingFormData(formData){
    this.checkAntibioticName(formData);
    this.readingDataService.setReadingFormData('baby_antibiotic',formData);
  }

  goToNextReadingForm(){
    let vim=this;
    vim.saveReadingFormData(vim.antibioticAdministrationForm['value']);
    vim.readingDataService.setComponentFlag('baby-final')
    vim.readingDataService.setActiveTab("final-diagnosis");
    vim.router.navigate(["dashboard/final-diagnosis"]);
  }

  onChanges(): void {
    if(this.readingDataObj!=undefined){
    this.antibioticAdministrationForm.statusChanges.subscribe(val => {
      if(val==='INVALID'){
        this.readingDataService.setFormValidationStatus('baby_antibiotic',false)
          if(this.readingDataObj!=undefined){
            this.antibioticAdministrationForm.value["reading"] = localStorage.getItem('reading');
            this.saveReadingFormData(this.antibioticAdministrationForm['value']);
          }
      }
      else{
        this.readingDataService.setFormValidationStatus('baby_antibiotic',true)
        if(this.readingDataObj!=undefined){
          this.antibioticAdministrationForm.value["reading"] = localStorage.getItem('reading');
          this.saveReadingFormData(this.antibioticAdministrationForm['value']);
        }
      }
    });
  }
 }

  setFormValidationAndValue(name,flag){
    this.readingDataService.setFormValidationStatus(name,flag)
    if(this.readingDataObj!=undefined){
      this.saveReadingFormData(this.antibioticAdministrationForm['value']);
    }
  }


  updateAntibioticForm(){
   this.setData();
    if(!this.antibioticAdministrationForm.valid){
      return ;
    }
    else{
      this.common_api.updateFormData('patient/update/baby_antibiotic/',this.id,this.readingDataService.reading,this.antibioticAdministrationForm['value'],this.loggedInUserId).subscribe(result=>{
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
    this.get_antibiotic(this.dataServiceObj.study_id, this.login_hospital['id'], this.page, this.readingDataService.reading);
    this.isEditClicked=false;
  //  this.saveReadingFormData(undefined);
  }

  checkMultiselectData(){
    if(typeof this.responseArray[0]['antibiotic_name'] != 'string'){
      this.responseArray[0]['antibiotic_name']=JSON.stringify(this.responseArray[0]['antibiotic_name']);
      }
  }

  checkAntibioticName(formData){
    if(typeof formData['antibiotic_name'] != 'string'){
      formData['antibiotic_name']=JSON.stringify(formData['antibiotic_name']);
      }
  }

  setData(){
    let vim=this;
    vim.transformDate(vim.antibioticAdministrationForm.value);
    if (vim.antibioticAdministrationForm.controls["antibiotic_name"].value == 'NA') {
      vim.antibioticAdministrationForm.value["antibiotic_name"] = 'NA';
    } else {
      vim.antibioticAdministrationForm.value["antibiotic_name"] = JSON.stringify(vim.selectedItems);
    }

    if (this.antibioticAdministrationForm.value["time_of_administration_of_antiobiotic_hours"] == '') {
      this.antibioticAdministrationForm.value["time_of_administration_of_antiobiotic_hours"] = 'NA';
    }

    if (this.antibioticAdministrationForm.value["time_of_administration_of_antiobiotic_minute"] == '') {
      this.antibioticAdministrationForm.value["time_of_administration_of_antiobiotic_minute"] = 'NA';
    }

    if (this.antibioticAdministrationForm.value["time_of_blood_samples_sent_for_culture_test_hours"] == '') {
      this.antibioticAdministrationForm.value["time_of_blood_samples_sent_for_culture_test_hours"] = 'NA';
    }

    if (this.antibioticAdministrationForm.value["time_of_blood_samples_sent_for_culture_test_minute"] == '') {
      this.antibioticAdministrationForm.value["time_of_blood_samples_sent_for_culture_test_minute"] = 'NA';
    }
  }
}
