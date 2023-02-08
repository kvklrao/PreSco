import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'emptyDataPipe'
})
export class emptyDataPipe implements PipeTransform {
  transform(value: any): string {
   if(value==undefined || value=="" || value==null){
    return "-";
   }
   return value;
  }
}