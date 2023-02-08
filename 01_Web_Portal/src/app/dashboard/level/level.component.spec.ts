import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from "ngx-toastr";
import { LevelComponent } from './level.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LevelComponent', () => {
  let component: LevelComponent;
  let fixture: ComponentFixture<LevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelComponent ],
      imports: [HttpClientTestingModule,ToastrModule.forRoot(), BrowserAnimationsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelComponent);
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
  
  it('isAlreadyExist method', () => {
    expect(component.isAlreadyExist({})).toBeFalsy();

    let obj: Object = {
      status: 422
    };
    expect(component.isAlreadyExist(obj)).toBeTruthy();
  });
  it("ngOnChanges method",()=>{
    spyOn(component,'get_level');
    component.ngOnChanges();
    expect(component.get_level).toHaveBeenCalled();
  });
  it("level_calculate method",()=>{
    expect(component.level_calculate({})).toBeFalsy();
    let response={
      get_level:"xyz"
    }
    //expect(component.level_calculate(response)).toBeTruthy()
    
  })
  it("getFormattedDate method",()=>{
    let date="01/01/2012"
    component.getFormattedDate(date);
  })

  it('isSuccess method', () => {
    expect(component.isSuccess({})).toBeFalsy();

    let obj: Object = {
      status: 200
    };
    expect(component.isSuccess(obj)).toBeTruthy();

    obj["status"] = 404;
    expect(component.isSuccess(obj)).toBeFalsy();
  });

});
