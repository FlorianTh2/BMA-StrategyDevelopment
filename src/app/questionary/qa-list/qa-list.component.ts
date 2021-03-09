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
  PartialModel
} from "../../graphql/generated/graphql";
import { map } from "rxjs/operators";
import { ID_OF_MATURITYMODEL } from "../../shared/constants/constants";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { retrieveCreateUserMaturityModelRequest } from "../store/actions/createUserMaturityModelRequest.action";
import * as fromQuestionary from "./../store/reducers";
import { retrieveMessageQueue } from "../store/actions/messageQueue.action";
import { retrieveDisplayedMessageQueue } from "../store/actions/displayedMessageQueue.action";

@Component({
  selector: "app-qa-list",
  templateUrl: "./qa-list.component.html",
  styleUrls: ["./qa-list.component.scss"]
})
export class QaListComponent implements OnInit {
  projectId: string;
  currentEvaluationMetric: EvaluationMetric;
  messageQueue: Message[] = [];
  renderedMessageQueue: Message[] = [];

  createUserMaturityModelRequest$: Observable<CreateUserMaturityModelRequest> = this.store$.select(
    fromQuestionary.selectCreateUserMaturityModelRequestReducerStateObject
  );

  selectCreateUserMaturityModelRequestReducerStateObject;

  constructor(
    private route: ActivatedRoute,
    private maturityModelGQL: MaturityModelGQL,
    private store$: Store<fromQuestionary.State>
  ) {}

  ngOnInit(): void {
    // will be undefined since this route will be available to public (without a project)
    // but possibly will be defined if loggedIn
    this.route.paramMap.subscribe((paramMap) => {
      this.projectId = paramMap.get("project_id");
    });

    this.maturityModelGQL
      .watch({ maturityModelId: ID_OF_MATURITYMODEL })
      .valueChanges.pipe(
        map((result) => result.data.maturityModel as MaturityModel)
      )
      .subscribe((a) => {
        const userMaturityModel: CreateUserMaturityModelRequest = this.createCreateUserMaturityModelRequest(
          a
        );
        const messageQueue: Message[] = this.createMessagesFromCreateUserPartialModelRequest(
          userMaturityModel.userPartialModels,
          [] as Message[]
        );

        this.store$.dispatch(
          retrieveCreateUserMaturityModelRequest({
            createUserMaturityModelRequest: userMaturityModel
          })
        );

        this.store$.dispatch(
          retrieveMessageQueue({
            messageQueue: messageQueue
          })
        );

        this.store$.dispatch(
          retrieveDisplayedMessageQueue({
            displayedMessageQueue: [messageQueue[0]]
          })
        );
      });
  }

  showConsole(a) {
    console.log(a);
  }

  //
  // loadNextQuestion(): Message {
  //   this.firstLoad = false;
  //   const result: Message = this.messageQueue.shift();
  //   this.renderedMessageQueue.push(result);
  //   return result;
  // }
  //

  createMessagesFromCreateUserPartialModelRequest(
    createUserPartialModelRequests: CreateUserPartialModelRequest[],
    inputList: Message[]
  ): Message[] {
    const result = createUserPartialModelRequests.map((a) => {
      inputList.push({
        sender: Sender.System,
        creatUserPartialModelRequest: a
      } as Message);
      if (
        Array.isArray(a.subUserPartialModels) &&
        a.subUserPartialModels.length
      ) {
        this.createMessagesFromCreateUserPartialModelRequest(
          a.subUserPartialModels,
          inputList
        );
      }
    });
    return inputList;
  }

  // createMessagesFromCreateUserPartialModelRequest(
  //   createUserPartialModelRequests: CreateUserPartialModelRequest[]
  // ) {
  //   createUserPartialModelRequests.map((a) => {
  //     return {
  //       sender: Sender.System,
  //       creatUserPartialModelRequest: a
  //     } as Message);
  //     // add one message for each evaluation Metrics
  //     if (
  //       Array.isArray(a.subUserPartialModels) &&
  //       a.subUserPartialModels.length
  //     ) {
  //       createMessagesFromCreateUserPartialModelRequest(
  //         a.subUserPartialModels
  //       );
  //     }
  //   });
  // }

  createCreateUserMaturityModelRequest(
    maturityModel: MaturityModel
  ): CreateUserMaturityModelRequest {
    const result = {
      // will be undefined if accessed from public-route since we have no projectId since this will be available to public (there is no project-route)
      projectId: this.projectId,
      maturityLevel: 0,
      name: "Define a name for your maturity-model!",
      userPartialModels: this.createCreateUserPartialModelRequests(
        maturityModel.partialModels
      )
    } as CreateUserMaturityModelRequest;
    return result;
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
