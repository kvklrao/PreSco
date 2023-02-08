import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Common } from '../shared/service/common/common';
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../shared/constant/app-constant';

@Component({
  selector: 'app-hospital-branch',
  templateUrl: './hospital-branch.component.html',
  styleUrls: ['./hospital-branch.component.css']
})
export class HospitalBranchComponent implements OnInit {
  addBranchForm: FormGroup;

  public customPatterns = {'A': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&\]')}};
  public OnlyAlbhabetWithSpace = {'S': { pattern: new RegExp('\[a-zA-Z \]')}};
  

  hospitalList=[];
  page=1;
  hospitalId:number;
  pageLength:number;
  login_hospital: any = {};
  doNotAutoComplete:any={};
  searchJson:any={};search_text:string;
  constructor(private formBuilder: FormBuilder,private commonService:CommonService,private helper:AppHelper,private toasty:ToastrService,private constant:AppConstant) { }

  ngOnInit() {
    const vim = this;
    vim.getLoggedInUserInfo();
    vim.createForm();
    vim.search_text=null;
    vim.getHospitalBranches(this.hospitalId,this.search_text);
  }

  createForm() {
    const vim = this;
    this.pageLength=this.constant.pageLimit;
    this.addBranchForm = this.formBuilder.group({
      name: [ "",
        [Validators.required, Validators.maxLength(32)]
      ],
      contact_person: ["", [Validators.minLength(3), Validators.maxLength(15)]],
      contact_number: ["", [Validators.required, Validators.minLength(10)]],
      email: ["", [Validators.required, Validators.email,Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      address: "",
      city: ["", [Validators.maxLength(15)]],
      state: "",
      pin_code: ["", [Validators.minLength(6)]],
      user_name: ["", [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  onBranchSubmit() {
   if(!this.addBranchForm.valid){
    return;
   }
   this.addBranch(this.addBranchForm['value']);
  }

  addBranch(formValue){
    this.commonService.addBranch(formValue,this.hospitalId).subscribe(response=>{
      if(this.helper.success(response)){
          this.success(response,'addBranch');
          this.setBranchInfo(response['response']);
          this.resetForm();
          this.getHospitalBranches(this.hospitalId,this.search_text);
      }
      else{
        this.helper.errorHandler(response);
      }
    })
  }

  setBranchInfo(response){
    let localData=JSON.parse(localStorage.getItem("login_hospital"));
    localData['hospital_branch_id']=response['hospital_branch_id']
    localData['hospital_branch_name']=response['branch_name']
    localStorage.setItem("login_hospital",JSON.stringify(localData));
  }

  getHospitalBranches(hospitalId,searchText){
      this.commonService.getHospitalBranches(hospitalId,searchText).subscribe(response=>{
        if(this.helper.success(response)){
          this.success(response,'getBranches')
        }
        else{
          this.helper.errorHandler(response);
          this.hospitalList=[];
        }
      })
  }

  getLoggedInUserInfo(){
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId=this.login_hospital['id'];
  }

  resetForm(){
    this.createForm();
  }

  success(response,api_type){
    if(api_type=='addBranch'){
      this.toasty.success(response['message'],'');
    }
    if(api_type=='getBranches'){
        this.hospitalList=response['response'];
    }
  }


  searchBranch(event:Event){
    if(this.search_text.length>=3){
        this.getHospitalBranches(this.hospitalId,this.search_text)
    }
    else if(this.search_text.length==0){
      this.search_text=null;
      this.getHospitalBranches(this.hospitalId,this.search_text)
    }
  }

}
