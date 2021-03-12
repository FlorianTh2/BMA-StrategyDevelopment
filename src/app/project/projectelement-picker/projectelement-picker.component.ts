import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  Project,
  ProjectsOfUserGQL,
  ProjectsUserMaturityModelsOfUserGQL,
  UserMaturityModel,
  UserMaturityModelOfUserGQL,
  UserMaturityModelsOfUserGQL
} from "../../graphql/generated/graphql";
import { map } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-projectelement-picker",
  templateUrl: "./projectelement-picker.component.html",
  styleUrls: ["./projectelement-picker.component.scss"]
})
export class ProjectelementPickerComponent implements OnInit {
  projectId: string;
  userMaturityModels$: Observable<UserMaturityModel[]>;

  constructor(
    private route: ActivatedRoute,
    private projectsUserMaturityModels: ProjectsUserMaturityModelsOfUserGQL
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.projectId = paramMap.get("project_id");
    });

    this.userMaturityModels$ = this.projectsUserMaturityModels
      .watch({
        projectId: this.projectId
      })
      .valueChanges.pipe(
        map(
          (result) =>
            result.data.projectOfUser.userMaturityModels as UserMaturityModel[]
        )
      );
  }
}
