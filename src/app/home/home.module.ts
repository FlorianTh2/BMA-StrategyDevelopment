import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";

import { HomeRoutingModule } from "./home-routing.module";
import { Page404HomeComponentComponent } from "./page404-home-component/page404-home-component.component";
import { SpiderchartComponent } from "./spiderchart/spiderchart.component";

@NgModule({
  declarations: [
    HomeComponent,
    Page404HomeComponentComponent,
    SpiderchartComponent
  ],
  imports: [CommonModule, HomeRoutingModule]
})
export class HomeModule {}
