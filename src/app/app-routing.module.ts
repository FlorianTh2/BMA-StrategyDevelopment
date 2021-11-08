import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./static-sites/about/about.component";
import { PrivacyComponent } from "./static-sites/privacy/privacy.component";
import { ImpressumComponent } from "./static-sites/impressum/impressum.component";
import { TestStepperComponent } from "./test-stepper/test-stepper.component";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () => import(`./home/home.module`).then((m) => m.HomeModule)
  },
  {
    path: "auth",
    loadChildren: () => import(`./auth/auth.module`).then((m) => m.AuthModule)
  },
  {
    path: "project",
    loadChildren: () =>
      import(`./project/project.module`).then((m) => m.ProjectModule)
  },
  {
    path: "questionary",
    loadChildren: () =>
      import(`./questionary/questionary.module`).then(
        (m) => m.QuestionaryModule
      )
  },
  {
    path: "businessstrategy",
    loadChildren: () =>
      import("./business-strategy/business-strategy.module").then(
        (m) => m.BusinessStrategyModule
      )
  },
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "privacy",
    component: PrivacyComponent
  },
  {
    path: "impressum",
    component: ImpressumComponent
  },
  // default
  { path: "", redirectTo: "/home", pathMatch: "full" },
  {
    path: "test",
    component: TestStepperComponent
  }
  //
  // to make it possible to be on route localhost:4200/: (otherwise this route will always load to /home)
  // (maybe there will be errors (like it is possible to /home/project1 to make /project1?? this should not be possible)
  // later but idk)
  // {
  //   path: "",
  //   loadChildren: () => import(`./home/home.module`).then((m) => m.HomeModule),
  //   pathMatch: "full"
  // }
  // error was: svg disappeard -> i guess this happens since the viewport config of the spiderchart is re-configured
  // with the app-module since it is no longer loaded in the home-module

  // another approach:
  // { path: "", component: HomeComponent, pathMatch: "full" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
