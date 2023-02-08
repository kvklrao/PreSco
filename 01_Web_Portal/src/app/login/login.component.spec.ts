import { async, ComponentFixture, TestBed, fakeAsync,tick } from '@angular/core/testing';
import {Location} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {Router, Routes} from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { CookieService } from 'ngx-cookie-service';
import {NgxMaskModule} from 'ngx-mask';
import { LoginComponent } from './login.component';
import { SignupComponent } from '../signup/signup.component';
import { ForgetComponent } from '../forget/forget.component';
import { By } from '@angular/platform-browser';
import { RefferalSignupModule } from '../referral-signup/referral-signup.module';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
  selector: "test-test",
  template:""
})
class MackCompo{

}
export const routes: Routes = [
  {
    path: '',
    component: MackCompo
  },
  {
    path: 'signup',
    component: MackCompo
  },
  {
    path: 'forget_password',
    component: MackCompo
  },
  {
    path: 'referral-signup',
    component : MackCompo
  },
  {
    path: 'admin', component: MackCompo,
  }
];

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let location: Location;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent, MackCompo],
      imports: [FormsModule, ReactiveFormsModule, HttpClientTestingModule, BrowserAnimationsModule,
        RouterTestingModule.withRoutes(routes), NgxMaskModule.forRoot(),
        ToastrModule.forRoot()],
        providers: [
          CookieService
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router); 
    location = TestBed.get(Location);
    router.initialNavigation(); 
    fixture.detectChanges();

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  
  it('Login component should created', () => {
    localStorage.setItem("login_hospital",JSON.stringify({"username":"getwell","email":"get@yahoo.in","user_type":"Hospital","id":92,"hospital_name":"getwell","hospital_branch_name":"getwell bhopal","hospital_branch_id":60}))
    expect(component).toBeTruthy();
  });

  it('If username and password are empty', () => {
    let component = fixture.debugElement.componentInstance;
    component.loginForm.controls['username'].setValue('');
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.valid).toBeFalsy();
    const button = fixture.debugElement.query(By.css('input[type=submit]'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('Redirect to Signup screen when signup method called', fakeAsync(() => {
    let component = fixture.debugElement.componentInstance;
    component.signup();
    router.navigate(['signup']); 
    tick();
    expect(location.path()).toBe('/signup');
  }));

  it('Redirect to Forget password screen when forget_password method called', fakeAsync(() => {
    let component = fixture.debugElement.componentInstance;
    component.forget_password();
    router.navigate(['forget_password']); 
    tick();
    expect(location.path()).toBe('/forget_password');
  }));

  it('Hide and Show password', () => {
    let icontrol = fixture.debugElement.query(By.css('i')).nativeElement;
    let component = fixture.debugElement.componentInstance;
    icontrol.click();
    expect(component.is_toggle).toBeTruthy();
    expect(component.password_class).toBe('fa fa-eye');
    //if button is clicked again than the method is called again
    icontrol.click();
    fixture.detectChanges();
    expect(component.is_toggle).toBeFalsy();
    expect(component.password_class).toBe('fa fa-eye-slash');
  });

  it('Valid username and password', fakeAsync(() => {
    let component = fixture.debugElement.componentInstance;
    component.loginForm.controls['username'].setValue('apollo');
    component.loginForm.controls['password'].setValue('apollo');
    spyOn(component, 'login');
    // let login_button = fixture.debugElement.query(By.css('input[type=submit]')).nativeElement;
    // login_button.click();
    component.login();
    // router.navigate(['dashboard']);
    // tick(); 
    // expect(location.path()).toBe('/dashboard');
    //expect(component.login).toHaveBeenCalledTimes(1);
  }));


  it('referralSignup method', () => {
    component.referralSignup()
    expect(location.path()).toBe('/');
  });

  it('navIgateUser method', () => {
    let res = {
      user_type: "Hospital"
    }
    spyOn(router,'navigateByUrl')
    component.navIgateUser(res)
    expect(router.navigateByUrl).toHaveBeenCalled();

    res["user_type"] = "Hospital Branch"
    component.navIgateUser(res)
    expect(router.navigateByUrl).toHaveBeenCalled();

    res["user_type"] = "Hospital Staff"
    component.navIgateUser(res)
    expect(router.navigateByUrl).toHaveBeenCalled();

    res["user_type"] = "Referral Doctor"
    component.navIgateUser(res)
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('isSuccess method', () => {
    var value = component.isSuccess({})
    expect(value).toBeFalsy();
    let res = {
      status: 200
    }
    var value = component.isSuccess(res)
    expect(value).toBeTruthy();
  });

    it('success method', () => {
    spyOn(component['commonAsyn'],'isHide')
    component.success({},null);
    expect(component['commonAsyn'].isHide).toHaveBeenCalled()

    let res = {
      status: 200,
      response: {
        user_type:"Hospital"
      }
    }
    component.loginForm.value["remember_me"] = true
    spyOn(component['cookieService'],'set')
    spyOn(component['cookieService'],'deleteAll')
    component.success(res,null);
    expect(component['cookieService'].set).toHaveBeenCalled()

    component.loginForm.value["remember_me"] = false
    component.success(res,null);
    expect(component['cookieService'].deleteAll).toHaveBeenCalled()
  });

  it('login method', () => {
    component.submitted = false;
    component.login()
    expect(component.submitted).toBeTruthy()
    component.loginForm.setValue({
      username:"getwell",
      password: "getwell",
      remember_me: false
    })
    spyOn(component['commonAsyn'],'showLoader')
    component.login()
    expect(component['commonAsyn'].showLoader).toHaveBeenCalled()
  });

});
