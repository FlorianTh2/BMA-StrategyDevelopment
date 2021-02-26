import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProjectRoutingModule } from "./project-routing.module";
import { ProjectComponent } from "./project.component";
import { ProjectPickerComponent } from "./project-picker/project-picker.component";
import { ProjectPickerCardComponent } from "./project-picker-card/project-picker-card.component";
import { SharedModule } from "../shared/share.module";
import { ProjectelementPickerComponent } from './projectelement-picker/projectelement-picker.component';
import { ProjectelementPickerCardComponent } from './projectelement-picker-card/projectelement-picker-card.component';

@NgModule({
  declarations: [
    ProjectComponent,
    ProjectPickerComponent,
    ProjectPickerCardComponent,
    ProjectelementPickerComponent,
    ProjectelementPickerCardComponent
  ],
  imports: [CommonModule, ProjectRoutingModule, SharedModule]
})
export class ProjectModule {}
