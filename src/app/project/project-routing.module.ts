import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectPickerComponent } from "./project-picker/project-picker.component";
import { ProjectComponent } from "./project.component";

const routes: Routes = [
  {
    path: "",
    component: ProjectPickerComponent,
    data: { title: "Projects" },
    pathMatch: "full"
  },
  {
    path: "",
    component: ProjectComponent,
    children: [
      {
        path: ":project_id",
        redirectTo: ":project_id/canvases",
        pathMatch: "full"
      },
      {
        path: ":project_id/canvases",
        loadChildren: "../canvas/canvas.module#CanvasModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
