import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { LoginService } from "../shared/service/login.service";
import { Common } from "../shared/service/common/common";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"],
  providers: [LoginService]
})
export class SignupComponent implements OnInit {
  signForm: FormGroup;
  submitted = false;
  already_exist_status = 422;
  success_status = 200;
  doNotAutoComplete:any={};

  public customPatterns = { 'A': { pattern: new RegExp('\[a-zA-Z0-9_*!@#$%&\]') } };
  public onlyCharWithSpace = { 'S': { pattern: new RegExp('\[a-zA-Z, \]') } };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private api: LoginService,
    private commonAsyn: Common
  ) { }

  ngOnInit() {
    this.commonAsyn.isHide();
    this.signForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email,Validators.pattern('[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}')]],
      hospital_name: ["", [Validators.required,Validators.maxLength(20)]],
      username: ["", [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPass: ["", [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * @method : signup
   * @purpose :- user signup here using this method
   */
  async signup() {
    this.submitted = true;
    if (this.signForm.invalid) {
      return;
    }

    const signupResponse = await this.api.signup(this.signForm.value);
    signupResponse.subscribe(
      response => {
        this.success(response, "signup");
      },
      error => {
        console.error("errro", error);
      });
  }

  /**
   *
   * @param response
   * @param api_type
   * @method: success
   * @purpose :-  it is a common helper
   */
  success(response, api_type) {
    const vim = this;
    if (api_type == "signup") {
      if (vim.isSuccess(response)) {
        vim.toastr.success("", "Sign Up Successful");
        vim.router.navigate(["/login"]);
      } else {
        if (vim.isAlreadyExist(response)) {
          vim.toastr.warning("Already Exist!!", response["message"]);
        } else {
          vim.errorToasty(response);
        }
      }
    }
  }

  /**
   *
   * @param error
   * @param api_type
   * @purpose :-  This is error handler method is called.
   * @method: errorHandler
   */
  errorHandler(error, api_type) {
    const vim = this;
    if (api_type == "signup") {
      vim.errorToasty(error);
    }
  }

  /**
   *
   * @param response
   * @method: it is a common herlper for check the status is 200 or not
   */
  isSuccess(response) {
    const vim = this;
    if (
      response.hasOwnProperty("status") &&
      response["status"] === vim.success_status
    ) {
      return true;
    }
    return false;
  }
  /**
   *
   * @param response
   * @method :- isAlreadyExist
   * @purpose :- check if User Already Exist.
   */
  isAlreadyExist(response) {
    const vim = this;
    if (
      response.hasOwnProperty("status") &&
      response["status"] === vim.already_exist_status
    ) {
      return true;
    }
    return false;
  }
  /**
   * @method :- errorToasty
   */
  errorToasty(error) {
    const vim = this;
    if (error.hasOwnProperty("message")) {
      vim.toastr.error("Error!", error["message"]);
    } else {
      vim.toastr.error("Error!", "Somethink wrong!!!..");
    }
  }

  is_match() {
    const vim = this;
    if (
      vim.signForm.value["confirmPass"] != "" &&
      vim.signForm.value["password"] != "" &&
      vim.signForm.value["confirmPass"] != vim.signForm.value["password"]
    ) {
      return true;
    }
    return false;
  }

  login() {
    const vim = this;
    vim.router.navigate(["/login"]);
  }
}
