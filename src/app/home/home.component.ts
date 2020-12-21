import { Component, OnInit } from "@angular/core";
import { from, Observable } from "rxjs";
import { State, Store } from "@ngrx/store";
import * as fromHome from "./store/reducers";
import * as fromHome2 from "./store/reducers/home.reducer";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  home$: Observable<fromHome2.State>;

  constructor(private store$: Store<fromHome.State>) {
    this.home$ = store$.select(fromHome.selectHomeReducerState);
  }

  ngOnInit(): void {}
}
