import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../shared/constant/app-constant';

@Component({
  selector: 'app-medical-records',
  templateUrl: './medical-records.component.html',
  styleUrls: ['./medical-records.component.css'],
})
export class MedicalRecordsComponent implements OnInit {
  formRef: any;
  formRefDetail: any;
  addMedicalRecordForm: FormGroup;
  public namePatters = { 'S': { pattern: new RegExp('\[a-zA-Z \]') } };
  public customPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&-/, \]') } };

  hospitalId: number;
  hospitalBranchId: number;
  study_id: string;
  patient_id: string;
  login_hospital: any = {};
  medicalRecordDetailObj:any={};
  MedicalRecordList = [];
  page=1;
  pageLength:number;
  medicalRecords=[];
  totalCount:number=0;
  isEdit=false;
  staffID:number = 0;
  usertypeConst:number;
  branchList=[];
  statusList:any=[{id:0,name:'Inactive'},{id:1,name:'Active'}];
  doNotAutoComplete:any={};search_text:string;
  constructor(private modalService: NgbModal,private formBuilder:FormBuilder,
              private commomService:CommonService,private helper:AppHelper,
              private toasty:ToastrService,private constant:AppConstant) { }

  ngOnInit() {
    this.search_text=null;
    this.pageLength=this.constant.pageLimit;
    this.createForm();
    this.getLoggedInUserInfo();
    this.getBranches();
    this.getMedicalRecordsCount(this.search_text);
  }

  createForm(){
    this.addMedicalRecordForm = this.formBuilder.group({
      bmrn: ["",[Validators.required]],
      mmrn: ["",[Validators.required]],
      babyName: ["",[Validators.maxLength(32)]],
      motherName: ["",[Validators.required, Validators.maxLength(32)]],
      fatherName: ["",[Validators.required, Validators.maxLength(32)]],
      contactNumberPrimary: ["", [Validators.required, Validators.minLength(10)]],
      contactNumberSecondary: [null, [Validators.minLength(10)]],
      address: ["",[Validators.required, Validators.maxLength(32)]],
      city: ["",[Validators.required, Validators.maxLength(32)]],
      state: ["",[Validators.required, Validators.maxLength(32)]],
      pincode: ["", [Validators.minLength(6)]],
      nationality: ["",[Validators.maxLength(32)]],
      email: ["", [Validators.email,Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      status:[1, [Validators.required]]
    });
  }

  updateForm(obj){
    this.study_id = obj['study_id'];
    this.patient_id = obj['patient_id'];
      this.addMedicalRecordForm.patchValue({
        bmrn: obj['baby_medical_record_number'],
        mmrn: obj['baby_mother_medical_record_number'],
        babyName:  obj['baby_name'],
        motherName: obj['mother_name'],
        fatherName:  obj['father_name'],
        contactNumberPrimary:  obj['primary_contact_no'],
        contactNumberSecondary:  obj['secondary_contact_no'],
        address: obj['address'],
        city:  obj['city'],
        state: obj['state'],
        pincode: obj['pincode'],
        nationality: obj['nationality'],
        email: obj['email_id'],
        status: obj['status'],
    });
  }

  open(content, obj) {
    if(_.isEmpty(obj)){
      if(this.hospitalBranchId==null || this.hospitalBranchId==undefined){
        this.toasty.error("Please Create Branch.", '');
      }else{
      this.createForm();
      this.formRef = this.modalService.open(content, { size: "lg" });
      }
    }
    else{
      this.updateForm(obj);
      this.isEdit=true;
      this.formRef = this.modalService.open(content, { size: "lg" });
    }
  }

  openDetail(openDetail, obj) {
    this.medicalRecordDetailObj=obj;
    this.formRefDetail = this.modalService.open(openDetail, { size: "lg" });
  }

  getLoggedInUserInfo() {
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId = this.login_hospital['id'];
    this.hospitalBranchId = this.login_hospital['hospital_branch_id'];
    this.staffID = 0;
    this.usertypeConst = this.login_hospital['user_type'] === 'Hospital'? this.constant.hospital_type:this.constant.hospital_branch_type;
  }

  onMedicalRecordSubmit() {
    if(!this.addMedicalRecordForm.valid){
      return ;
    }
    this.commomService.addMedicalRecord(this.hospitalId, this.hospitalBranchId, this.addMedicalRecordForm['value']).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'addMedicalRecord');
        this.getMedicalRecordsCount(this.search_text);
        this.close();
      }else{
        this.helper.errorHandler(result);
      }
    });
  }

  updateMedicalRecord() {
    if(!this.addMedicalRecordForm.valid){
      return;
    }

    this.commomService.updateMedicalRecord(this.study_id,this.patient_id,this.hospitalId,this.hospitalBranchId, this.usertypeConst , this.addMedicalRecordForm['value']).subscribe(result=>{
    if(this.helper.success(result)){
        this.success(result,'updateMedicalRecord')
        this.isEdit=false;
        this.getMedicalRecords(this.search_text);
        this.close();
        this.study_id = '';
        this.patient_id = ''
    }
    else{
        this.helper.errorHandler(result);
    }
  });
  }

  success(response,apitype){
    if(apitype=='addMedicalRecord'){
      this.toasty.success(response['message'],'')
    }
    if(apitype=='getMedicalRecords'){
      this.medicalRecords=response['response'];
    }
    if(apitype=='getMedicalRecordsCount'){
      this.totalCount=response['response']['medical_record_count'];
    }
    if(apitype=='updateMedicalRecord'){
      this.toasty.success('Record Update Successfully','')
    }
  }

  close() {
    this.isEdit=false;
    this.formRef.close();
  }

  closeDetail() {
    this.formRefDetail.close();
  }

  getMedicalRecords(searchText){
    this.commomService.getMedicalRecords(this.hospitalId, this.hospitalBranchId,this.page,this.pageLength,searchText,0, this.staffID).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'getMedicalRecords');
      }else{
        this.medicalRecords=[];
        this.helper.errorHandler(result);
      }
    });
  }

  nextPage(page) {
    let self = this;
    self.page = page;
    this. getMedicalRecords(this.search_text);
  }

  onDropDownChange(pagelength){
    this.getMedicalRecords(this.search_text);
  }

    getMedicalRecordsCount(searchText){
      this.commomService.getMedicalRecordsCount(this.hospitalId, this.hospitalBranchId,searchText,0,this.staffID).subscribe(result => {
        if(this.helper.success(result)){
          this.success(result, 'getMedicalRecordsCount');
          this.getMedicalRecords(searchText);
        }else{
          this.medicalRecords=[];
          this.helper.errorHandler(result);
        }
      });
    }
    getBranches(){
      this.commomService.getHospitalBranches( this.hospitalId,null).subscribe(response=>{
        if(this.helper.success(response)){
          this.branchList=response['response']
        }
      })
    }
    changeBranch(event){
      this.page=1;
      this.hospitalBranchId=event.target.value;
      this.createForm();
      this.search_text=null;
      this.getMedicalRecordsCount(this.search_text);
    }

    searchMedicalRecords(event:Event){
      if(this.search_text.length>=3){
        this.page=1;
        this.getMedicalRecordsCount(this.search_text)
      }
      else if(this.search_text.length==0){
        this.search_text=null;
        this.getMedicalRecordsCount(this.search_text);
      }
    }
}