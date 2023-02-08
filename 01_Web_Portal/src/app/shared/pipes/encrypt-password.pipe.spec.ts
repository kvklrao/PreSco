import { TestBed, async } from "@angular/core/testing";
import { passwordPipe } from './encrypt-password.pipe';

describe('EncryptPassword Service', () => {
    let encrypt;

    beforeEach(async(() => {
      TestBed.configureTestingModule({
        providers:[]
      })
      encrypt=new passwordPipe();
    }));

    afterEach(() => {
      TestBed.resetTestingModule();
    });
      
    it("should create",()=>{
        expect(encrypt).toBeTruthy();
    });

    it("transform method",()=>{
      encrypt.transform('testing');
      expect(encrypt.transform('testing')).toBe('*******');
    });
        
  });
