import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../shared/service/common/common.service';
import { AppHelper } from '../../shared/helper/app.helper';
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../../shared/constant/app-constant';

@Component({
  selector: 'app-referral-profile',
  templateUrl: './referral-profile.component.html',
  styleUrls: ['./referral-profile.component.css']
})
export class ReferralProfileComponent implements OnInit {
  referralProfileForm: FormGroup;
  hospitalId: number;
  referral_id:number;
  isEdit: boolean = false;
  password = "password";
  is_toggle = false;
  password_class = "fa fa-eye-slash";
  // hospitalBranchId: number;
  login_hospital: any = {};
  referralProfile = [];
  doNotAutoComplete:any={};
  public namePatters = { 'S': { pattern: new RegExp('\[a-zA-Z \]') } };
  public onlyNumber = { '0': { pattern: new RegExp('\[0-9\]') } };
  public customPatterns = { 'A': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&\]') } };
  public onlyCharWithSpace = { 'S': { pattern: new RegExp('\[a-zA-Z0-9, \]') } };
  public onlyPinNumber = { 'A': { pattern: new RegExp('\[0-9\]') } };

  constructor(private formBuilder:FormBuilder,
    private commomService:CommonService,private helper:AppHelper,
    private toasty:ToastrService,private constant:AppConstant) { }

  ngOnInit() {
    this.getLoggedInUserInfo();
    this.getReferralProfile();
    this.createForm();
  }

  createForm() {
    this.referralProfileForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(15)]],
      lastName: ["", [Validators.required, Validators.maxLength(15)]],
      userName: ["", [Validators.required, Validators.minLength(6)]],
      contactNumber: ["", [Validators.required, Validators.minLength(10)]],
      emailAddress: ["", [Validators.required, Validators.email, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      address: ["",[Validators.required]],
      city: ["",[Validators.required, Validators.maxLength(32)]],
      state: ["",[Validators.required, Validators.maxLength(32)]],
      pincode: ["", [Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.maxLength(15)]],
      speciality:["",[Validators.required]]
    });
  }

  updateForm(obj){
    this.isEdit = true;
    if(obj['pincode']==0){
      this.referralProfileForm.patchValue({
        pincode:""
      })
    }
    else{
      this.referralProfileForm.patchValue({
        pincode:obj['pincode']
      })
    }
      this.referralProfileForm.patchValue({
        hospitalId: obj['hospital_id'],
        hospitalBranchId: obj['hospital_branch_id'],
        firstName: obj['first_name'],
        lastName: obj['last_name'],
        userName: obj['user_name'],
        contactNumber: obj['contact_number'],
        emailAddress: obj['email_address'],
        address: obj['address'],
        city: obj['city'],
        state: obj['state'],
        // pincode: obj['pincode'],
        password: obj['password'],
        speciality:obj['speciality']
    });
  }

  getLoggedInUserInfo() {
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId = this.login_hospital['id'];
    this.referral_id = this.login_hospital['referral_id'];
    // this.hospitalBranchId = this.login_hospital['hospital_branch_id'];
  }

  getReferralProfile() {
    this.commomService.getReferralProfile(this.referral_id).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'getReferralProfile');
      }else{
        this.helper.errorHandler(result);
      }
    });
  }

  updateProfile(){
    if(!this.referralProfileForm.valid){
      return ;
    }else{
      this.commomService.updateReferralProfile(this.referralProfileForm['value'],this.referral_id).subscribe(result=>{
        if(this.helper.success(result)){
          this.success(result, 'updateReferralProfile');
          this.isEdit=false;
          this.getReferralProfile();
        }else{
          this.helper.errorHandler(result);
        }
      })
    }
  }

  cancel() {
    this.isEdit = false;
  }

  success(response,apitype){
    if(apitype=='getReferralProfile'){
      this.referralProfile=response['response'];
    }
    if(apitype=='updateReferralProfile'){
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

  ///swap type between text and password.
  swapper(){
    if(this.is_toggle){
      return 'text';
    }
    return 'password';
  }

}
