// import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalConnectComponent } from './hospital-connect.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppHelper } from '../shared/helper/app.helper';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { OrderModule } from 'ngx-order-pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';



describe('HospitalConnectComponent', () => {
  let component: HospitalConnectComponent;
  let fixture: ComponentFixture<HospitalConnectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HospitalConnectComponent ],
      imports: [
        NgxPaginationModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        OrderModule,
        BrowserAnimationsModule       
    ],
    providers:[AppHelper]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalConnectComponent);
    component = fixture.componentInstance;
    let setValue={};
    spyOn(window.localStorage,"setItem").and.callFake((key,value)=>{
      return setValue[key]=value;
    })
    spyOn(window.localStorage,"getItem").and.callFake(()=>{
      return JSON.stringify({"referral_id":123})
    })

    fixture.detectChanges();

  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  it('should create', () => {
    localStorage.setItem("login_hospital",JSON.stringify({"referral_id":123}));
    expect(component).toBeTruthy();
  });

  //methods

  it('nextPage method', () => {
    spyOn(component,'gethospitalList');
    component.nextPage(2);
    expect(component.gethospitalList).toHaveBeenCalled();
  });

  it('onDropDownChange method', () => {
    spyOn(component,'gethospitalList');
    component.onDropDownChange(2);
    expect(component.gethospitalList).toHaveBeenCalled();
  });

  it('updateStatus method', () => {
    let res = 
      {
        message: "status updated successfully",
        response: {
          referral_hospital_id: 14,
          hospital_id: "1"
        },
        status:200
      }
  
      var spy = spyOn(component['common'],'updateSubscriptionStatus').and.returnValue(of(res));
      let obj ={"referral_hospital_id":12 ,"hospital_initiation_status_id":2 ,"previousStatus":1,"currentStatus":2,"requesterType":"Hospital","hospitalActionStatus":2,"referralActionStatus":3,"referralHospitalId":null}
      component.updateStatus(2,2,obj)
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
          expect(commonService).toBe(res);
      })
      console.log(component.newStatusObj); 
  });
});
