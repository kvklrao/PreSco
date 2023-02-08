import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateLevel'
})
export class DateLevelPipe implements PipeTransform {

  transform(value: any, date): any {
    const date1 = new Date(value);
    return     ('0' + date1.getDate()).slice(-2) + '/'
             + ('0' + (date1.getMonth()+1)).slice(-2) + '/'
             + date1.getFullYear();
  }

}
