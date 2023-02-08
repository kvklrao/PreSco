import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { DataService } from 'src/app/shared/service/data.service';
import { ReadingDataService } from 'src/app/shared/service/reading-data.service';
import { AppConstant } from 'src/app/shared/constant/app-constant';

@Component({
  selector: 'app-top-nav-bar',
  templateUrl: './top-nav-bar.component.html',
  styleUrls: ['./top-nav-bar.component.css']
})
export class TopNavBarComponent implements OnInit {

  constructor(private router:Router, private route: ActivatedRoute, public dataService:DataService,public readingDataService:ReadingDataService,private constant:AppConstant) { }
  selectedTab:string;
  hospitalName:string;
  loginHospital:any={};
  loggedUserName:string;
  staffUser=["DashboardStaff","MessageCenter","MyProfile"];
  ReferralUser=["DashboardRD","MyProfile","hospitalConnect","MessageCenter"];
  branchAdmin=["Dashboard","MedicalRecords","HospitalStaff","Settings","MessageCenter","MyProfile"];
  hospitalAdmin=["Dashboard","MedicalRecords","HospitalStaff","Settings","MessageCenter","MyProfile","AddBranch"];
  ngOnInit() {

    this.selectedTab='dashboard';
    if(this.route.children.length>0){
      this.selectedTab = this.route.children[0].url['value'][0].path;

    }
    if(this.selectedTab == 'staff-profile' || this.selectedTab == 'referral-profile' || this.selectedTab == 'my-profile' || this.selectedTab == 'branch-admin-profile') {
      this.selectedTab = 'my-profile';
    }
 
    this.loginHospital=JSON.parse(localStorage.getItem("login_hospital"));
    this.getLoggedInUserName();
  }

  getLoggedInUserName(){
    if(this.loginHospital['user_type']===this.constant.referral_doctor_login || this.loginHospital['user_type']===this.constant.staff_type_login ){
      this.loggedUserName=this.loginHospital['first_name'] + ' '+this.loginHospital['last_name'];
    }
    if(this.loginHospital['user_type']===this.constant.branch_type_login ){
      this.loggedUserName=this.loginHospital['hospital_branch_name'];
    }
    if(this.loginHospital['user_type']===this.constant.hospital_type_login ){
      this.loggedUserName=this.loginHospital['hospital_name'];
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigate(["/"]);
    this.dataService.clearOption();
    this.readingDataService.isMotherProfileHaveResp = true;
    this.readingDataService.clearReadingFormData();
    this.readingDataService.reset();
    this.readingDataService.resetAll();
  }

  changeProfile(){
    if(this.loginHospital['user_type']==this.constant.staff_type_login){
      this.router.navigate(["admin/staff-profile"]);
    }
    if(this.loginHospital['user_type']==this.constant.hospital_type_login){
      this.router.navigate(["admin/my-profile"]);
    }
    if(this.loginHospital['user_type']==this.constant.branch_type_login){
      this.router.navigate(["admin/branch-admin-profile"]);
    }
    if(this.loginHospital['user_type']===this.constant.referral_doctor_login){
      this.router.navigate(["admin/referral-profile"]);
    }
    
  }

  activeTab(tabName){
    this.selectedTab=tabName;
  }

  showPermission(tabName){
    if(this.loginHospital['user_type']==this.constant.hospital_type_login){
        return this.hospitalAdmin.includes(tabName);
    }
    if(this.loginHospital['user_type']==this.constant.branch_type_login){
      return this.branchAdmin.includes(tabName);
    }
    if(this.loginHospital['user_type']==this.constant.staff_type_login){
      return this.staffUser.includes(tabName);
    }
    if(this.loginHospital['user_type']==this.constant.referral_doctor_login){
      return this.ReferralUser.includes(tabName);
    }
  }

  toggleCollapse(){
    if(window.screen.width < 1000){
      return "#navbarSupportedContent";
    }
    return "";
  }

}
