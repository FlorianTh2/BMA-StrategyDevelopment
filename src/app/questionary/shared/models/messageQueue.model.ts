import { Message } from "./message.model";
import { EvaluationItem } from "./evaluationItem";
import { CreateUserMaturityModelRequest } from "../../../graphql/generated/graphql";

export interface MessageQueue {
  messageQueue: ReadonlyArray<Message>;
  displayedMessageQueue: ReadonlyArray<Message>;
  clickedEvaluationMetricIds: ReadonlyArray<EvaluationItem>;
  model: CreateUserMaturityModelRequest;
}
