import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "home",
    loadChildren: () => import(`./home/home.module`).then((m) => m.HomeModule)
  },
  {
    path: "auth",
    loadChildren: () => import(`./auth/auth.module`).then((m) => m.AuthModule)
  },
  // default
  // { path: "", redirectTo: "/home", pathMatch: "full" }
  //
  // to make it possible to be on route localhost:4200/: (otherwise this route will always load to /home)
  // (maybe there will be errors (like it is possible to /home/project1 to make /project1?? this should not be possible)
  // later but idk)
  {
    path: "",
    loadChildren: () => import(`./home/home.module`).then((m) => m.HomeModule),
    pathMatch: "full"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
