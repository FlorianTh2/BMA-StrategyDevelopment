import { createReducer, on } from "@ngrx/store";
import { Message } from "../../shared/models/message.model";
import {
  resetQuestionary,
  retrieveCreateUserMaturityModelRequest,
  retrieveMessageQueue,
  selectEvaluationMetric,
  setNextMessage,
  setNextMessageTillNextEvaluationMetric,
  setNextMessageWithEvaluationMetric,
  setProperty
} from "../actions/messageQueue.action";
import { MessageQueue } from "../../shared/models/messageQueue.model";
import { EvaluationItem } from "../../shared/models/evaluationItem";
import {
  CreateUserEvaluationMetricRequest,
  CreateUserMaturityModelRequest,
  CreateUserPartialModelRequest
} from "../../../graphql/generated/graphql";

export const messageQueueFeatureKey = "messageQueue";

export interface State extends MessageQueue {}

export const initialState: State = {
  model: undefined,
  messageQueue: [],
  displayedMessageQueue: [],
  clickedEvaluationMetricIds: []
};

const internalMessageQueueReducer = createReducer(
  initialState,
  on(resetQuestionary, (state: State) => {
    return initialState;
  }),
  on(
    retrieveCreateUserMaturityModelRequest,
    (
      state: State,
      props: { createUserMaturityModelRequest: CreateUserMaturityModelRequest }
    ) => {
      return {
        ...state,
        model: props.createUserMaturityModelRequest
      };
    }
  ),
  on(
    setProperty,
    (
      state: State,
      props: {
        partialModelId: number;
        evaluationMetricId: number;
        newValue: number;
      }
    ) => {
      const newModel: CreateUserMaturityModelRequest = {
        ...state.model,
        userPartialModels: setValueEvaluationMatric(
          [...state.model.userPartialModels],
          props.partialModelId,
          props.evaluationMetricId,
          props.newValue
        )
      };
      return {
        ...state,
        model: newModel
      };
    }
  ),
  on(
    retrieveMessageQueue,
    (state: State, props: { messageQueue: ReadonlyArray<Message> }) => {
      return {
        ...state,
        messageQueue: props.messageQueue
      };
    }
  ),
  on(setNextMessageTillNextEvaluationMetric, (state: State) => {
    const extractedMessages: Message[] = [];
    let index: number = 0;
    while (true) {
      const leadingElement: Message = state.messageQueue[index];
      extractedMessages.push(leadingElement);
      index += 1;
      if (
        Array.isArray(
          leadingElement.creatUserPartialModelRequest.userEvaluationMetrics
        ) &&
        leadingElement.creatUserPartialModelRequest.userEvaluationMetrics.length
      ) {
        break;
      }
    }
    const tmpDisplayedMessageQueue = [...state.displayedMessageQueue];
    return {
      ...state,
      messageQueue: state.messageQueue.slice(index),
      displayedMessageQueue: tmpDisplayedMessageQueue.concat(extractedMessages)
    };
  }),
  on(setNextMessageWithEvaluationMetric, (state: State) => {
    let extractedMessage: Message;
    let index: number = 0;
    while (true) {
      extractedMessage = state.messageQueue[index];
      index += 1;
      if (
        Array.isArray(
          extractedMessage.creatUserPartialModelRequest.userEvaluationMetrics
        ) &&
        extractedMessage.creatUserPartialModelRequest.userEvaluationMetrics
          .length
      ) {
        break;
      }
    }
    return {
      ...state,
      messageQueue: state.messageQueue.slice(index),
      displayedMessageQueue: [...state.displayedMessageQueue, extractedMessage]
    };
  }),
  on(setNextMessage, (state: State) => {
    const leadingMessage = state.messageQueue[0];
    return {
      ...state,
      messageQueue: state.messageQueue.slice(1),
      displayedMessageQueue: state.displayedMessageQueue.concat([
        leadingMessage
      ])
    };
  }),
  on(
    selectEvaluationMetric,
    (state: State, props: { item: EvaluationItem }) => {
      // create new list (since immutable) + removing possible existing old index
      const currentIds = state.clickedEvaluationMetricIds.filter(
        (a) => a.evaluationMetricId !== props.item.evaluationMetricId
      );
      currentIds.push(props.item);
      return {
        ...state,
        clickedEvaluationMetricIds: currentIds
      };
    }
  )
);

function setValueEvaluationMatric(
  partialModels: CreateUserPartialModelRequest[],
  partialModelId: number,
  evaluationId: number,
  newValue: number
): CreateUserPartialModelRequest[] {
  const result: CreateUserPartialModelRequest[] = partialModels.map((a) => {
    if (parseInt(a.partialModelId) === partialModelId) {
      const evaluationMetricResult: CreateUserEvaluationMetricRequest[] = a.userEvaluationMetrics.map(
        (b) => {
          if (parseInt(b.evaluationMetricId) === evaluationId) {
            return { ...b, valueEvaluationMetric: newValue };
          }
          return b;
        }
      );
      return { ...a, userEvaluationMetrics: evaluationMetricResult };
    }
    if (
      Array.isArray(a.subUserPartialModels) &&
      a.subUserPartialModels.length
    ) {
      return {
        ...a,
        subUserPartialModels: setValueEvaluationMatric(
          a.subUserPartialModels,
          partialModelId,
          evaluationId,
          newValue
        )
      };
    }
    return a;
  });
  return result;
}

export function messageQueueReducer(state, action) {
  return internalMessageQueueReducer(state, action);
}
