import { ActivatedRoute } from "@angular/router";
import { Component, Input, OnInit } from "@angular/core";
import {
  ConsistencyMatrix,
  UserMaturityModel
} from "../../graphql/generated/graphql";

@Component({
  selector: "app-projectelement-picker-card",
  templateUrl: "./projectelement-picker-card.component.html",
  styleUrls: ["./projectelement-picker-card.component.scss"]
})
export class ProjectelementPickerCardComponent implements OnInit {
  @Input()
  projectId: string;

  @Input()
  userMaturityModel: UserMaturityModel;

  @Input()
  consistencyMatrix: ConsistencyMatrix;

  constructor() {}

  ngOnInit(): void {}
}
