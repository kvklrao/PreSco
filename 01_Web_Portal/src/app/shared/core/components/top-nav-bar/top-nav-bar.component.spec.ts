import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {Location} from "@angular/common";

import {Router, Routes, ActivatedRoute} from "@angular/router";
import { TopNavBarComponent } from './top-nav-bar.component';

import { DataService } from '../../../service/data.service'
import { url } from 'inspector';
import { HospitalAdminComponent } from 'src/app/user-dashboards/hospital-admin/hospital-admin.component';
import { HospitalAdminInfoComponent } from 'src/app/user-dashboards/hospital-admin/hospital-admin-info/hospital-admin-info.component';
import { HospitalBranchComponent } from 'src/app/hospital-branch/hospital-branch.component';
import { SettingsComponent } from 'src/app/settings/settings.component';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { emptyDataPipe } from 'src/app/shared/pipes/empty-data.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { HospitalStaffComponent } from 'src/app/hospital-staff/hospital-staff.component';
import { MedicalRecordsComponent } from 'src/app/medical-records/medical-records.component';
import { MyProfileComponent } from 'src/app/my-profile/my-profile.component';
import { StaffProfileComponent } from 'src/app/profile/staff-profile/staff-profile.component';
import { ReferralProfileComponent } from 'src/app/profile/referral-profile/referral-profile.component';
import { BranchAdminProfileComponent } from 'src/app/profile/branch-admin-profile/branch-admin-profile.component';
import { ReferralDoctorStaffComponent } from 'src/app/referral-doctor-staff/referral-doctor-staff.component';
import { HospitalStaffDashboardComponent } from 'src/app/user-dashboards/hospital-staff-dashboard/hospital-staff-dashboard.component';
import { ReferralDoctorComponent } from 'src/app/user-dashboards/referral-doctor/referral-doctor.component';
import { HospitalConnectComponent } from 'src/app/hospital-connect/hospital-connect.component';
import { MessageCenterComponent } from 'src/app/message-center/message-center.component';
import { ScoreAnalysisComponent } from 'src/app/score-analysis/score-analysis.component';
import { statusPipe } from 'src/app/shared/pipes/status.pipe';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { userTypePipe } from 'src/app/shared/pipes/user-type.pipe';
import { passwordPipe } from 'src/app/shared/pipes/encrypt-password.pipe';
import { OrderModule } from 'ngx-order-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';


export const routes: Routes = [

  {
    path: 'admin', component: HospitalAdminComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'prefix'},
      {path: 'dashboard', component: HospitalAdminInfoComponent},
      {path:'addbranch',component:HospitalBranchComponent},
      {path:'setting',component:SettingsComponent},
      {path:'staff',component:HospitalStaffComponent},
      {path:'medical-records', component:MedicalRecordsComponent},
      {path:'my-profile', component:MyProfileComponent},
      {path:'staff-profile', component:StaffProfileComponent},
      {path:'referral-profile', component:ReferralProfileComponent},
      {path:'branch-admin-profile', component:BranchAdminProfileComponent},
      {path:'referral-doctor', component:ReferralDoctorStaffComponent},
      {path:'hospital-staff', component:HospitalStaffDashboardComponent},
      {path:'referral-doctors', component:ReferralDoctorComponent},
      {path:'hospital-connect', component:HospitalConnectComponent},
      {path:'message-center', component:MessageCenterComponent},
      {path:'score-analysis/:babyMrNo/:studyId/:reading', component:ScoreAnalysisComponent}
    ],
  },
  
];

@Component({
    selector: 'app-footer',
    template: '',
  })

  class MockFooter{
      
  }

describe('TopNavBarComponent', () => {
  let component: TopNavBarComponent;
  let fixture: ComponentFixture<TopNavBarComponent>;
  let rout: Router ;
  let actRout: ActivatedRoute;
  

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
          TopNavBarComponent,
    ],
      imports:[RouterTestingModule],
      providers:[DataService,]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(TopNavBarComponent);
    component = fixture.componentInstance;
    
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function() {
      return JSON.stringify({"test":"test"});
    });
     spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
        return store[key]=value;
      });
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  it('should create', () => {
    localStorage.setItem("login_hospital",JSON.stringify({"username":"getwell","email":"get@yahoo.com","user_type":"Hospital","id":92,"hospital_name":"getwell","hospital_branch_name":"getwell indore","hospital_branch_id":59}))
    expect(component).toBeTruthy();
  });
  it("when logout method is called",fakeAsync(()=>{
     component.logout();
    //  router.navigate(['']);
    //  tick();
    //  expect(location.path()).toBe('/');
  }));
  it("when changeProfile method is called",fakeAsync(()=>{
    let component = fixture.debugElement.componentInstance;
    component.changeProfile();
       
  }));
  it("when activeTab method is called",()=>{
    let tab="tabname"
    component.activeTab("tabname");
    expect(component.selectedTab).toBe(tab);
  });
  it("when toggleCollapse method is called",()=>{
    let size=window.screen.width;
    if(size<1000){
      expect(component.toggleCollapse()).toBe("#navbarSupportedContent")
    }else{
      expect(component.toggleCollapse()).toBe("")
    }
  });
  it("when showPermission method is called",()=>{
    //localStorage.setItem("login_hospital",JSON.stringify({"username":"getwell","email":"get@yahoo.com","user_type":"Hospital","id":92,"hospital_name":"getwell","hospital_branch_name":"getwell indore","hospital_branch_id":59}))
    component.showPermission("tabname");
  });
});
