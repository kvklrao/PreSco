import { TestBed, async } from "@angular/core/testing";
import { AuthGuard } from './auth.guard';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

class MockRouter {
    navigate(path) { }
}

class MockActivatedRouteSnapshot {
    private _data: any;
    get data() {
        return this._data;
    }
}

class MockRouterStateSnapshot {
    url: string = '/';
}

describe('Auth Guard Service', () => {

    let router: Router
    let auth: AuthGuard
    let next: ActivatedRouteSnapshot;
    let state: RouterStateSnapshot;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [AuthGuard,
                { provide: Router, useClass: MockRouter },
                { provide: ActivatedRouteSnapshot, useClass: MockActivatedRouteSnapshot },
                { provide: RouterStateSnapshot, useClass: MockRouterStateSnapshot }
            ]
        });
        router = TestBed.get(Router)
        auth = new AuthGuard(router);
        let store = {};
        spyOn(window.localStorage, 'getItem').and.callFake(function () {
            return JSON.stringify({ "test": "test" });
        });
        spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
            return store[key] = value;
        });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
      });
      

    it('should create', () => {
        expect(auth).toBeTruthy();
    });

    it('canActivate method', () => {
        localStorage.setItem("login_hospital",JSON.stringify({"username":"getwell","email":"get@yahoo.com","user_type":"Hospital","id":92,"hospital_name":"getwell","hospital_branch_name":"getwell indore","hospital_branch_id":59}));
        expect(auth.canActivate(null, null)).toBeTruthy();
    });
});
