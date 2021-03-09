import { createAction, props } from "@ngrx/store";
import { CreateUserMaturityModelRequest } from "../../../graphql/generated/graphql";

export const retrieveCreateUserMaturityModelRequest = createAction(
  "[Questionary] Retrieve CreateUserMaturityMOdelRequest success",
  props<{ createUserMaturityModelRequest: CreateUserMaturityModelRequest }>()
);
