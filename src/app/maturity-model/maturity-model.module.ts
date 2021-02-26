import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MaturityModelRoutingModule } from "./maturity-model-routing.module";
import { MaturityModelComponent } from "./maturity-model.component";
import { HomeModule } from "../home/home.module";
import { SharedModule } from "../shared/share.module";

@NgModule({
  declarations: [MaturityModelComponent],
  imports: [CommonModule, MaturityModelRoutingModule, SharedModule]
})
export class MaturityModelModule {}
