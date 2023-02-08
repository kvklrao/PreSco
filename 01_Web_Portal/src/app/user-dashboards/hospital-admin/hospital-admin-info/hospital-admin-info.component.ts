import { Component, OnInit } from '@angular/core';
import { Common } from 'src/app/shared/service/common/common';
import { CommonService } from 'src/app/shared/service/common/common.service';
import { AppHelper } from 'src/app/shared/helper/app.helper';

@Component({
  selector: 'app-hospital-admin-info',
  templateUrl: './hospital-admin-info.component.html',
  styleUrls: ['./hospital-admin-info.component.css']
})
export class HospitalAdminInfoComponent implements OnInit {
  hospitalId:number;
  login_hospital:any={};
  hospitalBranchId:number;userType:string;
  page=1;
  constructor(private common:CommonService,private helper:AppHelper) { }
  branchList=[];dashboardData={};msgList=[];
  ngOnInit() {
    this.getUserInfo();
   this.getBranches(this.hospitalId);
   this.getDashBoardData();
  }

  getBranches(hospitalId){
    this.common.getHospitalBranches( this.hospitalId,null).subscribe(response=>{
      if(this.helper.success(response)){
        this.branchList=response['response']
      }
      else{
        this.branchList=[];
      }
    })
  }

  getUserInfo(){
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId=this.login_hospital['id'];
    this.hospitalBranchId=this.login_hospital['hospital_branch_id'];
    this.userType=this.login_hospital['user_type'];
}

changeBranch(event){
  this.page=1;
 this.hospitalBranchId=event.target.value;
 this.login_hospital['hospital_branch_id']=this.hospitalBranchId;
 localStorage.setItem("login_hospital",JSON.stringify(this.login_hospital));
 this.getDashBoardData();
}


getDashBoardData(){
    this.common.getHospitalAdminDashboardData(this.hospitalId,this.hospitalBranchId,this.userType).subscribe(result=>{
        if(this.helper.success(result)){
          this.dashboardData=result['response'][0];
          this.msgList=this.dashboardData['messages'];
          // console.log(this.dashboardData)
        }
        else{
          this.helper.errorHandler(result);
          this.dashboardData={};
          this.msgList=[];
        }
    })
}
}
