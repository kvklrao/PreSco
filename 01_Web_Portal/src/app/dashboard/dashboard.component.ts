import { Component, OnInit, Input, ViewEncapsulation, HostBinding, Directive, ViewContainerRef  } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
import {DataService} from '../shared/service/data.service';
import {ReadingDataService} from '../shared/service/reading-data.service';
import * as _ from "underscore";
import { CommonService } from "../shared/service/common/common.service";
import { ToastrService } from "ngx-toastr";import { Common } from '../shared/service/common/common';
;

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
  providers: [NgbModalConfig, NgbModal],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  patientForm: FormGroup;
  formRef: any;
  selectedItem='baby-profile';
  readingData;
  readinDataObj;
  dataServiceObj;
  invalidForm=false;
   messageString='';
   haveUnsavedData=false;
  // confirmationModalOpen: boolean =false;

  constructor(
    private formBuilder: FormBuilder,
    public config: NgbModalConfig,
    private modalService: NgbModal,
    private router: Router,
    private dataService:DataService,
    public readingDataService:ReadingDataService,
    private common_api: CommonService,
    private toastr:ToastrService,
    private commonAsyn: Common
  ) {

  }
  is_view = false;
  id = 0;
  hospital_id = 0;
  hospital_name = "";
  message:string;
  selectedActiveTab:string;
  disable_btn=true;
  allFormData:any
  foundEmpty=false;

  ngOnInit() {
    this.foundEmpty = false;
    this.selectedItem='baby-profile';
    this.readinDataObj = this.readingDataService.getComponentFlag();
    
    if(this.router.url != '/dashboard/baby-profile')
    this.selectedItem='baby-profile';
    this.router.navigate(['dashboard/baby-profile']);
    this.dataService.currentMessage.subscribe(message => {
      this.message = message;
      this.selectedItem='baby-profile';
    })

    this.readingDataService.tabMessage.subscribe(message => {
      this.selectedItem=message;
    })
   }

   openBabyProfile() {
     this.selectedItem='baby-profile';
     this.readingDataService.showBabyProfileForm("openBabyProfileForm");
     this.dataService.clearSearchText("resetSearchBar")
     this.readingDataService.isMotherProfileHaveResp = true;
     this.readingDataService.reading = '';
     this.dataService.clearOption();
     this.readingDataService.reset();
     this.router.navigate(['dashboard/baby-profile']);
   }
   
  closeMenu() {
  var targetElement = document.getElementsByClassName("hamburger-menu")[0];
  targetElement.classList.remove('open');
  }

   clickHamburger() {
     let menus = document.querySelectorAll('.hamburger-menu');
     for (let i = 0; i < menus.length; i++) {
      let menu = menus[i];
      menu.querySelector('.hamburger-button').addEventListener('click', this.buttonClickListener);
    }
   }

    buttonClickListener(evt) {
   let menu = evt.target.parentElement;
   let menuCssClass = menu.getAttribute('class');
   menu.setAttribute('class', menuCssClass.indexOf('open') >= 0 ? menuCssClass.replace('open', '') : (menuCssClass + ' open'));
 }



  get_id(id) {
    var local_data_info = JSON.parse(localStorage.getItem("login_hospital"));
    this.hospital_id = JSON.parse(local_data_info['id']);
    //console.error(local_data_info)
    this.hospital_name = local_data_info.hospital_name;
    this.is_view = true;
    this.id = id;
  }

  activeTab(newValue:string){
    this.selectedItem=newValue;
  }

  open(content) {
    //this.id.emit(0);

    this.formRef = this.modalService.open(content, { size: "lg" });
  }
  close() {
    //console.error("close this event")
    this.formRef.close();
  }
  
  logout() {
    localStorage.clear();
    this.router.navigate(["/"]);
    this.dataService.clearOption();
    this.readingDataService.isMotherProfileHaveResp = true;
    this.readingDataService.clearReadingFormData();
    this.readingDataService.reset();
    this.readingDataService.resetAll();
  }

  resetTab(){
    this.selectedItem='baby-profile';
  }

  openBabyAppear(){
    this.readingDataService.showSaveReadingButton=true;
   this.readingDataService.clearReadingFormData();
    this.getReading();
  }

 getReading(){
    var vim = this;
    vim.dataServiceObj = vim.dataService.getOption();
        const newUser =  vim.common_api.get_new_reading(vim.dataServiceObj.study_id);
        newUser.subscribe(
          response => {
            localStorage.setItem('reading',response['response']['reading_id']);
            this.getLastReadingData();
          }
        );
  }

   validateAllFormData(){
     this.messageString='';
     this.invalidForm=false;
     this.allFormData=this.readingDataService.getFormValidationStatus();
     if( this.allFormData['baby_appears']==false){
       this.setMessage('Baby Appears')
          this.invalidForm=true;
     }
     if( this.allFormData['baby_antibiotic']==false){
      this.setMessage('Baby Antibiotic')
       this.invalidForm=true;
     }
     if( this.allFormData['baby_cns']==false){
      this.setMessage('Baby CNS')
      this.invalidForm=true;
    }
    if(this.allFormData['baby_cv']==false){
      this.setMessage('Baby Cardio Vascular')
      this.invalidForm=true;
    }
    if(this.allFormData['baby_git']==false){
      this.setMessage('Baby GIT')
      this.invalidForm=true;
    }
    if( this.allFormData['baby_investigation']==false){
      this.setMessage('Baby Investigation')
      this.invalidForm=true;
    }
    if( this.allFormData['baby_resp']==false){
      this.setMessage('Baby Respiratory')
      this.invalidForm=true;
    }
    if(this.allFormData['baby_final']==false){
      this.setMessage('Baby Final')
      this.invalidForm=true;
    }
    if(this.invalidForm){
      this.toastr.error('','You have some unfilled entries in ' + this.messageString +'.'+'Please check');
      return false;
    }
      return true;
   }

   setMessage(formName){
      if(this.messageString!==''){
            this.messageString=this.messageString+', '+formName;
      }
      else{
          this.messageString=formName;
      }
   }

  getLastReadingData(){
    this.foundEmpty = false;;
    this.common_api.getLastReadingData(this.dataServiceObj.study_id).subscribe(result=>{
      if(result['status']!=200){
        this.readingDataService.clearReadingFormData();
        this.goToBabyAppear();
      }
      else{
        var vim = this;
        _.find(result['response'], function(num){
          if(_.isEmpty(num)) {
            vim.toastr.error('','There is some technical issues, Please search the record again');
            vim.foundEmpty = true;
            return vim.readingDataService.readingFormsData = {};
          }
        });
        if(!this.foundEmpty) {
          // console.log("not empty");Object.keys(myObj).length
          this.readingDataService.readingFormsData=result['response'];
          this.goToBabyAppear();
        }
      }
    })
  }

  goToBabyAppear(){
        this.readingDataService.reading = localStorage.getItem('reading');
        this.readingDataService.setComponentFlag('baby-appear');
        this.readingDataService.newReadingStatusFlags();
        this.selectedItem='baby-appearence';
        this.router.navigate(['dashboard/baby-appearence']);
  }

  goToDashboard(){
    this.dataService.clearOption();
    this.readingDataService.reset();
    this.readingDataService.reading=undefined;
    this.readingDataService.clearReadingFormData();
    this.router.navigate(['admin/hospital-staff']);
  }
}
