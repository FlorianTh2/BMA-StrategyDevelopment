import { Sender } from "../enums/senderEnum";
import { CreateUserPartialModelRequest } from "../../../graphql/generated/graphql";

export interface Message {
  id: number;
  sender: Sender;
  creatUserPartialModelRequest: CreateUserPartialModelRequest;
}
