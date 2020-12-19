import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home.component";

import { HomeRoutingModule } from "./home-routing.module";
import { Page404HomeComponentComponent } from "./page404-home-component/page404-home-component.component";
import { SpiderchartComponent } from "./spiderchart/spiderchart.component";
import { TestchartComponent } from "./testchart/testchart.component";
import { SharedModule } from "../shared/share.module";
import { StoreModule } from "@ngrx/store";
import * as fromHome from "./store/reducers";

@NgModule({
  declarations: [
    HomeComponent,
    Page404HomeComponentComponent,
    SpiderchartComponent,
    TestchartComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    StoreModule.forFeature(fromHome.homeFeatureKey, fromHome.reducers)
  ]
})
export class HomeModule {}
