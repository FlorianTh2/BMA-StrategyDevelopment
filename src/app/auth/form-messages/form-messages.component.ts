import { Component, Input, OnInit } from "@angular/core";
import { AbstractControl } from "@angular/forms";

@Component({
  selector: "app-form-messages",
  templateUrl: "./form-messages.component.html",
  styleUrls: ["./form-messages.component.scss"]
})
export class FormMessagesComponent implements OnInit {
  @Input() control: AbstractControl;
  @Input() controlName: string;

  private allMessages = {
    email: {
      required: "Eine E-Mail Adresse muss eingegeben werden",
      email: "Eingabe entspricht keiner E-Mail Adresse",
      emailExists: "Diese E-Mail Adresse wird schon verwendet"
    },
    password: {
      required: "Ein Passwort muss eingeben werden",
      minlength: "Passwort zu kurz"
    },
    passwords: {
      passwordEquality: "Die Passwörter sind ungleich"
    }
  };

  constructor() {}

  ngOnInit() {}

  errorsForControl(): string[] {
    const messages = this.allMessages[this.controlName];
    if (
      !this.control ||
      !this.control.errors ||
      !messages ||
      !this.control.touched
    ) {
      return null;
    }
    return Object.keys(this.control.errors).map((err) => messages[err]);
  }
}
