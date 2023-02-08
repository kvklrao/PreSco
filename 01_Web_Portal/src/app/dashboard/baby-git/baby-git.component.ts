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
  selector: "app-baby-git",
  templateUrl: "./baby-git.component.html",
  styleUrls: ["./baby-git.component.css"],
  providers: [NgbModalConfig, NgbModal]
})
export class BabyGitComponent implements OnInit, OnChanges {
  babyGitForm: FormGroup;
  formRef: any; submitted = false; already_exist_status = 422; success_status = 200; responseArray = []; page: number = 1; isGitFormEdit: boolean = true;
  getMedicalRecordNumber: string; isEditClicked: boolean = false; isStools: boolean = true; @Input() id; @Input() hospital_id;
  subscription: Subscription; temp_study_id = 0; login_hospital: any = {}; content: any;
  public dataServiceObj;
  public readingDataObj;
  loggedInUserId:number;
  constructor(
    private formBuilder: FormBuilder, private router: Router, private toastr: ToastrService, private common_api: CommonService,
    private modalService: NgbModal, private commonAsyn: Common, private dataService: DataService,public readingDataService: ReadingDataService) {
    this.dataServiceObj = dataService.getOption();}

  ngOnInit() {
    const vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.readingDataObj = vim.readingDataService.getReadingFormData('baby_git');
    vim.temp_study_id = vim.id;
    vim.id = vim.dataServiceObj.study_id;
    vim.createForm(vim.dataServiceObj.study_id);
    if (vim.readingDataObj != undefined) {
      vim.getMedicalRecordNumber=vim.dataServiceObj.baby_medical_record_number;
      vim.getReadingFormData(this.readingDataObj);
    } else {
        if (vim.dataServiceObj.study_id != undefined) {
          vim.getMedicalRecordNumber = vim.dataServiceObj.baby_medical_record_number;
          vim.get_baby_git(vim.dataServiceObj.study_id, vim.login_hospital['id'], vim.page, vim.readingDataService.reading);
        }
    }
    vim.onChanges();
  }

  createForm(id) {
    const vim = this;
    vim.isStools = true;

    this.babyGitForm = this.formBuilder.group({
      study_id: [vim.id],
      abdominal_dystension: ["", Validators.required],
      frequency_of_stools: ["", [Validators.required]],
      diarrhea: ["", Validators.required],
      vomiting: ["", Validators.required],
      feeding_intolerance: ["", Validators.required],
    });
  }

  updateForm(obj) {
    const vim = this;
    if (obj["frequency_of_stools"] == 'NA') {
      vim.isStools = false;
      vim.clearValidators('frequency_of_stools')
    } else {
      vim.isStools = true;
      vim.setValidators('frequency_of_stools');
    }
    vim.babyGitForm.patchValue({
      study_id: vim.id,
      abdominal_dystension: obj["abdominal_dystension"],
      frequency_of_stools: obj["frequency_of_stools"],
      diarrhea: obj["diarrhea"],
      vomiting: obj["vomiting"],
      feeding_intolerance: obj["feeding_intolerance"],
      baby_movement: obj["baby_movement"]
    });
  }
  onInputChange(event) {
    var vim = this;
    var target = event.target || event.srcElement || event.currentTarget;
    if (target.name == 'Frequency') {
      if (target.value == '2') {
        vim.isStools = false;
        vim.babyGitForm.patchValue({frequency_of_stools: 'NA'})
        vim.babyGitForm.value["frequency_of_stools"] = 'NA';
        vim.clearValidators('frequency_of_stools');
      } else {
        vim.isStools = true;
        vim.setValidators('frequency_of_stools');
        vim.babyGitForm.patchValue({ frequency_of_stools: ''})
      }
    }
  }
  ngOnChanges() { this.createForm(this.id);}

  reset() { this.createForm(null);}

