import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProjectRoutingModule } from "./project-routing.module";
import { ProjectComponent } from "./project.component";
import { ProjectPickerComponent } from "./project-picker/project-picker.component";
import { ProjectPickerCardComponent } from "./project-picker-card/project-picker-card.component";
import { SharedModule } from "../shared/share.module";

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectPickerComponent,
    ProjectPickerCardComponent
  ],
  imports: [CommonModule, ProjectRoutingModule, SharedModule]
})
export class ProjectModule {}
