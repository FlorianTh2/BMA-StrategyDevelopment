import { Component, OnInit } from "@angular/core";
import { AuthorizationService } from "../services/authorization.service";
import { User } from "../../graphql/generated/graphql";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit {
  user: User = null;

  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit(): void {
    this.authorizationService.userObservable.subscribe((a) => {
      this.user = a;
    });
  }
}
