import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthorizationService } from "../../core/services/authorization.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authentication: AuthorizationService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.loginForm = this.fb.group({
      email: ["", Validators.required],
      password: ["", [Validators.minLength(5), Validators.required]]
    });
  }

  login() {
    this.authentication
      .loginUser(
        this.loginForm.get("email").value,
        this.loginForm.get("password").value
      )
      .subscribe(
        (res) => {
          this.router.navigate(["/home"]);
        },
        (error) => {
          this.loginForm.get("password").reset();
        }
      );
  }
}
