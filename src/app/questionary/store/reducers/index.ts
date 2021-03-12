import {
  Action,
  combineReducers,
  createFeatureSelector,
  createSelector
} from "@ngrx/store";

import * as fromMessageQueue from "./messageQueue.reducer";
import * as fromRoot from "../../../store/reducers/root.reducer";
import { CreateUserMaturityModelRequest } from "../../../graphql/generated/graphql";
import { messageQueueFeatureKey } from "./messageQueue.reducer";
import { Message } from "../../shared/models/message.model";
import { MessageQueue } from "../../shared/models/messageQueue.model";

export const questionaryFeatureKey = "questionary";

// overall State
// needed to later map overallState to only this part of state (here HomeState) that we (this specific module) need
export interface State extends fromRoot.State {
  [questionaryFeatureKey]: QuestionaryState;
}

// state of this modules reducers in general
export interface QuestionaryState {
  [fromMessageQueue.messageQueueFeatureKey]: fromMessageQueue.State;
}

export function reducers(state: QuestionaryState | undefined, action: Action) {
  return combineReducers({
    [fromMessageQueue.messageQueueFeatureKey]:
      fromMessageQueue.messageQueueReducer
  })(state, action);
}

export const selectQuestionaryState = createFeatureSelector<
  State,
  QuestionaryState
>(questionaryFeatureKey);

///

export const selectMessageQueueReducerState = createSelector(
  selectQuestionaryState,
  (state) => state[messageQueueFeatureKey] as fromMessageQueue.State
);

export const selectMessageQueueRequestReducerStateObject = createSelector(
  selectMessageQueueReducerState,
  (state) => state as MessageQueue
);
