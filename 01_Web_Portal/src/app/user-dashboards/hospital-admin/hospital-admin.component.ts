import { Component, OnInit } from '@angular/core';
import { Common } from "../../shared/service/common/common";
import { CommonService } from 'src/app/shared/service/common/common.service';
import { AppHelper } from 'src/app/shared/helper/app.helper';

@Component({
  selector: 'app-hospital-admin',
  templateUrl: './hospital-admin.component.html',
  styleUrls: ['./hospital-admin.component.css']
})
export class HospitalAdminComponent implements OnInit {
loggedInUser:any={};
hospitalId:number;
hospitalBranchId:number;
userType:string;
dashboardData={};
msgList=[];
  constructor(private commonAsyn: Common,private common:CommonService,private helper:AppHelper) { }

  ngOnInit() {
    this.commonAsyn.isHide();
  }



}
