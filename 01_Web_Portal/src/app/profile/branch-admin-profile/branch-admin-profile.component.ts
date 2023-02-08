import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/service/common/common.service';
import { AppHelper } from 'src/app/shared/helper/app.helper';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-branch-admin-profile',
  templateUrl: './branch-admin-profile.component.html',
  styleUrls: ['./branch-admin-profile.component.css']
})
export class BranchAdminProfileComponent implements OnInit {
  hospitalId: number;
  branchId:number;
  login_hospital: any = {};
  branchProfile=[];
  branchProfileForm:FormGroup;
  isEdit:boolean=false;
  password = "password";
  is_toggle = false;
  password_class = "fa fa-eye-slash";
  doNotAutoComplete:any={};
  public onlyCharWithSpace = { 'S': { pattern: new RegExp('\[a-zA-Z, \]') } };
  public customPatterns = { 'A': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&\]') } };
  public addressPatterns = { 'A': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$,%&/ \]') } };
  
  constructor(private common:CommonService,private helper:AppHelper,private toasty:ToastrService,private formBuilder:FormBuilder) { }

  ngOnInit() {
    this.getLoggedInUserInfo();
    this.getBranchInformation();
    this.createForm();
  }

  createForm(){
    this.branchProfileForm = this.formBuilder.group({
      userName: ["",[Validators.required,Validators.minLength(6)]],
      contactNumber: ["",[Validators.required,Validators.minLength(10)]],
      address: [""],
      emailAddress: ["",[Validators.required,Validators.email,Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      city: [""],
      state: [""],
      pincode: [""],
      password: ["",[Validators.required,Validators.minLength(6)]],
      branchName: ["",[Validators.required]],
      hospitalBranchId:["",[Validators.required]]
      // firstName:["",[Validators.required]]
      // lastName:["",[Validators.required]]
    });
  }

  getLoggedInUserInfo() {
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId = this.login_hospital['id'];
    this.branchId=this.login_hospital['hospital_branch_id'];
  }

  getBranchInformation(){
    this.common.getBranchProfileInfo(this.branchId).subscribe(result=>{
      if(this.helper.success(result)){
        this.success(result,'getBranchProfile')
      }
    })
  }

  updateBranchProfile(){
    if(this.branchProfileForm.valid){
      this.common.updateBranchProfile(this.branchProfileForm['value'],this.branchId).subscribe(result=>{
        if(this.helper.success(result)){
          this.success(result,'updateBranchProfile');
          this.isEdit=false;
          this.getBranchInformation();
        }
      })
    }
  }

  success(response,apitype){
    if(apitype=='getBranchProfile'){
      this.branchProfile=response['response'];
    }
    if(apitype=='updateBranchProfile'){
      this.toasty.success(response['message'],'')
    }
  }

  updateForm(obj){
    this.isEdit = true;
      this.branchProfileForm.patchValue({
       userName: obj['user_name'],
      contactNumber: obj['contact_number'],
      address: obj['address'],
      emailAddress: obj['email_address'],
      city: obj['city'],
      state: obj['state'],
      pincode: obj['pincode'],
      password: obj['password'],
      branchName: obj['branch_name'],
      hospitalBranchId:obj['hospital_branch_id']
    });
  }

  cancel() {
    this.isEdit = false;
  }

  show_password() {
    if (this.is_toggle) {
      this.is_toggle = false;
      this.password = "password";
      this.password_class = "fa fa-eye-slash";
    } else {
      this.is_toggle = true;
      this.password = "text";
      this.password_class = "fa fa-eye";
    }
  }
}
