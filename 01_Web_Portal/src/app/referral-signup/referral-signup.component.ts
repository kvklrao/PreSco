import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "../shared/service/login.service";
import { Common } from "../shared/service/common/common";
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';
@Component({
  selector: 'app-referral-signup',
  templateUrl: './referral-signup.component.html',
  styleUrls: ['./referral-signup.component.css']
})
export class ReferralSignupComponent implements OnInit {
  signupReferralForm: FormGroup;
  submitted = false;specialityList:any=[];
  public namePatters = { 'S': { pattern: new RegExp('\[a-zA-Z \]') } };
  public customPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&-/, \]') } };
  doNotAutoComplete:any={};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private api: LoginService,
    private commonAsyn: Common,
    private common:CommonService,
    private helper:AppHelper
  ) { }

  ngOnInit() {
    this.commonAsyn.isHide();
    this.createForm();
    this.getReferralSpeciality();
  }

  createForm() {
    this.signupReferralForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(15)]],
      lastName: ["", [Validators.required, Validators.maxLength(15)]],
      userName: ["", [Validators.required, Validators.minLength(6)]],
      contactNumber: ["", [Validators.required, Validators.minLength(10)]],
      email: ["", [Validators.required, Validators.email, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      address: ["",[Validators.required]],
      city: ["",[Validators.required, Validators.maxLength(32)]],
      state: ["",[Validators.required, Validators.maxLength(32)]],
      pincode: ["", [Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.maxLength(15)]],
      speciality:[null,[Validators.required]]
    });
  }

  async signup() {
    console.log(this.signupReferralForm['value'])
    if (this.signupReferralForm.invalid) {
      this.submitted = true;
      return;
    }
    const signupResponse = await this.api.referral_signup(this.signupReferralForm.value);
    signupResponse.subscribe(
      response => {
        this.success(response, "signup");
      },
      error => {
        console.error("errro", error);
      });
  }

  success(response, apitype) {
    if (apitype == 'signup') {
      this.toastr.success(response['message'], '')
      this.createForm();
      this.submitted = false;
      this.router.navigate(["/login"]);
    }
  }

  login() {
    const vim = this;
    vim.router.navigate(["/login"]);
  }

  getReferralSpeciality(){
    this.common.getReferralSpeciality().subscribe(result=>{
      if(this.helper.success(result)){
        this.specialityList=result['response'];
      }
      else{
        this.specialityList=[];
        this.helper.errorHandler(result);
      }
    })
  }

}