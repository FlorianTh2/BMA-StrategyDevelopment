import { Sender } from "../enums/senderEnum";

export interface Message {
  id: number;
  sender: Sender;
  content: string;
}
