import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppConstant } from '../shared/constant/app-constant';
import { CommonService } from '../shared/service/common/common.service';
import { AppHelper } from '../shared/helper/app.helper';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-message-center',
  templateUrl: './message-center.component.html',
  styleUrls: ['./message-center.component.css']
})
export class MessageCenterComponent implements OnInit {
isListItemClicked: Boolean = false;
h2:Number;
  loggedInUser:any={};
  userType:string;
  dropDownList:any;
  participantList:any=[];
  page=1;
  pageLength:number;
  hospitalId:number;
  msgsList=[];
  recieverSelected=false;
  selectedUserDropDown=2;
  selectedItem=0;
  senderId:number;staffId:number;
  recieverId:number;textMessage:string='';
  messageJson:any={};referralId:number;referralLogin=5;searchText:string;userId:number;hospitalBranchId:number;noUserSelected=true;
  constructor(private constant:AppConstant,private common:CommonService,private helper:AppHelper,private toasty:ToastrService) { }
  @ViewChild('container') container: ElementRef
  @ViewChild('bottomDiv') bottomDiv: ElementRef
  
  ngOnInit() {
    this.pageLength=1000;
    this.getUserInfo();
    this.setDropDownData();
  }
  getUserInfo(){
    this.loggedInUser = JSON.parse(localStorage.getItem("login_hospital"));
    this.userType=this.loggedInUser['user_type'];
  }

  setDropDownData(){
    if(this.userType===this.constant.hospital_type_login){
      this.hospitalId=this.loggedInUser['id'];
      this.senderId=this.loggedInUser['user_id'];
      this.userId=this.loggedInUser['user_id'];
      this.getStaffUsers();
      this.dropDownList=this.constant.hospitalAdminDropDown;
    }
    if(this.userType===this.constant.branch_type_login){
      this.hospitalBranchId=this.loggedInUser['hospital_branch_id'];
      this.senderId=this.loggedInUser['user_id'];
      this.userId=this.loggedInUser['user_id'];
      this.getHospitalBranchStaffUsers();
      this.dropDownList=this.constant.hospitalBranchAdminDropDown
    }
    if(this.userType===this.constant.staff_type_login){
      this.hospitalId=this.loggedInUser['id'];
      this.staffId=this.loggedInUser['staff_id'];
      this.senderId=this.loggedInUser['user_id'];
      this.userId=this.loggedInUser['user_id'];
      this.getAllBranchStaffs();
      this.dropDownList=this.constant.staffDropDown;
    }
    if(this.userType===this.constant.referral_doctor_login){
      this.senderId=this.loggedInUser['user_id'];
      this.userId=this.loggedInUser['user_id'];
      this.referralId=this.loggedInUser['referral_id'];
      this.getReferralStaffList();
      this.dropDownList=this.constant.referralDoctorDropDown;
    }
  }

  getUsers(event:Event){
   let id=(event.target['value'])
   this.msgsList=[];
   this.recieverSelected=false;this.selectedItem=0;
   this.isListItemClicked=false;
   this.noUserSelected=true;
   if(id==1 && !(this.userType==this.constant.staff_type_login)){
      this.getHospitalReferralDoctorsUsers();
   }
   if(id==1 && this.userType==this.constant.staff_type_login){
      this.getStaffReferralDoctors();
   }
   if(id==2 && (this.userType==this.constant.hospital_type_login  || this.constant.branch_type_login)){
      this.getStaffUsers();
   }
   if(id==2 && this.userType==this.constant.staff_type_login){
     this.getAllBranchStaffs();
   }
   if(id==2 && this.userType==this.constant.referral_doctor_login){
    this.getReferralStaffList();
    }
   if(id==3){
      this.getHospitalAndBranchAdmin();
   }
   if(id==4){
     this.getReferralDocHospitalAdmins();
   }
  }

  success(apiType,response){
    if(apiType=='staffUsers'){
      this.participantList=response['response'];
    }
    if(apiType=='sendMessage'){
      this.toasty.success(response['message'],'')
    }
    if(apiType=='hospitalAndBranchAdmins'){
      this.participantList=response['response'];
    }
    if(apiType=='getMessages'){
      this.msgsList=response['response']
    }
    if(apiType=='hospitalReferralDoctors'){
      this.participantList=response['response'];
    }
    if(apiType=='referralDoctorHospitalAdmin'){
      this.participantList=response['response'];
    }
    if(apiType=='referralStaffList'){
      this.participantList=response['response']
    }
    if(apiType=='AllBranchStaffs'){
      this.participantList=response['response'];
    }
    if(apiType=='getStaffReferralDoctors'){
      this.participantList=response['response'];
    }
    if(apiType=='HospitalBranchStaff'){
      this.participantList=response['response'];
    }
  }

