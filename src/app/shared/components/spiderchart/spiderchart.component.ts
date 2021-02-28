import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import * as d3 from "d3";
import { data as externalData } from "../../../../assets/js/exampleData";
import { RadarChart } from "../../../../assets/js/RadarChart";
import { Observable } from "rxjs";
import {
  PartialModel,
  PartialModelsGQL
} from "../../../graphql/generated/graphql";
import { InputMaturityModelSpiderChart } from "../../models/InputMaturityModelSpiderChart";
// good reference
// http://bl.ocks.org/nbremer/6506614
@Component({
  selector: "app-spiderchart",
  templateUrl: "./spiderchart.component.html",
  styleUrls: ["./spiderchart.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SpiderchartComponent implements OnInit {
  @Input()
  inputData: InputMaturityModelSpiderChart;

  hostElement: any;
  private svg: any;
  private height: number = 500;
  private width: number = 500;
  private extraWidthX: number = 300;
  private extraWidthY: number = 300;
  private translateX: number = 100;
  private translateY: number = 100;
  private levels: number = 8;
  private colorscale = d3.scaleOrdinal(d3.schemeCategory10);
  private legendOptions = ["Reifegrad (ungewichtet)"];

  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit(): void {
    let chartConfig = {
      w: this.width,
      h: this.height,
      levels: this.levels,
      extraWidthX: this.extraWidthX,
      extraWidthY: this.extraWidthY,
      translateX: this.translateX,
      translateY: this.translateY
    };
    let data = this.transformPartialModels(this.inputData);

    RadarChart.draw("#chart", data, chartConfig);
    this.createChartLegend();
  }

  transformPartialModels(inputDataPara: InputMaturityModelSpiderChart) {
    const result1 = inputDataPara.maturityModel.userPartialModels.map((a) => {
      return {
        "top-level-userPartialModel": {
          axis: a.partialModel.name,
          value: a.maturityLevelEvaluationMetrics,
          maxValue: a.maxMaturityLevelEvaluationMetrics,
          "sub-level-userPartialModel": a.subUserPartialModel.map((b) => {
            return {
              axis: b.partialModel.name,
              value: b.maturityLevelEvaluationMetrics,
              maxValue: b.maxMaturityLevelEvaluationMetrics
            };
          })
        }
      };
    });
    return result1;
  }

  createChartLegend() {
    this.svg = d3.select(this.hostElement).select("#body").selectAll("svg");

    var colorscale = this.colorscale;

    //Create the title for the legend
    var text = this.svg
      .append("text")
      .attr("class", "title")
      .attr("transform", "translate(90,0)")
      .attr("x", this.width - 70)
      .attr("y", 10)
      .attr("font-size", "12px")
      .attr("fill", "#404040")
      .text("What % of owners use a specific service in a week");

    //Initiate Legend
    var legend = this.svg
      .append("g")
      .attr("class", "legend")
      .attr("height", 100)
      .attr("width", 200)
      .attr("transform", "translate(90,20)");

    //Create colour squares
    legend
      .selectAll("rect")
      .data(this.legendOptions)
      .enter()
      .append("rect")
      .attr("x", this.width - 65)
      .attr("y", function (d, i) {
        return i * 20;
      })
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", function (d, i) {
        return colorscale(i);
      });

    //Create text next to squares
    legend
      .selectAll("text")
      .data(this.legendOptions)
      .enter()
      .append("text")
      .attr("x", this.width - 52)
      .attr("y", function (d, i) {
        return i * 20 + 9;
      })
      .attr("font-size", "11px")
      .attr("fill", "#737373")
      .text(function (d) {
        return d;
      });
  }
}
