import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { Page404HomeComponentComponent } from "../home/page404-home-component/page404-home-component.component";
import { QuestionaryComponent } from "./questionary.component";

const routes: Routes = [
  {
    path: "",
    component: QuestionaryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionaryRoutingModule {}
