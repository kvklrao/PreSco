import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../shared/constant/app-constant';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
  hospitalId: number;
  myProfileForm: FormGroup;
  //hospitalBranchId: number;
  login_hospital: any = {};
  myProfile = [];
  isEdit: boolean = false;
  password = "password";
  is_toggle = false;
  password_class = "fa fa-eye-slash";

  constructor(private formBuilder:FormBuilder,
    private commomService:CommonService,private helper:AppHelper,
    private toasty:ToastrService,private constant:AppConstant) { }
    public onlyCharWithSpace = { 'S': { pattern: new RegExp('\[a-zA-Z, \]') } };
    public customPatterns = { 'A': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&\]') } };
  ngOnInit() {
    this.getLoggedInUserInfo();
    this.getMyProfile();
    this.createForm();
  }

  createForm(){
    this.myProfileForm = this.formBuilder.group({
      hospital_id: ["",[Validators.required]],
      hospital_name: ["",[Validators.required,Validators.maxLength(20)]],
      user_name: ["",[Validators.required,Validators.minLength(6)]],
      contact_number: [""],
      address: [""],
      email_address: ["",[Validators.required,Validators.email,Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      city: [""],
      state: [""],
      pincode: [""],
      password: ["",[Validators.required,Validators.minLength(6)]],
      user_id:["",Validators.required]
    });
  }



  updateForm(obj){
    this.isEdit = true;
      this.myProfileForm.patchValue({
        hospital_id: obj['hospital_id'],
        hospital_name: obj['hospital_name'],
        user_name:  obj['user_name'],
        contact_number: obj['contact_number'],
        address:  obj['address'],
        email_address:  obj['email_address'],
        city:  obj['city'],
        state: obj['state'],
        pincode:  obj['pincode'],
        password: obj['password'],
        user_id: obj['user_id']
    });
  }

  getLoggedInUserInfo() {
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId = this.login_hospital['id'];
    //this.hospitalBranchId = this.login_hospital['hospital_branch_id'];
  }

  getMyProfile() {
    this.commomService.getMyProfile(this.hospitalId).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'getProfile');
      }else{
        // this.medicalRecords=[];
        this.helper.errorHandler(result);
      }
    });
  }

  updateProfile(){
    if(!this.myProfileForm.valid){
      return ;
    }else{
      this.commomService.updateHospitalProfile(this.myProfileForm['value'],this.hospitalId).subscribe(result=>{
        if(this.helper.success(result)){
          this.success(result, 'updateProfile');
          this.isEdit=false;
          this.getMyProfile();
        }else{
          // this.medicalRecords=[];
          this.helper.errorHandler(result);
        }
      })
    }
  }

  cancel() {
    this.isEdit = false;
  }

  success(response,apitype){
    if(apitype=='getProfile'){
      this.myProfile=response['response'];
    }
    if(apitype=='updateProfile'){
      this.toasty.success(response['message'],'')
    }
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
