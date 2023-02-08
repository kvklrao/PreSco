import { Component, OnInit, Input , OnChanges } from '@angular/core';
import { CommonService } from '../../shared/service/common/common.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit , OnChanges {
  levels:Array<any> = [];
  @Input() patient_id;
  success_status = 200;
  already_exist_status = 422;
  level_number = 0;
  level_date: any;
  level_time: any;
  constructor(
    private common_api: CommonService,
    private toastr: ToastrService) { }

  ngOnInit() {
    const vim = this;
    vim.get_level(vim.patient_id);
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
  if (api_type == 'get_level') {
      if (vim.isSuccess(response)) {
        vim.levels =  response['response'];
        vim.level_calculate(response['response']);
      } else {
        vim.errorToasty(response);
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
    if (api_type == 'get_level') {
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
    if (response.hasOwnProperty('status') && response['status'] === vim.success_status) {
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
    if (response.hasOwnProperty('status') && response['status'] === vim.already_exist_status) {
      return true;  
    }
    return false;
  }
  /**
   * @method :- errorToasty
   */
  errorToasty(error) {
   const vim = this;
    if (error.hasOwnProperty('message')) {
      vim.toastr.error('Error!', error['message']);
    } else {
      vim.toastr.error('Error!', 'Somethink wrong!!!..');
    }
  }
 
   /**
   * @method : get_patients
   * @purpose :- Get The info of patient details..
   */
  async get_level(patient_id) {

    // const vim = this;
    // let get_patient_data:any = null;
    //  get_patient_data = await vim.common_api.get_level(patient_id);
    
    // get_patient_data.subscribe(
    //   response => {
        
    //     vim.success(response, 'get_level');
    //   },
    //   error => {
    //     console.error('errro', error);
    //   }
    // );
  }


  level_calculate(response) {
    const vim = this;
    if (response.hasOwnProperty('patient_level')) {
       vim.level_number = response.patient_level;
       vim.getFormattedDate(response.createdAt);
    }
  }

  getFormattedDate(date) {
    const vim = this;
   date = new Date(date);
 
    vim.level_date = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
    vim.level_time = vim.formatAMPM(date);  
  }

   formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'pm' : 'am';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
  }

  ngOnChanges() {
    const vim = this;
    vim.get_level(vim.patient_id);
  }
}
