import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgetRouting } from './forget.routing';
import { ForgetComponent } from './forget.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [ForgetComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ForgetRouting,
    HttpClientModule
    
  ]
})
export class ForgetModule { }
