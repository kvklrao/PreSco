import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "../../shared/service/common/common.service";
import * as _ from "underscore";
import { Util } from "../../shared/core/util";

@Component({
  selector: "app-basic",
  templateUrl: "./basic.component.html",
  styleUrls: ["./basic.component.css"]
})
export class BasicComponent implements OnInit, OnChanges {
  constructor(
  ) { }

  ngOnInit() {}
  ngOnChanges() {}
}
