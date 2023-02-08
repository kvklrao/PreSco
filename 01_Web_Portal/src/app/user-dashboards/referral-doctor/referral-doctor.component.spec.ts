import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDoctorComponent } from './referral-doctor.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppHelper } from 'src/app/shared/helper/app.helper';
import { ToastrModule } from 'ngx-toastr';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/shared/service/common/common.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('ReferralDoctorComponent', () => {
  let component: ReferralDoctorComponent;
  let fixture: ComponentFixture<ReferralDoctorComponent>;
  let httpMock: HttpTestingController;
  let commonService:CommonService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralDoctorComponent ],
      imports:[FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        NgbModalModule
],
      providers:[AppHelper,CommonService]
    })
    .compileComponents();
    httpMock = TestBed.get(HttpTestingController);
    commonService = TestBed.get(CommonService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralDoctorComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function() {
      return JSON.stringify({"test":"test"});
    });
     spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
        return store[key]=value;
      });
    fixture.detectChanges();
    let cls = ()=>{}
    component.formRef = {close:cls}
  });
  
  it('sendOpinion method',()=>{
    component.selectedOpinion=null
    component.sendOpinion();
    expect(component.sendOpinion).toBeTruthy();
    
    
  });
  it('open method',()=>{
   // spyOn(component,'open');
    component.open("open",{});
    //expect(component.open).toHaveBeenCalled();
  })

  it('should create', () => {
    localStorage.setItem("login_hospital",JSON.stringify({"username":"getwell","email":"get@yahoo.com","user_type":"Hospital","id":92,"hospital_name":"getwell","hospital_branch_name":"getwell indore","referral_id":59}))
    expect(component).toBeTruthy();
  });
  it('success method', () => {
    component.success({response:'succes'},'referralOpinionList');
    component.success({message:'error'},'savedOpinion');

  });
  it('close method',()=>{
    component.open('open',{});
    spyOn(component.formRef,'close');
    component.close();
    expect(component.formRef.close).toHaveBeenCalled();
  });
  it('getOpinionList method',()=>{
    let res = {
      response:{
      branch:101
      }
  }
      var spy = spyOn(commonService,'getReferralOpinonList').and.returnValue(of(res));
      component.getOpinionList()
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      }) 
  });
  it('getDashboardData method',()=>{
    let res = {
      response:{
      branch:101
      }
  }
      var spy = spyOn(commonService,'getReferralDashboardData').and.returnValue(of(res));
      component.getDashboardData()
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      }) 
  })

 
});