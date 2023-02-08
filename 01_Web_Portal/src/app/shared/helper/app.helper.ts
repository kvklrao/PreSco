import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable()
export class AppHelper {
    
    constructor(public toasty:ToastrService){

    }
   /**
    * @function as @return succcess
    */
    public success(response){
      //. debugger
      let self = this;  
        if(response.hasOwnProperty('status') && parseInt(response['status']) == 200  ){
          return true;
        } else {             
            return false;
        }
    }

   /**
    * @function as @return errorHandler
    */
    public errorHandler(response){
        let self = this;  
        if(response.hasOwnProperty('status') && parseInt(response['status']) != 200  ){
            if(response.hasOwnProperty('error')){
                if(response.hasOwnProperty('message') && response['message']!=null){
                    self.toasty.error(response['message'],'ERROR');
                }
                else{
                    self.toasty.error('Error','ERROR');
                }
            }
            else{
                self.toasty.error('Error','ERROR');
            }
        }
    }


   /**
    * @function as @return recordNotFound
    */
   public noRecordsFound(response){
     let self = this;  
    if(response.hasOwnProperty('status') && parseInt(response['status']) != 200){
        self.errorHandler(response);
      } else {
         self.errorHandler(response);
      }
   }

      /**
    * @function as @return blobSuccessResponse
    */
   public blobSuccessResponse(response){
    if(response['data']['type']!="application/json"){
        let contentDisposition=response['response']['headers']['_headers'].get('content-disposition');
        var attachmentName="";
        if (contentDisposition[0] && contentDisposition[0].indexOf('attachment') !== -1) {
          var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          var matches = filenameRegex.exec(contentDisposition[0]);
          if (matches != null && matches[1]) { 
            attachmentName = matches[1].replace(/['"]/g, '');
          }
        }
        var url = window.URL.createObjectURL(response.data);
        var a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = url;
        a.download =attachmentName;
        a.click();
        window.URL.revokeObjectURL(url);
         a.remove();
        this.toasty.success("File Downloaded Successfully",'Success');
   }
}

 /**
    * @function as @return blobErrorResponse
    */
   public blobErrorResponse(response){
    const fr = new FileReader();
    var errorMessage=null;
    fr.onloadend = (e => {
      let errorBlob=(fr.result);
      errorMessage=JSON.parse(errorBlob.toString());
        this.errorHandler(errorMessage);
      });
    fr.readAsText(response.data, 'utf-8');
   }




 }