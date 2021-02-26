import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { MaterialModule } from "../material/material.module";
import { CustomDatePipe } from "./pipes/custom-date.pipe";
import { SpiderchartComponent } from "./components/spiderchart/spiderchart.component";

@NgModule({
  declarations: [SafeHtmlPipe, CustomDatePipe, SpiderchartComponent],
  imports: [CommonModule, MaterialModule],
  exports: [SafeHtmlPipe, MaterialModule, CustomDatePipe, SpiderchartComponent]
})
export class SharedModule {}
