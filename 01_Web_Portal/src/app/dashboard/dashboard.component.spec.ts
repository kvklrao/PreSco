import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { MatTabsModule } from "@angular/material";
import { DashboardComponent } from './dashboard.component';
import { SearchComponent } from "./search/search.component";
import { BasicComponent } from "./basic/basic.component";
import { GeneralComponent } from "./general/general.component";
import { LevelComponent } from "./level/level.component";
import { MaternalComponent } from "./maternal/maternal.component";
import { BabyAppearComponent } from "./baby-appear/baby-appear.component";
import { BabyRespComponent } from "./baby-resp/baby-resp.component";
import { BabyCvComponent } from "./baby-cv/baby-cv.component";
import { BabyCnsComponent } from "./baby-cns/baby-cns.component";
import { BabyGitComponent } from "./baby-git/baby-git.component";
import { BabyInvestigationComponent } from "./baby-investigation/baby-investigation.component";
import { FinalComponent } from "./final/final.component";
import { AntibioticAdministrationComponent } from "./antibiotic-administration/antibiotic-administration.component";

import { MatIconModule } from "@angular/material";
import { NgxMaskModule } from 'ngx-mask';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ToastrModule } from "ngx-toastr";
import { DataService } from '../shared/service/data.service';
import { TopNavBarComponent } from '../shared/core/components/top-nav-bar/top-nav-bar.component';
import { HttpTestingController } from '@angular/common/http/testing';
import { inject } from '@angular/core/testing';
import { of } from 'rxjs';
import { CommonService } from '../shared/service/common/common.service';
import { Common } from '../shared/service/common/common';
import { Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
    selector: 'app-top-nav-bar',
    template: ''
})
class MockTopNavBarComponent {

}

const routes: Routes = [
    {
        path: 'dashboard', component: DashboardComponent,
        children: [
            { path: '', redirectTo: 'baby-profile', pathMatch: 'prefix' },
            { path: 'baby-profile', component: GeneralComponent }
        ],
    }
]

