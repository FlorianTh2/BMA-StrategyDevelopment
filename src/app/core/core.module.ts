import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { SharedModule } from "./../shared/share.module";
import { RouterModule } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";
import { GraphQLModule } from "../graphql/graphql.module";

@NgModule({
  declarations: [FooterComponent, HeaderComponent],
  imports: [CommonModule, SharedModule, RouterModule],
  exports: [HeaderComponent, FooterComponent, GraphQLModule, HttpClientModule]
})
export class CoreModule {}
