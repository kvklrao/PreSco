import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppHelper } from '../../../shared/helper/app.helper';
import { ToastrModule } from "ngx-toastr";
import { HospitalAdminInfoComponent } from './hospital-admin-info.component';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonService } from 'src/app/shared/service/common/common.service';
import { of } from 'rxjs';

describe('HospitalAdminInfoComponent', () => {
  let component: HospitalAdminInfoComponent;
  let fixture: ComponentFixture<HospitalAdminInfoComponent>;
  let httpMock: HttpTestingController;
  let commonService:CommonService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HospitalAdminInfoComponent],
      imports: [
        ToastrModule.forRoot(),HttpClientTestingModule],
      providers: [AppHelper,CommonService]
    })
      .compileComponents();
      httpMock = TestBed.get(HttpTestingController);
      commonService = TestBed.get(CommonService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HospitalAdminInfoComponent);
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
  
  it('should create local storage', () => {
    localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92, "hospital_name": "getwell", "hospital_branch_name": "getwell indore", "hospital_branch_id": 59 }))
    expect(component).toBeTruthy();
  });
  it('getDashBoardData method',()=>{
    let res = {
      response:{
      branch:101
      }
  }
      var spy = spyOn(commonService,'getHospitalAdminDashboardData').and.returnValue(of(res));
      component.getDashBoardData()
      spy.calls.mostRecent().returnValue.subscribe(commonService=>{
      expect(commonService).toBe(res);
      }) 
  });
  it('changeBranch method',()=>{
    let event = {
      target: {
        name: "HospitalAdminInfo",
        value: 2
      }
    }
    component.changeBranch(event);
    expect(component.page).toBe(1);
  })
});
