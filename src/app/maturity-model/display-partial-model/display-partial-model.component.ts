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
    console.log(inputValue);
    this.userPartialModelChange.emit({
      ...this.userPartialModel,
      maturityLevelEvaluationMetrics: inputValue
    });
  }

  keyEventUserEvaluationMatrix(event, id: string) {
    const inputValue = event;
    this.userPartialModelChange.emit({
      ...this.userPartialModel,
      userEvaluationMetrics: this.userPartialModel.userEvaluationMetrics.map(
        (a) => {
          if (a.id === id) {
            return {
              ...a,
              valueEvaluationMetric: inputValue
            };
          }
          return a;
        }
      )
    });
  }

  keyUserSubPartialModelEvent(event: UserPartialModel) {
    console.log(event);
    this.userPartialModelChange.emit({
      ...event
    });
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  showConsole(item: any) {
    console.log(item);
  }

  isArray(array: any): number {
    return Array.isArray(array) && array.length;
  }

  onSubPartialModelChange(event) {
    const inputValue = event.target.value;
    console.log(inputValue);
    this.userPartialModelChange.emit({
      ...this.userPartialModel,
      maturityLevelEvaluationMetrics: inputValue
    });
  }
}
