import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { QuestionaryRoutingModule } from "./questionary-routing.module";
import { QuestionaryComponent } from "./questionary.component";
import { QaListComponent } from "./qa-list/qa-list.component";
import { QaMessageComponent } from "./qa-message/qa-message.component";
import { SharedModule } from "../shared/share.module";
import { QaDisplayPartialModelComponent } from "./qa-display-partial-model/qa-display-partial-model.component";
import { StoreModule } from "@ngrx/store";
import * as fromQuestionary from "./store/reducers";
import { AuthRoutingModule } from "../auth/auth-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    QuestionaryComponent,
    QaListComponent,
    QaMessageComponent,
    QaDisplayPartialModelComponent
  ],
  imports: [
    CommonModule,
    QuestionaryRoutingModule,
    SharedModule,
    StoreModule.forFeature(
      fromQuestionary.questionaryFeatureKey,
      fromQuestionary.reducers
    ),
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class QuestionaryModule {}
