import { Component, OnInit, AfterViewChecked } from "@angular/core";
import { Common } from "./shared/service/common/common";
import { Router } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit, AfterViewChecked {
  title = "avyantra-fe";
  isLoading = true;
  constructor(private commonAsyn: Common,private router:Router) {
    console.clear();
  }

  ngOnInit() {
    // if(this.router.url!="/"){
    // this.router.navigate(['dashboard/baby-profile']);
    // }
  }

  ngAfterViewChecked() {
    this.commonAsyn.hideLoader().subscribe(val => {
      if (val["isLoad"]) {
        this.isLoading = true;
      } else {
        this.isLoading = false;
      }
    });
  }
}
