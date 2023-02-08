import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

@Injectable({
  providedIn: 'root'
})
export class ReadingDataService {
public readingFormsData={};
public allFormValidationStatus={};
public reading;
public babyReadingData={};
public checkComponentState = {
  //'mother-profile':false,
  'baby-appear':false,
  'baby-cns': false,
  'baby-cv': false,
  'baby-resp': false,
  'baby-git': false,
  'baby-investigation': false,
  'baby-antibiotic': false,
  'baby-final':false
};
public isMotherProfileHaveResp = true;
public showSaveReadingButton = true;
public haveMotherProfile = true;

private messageSource = new BehaviorSubject('default message');
tabMessage = this.messageSource.asObservable();

private showBabyProfile = new BehaviorSubject('message');
openForm = this.showBabyProfile.asObservable();

  constructor() { }

  getReadingFormData(formName){
      return this.readingFormsData[formName];
  }

  setReadingFormData(formName,data){
    this.readingFormsData[formName]=data;
  }

  clearReadingFormData(){
    this.readingFormsData={};
  }

  getAllFormData(){
    return this.readingFormsData;
  }

  setComponentFlag(componentName) {
    this.checkComponentState[componentName] = true
  }

  getComponentFlag(){
    return this.checkComponentState;
  }

  setActiveTab(message: string) {
    this.messageSource.next(message)
  }

  showBabyProfileForm(message: string) {
    this.showBabyProfile.next(message)
  }
  reset() {
    let reset = {
      //'mother-profile':false,
      'baby-appear':false,
      'baby-cns': false,
      'baby-cv': false,
      'baby-resp': false,
      'baby-git': false,
      'baby-investigation': false,
      'baby-antibiotic': false,
      'baby-final':false
    };
    this.checkComponentState = reset;
  }

  setFormValidationStatus(formName,statusFlag){
    this.allFormValidationStatus[formName]=statusFlag;
   // console.log(this.allFormValidationStatus)
  }

  getFormValidationStatus(){
    return this.allFormValidationStatus;
  }

  searchResetComponentFlags(){
    this.checkComponentState = {
      //'mother-profile':true,
      'baby-appear':true,
      'baby-cns': true,
      'baby-cv': true,
      'baby-resp': true,
      'baby-git': true,
      'baby-investigation': true,
      'baby-antibiotic': true,
      'baby-final':true
    };
  }

  resetAll(){
    this.isMotherProfileHaveResp=true;
    this.isMotherProfileHaveResp=true;
    this.haveMotherProfile=true;
    // this.messageSource.unsubscribe();
    // this.showBabyProfile.unsubscribe();
  }

  newReadingStatusFlags(){
    this.checkComponentState = {
     // 'mother-profile':true,
      'baby-appear':true,
      'baby-cns': false,
      'baby-cv': false,
      'baby-resp': false,
      'baby-git': false,
      'baby-investigation': false,
      'baby-antibiotic': false,
      'baby-final':false
    };
  }

  unsubscribeBabyProfile(){
    this.showBabyProfile.unsubscribe();
  }

  setBabyReadingData(data){
    this.babyReadingData=data;
  }

  getBabyReadingData(){
    return this.babyReadingData;
  }
  
}