declare var $: any;

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardComponent,
                GeneralComponent,
                SearchComponent,
                MockTopNavBarComponent],
            imports: [BrowserAnimationsModule,
                MatTabsModule, MatIconModule, NgxMaskModule.forRoot(), BsDatepickerModule.forRoot(),
                FormsModule, ReactiveFormsModule, AngularMultiSelectModule,
                HttpClientTestingModule, RouterTestingModule.withRoutes(routes),
                ToastrModule.forRoot()],
            providers: [DataService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        let store = {};
        spyOn(window.localStorage, 'getItem').and.callFake(function () {
            return JSON.stringify({ "test": "test" });
        });
        spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
            return store[key] = value;
        });
        fixture.detectChanges();
    });

    afterEach(() => {
        fixture.destroy();
        TestBed.resetTestingModule();
      });

    it('should create', () => {
        localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92, "hospital_name": "getwell", "hospital_branch_name": "getwell indore", "hospital_branch_id": 59 }));
        expect(component).toBeTruthy();
    });

    it('openBabyProfile method', () => {
        spyOn(component.readingDataService, 'showBabyProfileForm');
        spyOn(component['dataService'], 'clearSearchText');
        spyOn(component['dataService'], 'clearOption');
        spyOn(component.readingDataService, 'reset');
        spyOn(component['router'], 'navigate');
        component.openBabyProfile();
        expect(component.readingDataService.showBabyProfileForm).toHaveBeenCalled();
        expect(component.readingDataService.reset).toHaveBeenCalled();
        expect(component['dataService'].clearSearchText).toHaveBeenCalled();
        expect(component['dataService'].clearOption).toHaveBeenCalled();
        expect(component['router'].navigate).toHaveBeenCalled();
    });

    it('goToDashboard method', () => {
        spyOn(component.readingDataService, 'clearReadingFormData');
        spyOn(component['dataService'], 'clearOption');
        spyOn(component.readingDataService, 'reset');
        spyOn(component['router'], 'navigate');
        component.goToDashboard();
        expect(component.readingDataService.clearReadingFormData).toHaveBeenCalled();
        expect(component.readingDataService.reset).toHaveBeenCalled();
        expect(component['dataService'].clearOption).toHaveBeenCalled();
        expect(component['router'].navigate).toHaveBeenCalled();
    });

    it('goToBabyAppear method', () => {
        spyOn(component.readingDataService, 'setComponentFlag');
        spyOn(component.readingDataService, 'newReadingStatusFlags');
        spyOn(component['router'], 'navigate');
        component.goToBabyAppear();
        expect(component.readingDataService.setComponentFlag).toHaveBeenCalled();
        expect(component.readingDataService.newReadingStatusFlags).toHaveBeenCalled();
        expect(component['router'].navigate).toHaveBeenCalled();
    });

    it('setMessage method', () => {
        component.messageString = '';
        component.setMessage('test');
        expect(component.messageString).toBe('test');
        component.messageString = 'test1';
        component.setMessage('test2');
        expect(component.messageString).toBe('test1, test2');
    });

    it('validateAllFormData method', () => {
        spyOn(component, 'setMessage');
        component.readingDataService.setFormValidationStatus('baby_appears', false);
        component.readingDataService.setFormValidationStatus('baby_antibiotic', false);
        component.readingDataService.setFormValidationStatus('baby_cns', false);
        component.readingDataService.setFormValidationStatus('baby_cv', false);
        component.readingDataService.setFormValidationStatus('baby_git', false);
        component.readingDataService.setFormValidationStatus('baby_investigation', false);
        component.readingDataService.setFormValidationStatus('baby_resp', false);
        component.readingDataService.setFormValidationStatus('baby_final', false);

        component.validateAllFormData();
        expect(component.setMessage).toHaveBeenCalled();
        expect(component.validateAllFormData()).toBeFalsy();

        component.readingDataService.setFormValidationStatus('baby_appears', true);
        component.readingDataService.setFormValidationStatus('baby_antibiotic', true);
        component.readingDataService.setFormValidationStatus('baby_cns', true);
        component.readingDataService.setFormValidationStatus('baby_cv', true);
        component.readingDataService.setFormValidationStatus('baby_git', true);
        component.readingDataService.setFormValidationStatus('baby_investigation', true);
        component.readingDataService.setFormValidationStatus('baby_resp', true);
        component.readingDataService.setFormValidationStatus('baby_final', true);

        expect(component.validateAllFormData()).toBeTruthy();
    });

    it('openBabyAppear method', () => {
        spyOn(component.readingDataService, 'clearReadingFormData');
        spyOn(component, 'getReading');
        component.openBabyAppear();
        expect(component.readingDataService.showSaveReadingButton).toBeTruthy();
        expect(component.readingDataService.clearReadingFormData).toHaveBeenCalled();
        expect(component.getReading).toHaveBeenCalled();
    });

    it('resetTab method', () => {
        component.resetTab();
        expect(component.selectedItem).toBe('baby-profile');
    });

    it('logout method', () => {
        spyOn(localStorage, 'clear');
        spyOn(component.readingDataService, 'clearReadingFormData');
        spyOn(component.readingDataService, 'reset');
        spyOn(component.readingDataService, 'resetAll');
        spyOn(component['router'], 'navigate');
        spyOn(component['dataService'], 'clearOption');
        component.logout();
        expect(component.readingDataService.clearReadingFormData).toHaveBeenCalled();
        expect(component.readingDataService.reset).toHaveBeenCalled();
        expect(component.readingDataService.resetAll).toHaveBeenCalled();
        expect(localStorage.clear).toHaveBeenCalled();
        expect(component['router'].navigate).toHaveBeenCalled();
        expect(component['dataService'].clearOption).toHaveBeenCalled();
    });

    it('open method', () => {
        spyOn(component['modalService'], 'open');
        component.open('test');
        expect(component['modalService'].open).toHaveBeenCalled();
    });

    it('activeTab method', () => {
        component.activeTab('test');
        expect(component.selectedItem).toBe('test');
    });

    it('getReading method', inject([DataService, CommonService], (ds: DataService, cs: CommonService) => {
        ds.setOption({ study_id: 92 });
        let res = {
            response: {
                reading_id: 123
            }
        }
        var spy = spyOn(cs, 'get_new_reading').and.returnValue(of(res));
        spyOn(component, 'getLastReadingData');
        component.getReading();
        spy.calls.mostRecent().returnValue.subscribe(dt => {
            expect(dt).toBe(res);
            expect(component.getLastReadingData).toHaveBeenCalled();
        });
    }));
});
