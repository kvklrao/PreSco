import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class AppConstant {
  public MONTH_ARRAY=[ "01",  "02",  "03",  "04",  "05",  "06",  "07",  "08",  "09",  "10",  "11",  "12"];
  public pageLimit=10;
  public hospital_type=2;
  public hospital_branch_type=3;
  public hospital_type_login="Hospital";
  public branch_type_login="Hospital Branch";
  public staff_type_login="Hospital Staff";
  public referral_doctor_login="Referral Doctor";

  public requestInitiationStatus=1;
  public pendingInitiationStatus=2;
  public acceptInitiation=3;
  public activeStatus=4;
  public referralDoctorRequesterType=4;
  public hosAdminRequesterType=3;

  public staffUser=["DashboardStaff","MessageCenter","MyProfile"];
  public ReferralUser=["DashboardRD","MyProfile","hospitalConnect"];
  public branchAdmin=["Dashboard","MedicalRecords","HospitalStaff","Settings","MessageCenter","MyProfile"];
  public hospitalAdmin=["Dashboard","MedicalRecords","HospitalStaff","Settings","MessageCenter","MyProfile","AddBranch"];


  
  public hospitalAdminDropDown=[{name:'Referral Doctor',value:1},{name:'Doctor/Staff',value:2}];
  public hospitalBranchAdminDropDown=[{name:'Doctor/Staff',value:2}];
  public referralDoctorDropDown=[{name:'Hospital',value:4},{name:'Doctor/Staff',value:2}];
  public staffDropDown=[{name:'Referral Doctor',value:1},{name:'Doctor/Staff',value:2},{name:'Hospital',value:3}];
}
