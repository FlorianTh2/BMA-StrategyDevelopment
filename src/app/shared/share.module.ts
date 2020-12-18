import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { MaterialModule } from "../material/material.module";

@NgModule({
  declarations: [SafeHtmlPipe],
  imports: [CommonModule, MaterialModule],
  exports: [SafeHtmlPipe, MaterialModule]
})
export class SharedModule {}
