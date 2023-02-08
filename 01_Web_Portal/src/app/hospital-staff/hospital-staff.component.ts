import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, NavigationEnd } from "@angular/router";
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';
import * as _ from "underscore";
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../shared/constant/app-constant';
@Component({
  selector: 'app-hospital-staff',
  templateUrl: './hospital-staff.component.html',
  styleUrls: ['./hospital-staff.component.css']
})
export class HospitalStaffComponent implements OnInit {
  formRef: any;
  formRefDetail: any;
  addStaffForm: FormGroup;
  public customPatterns = { 'S': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&\]') } };
  public onlyNumber = { '0': { pattern: new RegExp('\[0-9\]') } };
  public namePatters = { 'S': { pattern: new RegExp('\[a-zA-Z \]') } };
   constructor(private modalService: NgbModal, private router: Router, private formBuilder: FormBuilder, private commomService: CommonService, private helper: AppHelper, private toasty: ToastrService, private constant: AppConstant) { }
  selectedBranches = [];
  branchList = [];
  settings = {};
  login_hospital: any = {};
  hospitalId: number;
  hospitalBranchId: number;
  branchRoles = [];
  branchSpecialities = [];
  staffList = [];
  pageLength: number;
  page = 1;
  totalCount: number;
  isEdit = false;
  staffDetailObj: any = {};
  updateStaffId: number;
  statusList: any = [{ id: 0, name: 'Inactive' }, { id: 1, name: 'Active' }];
  doNotAutoComplete: any = {};search_text:string;
  reportToStaffList=[];
  reportToCount=0;
  initcalled=false;
  ngOnInit() {
    this.search_text=null;
    this.pageLength = this.constant.pageLimit;
    this.createForm();
    this.getUserInfo();
    this.getBranchStaffCount(this.search_text);
    this.getBranches();
    this.getBranchRoles();
    this.getBranchSpecialities();
    this.setSettings(false);
  }
  createForm() {
    this.addStaffForm = this.formBuilder.group({
      firstName: ["", [Validators.required, Validators.maxLength(15)]],
      lastName: ["", [Validators.required, Validators.maxLength(15)]],
      contactNumber: ["", [Validators.required, Validators.minLength(10)]],
      email: ["", [Validators.required, Validators.email, Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      reportTo: [""],
      assignRole: ["", [Validators.required]],
      speciality: ["", [Validators.required]],
      branch: ["", [Validators.required]],
      username: ["", [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      status: [1, [Validators.required]],
    });
  }
  setSettings(disableFlag) {
    this.settings = {
      limitSelection: false,
      badgeShowLimit: 2,
      primaryKey: 'hospital_branch_id',
      labelKey: 'branch_name',
      disabled: disableFlag
    };
  }
  open(content, obj) {
    this.getReportTostaffList(null);
    if (_.isEmpty(obj)) {
      if(this.hospitalBranchId==null || this.hospitalBranchId==undefined){
        this.toasty.error("Please Create Branch.", '');
      }else{
        this.setSettings(false);
        this.createForm();
        this.formRef = this.modalService.open(content, { size: "lg" });
      }
    } else {
      this.updateForm(obj);
      this.isEdit = true;
      this.formRef = this.modalService.open(content, { size: "lg" });
    }
  }
  close() {
    this.isEdit = false;
    this.formRef.close();
  }
  closeDetail() {
    this.formRefDetail.close();
  }
  openDetail(openDetail, obj) {
    this.staffDetailObj = obj;
    this.setSettings(true);
    this.getSelectedBranch(obj['hospital_branch_id'])
    this.formRefDetail = this.modalService.open(openDetail, { size: "lg" });
  }
  addStaff() {
    if (!this.addStaffForm.valid) {
      return;
    }
    this.addStaffForm['value']['branch'] = _.pluck(this.selectedBranches, 'hospital_branch_id');
    this.commomService.adsStaff(this.hospitalId, this.hospitalBranchId, this.addStaffForm['value']).subscribe(result => {
      if (this.helper.success(result)) {
        this.success(result, 'addStaff')
        this.selectedBranches = [];
        this.close();
        this.getBranchStaffCount(null);
      } else {
        this.helper.errorHandler(result);
      }
    })
   }
  getUserInfo() {
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId = this.login_hospital['id'];
    this.hospitalBranchId = this.login_hospital['hospital_branch_id'];
  }
  getBranches() {
    this.commomService.getHospitalBranches(this.hospitalId,null).subscribe(response => {
      if (this.helper.success(response)) {
        this.branchList = response['response']
        if(this.login_hospital['user_type']==this.constant.branch_type_login){
          this.setBranch();
        }
      }
    })
  }
  getBranchRoles() {
    this.commomService.getBrancheRole(this.hospitalId, this.hospitalBranchId).subscribe(response => {
      if (this.helper.success(response)) {
        this.branchRoles = response['response']
      }
    })
  }
  getBranchSpecialities() {
    this.commomService.getSpeciality(this.hospitalId, this.hospitalBranchId).subscribe(response => {
      if (this.helper.success(response)) {
        this.branchSpecialities = response['response']
      }
    })
  }
  success(response, apitype) {
    if (apitype == 'addStaff') {
      this.toasty.success(response['message'], '')
    }
    if (apitype == 'getStaff') {
      this.staffList = response['response']
    }
    if (apitype == 'getStaffCount') {
      this.totalCount = response['response']['staff_count'];
      if(!this.initcalled){
        this.reportToCount=response['response']['staff_count'];
        this.initcalled=true;
      }
    }
    if (apitype == 'updateStaff') {
      this.toasty.success(response['message'], '');
    }
    if(apitype=='reportToStaffList'){
      this.reportToStaffList=response['response'];
    }
  }
  getBranchStaff(searchText) {
    this.commomService.getStaff(this.hospitalId, this.hospitalBranchId, this.page, this.pageLength,searchText,1).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'getStaff')
      }
      else {
        this.helper.errorHandler(response);
        this.staffList = [];
      }
    })
  }
  onDropDownChange(pagelength) {
    this.getBranchStaff(this.search_text);
  }
  nextPage(page) {
    let self = this;
    self.page = page;
    this.getBranchStaffCount(this.search_text);
  }
   getBranchStaffCount(searchText) {
    this.commomService.getStaffCounts(this.hospitalId, this.hospitalBranchId,searchText,1).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'getStaffCount')
        this.getBranchStaff(searchText);
      } else {
        this.helper.errorHandler(response);
        this.staffList = [];
      }
    })
  }
   updateForm(obj) {
    this.selectedBranches = [];
    this.updateStaffId = obj['staff_id'];
    this.setSettings(true);
    this.getSelectedBranch(obj['hospital_branch_id'])
    this.addStaffForm.patchValue({
      firstName: obj['first_name'],
      lastName: obj['last_name'],
      contactNumber: obj['contact_number'],
      email: obj['email_address'],
      reportTo: obj['reporting_user_id'],
      assignRole: obj['hospital_branch_role_id'],
      speciality: obj['hospital_branch_speciality_id'],
      branch: obj['hospital_branch_id'],
      username: obj['user_name'],
      password: obj['password'],
      status: obj['status'],
    });
  }
  updateStaff() {
    if (!this.addStaffForm.valid) {
      return;
    }
    this.addStaffForm['value']['branch'] = _.pluck(this.selectedBranches, 'hospital_branch_id');
    this.commomService.updateStaff(this.hospitalId, this.hospitalBranchId, this.updateStaffId, this.addStaffForm['value']).subscribe(result => {
      if (this.helper.success(result)) {
        this.success(result, 'updateStaff')
        this.updateStaffId = null;
        this.isEdit = false;
        this.createForm();
        this.close();
        this.getBranchStaff(this.search_text);
      }else {
        this.helper.errorHandler(result);
      }
    });}
   getSelectedBranch(branch_id) {
    this.selectedBranches = [];
    var vim = this;
    var list = _.find(this.branchList,
      function (num) { return (num['hospital_branch_id'] == branch_id) });
    this.selectedBranches.push(list)
  }
  changeBranch(event) {
    this.page=1;
    this.hospitalBranchId = event.target.value;
    this.createForm();
    this.search_text=null;
    this.getBranchStaffCount(this.search_text);
    this.getBranches();
    this.getBranchRoles();
    this.getBranchSpecialities();
    this.setSettings(false);
  }
  switchTab(tab) {
    var vim = this;
    if(tab == 'hospital-staff') {
      vim.router.navigate(["admin/staff"]);
    }
    if(tab == 'referral-doctor-staff') {
      vim.router.navigate(["admin/referral-doctor"]);
    }
  }
  setBranch(){
    let vim=this;
    let getBranch=_.find(vim.branchList, function(obj){ return obj['hospital_branch_id']==vim.login_hospital['hospital_branch_id']; });
    if(getBranch!=undefined || getBranch!=null){
    vim.branchList=[];
    vim.branchList.push(getBranch);
    vim.selectedBranches.push(getBranch)
    }
  }

  searchStaff(event:Event){
    if(this.search_text.length>=3){
      this.page=1;
      this.getBranchStaffCount(this.search_text);
    }
    else if(this.search_text.length==0){
      this.search_text=null;
      this.getBranchStaffCount(this.search_text);
    }
  }

  getReportTostaffList(searchText){
    this.commomService.getStaff(this.hospitalId, this.hospitalBranchId, 1, this.reportToCount,searchText,1).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'reportToStaffList')
      }
      else {
        this.helper.errorHandler(response);
      }
    })
  }
}
