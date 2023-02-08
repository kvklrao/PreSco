import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReferralSignupRouting } from './referral-signup.routing';
import { ReferralSignupComponent } from './referral-signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgxMaskModule} from 'ngx-mask'

@NgModule({
  declarations: [ReferralSignupComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ReferralSignupRouting,
    HttpClientModule,
    NgxMaskModule.forRoot()
    
  ]
})
export class RefferalSignupModule { }