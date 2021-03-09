import {
  Action,
  combineReducers,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";

import * as fromCreateUserMaturityModelRequest from "./createUserMaturityModelRequest.reducer";
import * as fromMessageQueue from "./messageQueue.reducer";
import * as fromDisplayedMessageQueue from "./displayedMessageQueue.reducer";
import { createUserMaturityModelRequestFeatureKey } from "./createUserMaturityModelRequest.reducer";
import * as fromRoot from "../../../store/reducers/root.reducer";
import { CreateUserMaturityModelRequest } from "../../../graphql/generated/graphql";
import { messageQueueFeatureKey } from "./messageQueue.reducer";
import { Message } from "../../shared/models/message.model";
import { displayedMessageQueueFeatureKey } from "./displayedMessageQueue.reducer";

export const questionaryFeatureKey = "questionary";

// overall State
// needed to later map overallState to only this part of state (here HomeState) that we (this specific module) need
export interface State extends fromRoot.State {
  [questionaryFeatureKey]: QuestionaryState;
}

// state of this modules reducers in general
export interface QuestionaryState {
  [fromCreateUserMaturityModelRequest.createUserMaturityModelRequestFeatureKey]: fromCreateUserMaturityModelRequest.State;
  [fromMessageQueue.messageQueueFeatureKey]: fromMessageQueue.State;
}

export function reducers(state: QuestionaryState | undefined, action: Action) {
  return combineReducers({
    [fromCreateUserMaturityModelRequest.createUserMaturityModelRequestFeatureKey]:
      fromCreateUserMaturityModelRequest.createUserMaturityModelRequestReducer,
    [fromMessageQueue.messageQueueFeatureKey]:
      fromMessageQueue.messageQueueReducer
  })(state, action);
}

export const selectQuestionaryState = createFeatureSelector<
  State,
  QuestionaryState
>(questionaryFeatureKey);

///

export const selectCreateUserMaturityModelRequestReducerState = createSelector(
  selectQuestionaryState,
  (state) =>
    state[
      createUserMaturityModelRequestFeatureKey
    ] as fromCreateUserMaturityModelRequest.State
);

export const selectCreateUserMaturityModelRequestReducerStateObject = createSelector(
  selectCreateUserMaturityModelRequestReducerState,
  (state) => state as CreateUserMaturityModelRequest
);

///

export const selectMessageQueueReducerState = createSelector(
  selectQuestionaryState,
  (state) => state[messageQueueFeatureKey] as fromMessageQueue.State
);

export const selectMessageQueueRequestReducerStateObject = createSelector(
  selectMessageQueueReducerState,
  (state) => state as ReadonlyArray<Message>
);

///

export const selectDisplayedMessageQueueReducerState = createSelector(
  selectQuestionaryState,
  (state) =>
    state[displayedMessageQueueFeatureKey] as fromDisplayedMessageQueue.State
);

export const selectDisplayedMessageQueueReducerStateObject = createSelector(
  selectDisplayedMessageQueueReducerState,
  (state) => state as ReadonlyArray<Message>
);

///
