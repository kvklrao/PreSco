import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  var fixture;
  var app;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'avyantra-fe'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('avyantra-fe');
  });

  it(`ngAfterViewChecked method`, () => {
    var res = {
      test:"test",
      isLoad:true
    }
    let spy = spyOn(app['commonAsyn'],'hideLoader').and.returnValue(of(res))
    app.ngAfterViewChecked()
    spy.calls.mostRecent().returnValue.subscribe((dt)=>{
      expect(dt).toBe(res)
      expect(app.isLoading).toBeTruthy()
    })

    res['isLoad'] = false
    spy.and.returnValue(of(res))
    app.ngAfterViewChecked()
    spy.calls.mostRecent().returnValue.subscribe((dt)=>{
      expect(dt).toBe(res)
      expect(app.isLoading).toBeFalsy()
    })
  });
});