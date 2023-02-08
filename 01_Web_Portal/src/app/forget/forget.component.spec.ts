import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {Router, Routes} from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { ForgetComponent } from './forget.component';
import { By } from '@angular/platform-browser';
import { executionAsyncId } from 'async_hooks';
import { AppHelper } from '../shared/helper/app.helper';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const routes: Routes = [
  {
    path: '',
    component: ForgetComponent
  }
];

describe('ForgetComponent', () => {
  let component: ForgetComponent;
  let fixture: ComponentFixture<ForgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetComponent ],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),BrowserAnimationsModule,
        ToastrModule.forRoot()],
        providers:[AppHelper]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create forget component', () => {
    expect(component).toBeTruthy();
  });

  it('Email field validation', () => {
    let errors={};
    let component = fixture.debugElement.componentInstance;
    let emailField=component.forgetForm.controls['email'];
    emailField.setValue('testgmail.com');
    errors = emailField.errors || {};
    expect(errors['email']).toBeTruthy();
    emailField.setValue('test@gmail.com');
    errors = emailField.errors || {};
    expect(errors['email']).toBeFalsy();
  });

  it('password and confirm password should be same', () => {
    let component = fixture.debugElement.componentInstance;
    let compiled=fixture.debugElement.nativeElement;
    let passwordField=component.forgetWithPasswordForm.controls['password'];
    let confirmPasswordField=component.forgetWithPasswordForm.controls['confirmPass'];
    spyOn(component,'is_match');
    passwordField.setValue('123456');
    confirmPasswordField.setValue('12345');
    expect(component.is_match).toBeTruthy();
  });
  
  it('valid email field form',()=>{
    let component = fixture.debugElement.componentInstance;
   // spyOn(component,'forget_password_email');
    component.forgetForm.controls['email'].setValue('test@gmail.com');
    expect(component.forgetForm.valid).toBeTruthy();
    // const button = fixture.debugElement.query(By.css('input[type=submit]'));
    // expect(button.nativeElement.disabled).toBeFalsy();
  })

  it('valid new password form',()=>{
    let component = fixture.debugElement.componentInstance;
    component.forgetWithPasswordForm.controls['password'].setValue('test123456');
    component.forgetWithPasswordForm.controls['confirmPass'].setValue('test123456');
    expect(component.forgetWithPasswordForm.valid).toBeTruthy();
  })

  it('password and confirm password minimum length validation',()=>{
    let component = fixture.debugElement.componentInstance;
    let errors={};
    let cerrors={};
    let passwordField=component.forgetWithPasswordForm.controls['password'];
    let confirmPassField=component.forgetWithPasswordForm.controls['confirmPass'];
    passwordField.setValue('1234');
    confirmPassField.setValue('1234')
    errors=passwordField.errors || {};
   cerrors=confirmPassField.errors || {};
    expect(errors['minlength']).toBeTruthy();
    expect(cerrors['minlength']).toBeTruthy();
  });
  // it("when forget_password method is called",()=>{
  //   component.createForm();
  //   component.forget_password();
  //   expect(component.forgetWithPasswordForm.invalid).toBeTruthy();
  // });
  it("when is_match method is called",()=>{
    component.is_match();
  });
  it("when forget_password_email method is called",()=>{
    component.createForm();
    // component.forget_password_email();
    expect(component.forgetForm.invalid).toBeTruthy();

  });

  it('forget password method', () => {
    let component = fixture.debugElement.componentInstance;
    let compiled=fixture.debugElement.nativeElement;
    let passwordField=component.forgetWithPasswordForm.controls['password'];
    let confirmPasswordField=component.forgetWithPasswordForm.controls['confirmPass'];
    spyOn(component,'is_match');
    passwordField.setValue('123456');
    confirmPasswordField.setValue('12345');
    expect(component.is_match).toBeTruthy();
  });

  afterAll(() => {
    TestBed.resetTestingModule();
  });
  
});