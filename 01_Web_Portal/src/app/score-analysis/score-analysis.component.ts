import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-score-analysis',
  templateUrl: './score-analysis.component.html',
  styleUrls: ['./score-analysis.component.css']
})
export class ScoreAnalysisComponent implements OnInit {

  constructor(private modalService: NgbModal,private formBuilder:FormBuilder,private common:CommonService,
    private helper:AppHelper,private route: ActivatedRoute,private toasty:ToastrService) { }
  formRef: any;
  inpanelFlag=false;
  outpanelFlag=false;
  data=90;
  bmrNo:string;
  inpanelList=[];
  login_hospital:any={};
  hospitalId:number;
  staffId:number;
  selectedDoctors=[];studyId:number;requestJson={};branchId:number;
  fileToUpload: File = null;
  formatFlag = false;
  fileExtension: string;
  errorMessage: string;
  fileUploadMessage: string;
  errorMessageFlag = false;
  fileEmptyFlag = false;
  isFileEmpty = true;
  uploadSuccessFlag = false;
  currentFileUpload: File = null;reading:string;
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.bmrNo=params['babyMrNo'];
      this.studyId=params['studyId'];
      this.reading=params['reading']
    });
    this.getUserInfo();
  }

  getUserInfo(){
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId=this.login_hospital['id'];
    this.staffId=this.login_hospital['staff_id'];
    this.branchId=this.login_hospital['hospital_branch_id'];
}

  open(modalName){
    this.inpanelFlag=false;
    this.outpanelFlag=false;
    this.selectedDoctors=[];
    this.getPanelDoctors(this.hospitalId,this.staffId);
    this.formRef = this.modalService.open(modalName, { size: "lg" });
  }

  selectDoctor(radioButton){
    if(radioButton==0){
      this.inpanelFlag=true;
      this.outpanelFlag=false;
    }
    if(radioButton==1){
      this.outpanelFlag=true;
      this.inpanelFlag=false;
    }
  }

  close(){
    this.outpanelFlag=false;
    this.inpanelFlag=false;
    this.formRef.close();
  }

  success(response,apitype){
    if(apitype=="panelReferralDoctors"){
      this.inpanelList=response['response']
    }
    if(apitype=='sendOpinionRequest'){
      this.toasty.success(response['message'],'')
    }
  }

  getPanelDoctors(hospitalId,staffId){
      this.common.getPanelReferralDoctors(hospitalId,staffId).subscribe(result=>{
        if(this.helper.success(result)){
            this.success(result,"panelReferralDoctors")
        }else{
          this.helper.errorHandler(result);
        }
      })
  }
  inpanelSelected(event){
   this.selectedDoctors=_.pluck(event.target.selectedOptions,"value");
  }
  sendOpinionRequest(){
   this.requestJson['referral_id']=this.selectedDoctors;
   this.requestJson['study_id']=this.studyId;
   this.requestJson['reading']=this.reading;
   if(this.fileToUpload==null || this.fileToUpload==undefined){
     this.toasty.error("Please upload a file",'')
     return;
   }
   this.requestJson['fileName']=this.fileToUpload;
   this.common.sendForOpinion(this.branchId,this.staffId,this.requestJson).subscribe(result=>{
     if(this.helper.success(result)){
        this.success(result,'sendOpinionRequest')
        this.close();
     }
     else{
       this.helper.errorHandler(result)
     }
   })
  }

  fileUpload(event) {
    this.formatFlag = false;
    this.fileEmptyFlag = false;
    this.isFileEmpty = false;
    this.fileToUpload = <File>event.target.files[0];
    if(this.fileToUpload!=undefined){
    this.fileExtension = this.fileToUpload.name.split('.').pop();
    if (this.fileExtension != 'xls') {
      this.formatFlag = true;
      }
    if (this.fileExtension == 'xlsx') {
      this.formatFlag = false;
      //console.log("incorrect file format");
    }
    if(this.fileToUpload.name==""){
      this.isFileEmpty = true;
    }
    }
    if(this.fileToUpload==undefined){
      this.isFileEmpty = true;
    }
    if(this.formatFlag){
      this.toasty.error("Only .xls and .xlsx format supported","Error..!");
    }
    
  }
}
