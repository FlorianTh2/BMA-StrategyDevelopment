import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthComponent } from "./auth.component";
import { AuthRoutingModule } from "../auth/auth-routing.module";
import { Page404AuthComponentComponent } from "./page404-auth-component/page404-auth-component.component";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { LogoutComponent } from "./logout/logout.component";
import { ReactiveFormsModule } from "@angular/forms";
import { FormMessagesComponent } from './form-messages/form-messages.component';

@NgModule({
  declarations: [
    AuthComponent,
    Page404AuthComponentComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    FormMessagesComponent
  ],
  imports: [CommonModule, AuthRoutingModule, ReactiveFormsModule]
})
export class AuthModule {}
