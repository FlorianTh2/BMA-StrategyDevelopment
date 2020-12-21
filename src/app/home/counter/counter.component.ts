import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Counter } from "../shared/models/counter";
import { Store } from "@ngrx/store";
import * as fromHome from "../store/reducers";
import { CounterActions } from "../store/actions";

@Component({
  selector: "app-counter",
  templateUrl: "./counter.component.html",
  styleUrls: ["./counter.component.scss"]
})
export class CounterComponent implements OnInit {
  counter$: Observable<Counter>;

  constructor(private store$: Store<fromHome.State>) {
    this.counter$ = store$.select(fromHome.selectHomeReducerStateCounter);
  }
  ngOnInit(): void {}

  increment() {
    this.store$.dispatch(CounterActions.increment());
  }

  decrement() {
    this.store$.dispatch(CounterActions.decrement());
  }

  reset() {
    this.store$.dispatch(CounterActions.reset());
  }
}
