import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import {
  ConsistencyMatrix,
  Project,
  ProjectsNestedResourcesGQL,
  UserMaturityModel
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
  consistencyMatrices$: Observable<ConsistencyMatrix[]>;

  constructor(
    private route: ActivatedRoute,
    private projectsNestedResourcesGQL: ProjectsNestedResourcesGQL
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.projectId = paramMap.get("project_id");
    });

    this.consistencyMatrices$ = this.projectsNestedResourcesGQL
      .watch({
        projectId: this.projectId
      })
      .valueChanges.pipe(
        map(
          (result) =>
            result.data.projectOfUser.consistencyMatrices as ConsistencyMatrix[]
        )
      );

    this.projectsNestedResourcesGQL
      .watch({
        projectId: this.projectId
      })
      .valueChanges.pipe()
      .subscribe((res) => {
        console.log("response: ", res.data);
      });

    this.userMaturityModels$ = this.projectsNestedResourcesGQL
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
