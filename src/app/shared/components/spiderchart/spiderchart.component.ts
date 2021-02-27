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

  // general chart settings
  private width: number = 500;
  private additionalWidth: number = 300;
  private height: number = 500;
  private container: any;
  hostElement: any;
  private svg: any;
  private margin = 100;

  // data settings
  private data: any = externalData;
  private maxValue: number = 0.6;
  private levels: number = 5;
  private config: any;
  private colorscale = d3.scaleOrdinal(d3.schemeCategory10);
  private legendOptions = ["Reifegrad (ungewichtet)"];

  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit(): void {
    this.config = {
      w: this.width,
      h: this.height,
      maxValue: this.maxValue,
      levels: this.levels,
      ExtraWidthX: this.additionalWidth
    };

    RadarChart.draw(
      "#chart",
      // data
      [this.transformPartialModels(this.inputData)],
      this.config
    );

    this.svg = d3
      .select(this.hostElement)
      .select("#body")
      .style("width", (this.width + this.additionalWidth).toString() + "px")
      // +100 since the legend i guess
      .style("height", (this.height + 100).toString() + "px")
      .selectAll("svg")
      .append("svg")
      .attr("width", this.width + this.additionalWidth)
      .attr("height", this.height);

    this.renderChart();
  }

  transformPartialModels(inputDataPara: InputMaturityModelSpiderChart) {
    console.log(inputDataPara);
    return inputDataPara.maturityModel.userPartialModels.map((a) => {
      return {
        "top-level-userPartialModel": {
          axis: a.partialModel.name,
          value: a.maturityLevelEvaluationMetrics,
          maxValue: a.maxMaturityLevelEvaluationMetrics,
          "sub-level-userPartialModel:": a.subUserPartialModel.map((b) => {
            return {
              axis: b.partialModel.name,
              value: b.maturityLevelEvaluationMetrics,
              maxValue: b.maxMaturityLevelEvaluationMetrics
            };
          })
        }
      };
    });
  }

  renderChart() {
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
