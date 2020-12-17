import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthComponent } from "./auth.component";
import { AuthRoutingModule } from "../auth/auth-routing.module";
import { Page404AuthComponentComponent } from './page404-auth-component/page404-auth-component.component';

@NgModule({
  declarations: [AuthComponent, Page404AuthComponentComponent],
  imports: [CommonModule, AuthRoutingModule]
})
export class AuthModule {}
