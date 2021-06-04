import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BusinessStrategyRoutingModule } from "./business-strategy-routing.module";
import { StrategyDevelopmentComponent } from "./strategy-development/strategy-development.component";
import { SharedModule } from "../shared/share.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [StrategyDevelopmentComponent],
  exports: [StrategyDevelopmentComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    BusinessStrategyRoutingModule
  ]
})
export class BusinessStrategyModule {}
