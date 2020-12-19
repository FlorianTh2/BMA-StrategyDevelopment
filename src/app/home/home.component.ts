import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromHome from "./store/reducers";
import { HomeReducerState } from "./store/reducers/home.reducer";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  home$: Observable<HomeReducerState>;

  constructor(private store: Store<fromHome.HomeState>) {
    this.home$ = store.select("home") as Observable<HomeReducerState>;
  }

  ngOnInit(): void {}
}
