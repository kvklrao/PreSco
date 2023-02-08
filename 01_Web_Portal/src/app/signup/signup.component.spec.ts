import { async, ComponentFixture, TestBed, fakeAsync,tick  } from '@angular/core/testing';
import {Location} from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {RouterTestingModule} from "@angular/router/testing";
import {Router, Routes} from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import {NgxMaskModule} from 'ngx-mask';
import { SignupComponent } from './signup.component';
import { LoginComponent } from '../login/login.component';
import { By } from '@angular/platform-browser';
import { query } from '@angular/core/src/render3';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

export const routes: Routes = [
  {
    path: '',
    component: SignupComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
];

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let router: Router;
  let location: Location;

  // export const routes: Routes = [
  //   {path: '', redirectTo: 'home', pathMatch: 'full'},
  //   {path: 'home', component: HomeComponent},
  //   {path: 'search', component: SearchComponent}
  // ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupComponent, LoginComponent ],
      imports: [BrowserAnimationsModule,FormsModule, ReactiveFormsModule, HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes), NgxMaskModule.forRoot(),
        ToastrModule.forRoot()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    router = TestBed.get(Router); 
    location = TestBed.get(Location);
    router.initialNavigation(); 
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  it('signup form should be loaded first', () => {
    expect(component).toBeTruthy();
  });

  it('Redirect to Login screen when login method called', fakeAsync(() => {
    let component = fixture.debugElement.componentInstance;
    component.login();
    router.navigate(['/login']); 
    tick(10);
    expect(location.path()).toBe('/login');
  }));

  it('Password and confirm password should be same',()=>{
    let component = fixture.debugElement.componentInstance;
    let compiled=fixture.debugElement.nativeElement;
    let passwordField=component.signForm.controls['password'];
    let confirmPasswordField=component.signForm.controls['confirmPass'];
    spyOn(component,'is_match');
    passwordField.setValue('123456');
    confirmPasswordField.setValue('123456');
    expect(component.is_match).toBeTruthy();
  });

  it('errorHandler method', () => {
    spyOn(component, "errorToasty");
    component.errorHandler("test", "signup");
    expect(component.errorToasty).toHaveBeenCalled();
  });

  it('isSuccess method', () => {
    expect(component.isSuccess({})).toBeFalsy();

    let obj: Object = {
      status: 200
    };
    expect(component.isSuccess(obj)).toBeTruthy();

    obj["status"] = 404;
    expect(component.isSuccess(obj)).toBeFalsy();
  });

  it('isAlreadyExist method', () => {
    expect(component.isAlreadyExist({})).toBeFalsy();

    let obj: Object = {
      status: 422
    };
    expect(component.isAlreadyExist(obj)).toBeTruthy();
  });

  it('success method', () => {
    component.success({},"signup");
  });

  it("signup method",()=>{
    component.signup();
  });


});
