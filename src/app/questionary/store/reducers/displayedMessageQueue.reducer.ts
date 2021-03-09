import { createReducer, on } from "@ngrx/store";
import { Message } from "../../shared/models/message.model";
import { retrieveDisplayedMessageQueue } from "../actions/displayedMessageQueue.action";

export const displayedMessageQueueFeatureKey = "displayedMessageQueue";

export interface State extends ReadonlyArray<Message> {}

export const initialState: State = [];

const internalDisplayedMessageQueueReducer = createReducer(
  initialState,

  on(
    retrieveDisplayedMessageQueue,
    (
      state: State,
      props: { displayedMessageQueue: ReadonlyArray<Message> }
    ) => {
      return props.displayedMessageQueue;
    }
  )
);

export function displayedMessageQueueReducer(state, action) {
  return internalDisplayedMessageQueueReducer(state, action);
}
