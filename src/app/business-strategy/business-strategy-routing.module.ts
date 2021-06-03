import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BusinessStrategyComponent } from "./business-strategy.component";

const routes: Routes = [
  {
    path: "",
    component: BusinessStrategyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessStrategyRoutingModule {}
