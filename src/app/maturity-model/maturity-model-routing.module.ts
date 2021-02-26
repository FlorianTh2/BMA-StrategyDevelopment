import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MaturityModelComponent } from "./maturity-model.component";

const routes: Routes = [
  {
    path: ":maturitymodel_id",
    component: MaturityModelComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaturityModelRoutingModule {}
