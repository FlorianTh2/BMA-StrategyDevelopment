import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BusinessStrategyRoutingModule } from "./business-strategy-routing.module";
import { StrategyDevelopmentComponent } from "./strategy-development/strategy-development.component";

@NgModule({
  declarations: [StrategyDevelopmentComponent],
  exports: [StrategyDevelopmentComponent],
  imports: [CommonModule, BusinessStrategyRoutingModule]
})
export class BusinessStrategyModule {}
