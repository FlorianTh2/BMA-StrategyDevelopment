import { createAction, props } from "@ngrx/store";
import { CreateUserMaturityModelRequest } from "../../../graphql/generated/graphql";
import { Message } from "../../shared/models/message.model";

export const retrieveDisplayedMessageQueue = createAction(
  "[Questionary] Retrieve DisplayedMessageQueue success",
  props<{ displayedMessageQueue: Message[] }>()
);