  getStaffUsers(){
    this.common.getStaffUsers(this.userId).subscribe(result=>{
        if(this.helper.success(result)){
            this.success('staffUsers',result);
        }else{
          this.helper.errorHandler(result)
        }
    })
  }

  getUserMessages(id,isRead,index){
    this.msgsList=[];
    this.selectedItem=id;
    this.recieverSelected=true;
    this.recieverId=id;
    this.participantList[index]['is_read']=1;
    this.textMessage='';
    this.noUserSelected=false;
    this.updateReadStatus(this.senderId,this.recieverId,isRead);
    //this.getMessages(this.senderId,this.recieverId);
  }

  getHospitalReferralDoctorsUsers(){
    this.common.getHospitalReferralDoctors(this.userId).subscribe(result=>{
      if(this.helper.success(result)){
                this.success('hospitalReferralDoctors',result);
            }else{
              this.helper.errorHandler(result);
            }
    })
  }

  getHospitalAndBranchAdmin(){
    this.common.getHospitalAndBranchAdmins(this.staffId).subscribe(result=>{
      if(this.helper.success(result)){
                this.success('hospitalAndBranchAdmins',result);
            }else{
              this.helper.errorHandler(result);
            }
    })
  }
  
  sendMessage(){
    if(this.checkEmptyMessage()){
    this.messageJson['message']=this.textMessage;
    this.common.sendMessage(this.senderId,this.recieverId,this.messageJson).subscribe(result=>{
      if(this.helper.success(result)){
        this.success('sendMessage',result)
        this.messageJson={};
        this.textMessage='';
        this.getMessages(this.senderId,this.recieverId);
      }else{
        this.helper.errorHandler(result);
      }
    })
  }
  }

  getMessages(senderId, recieverId) {
    debugger;
    this.common.getMessages(senderId, recieverId).subscribe(result => {
      if (this.helper.success(result)) {
        this.success('getMessages', result);
        this.isListItemClicked = true;
        if (this.msgsList.length <= 0) {
          this.isListItemClicked = false;
        }
      } else {
        this.helper.errorHandler(result);
        this.isListItemClicked = false;
      }
    })
  }

  checkEmptyMessage(){
    if(this.textMessage==''){
      this.toasty.error('Please type a message to send')
      return false;
    }
    if(this.recieverId==undefined){
      this.toasty.error('Please select a recipient')
      return false;
    }
    return true;
  }

  refreshData(){
    this.getMessages(this.senderId,this.recieverId);
  }
  getReferralDocHospitalAdmins(){
    this.common.getReferralHospitalAdmins(this.referralId).subscribe(result=>{
      if(this.helper.success(result)){
                this.success('referralDoctorHospitalAdmin',result);
            }else{
              this.helper.errorHandler(result);
            }
    })
  }

  updateReadStatus(senderId,recieverId,isReadFlag){
    if(isReadFlag==0){
    this.common.updateReadStatus(senderId,recieverId).subscribe(result=>{
      if(this.helper.success(result)){
        this.getMessages(senderId,recieverId);
            }else{
              this.helper.errorHandler(result);
 	        	this.isListItemClicked = false;
            }
    })
  }else{
    this.getMessages(senderId,recieverId);
  }
}
getReferralStaffList(){
  this.common.getReferralStaffList(this.referralId).subscribe(result=>{
    if(this.helper.success(result)){
              this.success('referralStaffList',result);
          }else{
            this.helper.errorHandler(result);
          }
  })
}
getAllBranchStaffs(){
  this.common.getAllBranchStaffs(this.staffId).subscribe(result=>{
    if(this.helper.success(result)){
              this.success('AllBranchStaffs',result);
              this.checkLoggedInUser();
          }else{
            this.helper.errorHandler(result);
          }
  })
}
getStaffReferralDoctors(){
  this.common.getStaffReferralDoctrs(this.staffId).subscribe(result=>{
    if(this.helper.success(result)){
              this.success('getStaffReferralDoctors',result);
          }else{
            this.helper.errorHandler(result);
          }
  })
}
  scrollBottom() {
    this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
  }

  setMsgContStyle() {
    if (this.isListItemClicked) {
      return { display: "block" }
    }
    return { display: "none" };
  }
  getHospitalBranchStaffUsers(){
    this.common.getBranchStaffUsers(this.hospitalBranchId).subscribe(result=>{
      if(this.helper.success(result)){
                this.success('HospitalBranchStaff',result);
            }else{
              this.helper.errorHandler(result);
            }
    })
  }

  checkLoggedInUser(){
    debugger;
    const index = this.participantList.findIndex(userobj => userobj['user_id'] == this.senderId);
    if(index>=0){
    this.participantList.splice(index,1);
    }
  }

}
