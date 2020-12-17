import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { Page404HomeComponentComponent } from "./page404-home-component/page404-home-component.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      // {
      //   path: "apply",
      //   component: ApplyComponent
      // },
      // {
      //   path: "",
      //   redirectTo: "apply",
      //   pathMatch: "full"
      // },
      { path: "**", component: Page404HomeComponentComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
