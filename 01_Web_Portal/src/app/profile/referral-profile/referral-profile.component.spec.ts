import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReferralProfileComponent } from './referral-profile.component';
import { passwordPipe } from '../../shared/pipes/encrypt-password.pipe';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppHelper } from 'src/app/shared/helper/app.helper';
import { ToastrModule } from "ngx-toastr";
import { CommonService } from 'src/app/shared/service/common/common.service';
import { emptyDataPipe } from 'src/app/shared/pipes/empty-data.pipe';


describe('ReferralProfileComponent', () => {
  let component: ReferralProfileComponent;
  let fixture: ComponentFixture<ReferralProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ReferralProfileComponent,
        passwordPipe,
        emptyDataPipe
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgxMaskModule.forRoot(),
        HttpClientTestingModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        AppHelper,
        CommonService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralProfileComponent);
    component = fixture.componentInstance;

    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(() => {
      return JSON.stringify({ "id": 123, "referral_id": 1234 });
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
    localStorage.setItem("login_hospital", JSON.stringify({ "id": 92, "referral_id": 1234 }));
    expect(component).toBeTruthy();
  });

  ///validation

  it("address field validation", () => {
    let signupRefForm = component.referralProfileForm;

    let isInvalid = signupRefForm.controls.address.invalid;
    expect(isInvalid).toBeTruthy();

    signupRefForm.controls.address.setValue("test!!");
    expect(signupRefForm.controls.address.valid).toBeTruthy();

  });

  it("city field validation", () => {
    let signupRefForm = component.referralProfileForm;
    let isInvalid = signupRefForm.controls.city.invalid;
    expect(isInvalid).toBeTruthy();

    signupRefForm.controls.city.setValue("test!!");
    expect(signupRefForm.controls.city.valid).toBeTruthy();

    signupRefForm.controls.city.setValue("this is max length 32 validation testing xyz");
    expect(signupRefForm.controls.city.valid).toBeFalsy();

  });

  it("contactNumber field validation", () => {
    let signupRefForm = component.referralProfileForm;
    let isInvalid = signupRefForm.controls.contactNumber.invalid;
    expect(isInvalid).toBeTruthy();

    signupRefForm.controls.contactNumber.setValue(1234567890);
    expect(signupRefForm.controls.contactNumber.valid).toBeTruthy();
  });

  it("email field validation", () => {
    let signupRefForm = component.referralProfileForm;
    let isInvalid = signupRefForm.controls.emailAddress.invalid;
    expect(isInvalid).toBeTruthy();

    signupRefForm.controls.emailAddress.setValue("test@ad101.com");
    expect(signupRefForm.controls.emailAddress.valid).toBeTruthy();

    signupRefForm.controls.emailAddress.setValue("wrong email");
    expect(signupRefForm.controls.emailAddress.valid).toBeFalsy();

  });

  it("firstName field validation", () => {
    let signupRefForm = component.referralProfileForm;
    let isInvalid = signupRefForm.controls.firstName.invalid;
    expect(isInvalid).toBeTruthy();

    signupRefForm.controls.firstName.setValue("test!!");
    expect(signupRefForm.controls.firstName.valid).toBeTruthy();
    signupRefForm.controls.firstName.setValue("max length 15 testing");
    expect(signupRefForm.controls.firstName.valid).toBeFalsy();

  });

  it("lastName field validation", () => {
    let signupRefForm = component.referralProfileForm;
    let isInvalid = signupRefForm.controls.lastName.invalid;
    expect(isInvalid).toBeTruthy();
    signupRefForm.controls.lastName.setValue("test!!");
    expect(signupRefForm.controls.lastName.valid).toBeTruthy();
    signupRefForm.controls.lastName.setValue("max length 15 testing");
    expect(signupRefForm.controls.lastName.valid).toBeFalsy();

  });

  it("password field validation", () => {
    let signupRefForm = component.referralProfileForm;
    let isInvalid = signupRefForm.controls.password.invalid;
    expect(isInvalid).toBeTruthy();
    signupRefForm.controls.password.setValue("test!!");
    let isValid = signupRefForm.controls.password.valid;
    expect(isValid).toBeTruthy();

  });

  it("state field validation", () => {
    let signupRefForm = component.referralProfileForm;
    let isInvalid = signupRefForm.controls.state.invalid;
    expect(isInvalid).toBeTruthy();
    signupRefForm.controls.state.setValue("test!!");
    expect(signupRefForm.controls.state.valid).toBeTruthy();

    signupRefForm.controls.state.setValue("this is max length 32 validation testing xyz");
    expect(signupRefForm.controls.state.valid).toBeFalsy();

  });

  it("userName field validation", () => {
    let signupRefForm = component.referralProfileForm;
    let isInvalid = signupRefForm.controls.userName.invalid;
    expect(isInvalid).toBeTruthy();
    signupRefForm.controls.userName.setValue("test!!");
    expect(signupRefForm.controls.userName.valid).toBeTruthy();

    signupRefForm.controls.userName.setValue("minl6");
    expect(signupRefForm.controls.userName.valid).toBeFalsy();

  });

  ///btn testing

  // it("Save button validation", () => {
  //   let signupRefForm = component.referralProfileForm;
  //   expect(signupRefForm.valid).toBeFalsy();

  //   signupRefForm.setValue({ //all valid
  //     address: "test address",
  //     city: "test city",
  //     contactNumber: "1234567890",
  //     emailAddress: "test@ad101.com",
  //     firstName: "testFname",
  //     lastName: "testLname",
  //     password: "1234567890",
  //     pincode: "123456",
  //     state: "test state",
  //     userName: "test@123",
  //   });

  //   expect(signupRefForm.valid).toBeTruthy();

  //   signupRefForm.setValue({
  //     address: "test address",
  //     city: "test city test city test city test city test city", //invalid
  //     contactNumber: "string number",
  //     emailAddress: "test@ad101.com",
  //     firstName: "testFname",
  //     lastName: "testLname",
  //     password: "1234567890",
  //     pincode: "123456",
  //     state: "test state",
  //     userName: "test@123",
  //   });

  //   expect(signupRefForm.valid).toBeFalsy();

  //   signupRefForm.setValue({
  //     address: "test address",
  //     city: "test city",
  //     contactNumber: "abcdefgh",//invalid
  //     emailAddress: "test@ad101.com",
  //     firstName: "testFname",
  //     lastName: "testLname",
  //     password: "1234567890",
  //     pincode: "123456",
  //     state: "test state",
  //     userName: "test@123",
  //   });

  //   expect(signupRefForm.valid).toBeFalsy();

  //   signupRefForm.setValue({
  //     address: "test address",
  //     city: "test city",
  //     contactNumber: "1234567890",
  //     emailAddress: "test", //invalid
  //     firstName: "testFname",
  //     lastName: "testLname",
  //     password: "1234567890",
  //     pincode: "123456",
  //     state: "test state",
  //     userName: "test@123",
  //   });

  //   expect(signupRefForm.valid).toBeFalsy();

  //   signupRefForm.setValue({
  //     address: "test address",
  //     city: "test city",
  //     contactNumber: "1234567890",
  //     emailAddress: "test@ad101.com",
  //     firstName: "testFname testFname testFname", //invalid
  //     lastName: "testLname testLname testLname", //invalid
  //     password: "1234567890",
  //     pincode: "123456",
  //     state: "test state",
  //     userName: "test@123",
  //   });

  //   expect(signupRefForm.valid).toBeFalsy();

  //   signupRefForm.setValue({
  //     address: "test address",
  //     city: "test city",
  //     contactNumber: "1234567890",
  //     emailAddress: "test@ad101.com",
  //     firstName: "testFname",
  //     lastName: "testLname",
  //     password: "1234567890",
  //     pincode: "123", //invalid
  //     state: "test state",
  //     userName: "test@123",
  //   });

  //   expect(signupRefForm.valid).toBeFalsy();

  //   signupRefForm.setValue({
  //     address: "test address",
  //     city: "test city",
  //     contactNumber: "1234567890",
  //     emailAddress: "test@ad101.com",
  //     firstName: "testFname",
  //     lastName: "testLname",
  //     password: "1234567890",
  //     pincode: "123456",
  //     state: "test state test state test state test state test state test state", //invalid
  //     userName: "test@123",
  //   });

  //   expect(signupRefForm.valid).toBeFalsy();

  //   signupRefForm.setValue({
  //     address: "test address",
  //     city: "test city",
  //     contactNumber: "1234567890",
  //     emailAddress: "test@ad101.com",
  //     firstName: "testFname",
  //     lastName: "testLname",
  //     password: "1234567890",
  //     pincode: "123456",
  //     state: "test state",
  //     userName: "test", //invalid
  //   });

  //   expect(signupRefForm.valid).toBeFalsy();

  // });

  //Edit btn validation

  it("Edit btn should work", () => {

    let obj = { //all valid
      address: "test address",
      city: "test city",
      contactNumber: "1234567890",
      emailAddress: "test@ad101.com",
      firstName: "testFname",
      lastName: "testLname",
      password: "1234567890",
      pincode: "123456",
      state: "test state",
      userName: "test@123",
    }

    expect(component.isEdit).toBeFalsy();

    component.updateForm(obj);
    expect(component.isEdit).toBeTruthy();

    component.cancel();
    expect(component.isEdit).toBeFalsy();


    expect(component.referralProfileForm.controls.address.value).toEqual("test address");

  });

});
