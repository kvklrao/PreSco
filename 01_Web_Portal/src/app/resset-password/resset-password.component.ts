import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Common } from '../shared/service/common/common';
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';

@Component({
  selector: 'app-resset-password',
  templateUrl: './resset-password.component.html',
  styleUrls: ['./resset-password.component.css']
})
export class RessetPasswordComponent implements OnInit {

  forgetForm: FormGroup;
  forgetWithPasswordForm: FormGroup;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  isEmailExist = false;passcode:string;requestJson={};

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private commonAsyn: Common,
    private route:ActivatedRoute,private common:CommonService,private helper:AppHelper
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.passcode=params['passcode'];
    });
    const vim = this;
    this.commonAsyn.isHide();
    vim.createWithPasswordForm();
  }
  
  createWithPasswordForm() {
    this.forgetWithPasswordForm = this.formBuilder.group({
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPass: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

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
  success(response,apiType){
    if(apiType=='passwordResetSuccess'){
      this.toastr.success(response['message'],'')
      this.router.navigate(["/"]);
    }
  }

  resetPassword(){
    if(this.forgetWithPasswordForm.invalid){
      return ;
    }
    this.requestJson['password']=this.forgetWithPasswordForm['value']['password'];
    this.requestJson['passcode']=this.passcode;
    this.common.resetPassword(this.requestJson).subscribe(response=>{
        if(this.helper.success(response)){
            this.success(response,'passwordResetSuccess')
        }
        else{
          this.helper.errorHandler(response);
        }
    })
  }

}
