import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreAnalysisComponent } from './score-analysis.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppHelper } from '../shared/helper/app.helper';
import { ToastrModule } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonService } from '../shared/service/common/common.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ScoreAnalysisComponent', () => {
  let component: ScoreAnalysisComponent;
  let fixture: ComponentFixture<ScoreAnalysisComponent>;
  let router:Router;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreAnalysisComponent ],
      imports:[FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        NgbModalModule,
        BrowserAnimationsModule
      ],
                providers:[FormBuilder,AppHelper,CommonService]
    })
    .compileComponents();
   
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreAnalysisComponent);
    component = fixture.componentInstance;
    let store = {};
    spyOn(window.localStorage, 'getItem').and.callFake(function() {
      return JSON.stringify({"test":"test"});
    });
     spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
        return store[key]=value;
      });
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    localStorage.setItem("login_hospital",JSON.stringify({"username":"getwell","email":"get@yahoo.com","user_type":"Hospital","id":92,"hospital_name":"getwell","hospital_branch_name":"getwell indore","hospital_branch_id":59,"staff_id":12}))

    expect(component).toBeTruthy();
  });
 it('sendOpinionRequest method',()=>{
   component.sendOpinionRequest();
 })
 it('getPanelDoctors method',()=>{
   component.getPanelDoctors(100,1);
 });
 it('inpanelSelected method',()=>{
  let event={
    target:{
      files:{name:"files0"}
    }
  }
   component.inpanelSelected(event);
 })
 it('open method',()=>{
   component.open("modal");
 });
 it('selectDoctor method',()=>{
   component.selectDoctor(0);
   expect(component.inpanelFlag).toBeTruthy();
   expect(component.outpanelFlag).toBeFalsy();
   component.selectDoctor(1);
   expect(component.outpanelFlag).toBeTruthy();
   expect(component.inpanelFlag).toBeFalsy();
 });
 it('close method',()=>{
   component.open("");
  spyOn(component.formRef,'close');
  component.close();
  expect(component.formRef.close).toHaveBeenCalled();
 });
 it('fileUpload method',()=>{
   let event={
     target:{
       files:{name:"files0"}
     }
   }
   component.fileUpload(event);
   expect(component.formatFlag).toBeFalsy();
   expect(component.fileEmptyFlag).toBeFalsy();
   
 });

});