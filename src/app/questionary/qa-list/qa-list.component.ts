import { Component, OnInit } from "@angular/core";
import { Message } from "../shared/models/message.model";
import { Sender } from "../shared/enums/senderEnum";

@Component({
  selector: "app-qa-list",
  templateUrl: "./qa-list.component.html",
  styleUrls: ["./qa-list.component.scss"]
})
export class QaListComponent implements OnInit {
  MESSAGES: Message[] = [
    { id: 0, sender: Sender.System, content: "Welcome" },
    { id: 1, sender: Sender.User, content: "Welcome" },
    { id: 2, sender: Sender.System, content: "Welcome" },
    { id: 3, sender: Sender.User, content: "Welcome" },
    { id: 4, sender: Sender.System, content: "Welcome" }
  ];

  constructor() {}

  ngOnInit(): void {}
}
