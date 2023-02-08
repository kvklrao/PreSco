import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { LoginService } from "../shared/service/login.service";
import { Common } from "../shared/service/common/common";
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.css']
})
export class ForgetComponent implements OnInit {
  forgetForm: FormGroup;
  forgetWithPasswordForm: FormGroup;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  isEmailExist = false;mailSuccessfull=false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private api: LoginService,
    private commonAsyn: Common,private common:CommonService,private helper:AppHelper
  ) {}
  /**
   * @method :-  it is  hooks
   * @purpose:- it is default method called
   */
  ngOnInit() {
    this.isEmailExist = false;
    this.commonAsyn.isHide();
    const vim = this;
    vim.createForm();
    vim.createWithPasswordForm();
  }
  
  /**
   * @method:-createForm
   * @purpose :- this is called when reactive form called
   */
  createForm() {
    this.forgetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email,Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]]
    });
  }
  createWithPasswordForm() {
    this.forgetWithPasswordForm = this.formBuilder.group({
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPass: ["", [Validators.required, Validators.minLength(6)]]
    });
  }


  // forget_password() {
  //   const vim = this;
  //   if (this.forgetWithPasswordForm.invalid) {
  //     return;
  //   }

  //     vim.forgetWithPasswordForm.value["type"] = "2";
  //     vim.forgetWithPasswordForm.value["email"] = this.forgetForm.value["email"];
  //     const newUser = vim.api.forgot_password(
  //       vim.forgetWithPasswordForm.value
  //     );
  //     newUser.subscribe(
  //       response => {
  //           this.isEmailExist = true;
  //           vim.toastr.success('Password successfully changed!')
  //           vim.router.navigate(["/login"]);
  //       },
  //       error => {
  //         console.error("errro", error);
  //       }
  //     ); 
  // }

  is_match() {
    
    const vim = this;
    if (
      vim.forgetWithPasswordForm.value["confirmPass"] != "" &&
      vim.forgetWithPasswordForm.value["password"] != "" &&
      vim.forgetWithPasswordForm.value["confirmPass"] != vim.forgetWithPasswordForm.value["password"]
    ) {
      return true;
    }
    return false;
  }

  sendEmail(){
    if(this.forgetForm.invalid){
      return ;
    }
   this.common.sendResetPasswordEmail(this.forgetForm['value']).subscribe(result=>{
     if(this.helper.success(result)){
        this.mailSuccessfull=true;
     }else{
        this.helper.errorHandler(result);
     }
   })
  }
}