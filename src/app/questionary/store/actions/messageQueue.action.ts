import { createAction, props } from "@ngrx/store";
import { CreateUserMaturityModelRequest } from "../../../graphql/generated/graphql";
import { Message } from "../../shared/models/message.model";

export const retrieveMessageQueue = createAction(
  "[Questionary] Retrieve MessageQueue success",
  props<{ messageQueue: Message[] }>()
);
