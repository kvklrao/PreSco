import { DateLevelPipe } from './date-level.pipe';
import { pipe } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';

describe('DateLevelPipe', () => {
  let pipe;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers:[]
    })
    pipe=new DateLevelPipe();
  })); 

  afterEach(() => {
    TestBed.resetTestingModule();
  });
  
  it('create an instance', () => {
    let pipe = new DateLevelPipe();
    expect(pipe).toBeTruthy();
  });
  it("should call transform method", () => {
    expect(pipe.transform('01/01/2001','dd/MM/yyyy')).toBe('01/01/2001');
  });

});


