import { Component, OnInit } from "@angular/core";
import {
  MaturityModel,
  Project,
  ProjectsOfUserGQL
} from "../../graphql/generated/graphql";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: "app-project-picker",
  templateUrl: "./project-picker.component.html",
  styleUrls: ["./project-picker.component.scss"]
})
export class ProjectPickerComponent implements OnInit {
  projects$: Observable<Project[]>;

  constructor(private projectsOfUserGQL: ProjectsOfUserGQL) {}

  ngOnInit(): void {
    this.projects$ = this.projectsOfUserGQL
      .watch()
      .valueChanges.pipe(
        map((result) => result.data.projectsOfUser as Project[])
      );
  }
}
