import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule, FormBuilder } from "@angular/forms";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CookieService } from 'ngx-cookie-service';
import { CommonService } from "./shared/service/common/common.service";

import { HttpClientModule } from "@angular/common/http";
import { Common } from "./shared/service/common/common";
import { AppConstant } from "./shared/constant/app-constant";
import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface,
  PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";

import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
// import { DashboardRouting } from "./dashboard.routing";
import { MatTabsModule } from "@angular/material";
import { MatIconModule } from "@angular/material";
import { BasicComponent } from "./dashboard/basic/basic.component";
import { GeneralComponent } from "./dashboard/general/general.component";


 import { SearchComponent } from "./dashboard/search/search.component";
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { LevelComponent } from "./dashboard/level/level.component";
import { MaternalComponent } from "./dashboard/maternal/maternal.component";
import { BabyAppearComponent } from "./dashboard/baby-appear/baby-appear.component";
import { BabyRespComponent } from "./dashboard/baby-resp/baby-resp.component";
import { BabyCvComponent } from "./dashboard/baby-cv/baby-cv.component";
import { BabyCnsComponent } from "./dashboard/baby-cns/baby-cns.component";
import { BabyGitComponent } from "./dashboard/baby-git/baby-git.component";
import { BabyInvestigationComponent } from "./dashboard/baby-investigation/baby-investigation.component";
import { FinalComponent } from "./dashboard/final/final.component";
import { ScrollingModule } from "@angular/cdk/scrolling";
import { UserInfoComponent } from "../app/dashboard/user-info/user-info.component";
import { DateLevelPipe } from "./shared/pipes/date-level.pipe";
import { FormsModule } from "@angular/forms";
import { NgbDatepickerModule } from "@ng-bootstrap/ng-bootstrap";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ScrollDispatchModule } from "@angular/cdk/scrolling";
import { AntibioticAdministrationComponent } from "./dashboard/antibiotic-administration/antibiotic-administration.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import {NgxMaskModule} from 'ngx-mask'
import { DataService } from './shared/service/data.service';
import { TopNavBarComponent } from './shared/core/components/top-nav-bar/top-nav-bar.component';
import { HospitalAdminComponent } from './user-dashboards/hospital-admin/hospital-admin.component';
// import { HospitalStaffComponent } from './user-dashboards/hospital-staff/hospital-staff.component';
import { ReferralDoctorComponent } from './user-dashboards/referral-doctor/referral-doctor.component';
import { FooterComponent } from './shared/core/components/footer/footer.component';
import { HospitalAdminInfoComponent } from './user-dashboards/hospital-admin/hospital-admin-info/hospital-admin-info.component';
import { HospitalBranchComponent } from './hospital-branch/hospital-branch.component';
import { AppHelper } from './shared/helper/app.helper';
import { SettingsComponent } from './settings/settings.component';
import { HospitalStaffComponent } from './hospital-staff/hospital-staff.component';
import {NgxPaginationModule} from 'ngx-pagination';
import { MedicalRecordsComponent } from './medical-records/medical-records.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReferralDoctorStaffComponent } from './referral-doctor-staff/referral-doctor-staff.component';
// import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {passwordPipe} from './shared/pipes/encrypt-password.pipe';
import { userTypePipe } from './shared/pipes/user-type.pipe';
import { HospitalStaffDashboardComponent } from './user-dashboards/hospital-staff-dashboard/hospital-staff-dashboard.component';
import { StaffProfileComponent } from './profile/staff-profile/staff-profile.component';
import { ReferralProfileComponent } from './profile/referral-profile/referral-profile.component';
import { BranchAdminProfileComponent } from './profile/branch-admin-profile/branch-admin-profile.component';
import { HospitalConnectComponent } from './hospital-connect/hospital-connect.component';
import { emptyDataPipe } from './shared/pipes/empty-data.pipe';
import { OrderModule } from 'ngx-order-pipe';
import { MessageCenterComponent } from './message-center/message-center.component';
import { statusPipe } from './shared/pipes/status.pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ScoreAnalysisComponent } from './score-analysis/score-analysis.component';
import { RessetPasswordComponent } from './resset-password/resset-password.component';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
@NgModule({
  declarations: [AppComponent,
    DashboardComponent,
    BasicComponent,
    GeneralComponent,
    SearchComponent,
    LevelComponent,
    MaternalComponent,
    BabyAppearComponent,
    BabyRespComponent,
    BabyCvComponent,
    BabyCnsComponent,
    BabyGitComponent,
    BabyInvestigationComponent,
    FinalComponent,   
   UserInfoComponent,
    DateLevelPipe,
    AntibioticAdministrationComponent,
    TopNavBarComponent,
    HospitalAdminComponent,
    HospitalStaffComponent,
    ReferralDoctorComponent,
    FooterComponent,
    HospitalAdminInfoComponent,
    HospitalBranchComponent,
    SettingsComponent,
    MedicalRecordsComponent,
    ReferralDoctorStaffComponent,
    MyProfileComponent,passwordPipe,userTypePipe, HospitalStaffDashboardComponent, StaffProfileComponent, BranchAdminProfileComponent, ReferralProfileComponent, HospitalConnectComponent,emptyDataPipe,MessageCenterComponent,statusPipe, ScoreAnalysisComponent, RessetPasswordComponent],
    imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 1000}),
    HttpClientModule,
    PerfectScrollbarModule,
    FormsModule,
    CommonModule,
    MatTabsModule,
    MatIconModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModalModule,
    ScrollingModule,
    NgbDatepickerModule,
    InfiniteScrollModule,
    ScrollDispatchModule,
    NgxSpinnerModule,
    AngularMultiSelectModule,
    BsDatepickerModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxPaginationModule,OrderModule,Ng2SearchPipeModule
  ],
  providers: [
    CommonService,
    Common,
    CookieService,
    DataService,
    AppHelper,
    FormBuilder,
    AppConstant,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
