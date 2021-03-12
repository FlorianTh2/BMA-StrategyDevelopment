import { Component, Input, OnInit } from "@angular/core";
import { Message } from "../shared/models/message.model";
import { CreateUserEvaluationMetricRequest } from "../../graphql/generated/graphql";

@Component({
  selector: "app-qa-message",
  templateUrl: "./qa-message.component.html",
  styleUrls: ["./qa-message.component.scss"]
})
export class QaMessageComponent implements OnInit {
  @Input()
  text: string;

  @Input()
  belongsToMetric: boolean;

  constructor() {}

  ngOnInit(): void {}
}
