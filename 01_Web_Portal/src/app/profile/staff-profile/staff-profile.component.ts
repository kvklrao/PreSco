import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from '../../shared/service/common/common.service';
import { AppHelper } from '../../shared/helper/app.helper';
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../../shared/constant/app-constant';

@Component({
  selector: 'app-staff-profile',
  templateUrl: './staff-profile.component.html',
  styleUrls: ['./staff-profile.component.css']
})
export class StaffProfileComponent implements OnInit {
  hospitalId: number;
  staffId:number;
  hospitalBranchId: number;
  staffProfileForm: FormGroup;
  login_hospital: any = {};
  staffProfile = [];
  password = "password";
  is_toggle = false;
  password_class = "fa fa-eye-slash";
  isEdit: boolean = false;
  public namePatters = { 'S': { pattern: new RegExp('\[a-zA-Z \]') } };
  public onlyNumber = { '0': { pattern: new RegExp('\[0-9\]') } };

  constructor(private formBuilder:FormBuilder,
    private commomService:CommonService,private helper:AppHelper,
    private toasty:ToastrService,private constant:AppConstant) { }

    public onlyCharWithSpace = { 'S': { pattern: new RegExp('\[a-zA-Z, \]') } };
    public customPatterns = { 'A': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&\]') } };

  ngOnInit() {
    this.getLoggedInUserInfo();
    this.createForm();
    this.getStaffProfile();
  }

  createForm(){
    this.staffProfileForm = this.formBuilder.group({
      hospitalId: this.hospitalId,
      hospitalBranchId: this.hospitalBranchId,
      staffId: this.staffId,
      firstName: ["", [Validators.required, Validators.maxLength(15)]],
      lastName: ["", [Validators.required, Validators.maxLength(15)]],
      contactNumber: ["", [Validators.required, Validators.minLength(10)]],
      emailAddress: ["", [Validators.required, Validators.email, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      userName: ["", [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      reportTo: [""],
      assignRole: ["", [Validators.required]],
      speciality: ["", [Validators.required]],
      branch: ["", [Validators.required]],
    });
  }

  updateForm(obj){
    this.isEdit = true;
      this.staffProfileForm.patchValue({
        hospitalId: obj['hospital_id'],
        hospitalBranchId: obj['hospital_branch_id'],
        staffId: obj['staff_id'],
        firstName: obj['first_name'],
        lastName: obj['last_name'],
        contactNumber: obj['contact_number'],
        emailAddress: obj['email_address'],
        userName: obj['user_name'],
        password: obj['password'],
        reportTo: obj['reporting_user'],
        assignRole: obj['role'],
        speciality: obj['speciality'],
        branch: obj['branches'],
    });
  }

  getLoggedInUserInfo() {
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId = this.login_hospital['id'];
    this.staffId = this.login_hospital['staff_id'];
    this.hospitalBranchId = this.login_hospital['hospital_branch_id'];
  }

  getStaffProfile() {

    this.commomService.getStaffProfile(this.staffId).subscribe(result => {
      if(this.helper.success(result)){
        this.success(result, 'getStaffProfile');
      }else{
        this.helper.errorHandler(result);
      }
    });
  }

  updateProfile(){
    console.error(this.staffProfileForm['value'])
    if(!this.staffProfileForm.valid){
      return ;
    }else{
      this.commomService.updateStaffProfile(this.staffProfileForm['value'],this.staffId).subscribe(result=>{
        if(this.helper.success(result)){
          this.success(result, 'updateStaffProfile');
          this.isEdit=false;
          this.getStaffProfile();
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
    if(apitype=='getStaffProfile'){
      this.staffProfile=response['response'];
    }
    if(apitype=='updateStaffProfile'){
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
