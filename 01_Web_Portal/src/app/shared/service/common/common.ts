import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: "root" })
export class Common {
  private isLoader = new Subject<any>();

  showLoader() {
    this.isLoader.next({ isLoad: true });
  }
  isHide() {
    this.isLoader.next({ isLoad: false });
  }

  hideLoader() {
    return this.isLoader.asObservable();
  }
}
