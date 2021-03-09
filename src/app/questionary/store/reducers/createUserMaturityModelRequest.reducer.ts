import { createReducer, on } from "@ngrx/store";
import { retrieveCreateUserMaturityModelRequest } from "../actions/createUserMaturityModelRequest.action";
import * as fromRoot from "../../../store/reducers/root.reducer";
import { CreateUserMaturityModelRequest } from "../../../graphql/generated/graphql";

export const createUserMaturityModelRequestFeatureKey =
  "createUserMaturityModelRequest";

export interface State extends CreateUserMaturityModelRequest {}

export const initialState: State = undefined;

const internalCreateUserMaturityModelRequestReducer = createReducer(
  initialState,

  on(
    retrieveCreateUserMaturityModelRequest,
    (
      state: State,
      props: { createUserMaturityModelRequest: CreateUserMaturityModelRequest }
    ) => {
      return props.createUserMaturityModelRequest;
    }
  )
);

export function createUserMaturityModelRequestReducer(state, action) {
  return internalCreateUserMaturityModelRequestReducer(state, action);
}
