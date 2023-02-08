import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup.component';
import { SignupRouting } from './signup.routing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {NgxMaskModule} from 'ngx-mask'

@NgModule({
  declarations: [SignupComponent],
  imports: [
    CommonModule,
    SignupRouting,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot()
  ]
})
export class SignupModule { }
