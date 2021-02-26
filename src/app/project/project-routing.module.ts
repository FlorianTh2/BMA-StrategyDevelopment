import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ProjectPickerComponent } from "./project-picker/project-picker.component";
import { ProjectComponent } from "./project.component";
import { ProjectelementPickerComponent } from "./projectelement-picker/projectelement-picker.component";

const routes: Routes = [
  {
    path: "",
    component: ProjectPickerComponent,
    data: { title: "Project" },
    pathMatch: "full"
  },
  {
    path: "",
    component: ProjectComponent,
    children: [
      {
        path: ":project_id",
        redirectTo: ":project_id/projectelements",
        pathMatch: "full"
      },
      {
        path: ":project_id/projectelements",
        component: ProjectelementPickerComponent
      },
      {
        path: ":project_id/projectelements/maturitymodel",
        loadChildren: () =>
          import(`./../maturity-model/maturity-model.module`).then(
            (m) => m.MaturityModelModule
          )
      }

      // {
      //   path: ":project_id",
      //   redirectTo: ":project_id/canvases",
      //   pathMatch: "full"
      // },
      // {
      //   path: ":project_id/canvases",
      //   loadChildren: "../canvas/canvas.module#CanvasModule"
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectRoutingModule {}
