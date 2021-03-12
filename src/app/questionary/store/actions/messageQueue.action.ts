import { createAction, props } from "@ngrx/store";
import { CreateUserMaturityModelRequest } from "../../../graphql/generated/graphql";
import { Message } from "../../shared/models/message.model";
import { EvaluationItem } from "../../shared/models/evaluationItem";

export const resetQuestionary = createAction(
  "[Questionary] Reset Whole Questionary-State"
);

export const retrieveCreateUserMaturityModelRequest = createAction(
  "[Questionary] Retrieve CreateUserMaturityMOdelRequest success",
  props<{ createUserMaturityModelRequest: CreateUserMaturityModelRequest }>()
);

export const setProperty = createAction(
  "[Questionary] Set New Property success",
  props<{
    partialModelId: number;
    evaluationMetricId: number;
    newValue: number;
  }>()
);

export const retrieveMessageQueue = createAction(
  "[Questionary] Retrieve MessageQueue success",
  props<{ messageQueue: Message[] }>()
);

export const setNextMessageTillNextEvaluationMetric = createAction(
  "[Questionary] Set Next Message Till Next EvaluationMetrics success"
);

export const setNextMessageWithEvaluationMetric = createAction(
  "[Questionary] Set Next Message With EvaluationMetrics success"
);

export const setNextMessage = createAction(
  "[Questionary] Set Next Message success"
);

export const selectEvaluationMetric = createAction(
  "[Questionary] Select EvaluationMetric success",
  props<{ item: EvaluationItem }>()
);
