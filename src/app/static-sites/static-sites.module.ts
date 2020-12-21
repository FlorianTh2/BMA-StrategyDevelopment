import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AboutComponent } from "./about/about.component";
import { PrivacyComponent } from "./privacy/privacy.component";
import { ImpressumComponent } from "./impressum/impressum.component";

@NgModule({
  declarations: [AboutComponent, PrivacyComponent, ImpressumComponent],
  imports: [CommonModule]
})
export class StaticSitesModule {}
