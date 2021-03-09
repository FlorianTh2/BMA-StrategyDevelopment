import { createReducer, on } from "@ngrx/store";
import { Message } from "../../shared/models/message.model";
import { retrieveMessageQueue } from "../actions/messageQueue.action";

export const messageQueueFeatureKey = "messageQueue";

export interface State extends ReadonlyArray<Message> {}

export const initialState: State = [];

const internalMessageQueueReducer = createReducer(
  initialState,

  on(
    retrieveMessageQueue,
    (state: State, props: { messageQueue: ReadonlyArray<Message> }) => {
      return props.messageQueue;
    }
  )
);

export function messageQueueReducer(state, action) {
  return internalMessageQueueReducer(state, action);
}