  open(content, obj) {
    this.submitted = false;
    if (!_.isEmpty(obj)) {
      this.isGitFormEdit = true; this.isEditClicked = true;
      this.updateForm(obj);
    } else {
      this.isGitFormEdit = true;
      this.createForm(this.id);
    }
  }
  babyGitFormSubmit() {
    const vim = this;
    vim.submitted = true;
    if (vim.babyGitForm.invalid) {return;}
    if (this.babyGitForm.value["frequency_of_stools"] == '') {
      this.babyGitForm.value["frequency_of_stools"] = 'NA';
    }
    vim.babyGitForm.value["tab_name"] = "baby_git";
    vim.babyGitForm.value["reading"] = localStorage.getItem('reading');
    vim.goToNextReadingForm();
  }
  success(response, api_type) {
    const vim = this;
     if (api_type == "get_baby_git") {
          vim.responseArray = [];
          vim.responseArray = response["response"];
          vim.isGitFormEdit = false;
        vim.commonAsyn.isHide();   
    }
  }

  get_baby_git(id, hospital_id, page, reading) {
    const vim = this;
    if (vim.temp_study_id == vim.id) {
    } else { vim.page = 1;vim.temp_study_id = vim.id;}
    const newdata = vim.common_api.get_tabs("patient/baby_git", id, hospital_id, page, reading);
    newdata.subscribe(
      response => { vim.success(response, "get_baby_git"); vim.isGitFormEdit = false;}, 
      error => { console.error("errro", error);}
    );
  }
  getReadingFormData(formData) {
    this.responseArray[0] = formData; this.updateForm(this.responseArray[0]); this.isGitFormEdit = true;
  }
  saveReadingFormData(formData) {
    this.readingDataService.setReadingFormData('baby_git', formData);
  }
  goToNextReadingForm(){
    let vim=this;
    vim.saveReadingFormData(vim.babyGitForm['value']);
    vim.readingDataService.setComponentFlag('baby-investigation')
    vim.readingDataService.setActiveTab("baby-investigation")
    vim.router.navigate(["dashboard/baby-investigation"]);
  }
  onChanges(): void {
    this.babyGitForm.statusChanges.subscribe(val => {
      if(val==='INVALID'){
        this.readingDataService.setFormValidationStatus('baby_git',false)
          if(this.readingDataObj!=undefined){
            this.babyGitForm.value["reading"] = localStorage.getItem('reading');
            this.saveReadingFormData(this.babyGitForm['value']);
          }
      } else {
        this.readingDataService.setFormValidationStatus('baby_git',true)
        if(this.readingDataObj!=undefined){
          this.babyGitForm.value["reading"] = localStorage.getItem('reading');
          this.saveReadingFormData(this.babyGitForm['value']);
        }
      }
    });
  }
  update_git_form() {
    var vim = this;
    vim.submitted = true;
    if(vim.babyGitForm.invalid) { return;} 
    else {
      if (this.babyGitForm.value["frequency_of_stools"] == '') {
        this.babyGitForm.value["frequency_of_stools"] = 'NA';
      }
      vim.babyGitForm.value["tab_name"] = "baby_git";
    vim.common_api.updateFormData('patient/update/baby_git/', vim.id, vim.readingDataService.reading, vim.babyGitForm.value,vim.loggedInUserId)
    .subscribe(result => {
      if(result['status'] != 200) { vim.toastr.error(result['message']);} 
      else {
        vim.toastr.success("", "Data Updated Succesfully");
        vim.isEditClicked = false;
        vim.get_baby_git(vim.dataServiceObj.study_id, vim.login_hospital['id'], this.page, vim.readingDataService.reading);
      }
    })
    }
  }
  setValidators(filedName){
    this.babyGitForm.controls[filedName].setValidators([Validators.required]);
    this.babyGitForm.controls[filedName].updateValueAndValidity();
  }
  clearValidators(fieldName){
    this.babyGitForm.controls[fieldName].clearValidators();
    this.babyGitForm.controls[fieldName].updateValueAndValidity();
  }
}
