import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { Router, Routes } from "@angular/router";
import { ToastrModule } from "ngx-toastr";
import { SearchComponent } from './search.component';
import { DataService } from '../../shared/service/data.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// export const routes: Routes = [
//   {
//     path: '',
//     component: SearchComponent
//   }
// ];
class MockBbyProfileComponent{
}

export const routes: Routes = [
  {
    path: 'dashboard', component: MockBbyProfileComponent,
    children: [
      {path: '', redirectTo: 'baby-profile', pathMatch: 'prefix'},
      {path: 'baby-profile', component: MockBbyProfileComponent},
    ],
    runGuardsAndResolvers: 'always',
  }
];


describe('PatentComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [FormsModule, NgbModalModule, ReactiveFormsModule,BrowserAnimationsModule, HttpClientTestingModule, RouterTestingModule.withRoutes(routes),
        ToastrModule.forRoot()],
      providers: [DataService,]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  afterEach(() => {
    fixture.destroy();
    TestBed.resetTestingModule();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close_search_box method', () => {
    component.close_search_box();
    expect(component.isTableDisplay).toBeFalsy();
    expect(component.search_str).toBe("");
  });

  it('success method', () => {
  
    spyOn(component, "errorToasty");
    let res = {
      status:200,
      response:[{data:"test"}]
    }

    component.success(res, "get_patients");
    expect(component.patientList.length).toBe(1);

    component.success(res, "search_patient");
    expect(component.searchResultEmpty).toBeFalsy();

    res['status']=600
    component.success(res, "get_patients");
    expect(component.errorToasty).toHaveBeenCalled()

    component.success(res, "search_patient");
    expect(component.searchResultEmpty).toBeTruthy();

  });

  it('errorHandler method', () => {
    spyOn(component, "errorToasty");
    component.errorHandler("test", "signup");
    expect(component.errorToasty).toHaveBeenCalled();
  });

  it('isSuccess method', () => {
    expect(component.isSuccess({})).toBeFalsy();

    let obj: Object = {
      status: 200
    };
    expect(component.isSuccess(obj)).toBeTruthy();

  });

  it('isAlreadyExist method', () => {
    expect(component.isAlreadyExist({})).toBeFalsy();

    let obj: Object = {
      status: 422
    };
    expect(component.isAlreadyExist(obj)).toBeTruthy();
  });

  it('view_patient method', () => {
    spyOn(component.id,'emit');
    spyOn(localStorage,'setItem');
    let obj = {
      id:123,
      study_id:1234,
      reading:12345
    }
    component.view_patient(obj);
    expect(component.id.emit).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('open method', () => {
    spyOn(component['modalService'],'open');
   component.open({});
    expect(component['modalService'].open).toHaveBeenCalled();
  });

  it('close method', () => {
    spyOn(component,'createForm');
   component.close();
    expect(component.createForm).toHaveBeenCalled();
  });

  it('errorToasty method', () => {
    spyOn(component["toastr"],'error');
    component.errorToasty(new Error("test"))
    expect(component["toastr"].error).toHaveBeenCalled()
    component.errorToasty(new Error())
    expect(component["toastr"].error).toHaveBeenCalled()
  });

  
});
