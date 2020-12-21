import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromHome from "./store/reducers";
import { Counter } from "./shared/models/counter";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  counter$: Observable<Counter>;

  constructor(private store$: Store<fromHome.State>) {
    this.counter$ = store$.select(fromHome.selectHomeReducerStateCounter);
  }

  ngOnInit(): void {}
}
