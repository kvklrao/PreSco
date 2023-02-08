import { Pipe, PipeTransform } from '@angular/core';
import {AppConstant} from '../../shared/constant/app-constant';
@Pipe({
  name: 'userPipe'
})
export class userTypePipe implements PipeTransform {
    constructor(private constant:AppConstant){}
  transform(id: number,object?:any): string {
   if(id==this.constant.hospital_type){
    return object['hospital_name'];
   }
   if(id==this.constant.hospital_branch_type){
    return object['branch_name']
   }
   if(id==null){
       return "-";
   }
  }
}