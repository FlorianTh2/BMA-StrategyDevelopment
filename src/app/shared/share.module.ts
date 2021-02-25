import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { MaterialModule } from "../material/material.module";
import { CustomDatePipe } from "./pipes/custom-date.pipe";

@NgModule({
  declarations: [SafeHtmlPipe, CustomDatePipe],
  imports: [CommonModule, MaterialModule],
  exports: [SafeHtmlPipe, MaterialModule, CustomDatePipe]
})
export class SharedModule {}
