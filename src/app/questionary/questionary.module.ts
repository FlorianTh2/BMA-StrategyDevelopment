import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionaryRoutingModule } from './questionary-routing.module';
import { QuestionaryComponent } from './questionary.component';


@NgModule({
  declarations: [QuestionaryComponent],
  imports: [
    CommonModule,
    QuestionaryRoutingModule
  ]
})
export class QuestionaryModule { }
