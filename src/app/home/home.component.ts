import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromHome from "./store/reducers";
import { Counter } from "./shared/models/counter";
import { map } from "rxjs/operators";
import { PartialModel, PartialModelsGQL } from "../graphql/generated/graphql";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  partialModels: Observable<PartialModel[]>;

  constructor(private partialModelsGQL: PartialModelsGQL) {
    this.partialModels = this.partialModelsGQL
      .watch()
      .valueChanges.pipe(
        map((result) => result.data.partialModels as PartialModel[])
      );
  }

  ngOnInit(): void {}
}
