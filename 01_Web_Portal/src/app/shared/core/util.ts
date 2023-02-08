import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class Util {
  private patientUpdate = new Subject<any>();
  private userInfo = new Subject<any>();

  setUserInfo(obj) {
    this.userInfo.next(obj);
  }

  getUserInfo(): Observable<any> {
    return this.userInfo.asObservable();
  }
}
