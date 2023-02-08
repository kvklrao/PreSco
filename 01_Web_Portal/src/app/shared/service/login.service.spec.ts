import { TestBed, inject } from '@angular/core/testing';
import { HttpClient } from "@angular/common/http";
import { LoginService } from './login.service';
import { Observable, of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    })
    service = TestBed.get(LoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('login method', inject([HttpClient],(http:HttpClient)=>{
    spyOn(http,'get').and.returnValue(of([]));
    service.login('test').subscribe(dt=>{
      expect(dt).toEqual([]);
    });
  }));

  it('signup method', inject([HttpClient],(http:HttpClient)=>{
    spyOn(http,'get').and.returnValue(of([]));
    service.signup('test').subscribe(dt=>{
      expect(dt).toEqual([]);
    });
  }));

  it('referral_signup method', inject([HttpClient],(http:HttpClient)=>{
    spyOn(http,'get').and.returnValue(of([]));
    service.referral_signup('test').subscribe(dt=>{
      expect(dt).toEqual([]);
    });
  }));

  it('forgot_password method', inject([HttpClient],(http:HttpClient)=>{
    spyOn(http,'get').and.returnValue(of([]));
    service.forgot_password('test').subscribe(dt=>{
      expect(dt).toEqual([]);
    });
  }));

  it('auto_suggetion method', inject([HttpClient],(http:HttpClient)=>{
    spyOn(http,'get').and.returnValue(of([]));
    service.auto_suggetion('test').subscribe(dt=>{
      expect(dt).toEqual([]);
    });
  }));

});
