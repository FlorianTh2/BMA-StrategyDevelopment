import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaticSitesRoutingModule } from './static-sites-routing.module';
import { AboutComponent } from './about/about.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ImpressumComponent } from './impressum/impressum.component';


@NgModule({
  declarations: [AboutComponent, PrivacyComponent, ImpressumComponent],
  imports: [
    CommonModule,
    StaticSitesRoutingModule
  ]
})
export class StaticSitesModule { }
