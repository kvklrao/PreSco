import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  status = false;
  baseUrl = environment.server_url;
  constructor(private http: HttpClient) {

  }

  login(data) {
    return this.http.post(this.baseUrl + 'login', data, this.jwt());
  }

  signup(data) {
    return this.http.post(this.baseUrl + 'hospital/signUp', data, this.jwt());
  }

  referral_signup(data) {
    return this.http.post(this.baseUrl + 'hospitalStaff/registerReferralDoctor', data, this.jwt());
  }

  forgot_password(data) {
    return this.http.post(this.baseUrl + 'forgot_password', data, this.jwt());
  }

  auto_suggetion(data) {
    var data1 = '{"hospital_name":"' + data + '"}';
    var data = JSON.parse(data1);
    return this.http.post(
      this.baseUrl + "search_parent_hospital",
      data,
      this.jwt()
    );
  }

  jwt(token = null) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return httpOptions;
  }
}
