import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BabyCnsComponent } from './dashboard/baby-cns/baby-cns.component';
import { GeneralComponent } from './dashboard/general/general.component';
import { MaternalComponent } from './dashboard/maternal/maternal.component';
import { BabyAppearComponent } from './dashboard/baby-appear/baby-appear.component';
import { BabyRespComponent } from './dashboard/baby-resp/baby-resp.component';
import { BabyCvComponent } from './dashboard/baby-cv/baby-cv.component';
import { BabyGitComponent } from './dashboard/baby-git/baby-git.component';
import { BabyInvestigationComponent } from './dashboard/baby-investigation/baby-investigation.component';
import { AntibioticAdministrationComponent } from './dashboard/antibiotic-administration/antibiotic-administration.component';
import { FinalComponent } from './dashboard/final/final.component';
import { HospitalAdminComponent } from './user-dashboards/hospital-admin/hospital-admin.component';
import { HospitalAdminInfoComponent } from './user-dashboards/hospital-admin/hospital-admin-info/hospital-admin-info.component';
import { HospitalBranchComponent } from './hospital-branch/hospital-branch.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { HospitalStaffComponent } from './hospital-staff/hospital-staff.component';
import { MedicalRecordsComponent } from './medical-records/medical-records.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ReferralDoctorStaffComponent } from './referral-doctor-staff/referral-doctor-staff.component';
import { HospitalStaffDashboardComponent } from './user-dashboards/hospital-staff-dashboard/hospital-staff-dashboard.component';
import { StaffProfileComponent } from './profile/staff-profile/staff-profile.component';
import { ReferralProfileComponent } from './profile/referral-profile/referral-profile.component';
import { BranchAdminProfileComponent } from './profile/branch-admin-profile/branch-admin-profile.component';
import { ReferralDoctorComponent } from './user-dashboards/referral-doctor/referral-doctor.component';
import { HospitalConnectComponent } from './hospital-connect/hospital-connect.component';
import { MessageCenterComponent } from './message-center/message-center.component';
import { ScoreAnalysisComponent } from './score-analysis/score-analysis.component';
import { RessetPasswordComponent } from './resset-password/resset-password.component';
const routes: Routes = [
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule'
  },
  // {
  //   path: 'dashboard', component: DashboardComponent,
  //   children: [
  //     {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
  //     {path: 'baby-profile', component: GeneralComponent},
  //     {path: 'mother-profile', component: MaternalComponent},
  //     {path: 'baby-appearence', component: BabyAppearComponent},
  //     {path: 'baby-respiratory', component: BabyRespComponent},
  //     {path: 'baby-cardio-vascular', component: BabyCvComponent},
  //     {path: 'baby-cns', component: BabyCnsComponent},
  //     {path: 'baby-gi-tract', component: BabyGitComponent},
  //     {path: 'baby-investigation', component: BabyInvestigationComponent},
  //     {path: 'anitibiotic-administration', component: AntibioticAdministrationComponent},
  //     {path: 'final-diagnosis', component: FinalComponent},
  //   ]
  // }
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
      {path: 'baby-profile', component: GeneralComponent},
      {path: 'mother-profile', component: MaternalComponent},
      {path: 'baby-appearence', component: BabyAppearComponent},
      {path: 'baby-respiratory', component: BabyRespComponent},
      {path: 'baby-cardio-vascular', component: BabyCvComponent},
      {path: 'baby-cns', component: BabyCnsComponent},
      {path: 'baby-gi-tract', component: BabyGitComponent},
      {path: 'baby-investigation', component: BabyInvestigationComponent},
      {path: 'anitibiotic-administration', component: AntibioticAdministrationComponent},
      {path: 'final-diagnosis', component: FinalComponent},
    ],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'admin', component: HospitalAdminComponent,
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'prefix',canActivate: [AuthGuard]},
      {path: 'dashboard', component: HospitalAdminInfoComponent,canActivate: [AuthGuard]},
      {path:'addbranch',component:HospitalBranchComponent,canActivate: [AuthGuard]},
      {path:'setting',component:SettingsComponent,canActivate: [AuthGuard]},
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
  {
    path: 'reset_password/:passcode',
    component: RessetPasswordComponent
  },
  {
    path: 'forget_password',
    loadChildren: './forget/forget.module#ForgetModule'
  },
  {
    path: 'referral-signup',loadChildren: './referral-signup/referral-signup.module#RefferalSignupModule'
  },
  {
    path: 'signup',
    loadChildren: './signup/signup.module#SignupModule'
  },
  {
    path: '',
    loadChildren: './login/login.module#LoginModule'
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true ,onSameUrlNavigation:'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
