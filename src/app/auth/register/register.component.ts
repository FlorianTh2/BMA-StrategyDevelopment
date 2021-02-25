import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthorizationService } from "../../core/services/authorization.service";
import { Router } from "@angular/router";
import { EmailValidatorService } from "../../core/services/email-validator.service";
import { PasswordValidatorService } from "../../core/services/password-validator.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private pvs: PasswordValidatorService,
    private evs: EmailValidatorService,
    private authorizationService: AuthorizationService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.registerForm = this.fb.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", [Validators.required, Validators.email], [this.evs]],
      passwords: this.fb.group(
        {
          password: ["", [Validators.required, Validators.minLength(5)]],
          passwordRepeat: ""
        },
        { validators: [this.pvs.passwordEquality] }
      )
    });
  }

  registrate() {
    this.authorizationService
      .registerUser(
        this.registerForm.get("firstname").value,
        this.registerForm.get("lastname").value,
        this.registerForm.get("email").value,
        this.registerForm.get("passwords").get("password").value
      )
      .subscribe(
        (response) => {
          alert("Prüfen Sie ihre Emails!");
          this.authorizationService
            .loginUser(
              this.registerForm.get("email").value,
              this.registerForm.get("passwords").get("password").value
            )
            .subscribe((res) => {
              this.registerForm.reset();
              this.router.navigate(["/home"]);
            });
        },
        (error) => {
          alert("Error idk");
        }
      );
  }
}
