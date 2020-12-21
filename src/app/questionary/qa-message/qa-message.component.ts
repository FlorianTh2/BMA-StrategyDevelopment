import { Component, Input, OnInit } from "@angular/core";
import { Message } from "../shared/models/message.model";

@Component({
  selector: "app-qa-message",
  templateUrl: "./qa-message.component.html",
  styleUrls: ["./qa-message.component.scss"]
})
export class QaMessageComponent implements OnInit {
  @Input()
  message: Message;

  constructor() {}

  ngOnInit(): void {}
}
