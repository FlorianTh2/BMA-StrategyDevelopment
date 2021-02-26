import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MaturityModel, MaturityModelGQL } from "../graphql/generated/graphql";
import { ID_OF_MATURITYMODEL } from "../shared/constants/constants";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  maturityModel$: Observable<MaturityModel>;

  constructor() {}

  ngOnInit(): void {}
}
