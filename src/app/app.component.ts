import { Component } from "@angular/core";
import { AuthorizationService } from "./core/services/authorization.service";
import { OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  constructor(private authorizationService: AuthorizationService) {}

  ngOnInit() {
    this.authorizationService.tryCreationOfUserFromJwtAfterPageReload();
  }
}
