import { Component, Input, OnInit } from "@angular/core";
import { Project } from "../../graphql/generated/graphql";

@Component({
  selector: "app-project-picker-card",
  templateUrl: "./project-picker-card.component.html",
  styleUrls: ["./project-picker-card.component.scss"]
})
export class ProjectPickerCardComponent implements OnInit {
  @Input()
  project: Project;

  constructor() {}

  ngOnInit(): void {}
}
