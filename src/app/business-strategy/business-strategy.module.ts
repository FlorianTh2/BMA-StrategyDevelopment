import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BusinessStrategyRoutingModule } from "./business-strategy-routing.module";
import { StrategyDevelopmentComponent } from "./strategy-development/strategy-development.component";
import { SharedModule } from "../shared/share.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { V1StrategyDevelopmentComponent } from "./v-1-strategy-development/strategy-development.component";
import { MatStepperModule } from "@angular/material/stepper";
import { TestStepperComponent } from "../test-stepper/test-stepper.component";

@NgModule({
  declarations: [StrategyDevelopmentComponent, V1StrategyDevelopmentComponent],
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
