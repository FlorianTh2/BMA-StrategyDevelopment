import { Component, OnInit, ViewChild } from "@angular/core";
import { Message } from "../shared/models/message.model";
import { Sender } from "../shared/enums/senderEnum";
import { Observable } from "rxjs";
import {
  CreateUserEvaluationMetricRequest,
  CreateUserMaturityModelGQL,
  CreateUserMaturityModelRequest,
  CreateUserPartialModelRequest,
  EvaluationMetric,
  MaturityModel,
  MaturityModelGQL,
  PartialModel,
  Project,
  ProjectsOfUserGQL,
  User
} from "../../graphql/generated/graphql";
import { map } from "rxjs/operators";
import { ID_OF_MATURITYMODEL } from "../../shared/constants/constants";
import { ActivatedRoute } from "@angular/router";
import { select, Store } from "@ngrx/store";
import * as fromQuestionary from "./../store/reducers";
import {
  resetQuestionary,
  retrieveCreateUserMaturityModelRequest,
  retrieveMessageQueue,
  selectEvaluationMetric,
  setNextMessageWithEvaluationMetric,
  setProperty
} from "../store/actions/messageQueue.action";
import { MessageQueue } from "../shared/models/messageQueue.model";
import { EvaluationItem } from "../shared/models/evaluationItem";
import { Apollo } from "apollo-angular";
import { EvaluationMetricEnum } from "../shared/enums/evaluationMetric.enum";
import { AuthorizationService } from "../../core/services/authorization.service";
import { MatSidenav } from "@angular/material/sidenav";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";

@Component({
  selector: "app-qa-list",
  templateUrl: "./qa-list.component.html",
  styleUrls: ["./qa-list.component.scss"]
})
export class QaListComponent implements OnInit {
  messageQueue$: Observable<MessageQueue> = this.store$.select(
    fromQuestionary.selectMessageQueueRequestReducerStateObject
  );

  partialModelList: PartialModel[] = [];

  evaluationMetricList: EvaluationMetric[] = [];

  user: User = null;

  modelName: string = "";
  saveMaturityModelFormControl = new FormControl();
  saveMaturityModelForm: FormGroup;
  @ViewChild("drawer") sidenav: MatSidenav;
  showFiller = false;
  userProjects$: Observable<Project[]>;

  constructor(
    private apollo: Apollo,
    private route: ActivatedRoute,
    private maturityModelGQL: MaturityModelGQL,
    private store$: Store<fromQuestionary.State>,
    private createUserMaturityModelGQL: CreateUserMaturityModelGQL,
    private authorizationService: AuthorizationService,
    private projectsOfUserGQL: ProjectsOfUserGQL,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.authorizationService.userObservable.subscribe((a) => {
      this.user = a;
    });

    if (this.user) {
      this.userProjects$ = this.projectsOfUserGQL
        .watch()
        .valueChanges.pipe(
          map((result) => result.data.projectsOfUser as Project[])
        );
    }

    this.initCreateUserMaturityModel();
    this.createForm();
  }

  private createForm() {
    this.saveMaturityModelForm = this.fb.group({
      modelNameView: new FormControl("", [Validators.required]),
      projectsView: new FormControl("", [Validators.required])
    });
  }

  setModelName(modelName: string) {
    this.modelName = modelName;
    return true;
  }

  initCreateUserMaturityModel() {
    this.maturityModelGQL
      .watch({ maturityModelId: ID_OF_MATURITYMODEL })
      .valueChanges.pipe(
        map((result) => result.data.maturityModel as MaturityModel)
      )
      .subscribe((a) => {
        const userMaturityModel: CreateUserMaturityModelRequest = this.createCreateUserMaturityModelRequest(
          a
        );
        const result = this.createPartialModelAndEvaluationList(
          a.partialModels,
          [],
          []
        );
        this.partialModelList = result.partialModelList;
        this.evaluationMetricList = result.evaluationList;

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

        this.loadNextQuestion();
      });
  }

