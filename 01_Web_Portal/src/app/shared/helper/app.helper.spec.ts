import { TestBed, async } from "@angular/core/testing";
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppHelper } from './app.helper';
import { AuthGuard } from '../guards/auth.guard';
import { ToastrService, ToastrModule } from 'ngx-toastr';



describe('Helper Service', () => {

    let tostServ: ToastrService
    let appHelper: AppHelper
    
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, ToastrModule.forRoot({
                timeOut: 1000}),],
            providers: [AppHelper]
        });
        tostServ = TestBed.get(ToastrService)
        appHelper = new AppHelper(tostServ);
        // let store = {};
        // spyOn(window.localStorage, 'getItem').and.callFake(function () {
        //     return JSON.stringify({ "test": "test" });
        // });
        // spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
        //     return store[key] = value;
        // });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });
        
    it('should create', () => {
        // localStorage.setItem("login_hospital", JSON.stringify({ "username": "getwell", "email": "get@yahoo.com", "user_type": "Hospital", "id": 92, "hospital_name": "getwell", "hospital_branch_name": "getwell indore", "hospital_branch_id": 59 }))
        expect(appHelper).toBeTruthy();
    });

    it('success method', () => {
        expect(appHelper.success({})).toBeFalsy()
        let res = {
            status:200
        }
        let val = appHelper.success(res)
        expect(val).toBeTruthy()
    });

    it('errorHandler method', () => {
        spyOn(appHelper.toasty,'error')
        let res = {
            status:400,
            message:"test msg"
        }
        appHelper.errorHandler(res)
        expect(appHelper.toasty.error).toHaveBeenCalled();
        res["error"] = "test error"
        appHelper.errorHandler(res)
        expect(appHelper.toasty.error).toHaveBeenCalled();
        res['message'] = null
        appHelper.errorHandler(res)
        expect(appHelper.toasty.error).toHaveBeenCalled();

    });

    it('noRecordsFound method', () => {
        spyOn(appHelper,'errorHandler')
        let res = {
            status:400,
            message:"test msg"
        }
        appHelper.noRecordsFound(res)
        expect(appHelper.errorHandler).toHaveBeenCalled();
        res['status']=200
        appHelper.noRecordsFound(res)
        expect(appHelper.errorHandler).toHaveBeenCalled();
    });

    it('blobSuccessResponse method', () => {
        var fun = (text)=>{
            return [["attachment"]]
        }
        spyOn(appHelper.toasty,'success')
        let res = {
            data:new File([],"test.pdf"),
            response:{
                headers:{
                    _headers:{
                        get:fun
                    }
                }
            }
        }
        appHelper.blobSuccessResponse(res);
        expect(appHelper.toasty.success).toHaveBeenCalled();
    });
});