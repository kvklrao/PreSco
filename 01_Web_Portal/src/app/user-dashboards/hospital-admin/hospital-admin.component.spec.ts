import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { HospitalAdminComponent } from './hospital-admin.component';
import { AppRoutingModule } from "../../app-routing.module";
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
 import { ToastrModule } from 'ngx-toastr';
 import { HttpClientTestingModule } from '@angular/common/http/testing';
 import { MatTabsModule, MatIconModule } from '@angular/material';
 import { NgxSpinnerModule } from 'ngx-spinner';
 import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
 import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
 import { NgxMaskModule } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { CommonService } from 'src/app/shared/service/common/common.service';
import { Common } from 'src/app/shared/service/common/common';
import { CookieService } from 'ngx-cookie-service';
import { DataService } from 'src/app/shared/service/data.service';
import { AppHelper } from 'src/app/shared/helper/app.helper';
import { userTypePipe } from '../../shared/pipes/user-type.pipe';
import { passwordPipe } from '../../shared/pipes/encrypt-password.pipe';
import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { DashboardComponent } from 'src/app/dashboard/dashboard.component';
import { GeneralComponent } from 'src/app/dashboard/general/general.component';

@Component(
  {
    selector: 'app-top-nav-bar',
    template: '',
  }
)
class MockTemp {
  
}

@Component(
  {
    selector: 'app-footer',
    template: '',
  }
)
class Mock2 {
  
}

@Component(
  {
    selector: 'app-search',
    template: '',
  }
)
class Mock3 {
  
}

var rout:Routes = [
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
      {path: 'baby-profile', component: MockTemp},
      {path: 'mother-profile', component: MockTemp},
      {path: 'baby-appearence', component: MockTemp},
      {path: 'baby-respiratory', component: MockTemp},
      {path: 'baby-cardio-vascular', component: MockTemp},
      {path: 'baby-cns', component: MockTemp},
      {path: 'baby-gi-tract', component: MockTemp},
      {path: 'baby-investigation', component: MockTemp},
      {path: 'anitibiotic-administration', component: MockTemp},
      {path: 'final-diagnosis', component: MockTemp},
    ],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'admin', component: HospitalAdminComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'prefix'},
      {path: 'dashboard', component: DashboardComponent},
      {path:'addbranch',component:MockTemp},
      {path:'setting',component:MockTemp},
      {path:'staff',component:MockTemp},
      {path:'medical-records', component:MockTemp},
      {path:'my-profile', component:MockTemp},
      {path:'staff-profile', component:MockTemp},
      {path:'referral-profile', component:MockTemp},
      {path:'branch-admin-profile', component:MockTemp},
      {path:'referral-doctor', component:MockTemp},
      {path:'hospital-staff', component:MockTemp},
      {path:'referral-doctors', component:MockTemp},
      {path:'hospital-connect', component:MockTemp},
      {path:'message-center', component:MockTemp},
      {path:'score-analysis/:babyMrNo/:studyId/:reading', component:MockTemp}
    ],
  }
]
describe('HospitalAdminComponent', () => {
  let component: HospitalAdminComponent;
  let fixture: ComponentFixture<HospitalAdminComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalAdminComponent, MockTemp, Mock2,Mock3, DashboardComponent,
        userTypePipe,
        passwordPipe ],
        imports: [
          ReactiveFormsModule,
          RouterTestingModule.withRoutes(rout),
          ToastrModule.forRoot(),
          FormsModule,
          MatTabsModule,
          MatIconModule,
          HttpClientTestingModule,
          NgxSpinnerModule,
          AngularMultiSelectModule,
          BsDatepickerModule.forRoot(),
          NgxMaskModule.forRoot(),
          NgxPaginationModule
        ],
        providers: [
          CommonService,
          Common,
          CookieService,
          DataService,
          AppHelper
        ],
    })
    .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(HospitalAdminComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function() {
      return JSON.stringify({"test":"test"});
    });
     spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
        return store[key]=value;
      });
    fixture.detectChanges();
  }));

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  it('should create', () => {
    // localStorage.setItem("login_hospital",JSON.stringify({"username":"getwell","email":"get@yahoo.com","user_type":"Hospital","id":92,"hospital_name":"getwell","hospital_branch_name":"getwell indore","hospital_branch_id":59}))
    expect(component).toBeTruthy();
  });
});
