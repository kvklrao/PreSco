import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RessetPasswordComponent } from './resset-password.component';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppHelper } from '../shared/helper/app.helper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('RessetPasswordComponent', () => {
  let component: RessetPasswordComponent;
  let fixture: ComponentFixture<RessetPasswordComponent>;
  let router:Router

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RessetPasswordComponent],
      imports:[FormsModule,ReactiveFormsModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,BrowserAnimationsModule
      ],
      providers:[
        AppHelper
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RessetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('resetPassword method',()=>{
    component.resetPassword();
  });

  it('success method',()=>{
    component.success({},"apiType");
  });

  it('Password and confirm password should be same',()=>{
    let component = fixture.debugElement.componentInstance;
    let compiled=fixture.debugElement.nativeElement;
    let passwordField=component.forgetWithPasswordForm.controls['password'];
    let confirmPasswordField=component.forgetWithPasswordForm.controls['confirmPass'];
    spyOn(component,'is_match');
    passwordField.setValue('123456');
    confirmPasswordField.setValue('123456');
    expect(component.is_match).toBeTruthy();
  });

});