  createPartialModelAndEvaluationList(
    partialModels: PartialModel[],
    inputListPartialModels: PartialModel[],
    inputListEvaluationMetrics: EvaluationMetric[]
  ): { partialModelList: PartialModel[]; evaluationList: EvaluationMetric[] } {
    partialModels.map((a) => {
      inputListPartialModels.push(a);
      if (Array.isArray(a.evaluationMetrics) && a.evaluationMetrics.length) {
        inputListEvaluationMetrics = inputListEvaluationMetrics.concat(
          a.evaluationMetrics
        );
      }
      if (Array.isArray(a.subPartialModels) && a.subPartialModels.length) {
        this.createPartialModelAndEvaluationList(
          a.subPartialModels,
          inputListPartialModels,
          inputListEvaluationMetrics
        );
      }
    });
    return {
      partialModelList: inputListPartialModels,
      evaluationList: inputListEvaluationMetrics
    };
  }

  showConsole(a) {
    console.log(a);
  }

  getEnumString(index: number): string {
    return EvaluationMetricEnum[index];
  }

  getPartialModelById(id: string): PartialModel {
    return this.partialModelList.filter((a) => a.id === id)[0];
  }

  resetProgress() {
    this.store$.dispatch(resetQuestionary());
    this.initCreateUserMaturityModel();
  }

  saveUserMaturityModelToggle() {
    this.sidenav.toggle();
  }

  saveUserMaturityModel(
    createUserMaturityModelRequest: CreateUserMaturityModelRequest
  ) {
    const selectedModelName = this.saveMaturityModelForm.get("modelNameView")
      .value;
    const selectedProjects: Project[] = this.saveMaturityModelForm.get(
      "projectsView"
    ).value;
    const result = this.createUserMaturityModelGQL
      .mutate({
        userMaturityModel: {
          ...createUserMaturityModelRequest,
          name: selectedModelName,
          // currently only one project can be selected
          projectId: selectedProjects[0].id
        }
      })
      .pipe(
        map((a) => {
          console.log("inn");
          const idOfCreated = a.data.createUserMaturityModel.id;
          console.log(idOfCreated);
          return idOfCreated;
        })
      )
      .subscribe();
    console.log(result);
    return result;
  }

  isAlreadyClicked(
    clickedEvaluationList: EvaluationItem[],
    evaluationMetricId: string,
    index: number
  ) {
    const resultList = clickedEvaluationList.filter(
      (a) =>
        a.evaluationMetricId === parseInt(evaluationMetricId) &&
        a.index === index
    );
    return Array.isArray(resultList) && resultList.length;
  }

  handleEvaluationEventClick(
    message: Message,
    evaluationMetric: EvaluationMetric,
    index: number,
    isLastMessage: boolean,
    isLastEvaluationMetric: boolean
  ) {
    const newValue = index + evaluationMetric.minValue;
    this.store$.dispatch(
      selectEvaluationMetric({
        item: {
          evaluationMetricId: parseInt(evaluationMetric.id),
          index: index
        } as EvaluationItem
      })
    );
    // change model
    this.store$.dispatch(
      setProperty({
        partialModelId: parseInt(
          message.creatUserPartialModelRequest.partialModelId
        ),
        evaluationMetricId: parseInt(evaluationMetric.id),
        newValue: newValue
      })
    );
    // load next message
    if (isLastMessage && isLastEvaluationMetric) this.loadNextQuestion();
  }

  async loadNextQuestion() {
    this.store$.dispatch(setNextMessageWithEvaluationMetric());
  }

  hasEvaluationMetric(message: Message) {
    const result =
      Array.isArray(
        message.creatUserPartialModelRequest.userEvaluationMetrics
      ) && message.creatUserPartialModelRequest.userEvaluationMetrics.length;
    return result;
  }

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

  createCreateUserMaturityModelRequest(
    maturityModel: MaturityModel
  ): CreateUserMaturityModelRequest {
    const result = {
      // will be undefined if accessed from public-route since we have no projectId since this will be available to public (there is no project-route)
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
          evaluationMetricId: a.id
        } as CreateUserEvaluationMetricRequest;
      }
    );
    return createdCreateUserEvaluationMetrics;
  }
}
