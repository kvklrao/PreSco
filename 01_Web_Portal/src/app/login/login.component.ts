import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LoginService } from "../shared/service/login.service";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Common } from "../shared/service/common/common";
import { CookieService } from 'ngx-cookie-service';
import { ReadingDataService } from '../shared/service/reading-data.service';
import { AppConstant } from '../shared/constant/app-constant';

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted = false;
  password = "password";
  is_toggle = false;
  password_class = "fa fa-eye-slash";
  cookieValue = 'UNKNOWN';
  checked: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private loginApi: LoginService,
    private router: Router,
    private toastr: ToastrService,
    private commonAsyn: Common,
    private cookieService: CookieService,
    private readingDataService:ReadingDataService,private constant:AppConstant 
  ) {  
  }

  ngOnInit() {
   this.checked=false;
   // console.log(this.checked);
    this.commonAsyn.isHide();
    this.loginForm = this.formBuilder.group({
      username: ["", Validators.required],
      password: ["", [Validators.required, Validators.minLength(6)]],
      remember_me: [""]
    });
    this.checkCookies();

  }

  async login() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.commonAsyn.showLoader();
    const loginResponse = await this.loginApi.login(this.loginForm.value);
    loginResponse.subscribe(
      response => {      
        this.success(response, "login");
      },
      error => {
        this.commonAsyn.isHide();
      }
    );
  }

  checkCookies(){
    if(this.cookieService.get('UserCookieValue')){
      this.checked=true;
      //console.log(this.checked);
      this.loginForm.patchValue({
        username:  this.cookieService.get('UserCookieValue'),
        password:  this.cookieService.get('PasswordCookieValue')})
    }
  }

  success(response, api_type) {
    const vim = this;
    if (vim.isSuccess(response)) {
      localStorage.setItem(
        "login_hospital",
        JSON.stringify(response["response"])
      );
      if(this.loginForm.value["remember_me"] === true && response["response"]){
        this.cookieService.set( 'UserCookieValue', response["response"].username );
        this.cookieService.set( 'PasswordCookieValue', this.loginForm.value["password"] );
      }
      if(this.loginForm.value["remember_me"] === false && response["response"]){
       this.cookieService.deleteAll()
      }
      this.navIgateUser(response["response"]);
      //vim.router.navigateByUrl("/admin");
      vim.toastr.success("", "Login Successful");
      vim.readingDataService.setActiveTab("default message");
      vim.readingDataService.showBabyProfileForm("message");
    } else {
      vim.toastr.error("Login", "Invalid credentails");
      vim.commonAsyn.isHide();
    }
  }

  isSuccess(response) {
    if (response.hasOwnProperty("status") && response["status"] === 200) {
      return true;
    }
    return false;
  }

  forget_password() {
    const vim = this;
    vim.router.navigate(["/forget_password"]);
  }

  signup() {
    const vim = this;
    vim.router.navigate(["/signup"]);
  }

  referralSignup() {
    const vim = this;
    vim.router.navigate(["/referral-signup"]);
  }

  navIgateUser(response){
    if(response['user_type']==this.constant.hospital_type_login || response['user_type']==this.constant.branch_type_login){
      this.router.navigateByUrl("/admin");
    }
    if(response['user_type']==this.constant.staff_type_login){
      this.router.navigateByUrl("/admin/hospital-staff");
    }
    if(response['user_type']==this.constant.referral_doctor_login){
      this.router.navigateByUrl("/admin/referral-doctors");
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

  // rememberMe(event){

  // }
}
