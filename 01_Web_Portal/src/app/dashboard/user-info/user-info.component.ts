import { Component, OnInit } from '@angular/core';
import { Util } from '../../shared/core/util';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {
  //  userInfo:any = {};
  //  formRef:any;
  constructor(
    // private formBuilder: FormBuilder,public config: NgbModalConfig,
    // private modalService: NgbModal,private util: Util
    ) { }
 
    ngOnInit() {}    
  // ngOnInit() {
  //   const vim = this;
  //   vim.util.getUserInfo().subscribe(value => { 
  //      vim.userInfo = value;
  //   });
  // }


  // open(content) {
  //   //this.id.emit(0);
  
  //  this.formRef = this.modalService.open(content, { size: 'lg' });
  // }

  // close() {
  //    const vim = this;
  //    vim.formRef.close();
  // }
}
