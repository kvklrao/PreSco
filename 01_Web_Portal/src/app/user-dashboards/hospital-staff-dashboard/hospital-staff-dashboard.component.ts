import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from "@angular/router";
import { CommonService } from '../../shared/service/common/common.service';
import { AppHelper } from '../../shared/helper/app.helper';
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../../shared/constant/app-constant';
import { ReadingDataService } from 'src/app/shared/service/reading-data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-hospital-staff-dashboard',
  templateUrl: './hospital-staff-dashboard.component.html',
  styleUrls: ['./hospital-staff-dashboard.component.css']
})
export class HospitalStaffDashboardComponent implements OnInit {
  hospitalId: number;
  hospitalBranchId: number;
  login_hospital: any = {};
  page=1;
  pageLength:number;
  medicalRecords=[];
  staffId:number;
  totalCount:number;searchText:string;dashboardData={};
  staffBranchList=[];
  generateScore=false;
  dataEntry=false;formRef:any;opinionList=[];
  bmrNo:string;
  motherName:string;

  constructor(private router: Router,private modalService: NgbModal,
    private commomService:CommonService,private helper:AppHelper,
    private toasty:ToastrService,private constant:AppConstant,private readingDataService:ReadingDataService) { }

  ngOnInit() {
    this.searchText=null;
    this.pageLength=this.constant.pageLimit;
    this.getLoggedInUserInfo();
    this.getMedicalRecordsCount(this.searchText);
    this.getDashBoardData();
    this.getStaffBranches();
  }

  getLoggedInUserInfo() {
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId = this.login_hospital['id'];
    this.hospitalBranchId = this.login_hospital['hospital_branch_id'];
    this.staffId=this.login_hospital['staff_id'];
  }

  getMedicalRecordsCount(searchText){
    this.commomService.getMedicalRecordsCount(this.hospitalId, this.hospitalBranchId,searchText,0,this.staffId).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'getMedicalRecordsCount');
        this.getMedicalRecords(searchText);
      }else{
        this.medicalRecords=[];
        this.helper.errorHandler(result);
      }
    });
  }

  getMedicalRecords(searchText){
    this.commomService.getMedicalRecords(this.hospitalId, this.hospitalBranchId,this.page,this.pageLength,this.searchText,0, this.staffId).subscribe(result => {
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
    this. getMedicalRecords(this.searchText);
  }

  onDropDownChange(pagelength){
    this.getMedicalRecords(this.searchText);
  }

  success(response,apitype){
    if(apitype=='getMedicalRecords'){
     // console.log(response,'staff list')
      this.medicalRecords=response['response'];
    }
    if(apitype=='getMedicalRecordsCount'){
      this.totalCount=response['response']['medical_record_count'];
    }
    if(apitype=='getStaffBranches'){
      this.staffBranchList=response['response'];
    }
    if(apitype=='referralOpinions'){
      this.opinionList=response['response'];
    }
  }

  readingDashboard(list) {
    this.readingDataService.setActiveTab('baby-profile')
    localStorage.setItem('staffMedicalRecord',JSON.stringify(list));
    this.getLastReadingData(list['study_id']);
    this.router.navigate(['dashboard']);
  }

  hasPermission(name){
    if(name=='dataEntry'){
        return this.login_hospital['data_entry'];
    }
    if(name=='generateScore'){
      return this.login_hospital['generate_score'];
    }

  }

  getLastReadingData(studyId){
    this.commomService.getLastReadingData(studyId).subscribe(result=>{
      if(result['status']!=200){
        this.readingDataService.clearReadingFormData();
      }
      else{
        var vim = this;
        _.find(result['response'], function(num){
          if(_.isEmpty(num)) {
            vim.toasty.error('','There is some technical issues, Please search the record again');
            return vim.readingDataService.readingFormsData = {};
          }
        });
          this.readingDataService.readingFormsData=result['response'];
      }
    })
  }
medicalRecordSearch(){
  if(this.searchText.length>=3){
    this.page=1;
    this.getMedicalRecordsCount(this.searchText);
  }
  else if(this.searchText.length==0){
    this.searchText=null;
    this.getMedicalRecordsCount(this.searchText);
  }
}
getDashBoardData(){
  this.commomService.getStaffDashboardData(this.staffId).subscribe(response=>{
    if(this.helper.success(response)){
      this.dashboardData=response['response'][0]
      //console.log(this.dashboardData);
    }
    else{
      this.dashboardData={};
      this.helper.errorHandler(response);
    }
  })
}
getStaffBranches(){
  this.commomService.getStaffBranches(this.staffId).subscribe(response=>{
    if(this.helper.success(response)){
      this.success(response,'getStaffBranches')
    }
    else{
      this.dashboardData={};
      this.helper.errorHandler(response);
    }
  })
}

changeBranch(event){
  let vim=this;
  this.hospitalBranchId=event.target.value;
  this.searchText=null;
  var newBranchData=_.filter(vim.staffBranchList, function(listObj){ return listObj['hospital_branch_id']  == vim.hospitalBranchId; });
  if(newBranchData){
    this.login_hospital=newBranchData[0];
    localStorage.setItem('login_hospital', JSON.stringify(this.login_hospital))
    // this.updatePermissions();
  }
  this.getMedicalRecordsCount(this.searchText);
}

close() {
  this.opinionList=[];
  this.formRef.close();
}

open(openModal,obj) {
  this.getOpinions(obj['study_id'])
  this.bmrNo=obj['baby_medical_record_number'];
  this.motherName=obj['mother_name']
  this.formRef = this.modalService.open(openModal, { windowClass : "myCustomModalClass"});
}

getOpinions(studyId){
  this.commomService.getOpinions(studyId).subscribe(response=>{
    if(this.helper.success(response)){
      this.success(response,'referralOpinions')
    }else{
      this.opinionList=[];
      this.helper.errorHandler(response);
    }
  })
}
// updatePermissions(){
//   this.dataEntry=this.login_hospital['data_entry'];
//   this.generateScore=this.login_hospital['generate_score'];
// }
}
