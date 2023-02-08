import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageCenterComponent } from './message-center.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AppHelper } from '../shared/helper/app.helper';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { CommonService } from '../shared/service/common/common.service';
import { AppConstant } from '../shared/constant/app-constant';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



describe('MessageCenterComponent', () => {
  let component: MessageCenterComponent;
  let fixture: ComponentFixture<MessageCenterComponent>;
  let httpMock: HttpTestingController;
  let commonService:CommonService;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MessageCenterComponent],
            imports: [
                ScrollingModule,
                FormsModule,
                Ng2SearchPipeModule,
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ToastrModule.forRoot()
            ],
            providers:[
                AppHelper,
                ToastrService,
                CommonService,
                AppConstant
            ]
        })
            .compileComponents();
            httpMock = TestBed.get(HttpTestingController);
            commonService = TestBed.get(CommonService);
    }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageCenterComponent);
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
    localStorage.setItem("login_hospital",JSON.stringify({"username":"getwell","email":"get@yahoo.com","user_type":"Hospital","id":92,"hospital_name":"getwell","hospital_branch_name":"getwell indore","hospital_branch_id":59}));
    expect(component).toBeTruthy();
  });
  it('setMsgContStyle method',()=>{
     component.setMsgContStyle();
     expect(component.isListItemClicked).toBeFalsy();
  });
  it('setDropDownData method',()=>{
     // spyOn(component,'getStaffUsers');
      component.setDropDownData();
      //expect(component.getStaffUsers).toHaveBeenCalled();
  });
 it('success method',()=>{
     let apiType="staffUsers";
     let response="response";
     component.success(apiType="sendMessage",response="message");
     component.success(apiType="staffUsers",response="response");
     component.success(apiType="hospitalAndBranchAdmins",response="response");
     component.success(apiType="getMessages",response="response");
     component.success(apiType="hospitalReferralDoctors",response="response");
     component.success(apiType="referralDoctorHospitalAdmin",response="response");
     component.success(apiType="referralStaffList",response="response");
     component.success(apiType="AllBranchStaffs",response="response");
     component.success(apiType="getStaffReferralDoctors",response="response");
     component.success(apiType="HospitalBranchStaff",response="response");     
 });
 it('getStaffUsers method',()=>{
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getStaffUsers').and.returnValue(of(res));
        component.getStaffUsers()
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        }) 
 });
it('getHospitalReferralDoctorsUsers method',()=>{
    // component.getHospitalReferralDoctorsUsers();
    // commonService.getHospitalReferralDoctors(101).subscribe((results)=>{
    //     //console.log(results);
    //     expect(results).toBeTruthy();
    // });
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getHospitalReferralDoctors').and.returnValue(of(res));
        component.getHospitalReferralDoctorsUsers()
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        }) 
});
it('getHospitalAndBranchAdmin method',()=>{
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getHospitalAndBranchAdmins').and.returnValue(of(res));
        component.getHospitalAndBranchAdmin()
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        }) 
   // component.getHospitalAndBranchAdmin();
});
it('sendMessage method',()=>{
    expect(component.checkEmptyMessage()).toBeFalsy();
    component.sendMessage();
});
it('getMessages method',()=>{
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getMessages').and.returnValue(of(res));
        component.getMessages(101,100);
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        }) 
    //component.getMessages(101,201);
});
it('checkEmptyMessage method',()=>{
    component.checkEmptyMessage();
    expect(component.recieverId).toBeUndefined()
});
it('refreshData method',()=>{
    spyOn(component,'getMessages');
    component.refreshData();
    expect(component.getMessages).toHaveBeenCalled();
});
it('updateReadStatus method',()=>{
  
    component.updateReadStatus(101,201,0);
});
it('getReferralStaffList method',()=>{
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getReferralStaffList').and.returnValue(of(res));
        component.getReferralStaffList()
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        }) 
    
});
it('getAllBranchStaffs method',()=>{
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getAllBranchStaffs').and.returnValue(of(res));
        component.getAllBranchStaffs()
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        }) 
    
});
it('getStaffReferralDoctors method',()=>{
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getStaffReferralDoctrs').and.returnValue(of(res));
        component.getStaffReferralDoctors()
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        }) 
});
it('getReferralDocHospitalAdmins method',()=>{
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getReferralHospitalAdmins').and.returnValue(of(res));
        component.getReferralDocHospitalAdmins()
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        }) 
}); 
// it('scrollBottom method',()=>{
//     component.scrollBottom();
// });
it('getHospitalBranchStaffUsers method',()=>{
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getBranchStaffUsers').and.returnValue(of(res));
        component.getHospitalBranchStaffUsers()
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        })
    
});
it('setDropDownData methjod',()=>{
    component.setDropDownData();
    //expect(component.userType).toBe("Hospital");
}); 
// it('getUserMessages method',()=>{
//     spyOn(component,'updateReadStatus');
//     component.getUserMessages(1,1,1);
//     expect(component.updateReadStatus).toHaveBeenCalled();
// })

it('getAllBranchStaffs(){ method',()=>{
    let res = {
        response:{
        branch:101
        }
    }
        var spy = spyOn(commonService,'getAllBranchStaffs').and.returnValue(of(res));
        component.getAllBranchStaffs()
        spy.calls.mostRecent().returnValue.subscribe(commonService=>{
            expect(commonService).toBe(res);
        })
});
it('checkLoggedInUser',()=>{
    component.checkLoggedInUser();
})

it('setDropDownData method',()=>{
    component.userType="Hospital";
    spyOn(component,'getStaffUsers');
    component.setDropDownData();
    expect(component.getStaffUsers).toHaveBeenCalled();
    component.userType="Hospital Branch";
    spyOn(component,'getHospitalBranchStaffUsers');
    component.setDropDownData();
    expect(component.getHospitalBranchStaffUsers).toHaveBeenCalled();
    component.userType="Hospital Staff";
    spyOn(component,'getAllBranchStaffs');
    component.setDropDownData();
    expect(component.getAllBranchStaffs).toHaveBeenCalled();
    component.userType="Referral Doctor";
    spyOn(component,'getReferralStaffList');
    component.setDropDownData();
    expect(component.getReferralStaffList).toHaveBeenCalled();
});


});
