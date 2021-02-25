import { Injectable } from "@angular/core";
import { FormGroup, ValidationErrors } from "@angular/forms";

@Injectable({
  providedIn: "root"
})
export class PasswordValidatorService {
  constructor() {}

  passwordEquality(controlGroup: FormGroup): ValidationErrors | null {
    const pwd1 = controlGroup.get("password").value;
    const pwd2 = controlGroup.get("passwordRepeat").value;

    if (pwd1 === pwd2) {
      return null;
    } else {
      return { passwordEquality: { valid: false } };
    }
  }
}
