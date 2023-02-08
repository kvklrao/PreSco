import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HospitalBranchComponent } from './hospital-branch.component';
import {NgxMaskModule} from 'ngx-mask';
import { ToastrModule } from "ngx-toastr";
import { AppHelper } from '../shared/helper/app.helper';
import { emptyDataPipe } from '../shared/pipes/empty-data.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('HospitalBranchComponent', () => {
  let component: HospitalBranchComponent;
  let fixture: ComponentFixture<HospitalBranchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalBranchComponent,emptyDataPipe ],
      imports: [
        FormsModule, ReactiveFormsModule, NgxMaskModule.forRoot(),
        HttpClientTestingModule,BrowserAnimationsModule,
        ToastrModule.forRoot()],
      providers:[AppHelper]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalBranchComponent);
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

  it("contact_person field validation",()=>{
     let errors={};
     let contact_person=component.addBranchForm.controls['contact_person'];
     contact_person.setValue('testContact');
     errors=contact_person.errors||{};
     expect(errors['required']).toBeFalsy();

     contact_person.setValue('xy');
     errors=contact_person.errors||{};
     expect(errors['minlength']).toBeTruthy();

     contact_person.setValue('testcontactpersontest');
     errors=contact_person.errors||{};
     expect(errors['maxlength']).toBeTruthy();
   });
  
  it('email field validation', () => {
    let errors={};
    let email=component.addBranchForm.controls['email'];
    email.setValue('');
    errors = email.errors || {};
    expect(errors['required']).toBeTruthy();
    email.setValue('testname@gmail.com');
    errors = email.errors || {};
    expect(errors['required']).toBeFalsy();

    email.setValue('testemail');
    errors=email.errors||{};
    expect(errors['email']).toBeTruthy();
  });
  it('city field validation', () => {
    let errors={};
    let city=component.addBranchForm.controls['city'];
    city.setValue('testname');
    errors = city.errors || {};
    expect(errors['required']).toBeFalsy();

    city.setValue("testcitytestcitytest");
    errors=city.errors||{};
    expect(errors['maxlength']).toBeTruthy();
  });
   it('pin_code field validation', () => {
    let errors={};
    let pin_code=component.addBranchForm.controls['pin_code'];
    pin_code.setValue('testname');
    errors = pin_code.errors || {};
    expect(errors['required']).toBeFalsy();
 });

  it('user_name field validation', () => {
    let errors={};
    let user_name=component.addBranchForm.controls['user_name'];
    user_name.setValue('');
    errors = user_name.errors || {};
    expect(errors['required']).toBeTruthy();

    user_name.setValue('un');
    errors=user_name.errors||{};
    expect(errors['minlength']).toBeTruthy();

    user_name.setValue('testname');
    errors = user_name.errors || {};
    expect(errors['required']).toBeFalsy();
  });
  it('password field validation', () => {
    let errors={};
    let password=component.addBranchForm.controls['password'];
    password.setValue('');
    errors = password.errors || {};
    expect(errors['required']).toBeTruthy();

    password.setValue('tp');
    errors=password.errors||{};
    expect(errors['minlength']).toBeTruthy();

    password.setValue('testname');
    errors = password.errors || {};
    expect(errors['required']).toBeFalsy();
  });
  it("when onBranchSubmit method is called",()=>{
    component.onBranchSubmit();
    expect(component.addBranchForm.invalid).toBeTruthy();
  });
  it("when addBranch method is called",()=>{
    let obj={
      name:"",
      contact_person:"",
      contact_number: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pin_code: "",
      user_name: "",
      password: ""
    }
    component.addBranch(obj);
  });
  it("when setBranchInfo method is called",()=>{
    let obj={
      name:"",
      contact_person:"",
      contact_number: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pin_code: "",
      user_name: "",
      password: ""
    }
    component.setBranchInfo(obj);
  });
  it("when resetform method is called",()=>{
    spyOn(component,'createForm');
    component.resetForm();
    expect(component.createForm).toHaveBeenCalled();
  });
  it("when success method is called",()=>{
    let response=null;
    let apti_type="addBRanch";
    component.success(response,apti_type); 
  });
});
