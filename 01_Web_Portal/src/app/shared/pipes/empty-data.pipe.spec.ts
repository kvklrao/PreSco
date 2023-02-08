import { emptyDataPipe } from './empty-data.pipe';
import { pipe } from 'rxjs';
import { async, TestBed } from '@angular/core/testing';

describe('EmptyDataPipe', () => {
  let pipe;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers:[]
    })
    pipe=new emptyDataPipe();
  })); 

  afterEach(() => {
    TestBed.resetTestingModule();
  });
  
  it('create an instance', () => {
    let pipe = new emptyDataPipe();
    expect(pipe).toBeTruthy();
  });
  it("should call transform method", () => {
    expect(pipe.transform('')).toBe('-');
  });

});


