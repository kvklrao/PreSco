import { userTypePipe } from "./user-type.pipe";
import { async, TestBed, fakeAsync } from '@angular/core/testing';
import { AppConstant } from '../constant/app-constant';
import { pipe } from 'rxjs';

describe('User Type Service', () => {
   var constant;
   var usertype;

  beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers:[AppConstant]
      })
      constant=TestBed.get(AppConstant)
      usertype=new userTypePipe(constant);
    }));  
 
  it("should create",()=>{
      expect(usertype).toBeTruthy();
  });
  it('transform method when id is 2',()=>{
    usertype.transform(2,{hospital_name:'2'});
    expect(usertype.transform(2,{hospital_name:'2'})).toBe('2')
  });
  it('transform method when id is null',()=>{
    usertype.transform('',{});
    expect(usertype.transform(null,{hospital_name:'2'})).toBe('-');
  })
  it('transform method when id is',()=>{
    usertype.transform(3,{branch_name:'3'});
    expect(usertype.transform(3,{branch_name:'3'})).toBe('3')
  });

      
});
