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
  }
];

// default
// { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
