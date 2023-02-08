import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {

  private data = {};  
  
  private messageSource = new BehaviorSubject('default message');
  currentMessage = this.messageSource.asObservable();

  private clearSearch = new BehaviorSubject('Search Text');
  currentSearchTrigger = this.clearSearch.asObservable();

 setOption( value) {      
    this.data = value;  
  }  
  
  getOption() {  
    return this.data;  
  }  

  clearOption(){
    this.data={};
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  }

  clearSearchText(message: string) {
    this.clearSearch.next(message)
  }
}
