import { Injectable } from "@angular/core";
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors
} from "@angular/forms";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CheckEmailAddressGQL } from "../../graphql/generated/graphql";

@Injectable({
  providedIn: "root"
})
export class EmailValidatorService implements AsyncValidator {
  constructor(private checkEmail: CheckEmailAddressGQL) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.checkEmail.watch({ email: control.value }).valueChanges.pipe(
      map((res) =>
        !res.data.checkEmailAddress
          ? null
          : {
              emailExists: { valid: false }
            }
      )
    );
  }
}
