import { Component, OnInit, EventEmitter, Output, Input, HostListener } from "@angular/core";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CommonService } from "../../shared/service/common/common.service";
import { ToastrService } from "ngx-toastr";
import { Util } from "../../shared/core/util";
import { Common } from "../../shared/service/common/common";
import {Router} from '@angular/router';
import { DatePipe } from '@angular/common';
import { DataService } from '../../shared/service/data.service';
import { ReadingDataService } from '../../shared/service/reading-data.service';
import { of } from 'rxjs';

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
  providers: [NgbModalConfig, NgbModal]
})
export class SearchComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  patientList: Array<any> = [];
  subcription: Array<any> = [];
  modelRef: any;
  patient_temp = [];
  local_data_info: any = {};
  isTableDisplay: boolean = false;
  search_str= '';
  message:string;
  login_hospital;
  searchResultEmpty:boolean=false;

  @Output() id: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private formBuilder: FormBuilder, public config: NgbModalConfig,  private modalService: NgbModal, private common_api: CommonService,
    private toastr: ToastrService,  private util: Util, private commonConst: Common, private router: Router, 
    private dataService:DataService,private readingDataService:ReadingDataService) {
    config.backdrop = "static";
    config.keyboard = false;
  }

  ngOnInit() {
    const vim = this;
    vim.login_hospital = JSON.parse(localStorage.getItem("login_hospital"));
    vim.createForm();
    this.dataService.currentMessage.subscribe(message => {
      this.message = message;
    })
    this.dataService.currentSearchTrigger.subscribe(message=>{
     if(message=="resetSearchBar"){
       this.search_str='';
     }
    })
  }
  createForm() {
    this.registerForm = this.formBuilder.group({
      patient_first_name: ["", Validators.required],
      patient_last_name: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      country: ["", Validators.required],
      phone: ["", Validators.required]
    });
  }

  async search_patient(event) {
    const vim = this;
    const str = this.search_str;
    if (localStorage.getItem("login_hospital")) {
      vim.local_data_info = JSON.parse(localStorage.getItem("login_hospital"));
    }
   
    if (str.length >= 1 &&  vim.local_data_info!=null) {
      vim.isTableDisplay = true;
      const reqObj = {
        like: str,
        hospital_id: vim.local_data_info["id"]
      };
      // const get_patient_data = await vim.common_api.search_patient(reqObj);
      // get_patient_data.subscribe(
      //   response => {          
      //     vim.success(response, "search_patient");
      //   },
      //   error => {
      //     console.error("errro", error);
      //   }
      // );
      const get_patient_data = await vim.common_api.search_patient_reading(this.search_str,vim.login_hospital['id'] );
      get_patient_data.subscribe(
        response => {          
          vim.success(response, "search_patient");
        },
        error => {
          console.error("errro", error);
        }
      );
    } else {
      vim.isTableDisplay = false;
      vim.patientList = vim.patient_temp;
    }
  }
  open(content) {
    this.modalService.open(content);
  }
  close() {
    this.createForm();
  }

  close_search_box(){
    this.isTableDisplay = false;
    this.search_str='';
  }

  get f() {
    return this.registerForm.controls;
  } 

  /**
   *
   * @param response
   * @param api_type
   * @method: success
   * @purpose :-  it is a common helper
   */
  success(response, api_type) {
    const vim = this;
    if (api_type == "get_patients") {
      vim.commonConst.isHide();
      if (vim.isSuccess(response)) {
        console.log(response,'search response')
        vim.patientList = response["response"];
        vim.patient_temp = response["response"];
        if (vim.patientList.length > 0) {
          vim.util.setUserInfo(vim.patientList[0]);
          vim.id.emit(vim.patientList[0]["id"]);
        }
        // vim.util.setUserInfo(obj);
      } else {
        vim.errorToasty(response);
      }
    } else if (api_type == "search_patient") {
      if (vim.isSuccess(response)) {
        vim.patientList = response["response"];
        this.searchResultEmpty=false;
        // vim.readingDataService.searchResetComponentFlags();
        // vim.util.setUserInfo(obj);
      } else {
        vim.patientList = [];
        this.searchResultEmpty=true;
        // vim.errorToasty(response);
      }
    }
  }

  /**
   *
   * @param error
   * @param api_type
   * @purpose :-  This is error handler method is called.
   * @method: errorHandler
   */
  errorHandler(error, api_type) {
    const vim = this;
    if (api_type == "signup") {
      vim.errorToasty(error);
    }
  }

  /**
   *
   * @param response
   * @method: it is a common herlper for check the status is 200 or not
   */
  isSuccess(response) {
    const vim = this;
    if (
      response.hasOwnProperty("status") &&
      response["status"] === vim.success_status
    ) {
      return true;
    }
    return false;
  }
  /**
   *
   * @param response
   * @method :- isAlreadyExist
   * @purpose :- check if User Already Exist.
   */
  isAlreadyExist(response) {
    const vim = this;
    if (
      response.hasOwnProperty("status") &&
      response["status"] === vim.already_exist_status
    ) {
      return true;
    }
    return false;
  }
  /**
   * @method :- errorToasty
   */
  errorToasty(error) {
    const vim = this;
    if (error.hasOwnProperty("message")) {
      vim.toastr.error("Error!", error["message"]);
    } else {
      vim.toastr.error("Error!", "Somethink wrong!!!..");
    }
  }

  handler(e) {
    console.error(e);
  }
   /**
   * @method : view_patient
   * @purpose :- Update as Async data..
   */
  view_patient(obj: any) {
    this.isTableDisplay = false;
    const vim = this;
    vim.util.setUserInfo(obj);
    vim.id.emit(obj["id"]);
    obj.study_id =  obj["study_id"];
    obj.reading =  obj["reading"];
    vim.readingDataService.reading = obj.reading;
    localStorage.setItem('reading',obj["reading"]);
    vim.readingDataService.isMotherProfileHaveResp = false;
    vim.dataService.changeMessage("Search Reset");
    vim.dataService.setOption(obj);
    vim.readingDataService.clearReadingFormData();
    // vim.readingDataService.isMotherProfileHaveResp= true;

    if(obj["reading"] != null){ 
      vim.readingDataService.searchResetComponentFlags();
    } else {
      vim.readingDataService.reset();
    }
    //vim.readingDataService.searchResetComponentFlags();
    vim.readingDataService.showBabyProfileForm("message");
    if(localStorage.getItem('staffMedicalRecord')) {
      localStorage.removeItem('staffMedicalRecord');
    }
    vim.router.navigate(["dashboard/baby-profile"]);
    localStorage.removeItem('reading');
  }
}
