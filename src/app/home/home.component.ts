import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { select, Store } from "@ngrx/store";
import * as fromHome from "./store/reducers";
import { getHomeState } from "./store/reducers";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  home$: Observable<fromHome.HomeState>;

  constructor(private state$: Store<fromHome.State>) {
    this.home$ = state$.select(getHomeState);
  }

  ngOnInit(): void {}
}
