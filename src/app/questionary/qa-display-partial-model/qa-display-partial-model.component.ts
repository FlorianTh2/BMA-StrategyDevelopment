import { Component, Input, OnInit } from "@angular/core";
import { CreateUserPartialModelRequest } from "../../graphql/generated/graphql";

@Component({
  selector: "app-qa-display-partial-model",
  templateUrl: "./qa-display-partial-model.component.html",
  styleUrls: ["./qa-display-partial-model.component.scss"]
})
export class QaDisplayPartialModelComponent implements OnInit {
  @Input()
  createUserPartialModelRequest: CreateUserPartialModelRequest;

  constructor() {}

  ngOnInit(): void {}
}
