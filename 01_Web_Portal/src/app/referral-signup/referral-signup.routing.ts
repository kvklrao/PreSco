import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReferralSignupComponent } from './referral-signup.component';


const routes: Routes = [
  {
    path: '',
    component: ReferralSignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReferralSignupRouting {
    
}