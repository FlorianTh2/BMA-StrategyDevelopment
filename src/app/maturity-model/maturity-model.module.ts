import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MaturityModelRoutingModule } from "./maturity-model-routing.module";
import { MaturityModelComponent } from "./maturity-model.component";
import { HomeModule } from "../home/home.module";
import { SharedModule } from "../shared/share.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DisplayPartialModelComponent } from './display-partial-model/display-partial-model.component';

@NgModule({
  declarations: [MaturityModelComponent, DisplayPartialModelComponent],
  imports: [
    CommonModule,
    MaturityModelRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class MaturityModelModule {}
