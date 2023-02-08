import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusPipe'
})
export class statusPipe implements PipeTransform {
  transform(value: any): string {
  if(value==1){
      return "Active";
  }
  else{
      return "Inactive";
  }
}
}