import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from "@angular/material";
import { LoginComponent } from "./login.component";
import { LoginRouting } from "./login.routing";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    MatIconModule,
    LoginRouting,
    ReactiveFormsModule,
    HttpClientModule
  ],
  entryComponents: []
})
export class LoginModule {}
