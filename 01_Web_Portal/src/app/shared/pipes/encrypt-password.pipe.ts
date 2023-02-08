import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'passwordEcryptPipe'
})
export class passwordPipe implements PipeTransform {
  transform(password: string): string {
    var encryptString="*"
    return encryptString.repeat(password.length);
  }
}