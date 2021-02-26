import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  MaturityModel,
  MaturityModelGQL,
  UserMaturityModel,
  UserMaturityModelOfUserGQL
} from "../graphql/generated/graphql";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { ID_OF_MATURITYMODEL } from "../shared/constants/constants";

@Component({
  selector: "app-maturity-model",
  templateUrl: "./maturity-model.component.html",
  styleUrls: ["./maturity-model.component.scss"]
})
export class MaturityModelComponent implements OnInit {
  maturityModel_id: string;
  userMaturityModel$: Observable<UserMaturityModel>;
  maturityModel$: Observable<MaturityModel>;

  constructor(
    private route: ActivatedRoute,
    private userMaturityModelOfUserGQL: UserMaturityModelOfUserGQL,
    private maturityModelGQL: MaturityModelGQL
  ) {}

  ngOnInit(): void {
    this.maturityModel_id = this.route.snapshot.paramMap.get(
      "maturitymodel_id"
    );
    this.userMaturityModel$ = this.userMaturityModelOfUserGQL
      .watch({ userMaturityModelId: this.maturityModel_id })
      .valueChanges.pipe(
        map(
          (result) => result.data.userMaturityModelOfUser as UserMaturityModel
        )
      );
    this.maturityModel$ = this.maturityModelGQL
      .watch({ maturityModelId: ID_OF_MATURITYMODEL })
      .valueChanges.pipe(
        map((result) => result.data.maturityModel as MaturityModel)
      );
  }
}
