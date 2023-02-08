import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/shared/service/common/common.service';
import { AppHelper } from 'src/app/shared/helper/app.helper';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from 'src/app/shared/constant/app-constant';
@Component({
  selector: 'app-referral-doctor',
  templateUrl: './referral-doctor.component.html',
  styleUrls: ['./referral-doctor.component.css']
})
export class ReferralDoctorComponent implements OnInit {

  constructor(private modalService: NgbModal,private formBuilder:FormBuilder,private common:CommonService,private helper:AppHelper,private toasty:ToastrService,private constant:AppConstant) { }
  formRef: any;
  referralOpinion: FormGroup;
  submitted=false;login_hospital:any={};referralId:number;dashboardData={};opinionRequestList=[];selectedOpinion=null;page=1;
  pageLimit:number;
  ngOnInit() {
    this.pageLimit=this.constant.pageLimit;
    this.getUserInfo();
    this.createForm();
    this.getDashboardData();
  }
createForm(){
  this.referralOpinion = this.formBuilder.group({
    opinion: ["", [Validators.required]],
    prescription: ["", [Validators.required]],
  });
}
getUserInfo(){
  this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
  this.referralId=this.login_hospital['referral_id'];
}
getDashboardData(){
  this.common.getReferralDashboardData(this.referralId).subscribe(response=>{
    if(this.helper.success(response)){
      this.dashboardData=response['response'];
      this.getOpinionList();
    }
    else{
      this.helper.errorHandler(response);
    }
  })
}
  close() {
    this.resetForm();
    this.formRef.close();
  }

  open(openModal,obj) {
    this.selectedOpinion=obj['staff_referral_hospital_id'];
    this.formRef = this.modalService.open(openModal, { size: "lg" });
  }
  sendOpinion(){
    if(this.referralOpinion.invalid){
      this.submitted=true;
      return;
    }
    if(this.selectedOpinion==null || this.selectedOpinion==0 || this.selectedOpinion==undefined){
      return;
    }
    this.common.saveOpinion(this.selectedOpinion,this.referralOpinion['value']).subscribe(response=>{
      if(this.helper.success(response)){
          this.success(response,'savedOpinion')
          this.selectedOpinion=null;
          this.close();
      }else{
        this.helper.errorHandler(response);
      }
    })
  }

  resetForm(){
    this.createForm();
  }

  success(response,apiType){
    if(apiType=='referralOpinionList'){
        this.opinionRequestList=response['response'];
    }
    if(apiType=='savedOpinion'){
      this.toasty.success(response['message'],'')
    }
  }

  getOpinionList(){
    this.common.getReferralOpinonList(this.referralId).subscribe(response=>{
      if(this.helper.success(response)){
        this.success(response,'referralOpinionList')
        this.selectedOpinion=null;
        this.close();
      }else{
        this.helper.errorHandler(response);
      }
    })
  }
}
