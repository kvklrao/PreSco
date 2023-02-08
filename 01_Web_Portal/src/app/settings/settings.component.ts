import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../shared/constant/app-constant';
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as _ from "underscore";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  model: any = {}; speciality: any = {};roleList = [];specialityList = [];userList = [];userListDummy = [];formRef: any;hospital_branch_role_id = '';
  hospital_branch_speciality_id = '';pageLength: number;page = 1; totalCount: number;hospitalId: number;hospitalBranchId: number;login_hospital: any = {};
  isRole = true;isSpeciality = false;isUserAccess = false;editFlag = [];editCalled = []; specialityEditFlag = []; specialityEditCalled = [];
  updatedRole: string; updatedSpeciality: string; roleJson: any = {}; branchList = [];search_text:string;
  @ViewChild('roleForm') roleForm;
  @ViewChild('specialityForm') specialityForm;
  public namePatters = { 'S': { pattern: new RegExp('\[a-zA-Z \]') } };
  constructor(private commonService: CommonService, private helper: AppHelper, private toasty: ToastrService, private constant: AppConstant, private modalService: NgbModal) { }
  
  ngOnInit() {
    this.search_text=null;
    this.isRole = true;
    this.isSpeciality = false;
    this.isUserAccess = false;
    this.pageLength = this.constant.pageLimit;
    this.getLoggedInUserInfo();
    this.getUsersCount(null);
    this.getBrancheRole(this.hospitalId, this.hospitalBranchId);
    this.getSpeciality(this.hospitalId, this.hospitalBranchId);
    this.getBranches(this.hospitalId);
  }
  onRoleFormSubmit() {
    if(this.hospitalBranchId != null){
    this.commonService.addRole(this.model, this.hospitalId, this.hospitalBranchId).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'addRole')
        this.resetForm();
        this.getBrancheRole(this.hospitalId, this.hospitalBranchId);
      } else {
        this.helper.errorHandler(response);
      }})
   } else { this.toasty.error("Please Create Branch.", '');}}

  getBrancheRole(hospitalId, hospitalBranchId) {
    this.commonService.getBrancheRole(hospitalId, hospitalBranchId).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'getBrancheRole');
      } else {
        this.helper.errorHandler(response);
        this.roleList = [];
      }
    })}

  removeBranchRole(hospital_branch_role_id) {
    this.commonService.removeBranchRole(hospital_branch_role_id).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'removeBranchRole');
        this.close()
        this.getBrancheRole(this.hospitalId, this.hospitalBranchId);
      } else {
        this.helper.errorHandler(response);
      }
    })
  }
  onSpecialityFormSubmit() {
    if(this.hospitalBranchId != null){
    this.commonService.addSpeciality(this.speciality, this.hospitalId, this.hospitalBranchId).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'addSpeciality')
        this.specialityForm.reset();
        this.getSpeciality(this.hospitalId, this.hospitalBranchId);
      }else { this.helper.errorHandler(response); } })
    } else { this.toasty.error("Please Create Branch.", '');}
  }

  getSpeciality(hospitalId, hospitalBranchId) {
    this.commonService.getSpeciality(hospitalId, hospitalBranchId).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'getSpeciality');
      } else {
        this.helper.errorHandler(response);
        this.specialityList = [];
      }
    })
  }
  removeSpeciality(hospital_branch_speciality_id) {
    this.commonService.removeSpeciality(hospital_branch_speciality_id).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'removeSpeciality');
        this.close()
        this.getSpeciality(this.hospitalId, this.hospitalBranchId);
      } else {
        this.helper.errorHandler(response);
      }
    })
  }
  changePermission(index, fieldname, event, staff_id, updateObj) {
    if (this.userList.length > 0) {
      if (this.userListDummy.length > 0) {
        const i = this.userListDummy.findIndex(userObj => userObj['staff_id'] === updateObj['staff_id']);
        if (i != -1) {
          if (event.target.checked) {
            this.userListDummy[i][fieldname] = 1;
          } else {this.userListDummy[i][fieldname] = 0;}
        } else {this.setPermission(event, index, fieldname); }
      } else { this.setPermission(event, index, fieldname); }
    }
  }
  setPermission(event, index, fieldname) {
    if (event.target.checked) {
      this.userList[index][fieldname] = 1;
      this.userListDummy.push(this.userList[index]);
    } else {
      this.userList[index][fieldname] = 0;
      this.userListDummy.push(this.userList[index]);
    }
  }

  updateList(index,fieldName,value){
    this.userList[index][fieldName] = value;
    this.userListDummy.push(this.userList[index]);
  }
  updatePermission() {
    this.commonService.updateUserPermission(this.hospitalId, this.hospitalBranchId, this.userListDummy).subscribe(response => {
      if(this.helper.success(response)) {
        this.success(response, "updateUserPermission");
      } else {
        this.helper.errorHandler(response);
      }
    })
  }
  getUser(searchText) {
    this.commonService.getStaff(this.hospitalId, this.hospitalBranchId, this.page, this.pageLength,searchText,0).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'getUser');
      } else {
        this.helper.errorHandler(response);
        this.userList = [];
      }
    })
  }
  onDropDownChange(pagelength) {
     this.getUser(null);
    // this.getUsersCount();
  }
  nextPage(page) {
    let self = this;
    self.page = page;
    this.getUsersCount(null);
  }
  getUsersCount(searchText) {
    this.commonService.getStaffCounts(this.hospitalId, this.hospitalBranchId,searchText,0).subscribe(response => {
      if (this.helper.success(response)) {
        this.success(response, 'getStaffCount')
        this.getUser(searchText);
      }  else {
        this.helper.errorHandler(response);
        this.userList = [];
      }
    })
  }
  getLoggedInUserInfo() {
    this.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospitalId = this.login_hospital['id'];
    this.hospitalBranchId = this.login_hospital['hospital_branch_id'];
  }
  getBranches(hospitalId) {
    this.commonService.getHospitalBranches(this.hospitalId,null).subscribe(response => {
      if (this.helper.success(response)) {
        this.branchList = response['response']
      }
      else {
        this.branchList = [];
      }
    })
  }
  resetForm() {
    this.roleForm.reset();
  }
  onChangeTab(tab) {
    var vim = this;
    if (tab == 'role') {
      vim.isRole = true;  vim.isSpeciality = false;  vim.isUserAccess = false;
      vim.resetFlags();
    }
    if (tab == 'speciality') {
      vim.isRole = false; vim.isSpeciality = true; vim.isUserAccess = false;
      vim.resetFlags();
    }
    if (tab == 'user_access') {
      vim.userListDummy=[];
      vim.getUsersCount(null);
      vim.isRole = false; vim.isSpeciality = false;  vim.isUserAccess = true;
      vim.resetFlags();
    }
  }
  success(response, api_type) {
    if (api_type == 'addRole') { this.toasty.success(response['message'], '');}
    if (api_type == 'getBrancheRole') {this.roleList = _.sortBy(response['response'], 'role');  }
    if (api_type == 'removeBranchRole') {
      this.roleList = response['response'];
      this.hospital_branch_role_id = '';
    }
    if (api_type == 'addSpeciality') { this.toasty.success(response['message'], '');}
    if (api_type == 'getSpeciality') { this.specialityList = _.sortBy(response['response'], 'speciality');  }
    if (api_type == 'removeSpeciality') {
      this.specialityList = response['response'];
      this.hospital_branch_speciality_id = '';
    }
    if (api_type == 'updatSuccess') { this.toasty.success(response['message'], '')}
    if (api_type == 'updatSpeciality') {this.toasty.success(response['message'], '');}
    if (api_type == 'getUser') {this.userList = response['response'];}
    if (api_type == 'getStaffCount') { this.totalCount = response['response']['staff_count']; }
    if (api_type == 'updateUserPermission') {
      this.toasty.success(response['message'], '');
      this.userListDummy = [];}
  }
  open(content, id, tab, index) {
    if (tab == 'role') {
      this.hospital_branch_role_id = id;
    }
    if (tab == 'speciality') {
      this.hospital_branch_speciality_id = id;
    }
    this.formRef = this.modalService.open(content, { size: "sm" });
    this.editFlag[index] = false;
    this.editCalled[index] = false;
  }
  createEditFlagList() {
    _.each(this.roleList, this.editFlag.push(false));
  }

  close() {
    this.formRef.close();
  }

  edit(index, roleName) {
    this.editFlag[index] = true; this.updatedRole = roleName; this.editCalled[index] = true;
  }

  closeUpdate(index) {
    this.editCalled[index] = false; this.editFlag[index] = false;
  }

  editSpeaciality(index, speciality) {
    this.specialityEditFlag[index] = true; this.updatedSpeciality = speciality; this.specialityEditCalled[index] = true;
  }
  closeSpecialty(index) {
    this.specialityEditFlag[index] = false; this.specialityEditCalled[index] = false;
  }

  updateRole(index, roleId) {
    this.roleJson['role'] = this.updatedRole;
    this.commonService.updateHospitalRole(this.hospitalId, this.hospitalBranchId, roleId, this.roleJson).subscribe(result => {
      if (this.helper.success(result)) {
        this.success(result, 'updatSuccess');
        this.getBrancheRole(this.hospitalId, this.hospitalBranchId);
        this.editFlag[index] = false;
        this.editCalled[index] = false;
      } else {this.helper.errorHandler(result); }  })
  }

  updateSpeciality(index, specialityId) {
    let specialityJson: any = {};
    specialityJson['speciality'] = this.updatedSpeciality;
    this.commonService.updateHospitalSpeciality(this.hospitalId, this.hospitalBranchId, specialityId, specialityJson).subscribe(result => {
      if (this.helper.success(result)) {
        this.success(result, 'updatSpeciality');
        this.getSpeciality(this.hospitalId, this.hospitalBranchId);
        this.specialityEditFlag[index] = false;
        this.specialityEditCalled[index] = false;
      }else { this.helper.errorHandler(result); }})
  }

  resetFlags() {
    this.editFlag = []; this.editCalled = []; this.specialityEditFlag = []; this.specialityEditCalled = [];
    this.model={};this.speciality={};
  }
  
  changeBranch(event) {
    this.page=1;
    this.hospitalBranchId = event.target.value;
    this.getBrancheRole(this.hospitalId, this.hospitalBranchId);
    this.getSpeciality(this.hospitalId, this.hospitalBranchId);
    this.getUsersCount(null)
  }
  searchUser(event:Event){
 if(this.search_text.length>=3){
    this.getUsersCount(this.search_text);
 }
 else if(this.search_text.length==0){
  this.getUsersCount(null);
 }
  }
}