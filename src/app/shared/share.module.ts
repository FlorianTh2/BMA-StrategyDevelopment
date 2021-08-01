import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SafeHtmlPipe } from "./pipes/safe-html.pipe";
import { MaterialModule } from "../material/material.module";
import { CustomDatePipe } from "./pipes/custom-date.pipe";
import { SpiderchartComponent } from "./components/spiderchart/spiderchart.component";
import { BasicLineChartComponent } from "./components/basic-line-chart/basic-line-chart.component";
import { ScatterPlotMdsComponent } from "./components/scatter-plot-mds/scatter-plot-mds.component";

@NgModule({
  declarations: [
    SafeHtmlPipe,
    CustomDatePipe,
    SpiderchartComponent,
    BasicLineChartComponent,
    ScatterPlotMdsComponent
  ],
  imports: [CommonModule, MaterialModule],
  exports: [
    SafeHtmlPipe,
    MaterialModule,
    CustomDatePipe,
    SpiderchartComponent,
    BasicLineChartComponent,
    ScatterPlotMdsComponent
  ]
})
export class SharedModule {}
