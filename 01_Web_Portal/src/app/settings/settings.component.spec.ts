import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule } from "ngx-toastr";
import { AppHelper } from '../shared/helper/app.helper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SettingsComponent } from './settings.component';
import { By } from 'protractor';
import { Observable, of } from 'rxjs';
import { CommonService } from '../shared/service/common/common.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment.prod';
import * as _ from "underscore";
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [
        FormsModule, ReactiveFormsModule, NgxMaskModule.forRoot(),
        HttpClientTestingModule,
        NgxPaginationModule,NgbModalModule,
        ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [AppHelper, CommonService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function () {
      return JSON.stringify({ "test": "test" });
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value;
    });
    fixture.detectChanges();
    var close = ()=>{
      return 'test'
    }
    component.formRef = {
      close:close
    }
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92, "hospital_name": "getwell", "hospital_branch_name": "getwell indore", "hospital_branch_id": 59 }))
    expect(component).toBeTruthy();
  });


  //validations
  it('Multiple branch dropdwon', () => {
    let elm1 = fixture.debugElement.nativeElement.querySelector('#form_need');
    expect(elm1).toBeNull();
    component.login_hospital = {
      user_type: 'Hospital'
    }

    fixture.detectChanges();
    let elm2 = fixture.debugElement.nativeElement.querySelector('#form_need');
    expect(elm2).toBeDefined();
  });

  //methods

  it('ngOnInit method', () => {
    spyOn(component, 'getLoggedInUserInfo');
    spyOn(component, 'getUsersCount');
    spyOn(component, 'getBrancheRole');
    spyOn(component, 'getSpeciality');
    spyOn(component, 'getBranches');

    component.ngOnInit();

    expect(component.getLoggedInUserInfo).toHaveBeenCalled();
    expect(component.getUsersCount).toHaveBeenCalled();
    expect(component.getBrancheRole).toHaveBeenCalled();
    expect(component.getSpeciality).toHaveBeenCalled();
    expect(component.getBranches).toHaveBeenCalled();
  });

  it('changeBranch method', () => {
    spyOn(component, 'getBrancheRole');
    spyOn(component, 'getSpeciality');
   // spyOn(component, 'getUser');
    let event = {
      target: {
        value: 123
      }
    };

    component.changeBranch(event);

    expect(component.getBrancheRole).toHaveBeenCalled();
    expect(component.getSpeciality).toHaveBeenCalled();
   // expect(component.getUser).toHaveBeenCalled();
  });

  it('resetFlags method', () => {
    component.resetFlags();

    expect(component.editFlag.length).toBe(0);
    expect(component.editCalled.length).toBe(0);
    expect(component.specialityEditFlag.length).toBe(0);
    expect(component.specialityEditCalled.length).toBe(0);
  });

  it('closeSpecialty method', () => {
    component.specialityEditFlag = [true];
    component.specialityEditCalled = [true];

    component.closeSpecialty(0);

    expect(component.specialityEditFlag[0]).toBeFalsy();
    expect(component.specialityEditCalled[0]).toBeFalsy();
  });


  it('editSpeaciality method', () => {
    component.specialityEditFlag = [false];
    component.specialityEditCalled = [false];

    component.editSpeaciality(0, false);

    expect(component.specialityEditFlag[0]).toBeTruthy();
    expect(component.specialityEditCalled[0]).toBeTruthy();
    expect(component.updatedSpeciality).toBeFalsy();
  });

  it('closeUpdate method', () => {
    component.editCalled = [true];
    component.editFlag = [true];

    component.closeUpdate(0);

    expect(component.editCalled[0]).toBeFalsy();
    expect(component.editFlag[0]).toBeFalsy();
  });

  it('edit method', () => {
    component.editCalled = [false];
    component.editFlag = [false];

    component.edit(0, 'test');

    expect(component.editCalled[0]).toBeTruthy();
    expect(component.editFlag[0]).toBeTruthy();
    expect(component.updatedRole).toBe('test');
  });

  it('createEditFlagList method', () => {
    spyOn(_, 'each');
    component.createEditFlagList();
    expect(_.each).toHaveBeenCalled();
  });

  it('success method', () => {
    spyOn(component["toasty"], 'success');
    let res = {
      message: "test",
      response: ['test']
    };
    component.success(res, "addRole");
    expect(component["toasty"].success).toHaveBeenCalled();

    component.success(res, "removeBranchRole");
    expect(component.hospital_branch_speciality_id).toBe("");
    // expect(component.specialityList).toBe(res.response);


    component.success(res, "addSpeciality");
    expect(component["toasty"].success).toHaveBeenCalled();

    component.success(res, "removeSpeciality");
    expect(component.hospital_branch_speciality_id).toBe("");
    // expect(component.specialityList).toBe(res.response);

    component.success(res, "updatSuccess");
    expect(component["toasty"].success).toHaveBeenCalled();

    component.success(res, "updatSpeciality");
    expect(component["toasty"].success).toHaveBeenCalled();

    component.success(res, "updateUserPermission");
    expect(component["toasty"].success).toHaveBeenCalled();
    expect(component.userListDummy.length).toBe(0);
  });

  it('onChangeTab method', () => {
    spyOn(component, 'resetFlags');
    component.isRole = false;
    component.isSpeciality = true;
    component.isUserAccess = true;

    component.onChangeTab('role');

    expect(component.isRole).toBeTruthy();
    expect(component.isSpeciality).toBeFalsy();
    expect(component.isUserAccess).toBeFalsy();
    expect(component.resetFlags).toHaveBeenCalled();

    component.isRole = true;
    component.isSpeciality = false;
    component.isUserAccess = true;

    component.onChangeTab('speciality');

    expect(component.isRole).toBeFalsy();
    expect(component.isSpeciality).toBeTruthy();
    expect(component.isUserAccess).toBeFalsy();
    expect(component.resetFlags).toHaveBeenCalled();

    component.isRole = true;
    component.isSpeciality = true;
    component.isUserAccess = false;

    component.onChangeTab('user_access');

    expect(component.isRole).toBeFalsy();
    expect(component.isSpeciality).toBeFalsy();
    expect(component.isUserAccess).toBeTruthy();
    expect(component.resetFlags).toHaveBeenCalled();
  });

  it('resetForm method', () => {
    spyOn(component.roleForm, 'reset');
    component.resetForm();
    expect(component.roleForm.reset).toHaveBeenCalled();
  });


  it('nextPage method', () => {
    spyOn(component, 'getUsersCount');
    component.nextPage(1);
    expect(component.getUsersCount).toHaveBeenCalled();
  });

  it('onDropDownChange method', () => {
    spyOn(component, 'getUser');
   // spyOn(component, 'getUsersCount');

    component.onDropDownChange(1);
    expect(component.getUser).toHaveBeenCalled();
    //expect(component.getUsersCount).toHaveBeenCalled();
  });

  it('updateList method', () => {
    component.userList = [
      {test:125}
    ]
    component.userListDummy = ['test'];
    component.updateList(0, 'test', 5);
    expect(component.userListDummy.length).toBe(2);
  });

  it('changePermission method', () => {
    spyOn(component,'setPermission');
    spyOn(component.userListDummy,'findIndex');
    let event = {
      target:{
        checked:false
      }
    }
    component.userList = [
      {test:123}
    ]
    component.changePermission(0,'test',event,123,{});
    expect(component.setPermission).toHaveBeenCalled();

    component.userListDummy = [
      {test:123}
    ]
    component.changePermission(0,'test',event,123,{});
    expect(component.userListDummy[0]["test"]).toBe(0);
  });

  it('searchUser method', () => {
    let event:Event;
   spyOn(component,'getUsersCount');
   component.search_text="abc";
   component.searchUser(event);
   expect(component.getUsersCount).toHaveBeenCalled();
   component.search_text="";
   expect(component.getUsersCount).toHaveBeenCalled();
  });

  it('updateSpeciality method', () => {
    component.updatedSpeciality="test";
    component.hospitalId=1;
    component.hospitalBranchId=2;
    let res = {
      response:{
        referral_count:101
      },status:200
  }
      var spy = spyOn(component['commonService'],'updateHospitalSpeciality').and.returnValue(of(res));
      component.updateSpeciality(1,21);
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      })
  });

  it('updateRole method', () => {
    component.updatedRole="test";
    component.hospitalId=1;
    component.hospitalBranchId=2;
    let res = {
      response:{
        referral_count:101
      },status:200
  }
      var spy = spyOn(component['commonService'],'updateHospitalRole').and.returnValue(of(res));
      component.updateRole(1,21);
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      })
  });


  it('getUsers method', () => {
    component.updatedRole="test";
    component.hospitalId=1;
    component.hospitalBranchId=2;
    component.page=1;
    component.pageLength=10;
    let res = {
      response:{
        referral_count:101
      },status:200
  }
      var spy = spyOn(component['commonService'],'getStaff').and.returnValue(of(res));
      component.getUser("");
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      })
  });

  it('updatePermission method', () => {
    component.updatedRole="test";
    component.hospitalId=1;
    component.hospitalBranchId=2;
    component.userListDummy=[];
    let res = {
      response:{
        referral_count:101
      },status:200
  }
      var spy = spyOn(component['commonService'],'updateUserPermission').and.returnValue(of(res));
      component.updatePermission();
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      })
  });

  it('removeSpeciality method', () => {
    component.updatedRole="test";
    component.hospitalId=1;
    component.hospitalBranchId=2;
    component.userListDummy=[];
    let res = {
      response:{
        referral_count:101
      },status:200
  }
      var spy = spyOn(component['commonService'],'removeSpeciality').and.returnValue(of(res));
      component.removeSpeciality(12);
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      })
  });

  // it('onSpecialityFormSubmit method', () => {
  //   component.updatedRole="test";
  //   component.hospitalId=1;
  //   component.hospitalBranchId=2;
  //   component.speciality={};
  //   let res = {
  //     response:{
  //       referral_count:101
  //     },status:200
  // }
  //     var spy = spyOn(component['commonService'],'addSpeciality').and.returnValue(of(res));
  //     component.onSpecialityFormSubmit();
  //     spy.calls.mostRecent().returnValue.subscribe(commonService=>{
  //         expect(commonService).toBe(res);
  //     })
  // });



});
