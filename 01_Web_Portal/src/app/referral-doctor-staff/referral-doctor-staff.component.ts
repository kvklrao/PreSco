import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from "@angular/router";
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../shared/constant/app-constant';
import { Common } from '../shared/service/common/common';

@Component({
  selector: 'app-referral-doctor-staff',
  templateUrl: './referral-doctor-staff.component.html',
  styleUrls: ['./referral-doctor-staff.component.css']
})
export class ReferralDoctorStaffComponent implements OnInit {
  formRef: any;
  formRefDetail: any;
  addReferralForm: FormGroup;
  login_hospital: any = {};
  hospitalId: number;
  hospitalBranchId: number;
  specialities = [];
  referralDoctors = [];
  referralDoctorRecordsObj:any={};
  page=1;
  pageLength:number;
  totalCount:number;searchText:string;
  user_type:string;newStatusObj:any={}; disableButton=false; doNotAutoComplete:any={};
  public namePatters = { 'S': { pattern: new RegExp('\[a-zA-Z \]') } };
  public customPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&-/, \]') } };
  constructor(private modalService: NgbModal, private router: Router, private formBuilder: FormBuilder, private commomService: CommonService, private helper: AppHelper, private toasty: ToastrService, private constant: AppConstant,private commonLoader:Common) { }

  ngOnInit() {
    this.searchText=null
    this.pageLength=this.constant.pageLimit;
    this.getUserInfo();
    this.createForm();
    this.getSpeciality();
    this.getData();
  }

  getData(){
    if(this.login_hospital['user_type']==this.constant.hospital_type_login){
       this.getRegisteredHospitalRecordsCount(this.searchText);
    }else{
       this.getReferralDoctorRecordsCount(this.searchText);
    }
  }

  createForm() {
    this.addReferralForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(15)]],
      lastName: ["", [Validators.required, Validators.maxLength(15)]],
      speciality: ["", [Validators.required]],
      contactNumber: ["", [Validators.required, Validators.minLength(10)]],
      email: ["", [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      address: ["",[Validators.required]],
      city: ["",[Validators.required, Validators.maxLength(32)]],
      state: ["",[Validators.required, Validators.maxLength(32)]],
      pincode: ["", [Validators.minLength(6)]]
    });
  }

  open(content, obj) {
      this.createForm();
      this.formRef = this.modalService.open(content, { size: "lg" });
  }

  openDetail(contentDetail, list) {
    this.referralDoctorRecordsObj=list;
    this.formRefDetail = this.modalService.open(contentDetail, { size: "lg" });
  }

  close() {
    this.formRef.close();
  }

  closeDetail() {
    this.formRefDetail.close();
  }

  getUserInfo() {
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId = this.login_hospital['id'];
    this.hospitalBranchId = this.login_hospital['hospital_branch_id'];
    this.user_type=this.login_hospital['user_type'];
  }

  getSpeciality() {
    this.commomService.getSpeciality(this.hospitalId, this.hospitalBranchId).subscribe(response => {
      if (this.helper.success(response)) {
        this.specialities = response['response']
      }
    })
  }

  onReferralSubmit(){
    if(!this.addReferralForm.valid){
      return ;
    }
    this.disableButton=true;
    this.commomService.addReferralDoctor(this.hospitalId, this.hospitalBranchId, this.addReferralForm['value']).subscribe(result => {
      if(this.helper.success(result)){
        this.disableButton=false;
        this.success(result, 'addReferralDoctor');
        this.getReferralDoctorRecordsCount(null);
        this.close();
      }else{
        this.disableButton=false;
        this.helper.errorHandler(result);
      }
    });
  }

  getReferralDoctorRecords(searchText){
    this.commomService.getReferralDoctors(this.hospitalId, this.hospitalBranchId,this.page,this.pageLength,searchText).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'getReferralDoctors');
      }else{
        this.referralDoctors=[];
        this.helper.errorHandler(result);
      }
    });
  }

  nextPage(page) {
    let self = this;
    self.page = page;
    if(this.user_type=='Hospital'){
      this.getRegisteredReferralDoctors(this.searchText);
    }else{
    this. getReferralDoctorRecords(this.searchText);
    }
  }

  onDropDownChange(pagelength){
    if(this.user_type=='Hospital'){
      this.getRegisteredReferralDoctors(this.searchText);
    }else{
    this. getReferralDoctorRecords(this.searchText);
    }
  }

  getReferralDoctorRecordsCount(searchText){
    this.commomService.getReferralDoctorRecordsCount(this.hospitalId, this.hospitalBranchId,searchText).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'getReferralDoctorRecordsCount');
        this.getReferralDoctorRecords(searchText);
      }else{
        this.referralDoctors=[];
        this.helper.errorHandler(result);
      }
    });
  }

  success(response, apitype) {
    if (apitype == 'addReferralDoctor') {
      this.toasty.success(response['message'], '')
    }
    if(apitype=='getReferralDoctors'){
      this.referralDoctors=response['response'];
    }
    if(apitype=='getReferralDoctorRecordsCount'){
      this.totalCount=response['response']['referral_count'];
    }
    if(apitype=='getRegisteredReferralDoctorRecordsCount'){
      this.totalCount=response['response']['refferal_count'];
    }
    if(apitype=='getRegisteredReferralDoctors'){
      this.referralDoctors=response['response'];
    }
    if(apitype=='statusUpdate'){
      this.toasty.success(response['message'],'')
    }
  }

  switchTab(tab) {
    var vim = this;
    if(tab == 'hospital-staff') {
      vim.router.navigate(["admin/staff"]);
    }
    if(tab == 'referral-doctor-staff') {
      vim.router.navigate(["admin/referral-doctor"]);
    }
  }

  getRegisteredHospitalRecordsCount(searchText){
    this.commomService.getRegisteredReferralDoctorRecordsCount(this.hospitalId,searchText).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'getRegisteredReferralDoctorRecordsCount');
        this.getRegisteredReferralDoctors(searchText);
      }else{
        this.referralDoctors=[];
        this.helper.errorHandler(result);
      }
    });
  }

  getRegisteredReferralDoctors(searchText){
    this.commomService.getRegisteredReferralDoctors(this.hospitalId,this.page,this.pageLength,searchText).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'getRegisteredReferralDoctors');
      }else{
        this.referralDoctors=[];
        this.helper.errorHandler(result);
      }
    });
  }

  updateStatus(listObj){
    this.setNewStatus(listObj.hospital_initiation_status_id,listObj);
    this.commomService.updateSubscriptionStatus(listObj.referral_id,this.hospitalId,this.newStatusObj).subscribe(result=>{
      if(this.helper.success(result)){
        this.success(result,'statusUpdate');
        this.newStatusObj={};
        this.getRegisteredHospitalRecordsCount(this.searchText);
      }
    })
  }
  setNewStatus(statusId,obj){
    if(statusId==this.constant.requestInitiationStatus){
        this.setStatus(statusId,this.constant.pendingInitiationStatus,this.constant.acceptInitiation,obj['referral_hospital_id']);
    }
    if(statusId==this.constant.pendingInitiationStatus){
      this.setStatus(statusId,this.constant.pendingInitiationStatus,this.constant.activeStatus,obj['referral_hospital_id']);
    }
    if(statusId==this.constant.acceptInitiation){
      this.setStatus(statusId,this.constant.activeStatus,this.constant.activeStatus,obj['referral_hospital_id']);
    }
    if(statusId==this.constant.activeStatus){
      this.setStatus(statusId,this.constant.pendingInitiationStatus,this.constant.activeStatus,obj['referral_hospital_id']);
    }
  }

  setStatus(oldStatus,newstatus,hospitalStatus,referrrenceHospitalId){
    this.newStatusObj['previousStatus']=oldStatus;
    this.newStatusObj['currentStatus']=newstatus;
    this.newStatusObj['requesterType']="Hospital";
    this.newStatusObj['hospitalActionStatus']=newstatus;
    this.newStatusObj['referralActionStatus']=hospitalStatus;
    this.newStatusObj['referralHospitalId']=referrrenceHospitalId;
  }

  updateUnregisteredDoctorStatus(Obj){

  }

  searchReferralDoctors(){
    if(this.user_type==this.constant.hospital_type_login){
        if(this.searchText.length>=3){
          this.getRegisteredHospitalRecordsCount(this.searchText)
        }
        else if(this.searchText.length==0){
          this.searchText=null;
          this.getRegisteredHospitalRecordsCount(this.searchText);
        }
    }
    if(this.user_type==this.constant.branch_type_login){
      if(this.searchText.length>=3){
        this.getReferralDoctorRecordsCount(this.searchText)
      }
      else if(this.searchText.length==0){
        this.searchText=null;
        this.getReferralDoctorRecords(this.searchText);
      }
    }
  }


}
