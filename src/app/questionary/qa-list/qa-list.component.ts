import { Component, OnInit } from "@angular/core";
import { Message } from "../shared/models/message.model";
import { Sender } from "../shared/enums/senderEnum";
import { Observable } from "rxjs";
import {
  CreateUserEvaluationMetricRequest,
  CreateUserMaturityModelRequest,
  CreateUserPartialModelRequest,
  EvaluationMetric,
  MaturityModel,
  MaturityModelGQL,
  PartialModel,
  UserMaturityModel,
  UserMaturityModelsOfUserGQL,
  UserPartialModel
} from "../../graphql/generated/graphql";
import { map } from "rxjs/operators";
import { ID_OF_MATURITYMODEL } from "../../shared/constants/constants";
import { ActivatedRoute } from "@angular/router";

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
  projectId: string;
  maturityModel$: Observable<MaturityModel>;

  constructor(
    private route: ActivatedRoute,
    private maturityModelGQL: MaturityModelGQL
  ) {}

  ngOnInit(): void {
    // will be undefined since this route will be available to public (without a project)
    // but possibly will be defined if loggedIn
    this.route.paramMap.subscribe((paramMap) => {
      this.projectId = paramMap.get("project_id");
    });

    this.maturityModel$ = this.maturityModelGQL
      .watch({ maturityModelId: ID_OF_MATURITYMODEL })
      .valueChanges.pipe(
        map((result) => result.data.maturityModel as MaturityModel)
      );
  }

  createCreateUserMaturityModelRequest(
    maturityModel: MaturityModel
  ): CreateUserMaturityModelRequest {
    return {
      // will be undefined if accessed from public-route since we have no projectId since this will be available to public (there is no project-route)
      projectId: this.projectId,
      maturityLevel: 0,
      name: "Define a name for your maturity-model!",
      userPartialModels: this.createCreateUserPartialModelRequests(
        maturityModel.partialModels
      )
    } as CreateUserMaturityModelRequest;
  }

  createCreateUserPartialModelRequests(
    partialModels: PartialModel[]
  ): CreateUserPartialModelRequest[] {
    const createdCreateUserPartialModelRequest: CreateUserPartialModelRequest[] = partialModels.map(
      (a) => {
        return {
          maturityLevelEvaluationMetrics: 0,
          partialModelId: a.id,
          // storing addition the whole partialModel (and later the evaluationMetric to userEvaluationMetric to get easier access)
          // this object will be ignored with graphql and since it is not send
          partialModel: a,
          userEvaluationMetrics:
            Array.isArray(a.evaluationMetrics) && a.evaluationMetrics.length
              ? this.createCreateUserEvaluationMetricRequests(
                  a.evaluationMetrics
                )
              : [],
          subUserPartialModels:
            Array.isArray(a.subPartialModels) && a.subPartialModels.length
              ? this.createCreateUserPartialModelRequests(a.subPartialModels)
              : []
        } as CreateUserPartialModelRequest;
      }
    );
    return createdCreateUserPartialModelRequest;
  }

  createCreateUserEvaluationMetricRequests(
    evaluationMetrics: EvaluationMetric[]
  ): CreateUserEvaluationMetricRequest[] {
    const createdCreateUserEvaluationMetrics: CreateUserEvaluationMetricRequest[] = evaluationMetrics.map(
      (a) => {
        return {
          valueEvaluationMetric: 0,
          evaluationMetricId: a.id,
          evaluationMetric: a
        } as CreateUserEvaluationMetricRequest;
      }
    );
    return createdCreateUserEvaluationMetrics;
  }
}
