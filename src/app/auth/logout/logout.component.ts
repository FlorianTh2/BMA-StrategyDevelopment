import { Component, OnInit } from "@angular/core";
import { AuthorizationService } from "../../core/services/authorization.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-logout",
  templateUrl: "./logout.component.html",
  styleUrls: ["./logout.component.scss"]
})
export class LogoutComponent implements OnInit {
  constructor(
    private authorizationService: AuthorizationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authorizationService.logoutUser();
    this.router.navigate(["/home"]);
  }
}
