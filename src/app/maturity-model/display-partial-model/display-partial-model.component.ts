import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import {
  UserEvaluationMetric,
  UserPartialModel
} from "../../graphql/generated/graphql";

@Component({
  selector: "app-display-partial-model",
  templateUrl: "./display-partial-model.component.html",
  styleUrls: ["./display-partial-model.component.scss"]
})
export class DisplayPartialModelComponent implements OnInit {
  @Input()
  userPartialModel: UserPartialModel;

  @Output() userPartialModelChange = new EventEmitter<UserPartialModel>();

  constructor() {}

  ngOnInit(): void {}

  keyEvent(event) {
    const inputValue = event.target.value;
    this.userPartialModelChange.emit({
      ...this.userPartialModel,
      maturityLevelEvaluationMetrics: inputValue
    });
  }

  keyEventUserEvaluationMatrix(event, id: string) {
    const inputValue = event;
    const emitValue = {
      ...this.userPartialModel,
      userEvaluationMetrics: this.userPartialModel.userEvaluationMetrics.map(
        (a) => {
          if (a.id === id) {
            return {
              ...a,
              valueEvaluationMetric: parseInt(inputValue.target.value)
            };
          }
          return a;
        }
      )
    };
    // console.log("sub-level-emit with partialModel");
    // console.log(this.userPartialModel);
    // console.log("=");
    // console.log(emitValue);
    this.userPartialModelChange.emit(emitValue);
  }

  keyUserSubPartialModelEvent(event: UserPartialModel) {
    // console.log(event);
    const newSubUserPartialModels = this.userPartialModel.subUserPartialModels.map(
      (a) => {
        if (a.id === event.id) {
          return event;
        }
        return a;
      }
    );
    // console.log(this.userPartialModel.subUserPartialModels);
    // console.log(newSubUserPartialModels);
    const emitValue = {
      ...this.userPartialModel,
      subUserPartialModels: newSubUserPartialModels
    };
    // console.log("top-level-emit with partial model:");
    // console.log(this.userPartialModel);
    // console.log(emitValue);
    this.userPartialModelChange.emit(emitValue);
  }

  trackByIndex(index: any, obj: any): any {
    return index;
  }

  showConsole(item: any) {
    console.log(item);
  }

  isArray(array: any): number {
    return Array.isArray(array) && array.length;
  }
}
