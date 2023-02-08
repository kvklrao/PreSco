// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffProfileComponent } from './staff-profile.component';
import { passwordPipe } from '../../shared/pipes/encrypt-password.pipe';
import { ToastrService } from 'ngx-toastr';
import { AppConstant } from '../../shared/constant/app-constant';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonService } from 'src/app/shared/service/common/common.service';
import { AppHelper } from 'src/app/shared/helper/app.helper';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from "ngx-toastr";
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StaffProfileComponent', () => {
  let component: StaffProfileComponent;
  let fixture: ComponentFixture<StaffProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        StaffProfileComponent,
        passwordPipe
      ],
      imports:[
        ReactiveFormsModule,
        FormsModule,
        NgxMaskModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule
      ],
      providers:[ToastrService, AppConstant, CommonService, AppHelper]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffProfileComponent);
    component = fixture.componentInstance;

    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify({ "id": 123, "staff_id": 1234, "hospital_branch_id":12345 });
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value;
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    localStorage.setItem("login_hospital",JSON.stringify({"id":92, "staff_id":1234, "hospital_branch_id":12345}));
    expect(component).toBeTruthy();
  });
  it('form invalid when empty', () => {
    expect(component.staffProfileForm.valid).toBeFalsy();
  });
  it('form validation', () => {
    //form invalid
    let component=fixture.debugElement.componentInstance;
    component.staffProfileForm['value']['firstName']="testfirstNameeee";
    component.staffProfileForm['value']['lastName']="testLastNameeee";
    component.staffProfileForm['value']['contactNumber']=123456;
    component.staffProfileForm['value']['emailAddress']="testemail";
    component.staffProfileForm['value']['userName']="testU";
    component.staffProfileForm['value']['password']="testP";
    component.staffProfileForm['value']['assignRole']="";
    component.staffProfileForm['value']['speciality']="";
    component.staffProfileForm['value']['branch']="";
    expect(component.staffProfileForm.valid).toBeFalsy();    
  });
  it('First name validations',()=>{
    let errors={};
    let firstName=component.staffProfileForm.controls['firstName'];
    firstName.setValue('testfirstnameeee');
    errors=firstName.errors||{};
    expect(errors['maxlength']).toBeTruthy();
    firstName.setValue('testFirstName');
    errors=firstName.errors||{};
    expect(errors['maxlength']).toBeFalsy();
  });
  it('Last name validations',()=>{
    let errors={};
    let lastName=component.staffProfileForm.controls['lastName'];
    lastName.setValue('testfirstnameeee');
    errors=lastName.errors||{};
    expect(errors['maxlength']).toBeTruthy();
    lastName.setValue('testFirstName');
    errors=lastName.errors||{};
    expect(errors['maxlength']).toBeFalsy();
  });
  it('Contact Number validations',()=>{
    let errors={};
    let contactNumber=component.staffProfileForm.controls['contactNumber'];
    contactNumber.setValue('12345');
    errors=contactNumber.errors||{};
    expect(errors['minlength']).toBeTruthy();
    contactNumber.setValue('1234567890');
    errors=contactNumber.errors||{};
    expect(errors['minlength']).toBeFalsy();
  });
  it('Email validations',()=>{
    let component=fixture.debugElement.componentInstance;
    let errors={};
    let email=component.staffProfileForm.controls['emailAddress'];
    email.setValue('testDemogmail.com');
    errors=email.errors||{};
    expect(errors['email']).toBeTruthy();
    expect(errors['pattern']).toBeTruthy();
    email.setValue('testDemo@gmail.com');
    errors=email.errors||{};
    expect(errors['email']).toBeFalsy(); 
  });
  it('User Name validations',()=>{
    let errors={};
    let username=component.staffProfileForm.controls['userName'];
    username.setValue('test');
    errors=username.errors||{};
    expect(errors['minlength']).toBeTruthy();
    username.setValue('test123');
    errors=username.errors||{};
    expect(errors['minlength']).toBeFalsy();
  });
  it('password validations',()=>{
    let errors={};
    let password=component.staffProfileForm.controls['password'];
    password.setValue('test');
    errors=password.errors||{};
    expect(errors['minlength']).toBeTruthy();
    password.setValue('test123');
    errors=password.errors||{};
    expect(errors['minlength']).toBeFalsy();
  }); 
  it("cancel button",()=>{
    component.cancel();
    expect(component.isEdit).toBeFalsy();
  });
  it('Hide and Show password', () => {
    let icontrol = fixture.debugElement.query(By.css('i')).nativeElement;
    let component = fixture.debugElement.componentInstance;
    icontrol.click();
    fixture.detectChanges();
    expect(component.is_toggle).toBeFalsy();
    expect(component.password_class).toBe('fa fa-eye-slash');
    //if button is clicked again than the method is called again
    // icontrol.click();
    // fixture.detectChanges();
    // //expect(component.is_toggle).toBeTruthy();
    // expect(component.password_class).toBe('fa fa-eye-slash');
  });


  it("updateProfile method called",()=>{
  component.createForm();
  component.staffProfileForm.patchValue({
    hospitalId: 1,
    hospitalBranchId: 1,
    staffId: 1,
    firstName: "test",
    lastName:"last_name",
    contactNumber: "1234567890",
    emailAddress: "test@gmail.com",
    userName: "test@123",
    password: "123456",
    reportTo: "5",
    assignRole: "test",
    speciality: "test",
    branch: "test",
});
let res = {
  response:{
    referral_count:101
  }
}
  var spy = spyOn(component['commomService'],'updateStaffProfile').and.returnValue(of(res));
  component.updateProfile()
  spy.calls.mostRecent().returnValue.subscribe(commonService=>{
      expect(commonService).toBe(res);
  }) 

  });

  it("success method called",()=>{
    let data={response:{data:1233}}
    spyOn(component['toasty'],'success')
    component.success({},"updateStaffProfile");
    expect(component['toasty'].success).toHaveBeenCalled();
    component.success(data,"getStaffProfile");
    expect(component.staffProfile).not.toEqual(null);
  });

  it("show_password method called",()=>{
  component.is_toggle=true;
  component.show_password();
  expect(component.password).toEqual('password');
  expect(component.password_class).toEqual("fa fa-eye-slash")
  component.show_password();
  expect(component.password).toEqual('text')
  expect(component.password_class).toEqual("fa fa-eye")
  });
  
});