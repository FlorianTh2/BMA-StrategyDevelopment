import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { QuestionaryRoutingModule } from './questionary-routing.module';
import { QuestionaryComponent } from './questionary.component';
import { QaListComponent } from './qa-list/qa-list.component';
import { QaMessageComponent } from './qa-message/qa-message.component';


@NgModule({
  declarations: [QuestionaryComponent, QaListComponent, QaMessageComponent],
  imports: [
    CommonModule,
    QuestionaryRoutingModule
  ]
})
export class QuestionaryModule { }
