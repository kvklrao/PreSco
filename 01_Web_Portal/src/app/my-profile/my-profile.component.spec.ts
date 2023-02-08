import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from "ngx-toastr";
import { AppHelper } from '../shared/helper/app.helper';
import { NgxMaskModule } from 'ngx-mask';
import { MyProfileComponent } from './my-profile.component';
import { passwordPipe } from '../shared/pipes/encrypt-password.pipe';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyProfileComponent, passwordPipe],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, NgxMaskModule.forRoot(),BrowserAnimationsModule,
        ToastrModule.forRoot()],
      providers: [AppHelper]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function () {
      return JSON.stringify({ "test": "test" });
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
    localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92, "hospital_name": "getwell", "hospital_branch_name": "getwell indore", "hospital_branch_id": 59 }))
    expect(component).toBeTruthy();
  });

  it('form validation failed', () => {
    let component = fixture.debugElement.componentInstance;
    component.myProfileForm['value']['email_address'] = "testdemo";
    component.myProfileForm['value']['hospital_id'] = 92;
    component.myProfileForm['value']['hospital_name'] = "test";
    component.myProfileForm['value']['user_name'] = "testuser";
    component.myProfileForm['value']['password'] = "123456";
    component.myProfileForm['value']['user_id'] = 486;
    expect(component.myProfileForm.valid).toBeFalsy();
  });

  // it('form validation pass', () => {
  //   let component=fixture.debugElement.componentInstance;
  //   component.myProfileForm['value']['email_address']="testdemo@gmail.com";
  //   component.myProfileForm['value']['hospital_id']=92;
  //   component.myProfileForm['value']['hospital_name']="test";
  //   component.myProfileForm['value']['user_name']="testuser";
  //   component.myProfileForm['value']['password']="123456";
  //   component.myProfileForm['value']['user_id']=486;
  //   expect(component.myProfileForm.valid).toBeTruthy();
  // });

  it('email validations', () => {
    let component = fixture.debugElement.componentInstance;
    let errors = {};
    let email = component.myProfileForm.controls['email_address'];
    email.setValue('testDemogmail.com');
    errors = email.errors || {};
    expect(errors['email']).toBeTruthy();
  })

  it('user name validations', () => {
    let errors = {};
    let username = component.myProfileForm.controls['user_name'];
    username.setValue('test');
    errors = username.errors || {};
    expect(errors['minlength']).toBeTruthy();
    username.setValue('test123');
    errors = username.errors || {};
    expect(errors['minlength']).toBeFalsy();
  })

  it('password validations', () => {
    let errors = {};
    let password = component.myProfileForm.controls['password'];
    password.setValue('test');
    errors = password.errors || {};
    expect(errors['minlength']).toBeTruthy();
    password.setValue('test123');
    errors = password.errors || {};
    expect(errors['minlength']).toBeFalsy();
  })

  it('hospital name validations', () => {
    let errors = {};
    let hospital_name = component.myProfileForm.controls['hospital_name'];
    hospital_name.setValue('testffffffffffffffffffffffffffffffffffffffff');
    errors = hospital_name.errors || {};
    expect(errors['maxlength']).toBeTruthy();
    hospital_name.setValue('testhospital');
    errors = hospital_name.errors || {};
    expect(errors['minlength']).toBeFalsy();
  })

  it('show_password method', () => {
    component.is_toggle = true;
    component.show_password()
    expect(component.password).toBe("password");
    component.show_password()
    component.is_toggle = false;
    expect(component.password).toBe("text");
  });

  it('success method', () => {
    spyOn(component["toasty"], 'success')
    let res = {
      response: "test",
      message: ""
    }
    component.success(res, 'getProfile')
    expect(component.myProfile).toBe("test");
    component.success(res, 'updateProfile')
    expect(component['toasty'].success).toHaveBeenCalled();

  });

  it('cancel method', () => {
    component.cancel()
    expect(component.isEdit).toBeFalsy();
  });

  it('updateProfile method', () => {
    expect(component.updateProfile()).toBeUndefined();
    let res = {
      status: 200,
      msg: "test"
    }
    component.myProfileForm.patchValue({
      hospital_id: "123",
      hospital_name: "fgfhfgh",
      user_name: "fghghfgh",
      contact_number: "3465554654",
      address: "fgffg",
      email_address: "fghgfh@ff.ff",
      city: "hjhgj",
      state: "ghjghj",
      pincode: "546546546",
      password: "ghjfgdhj",
      user_id: "ghdfgdjhj"
    });
    spyOn(component, 'success')
    spyOn(component["helper"], 'errorHandler')
    let spy = spyOn(component['commomService'], 'updateHospitalProfile').and.returnValue(of(res))
    component.updateProfile();
    spy.calls.mostRecent().returnValue.subscribe((res) => {
      expect(component.success).toHaveBeenCalled();
    });
    res['status']=400
    spy.and.returnValue(of(res))
    component.updateProfile();
    spy.calls.mostRecent().returnValue.subscribe((res) => {
      expect(component["helper"].errorHandler).toHaveBeenCalled();
    });
  });
});
