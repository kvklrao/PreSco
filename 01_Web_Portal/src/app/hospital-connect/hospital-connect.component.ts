import { Component, OnInit } from '@angular/core';
import { AppConstant } from '../shared/constant/app-constant';
import { AppHelper } from '../shared/helper/app.helper';
import { CommonService } from '../shared/service/common/common.service';
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-hospital-connect',
  templateUrl: './hospital-connect.component.html',
  styleUrls: ['./hospital-connect.component.css']
})
export class HospitalConnectComponent implements OnInit {
  login_user:any={};
  hospitalList=[];
  page=1;
  pageLength;
  totalCount:number;
  referralDoctorId:number;
  newStatusObj:any={};searchText:string
  constructor(private constant:AppConstant,private helper:AppHelper,private common:CommonService,private toasty:ToastrService) { }

  ngOnInit() {
    this.searchText=null
    this.pageLength=this.constant.pageLimit;
    this.getUserInfo();
    this.gethospitalListCount(this.searchText);
  }

  getUserInfo() {
    this.login_user = JSON.parse(localStorage.getItem("login_hospital"));
    this.referralDoctorId=this.login_user['referral_id'];
  }
  gethospitalList(searchText){
    this.common.getHospitalList(this.referralDoctorId,this.page,this.pageLength,searchText).subscribe(result=>{
      if(this.helper.success(result)){
        this.success(result,'hospitalsList')
      }
    })
  }

  gethospitalListCount(searchText){
    this.common.getHospitalListCount(searchText).subscribe(result=>{
      if(this.helper.success(result)){
        this.success(result,'hospitalsListCount')
        this.gethospitalList(searchText);
      }
    })
  }

  success(response,apiType){
    if(apiType==='hospitalsList'){
      this.hospitalList=_.sortBy(response['response'], 'hospital_name');
    }
    if(apiType==='hospitalsListCount'){
      this.totalCount=response['response']['referral_hospital_count'];
    }
    if(apiType==='statusUpdate'){
      this.toasty.success(response['message'],'')
    }
  }
  nextPage(page) {
    let self = this;
    self.page = page;
    this.gethospitalList(this.searchText);
  }
  onDropDownChange(pagelength){
    this.gethospitalList(this.searchText);
  }

  updateStatus(statusId,hospitalId,listObj){
    this.setNewStatus(statusId,listObj)
    this.common.updateSubscriptionStatus(this.referralDoctorId,hospitalId,this.newStatusObj).subscribe(result=>{
      if(this.helper.success(result)){
        this.success(result,'statusUpdate');
        this.newStatusObj={};
        this.gethospitalList(this.searchText);
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
    this.newStatusObj['requesterType']="Referral Doctor";
    this.newStatusObj['hospitalActionStatus']=hospitalStatus;
    this.newStatusObj['referralActionStatus']=newstatus;
    this.newStatusObj['referralHospitalId']=referrrenceHospitalId;
  }

  searchReferralHospital(){
    if(this.searchText.length>=3){
      this.gethospitalListCount(this.searchText)
    }
    else if(this.searchText.length==0){
      this.searchText=null;
        this.gethospitalListCount(this.searchText);
    }
  }

}
