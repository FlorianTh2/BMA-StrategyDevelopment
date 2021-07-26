import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from "@angular/core";
import {
  InputMaturityModelSpiderChart,
  InputSubUserPartialModelSpiderChart
} from "../../models/InputMaturityModelSpiderChart";
import { ScatterPlotData } from "../../models/scatterPlotData";
import * as d3 from "d3";
import { ScaleBand, ScaleLinear } from "d3";

@Component({
  selector: "app-basic-line-chart",
  templateUrl: "./basic-line-chart.component.html",
  styleUrls: ["./basic-line-chart.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class BasicLineChartComponent implements OnInit {
  @Input()
  // [[x,y], ...]
  data: ScatterPlotData[];

  hostElement: any;
  private svg: any;
  // dont work directly on svg, instead work on group of svg
  private g1: any;
  private tooltip: any;
  private margin: any;
  private height: number;
  private width: number;
  private colorData: string = "#3D4D5D";
  private xscale: ScaleBand<string>;
  private yscale: ScaleLinear<number, number, never>;

  constructor() {}

  ngOnInit(): void {
    this.initChart();
    this.createdConnectedScatterPlot(this.g1);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data && this.svg && changes.data.currentValue) {
      this.data = changes.data.currentValue as ScatterPlotData[];
      const oldData = changes.data.previousValue as ScatterPlotData[];
      // this.updateChart(oldData);
      d3.select("#chart").selectAll("*").remove();
      this.svg = undefined;
      this.g1 = undefined;
      this.initChart();
      this.createdConnectedScatterPlot(this.g1);
    }
  }

  initChart(): void {
    this.margin = { top: 10, right: 60, bottom: 75, left: 60 };
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.width = 800 - this.margin.left - this.margin.right;

    const maxValue = Math.max(...this.data.map((a) => a.indexData));
    // give 5px per digit more to properly display leftaxislabel
    this.margin.left =
      this.margin.left +
      [...maxValue.toString()].reduce((aAcc, a) => aAcc + 5, 0);
    this.svg = d3
      .select("#chart")
      .append("svg")
      .attr("class", "svg-class")
      .attr("width", this.width + this.margin.left + +this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.g1 = this.svg
      // dont work on svg, instead work on one group of svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    // init/prepare tooltip for following definition of edge-point-hover
    this.tooltip = d3
      .select("#chart")
      .append("div")
      .attr("class", "tooltip-class")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");
  }

  // https://bl.ocks.org/d3noob/a22c42db65eb00d4e369
  // https://www.d3-graph-gallery.com/graph/connectedscatter_basic.html
  // https://stackoverflow.com/a/51676326/11244995
  createdConnectedScatterPlot(g1) {
    // base structure:
    //  selectAll(nameX) -> data -> enter -> append -> attr(class, nameX)
    //  nameX has to match
    //
    // short: after append g, you work with g
    //
    // long:
    //  search for all .gPartialModelAxes in the scope of g1 (i.e. on all elements within g1 (but i guess only one level below g1))
    //  fill with data, foreach datapoint in data applies following (here only one taken)
    //  enter to apply data
    //  append g
    //  on this appended g, set class: gPartialModelAxes (so next time g1.selectAll(".gPartialModelAxes"))
    //    searches for elements with classes gPartialModelAxes, it will find the new appended g with the given class
    //
    // g1.selectAll(".gPartialModelAxes")
    //   .data([1])
    //   .enter()
    //   .append("g")
    //   .attr("class", "gPartialModelAxes");

    const module = this;

    this.xscale = d3
      .scaleBand()
      .domain(this.data.map((a) => a.indexName))
      .rangeRound([0, this.width])
      .padding(0.1);

    this.yscale = d3
      .scaleLinear()
      .domain([
        Math.min(...this.data.map((a) => a.indexData)),
        Math.max(...this.data.map((a) => a.indexData))
      ])
      .nice()
      .range([this.height, 0]);

    const axisBottom = g1
      .selectAll(".gAxisBottom")
      .data([-1])
      .enter()
      .append("g")
      .attr("class", "gAxisBottom")
      .attr("transform", "translate(0," + this.height + ")")
      .call(d3.axisBottom(this.xscale));

    const axisBottomLabel = g1
      .selectAll(".gAxisBottomLabel")
      .data([-1])
      .enter()
      .append("text")
      .attr("class", "gAxisBottomLabel")
      .attr("x", this.width / 2)
      .attr("y", this.height + this.margin.top + this.margin.bottom / 2)
      .text("Anzahl der Cluster");

    const axisLeft = g1
      .selectAll(".gAxisLeft")
      .data([-1])
      .enter()
      .append("g")
      .attr("class", "gAxisLeft")
      .call(d3.axisLeft(this.yscale));

    const axisLeftLabel = g1
      .selectAll(".gAxisLeftLabel")
      .data([-1])
      .enter()
      .append("text")
      .attr("class", "gAxisLeftLabel")
      // it shows up somehow in the middle but did not fully understand that x-calculation
      .attr("x", -this.margin.left)
      .attr("y", -this.margin.left / 2)
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Aggregierter Abstand");

    const pathLineWithLineObjects = g1
      .selectAll(".pathline")
      .data([this.data])
      .enter()
      .append("path")
      .attr("class", "pathline")
      .attr("fill", "none")
      .attr("stroke", this.colorData)
      .attr("stroke-width", 1.5)
      .attr("class", "line")
      .attr(
        "d",
        d3
          .line()
          // @ts-ignore
          .x(function (d: ScatterPlotData) {
            // hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
            return module.xscale(d.indexName) + module.xscale.bandwidth() / 2;
          })
          // @ts-ignore
          .y(function (d: ScatterPlotData) {
            return module.yscale(d.indexData);
          })
      );

    const scatterPointsOnPathLine = g1
      .selectAll(".gPathpoints")
      .data([-1])
      .enter()
      .append("g")
      .attr("class", "gPathpoints")
      .selectAll(".pathpoints")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("class", "pathpoints")
      .attr("cx", function (d: ScatterPlotData) {
        return module.xscale(d.indexName) + module.xscale.bandwidth() / 2;
      })
      .attr("cy", function (d: ScatterPlotData) {
        return module.yscale(d.indexData);
      })
      .attr("r", 5)
      .attr("fill", this.colorData)
      .on("mouseover", function (event, data: ScatterPlotData) {
        console.log("sadfasdf");
        console.log(data.indexData);
        let bbox = this.getBBox();
        module.tooltip
          .html("<div>Inertia: " + data.indexData.toFixed(2) + "</div>")
          .style("left", module.getXTooltip(this, module.tooltip))
          .style("top", module.getYTooltip(this, module.tooltip))
          .style("visibility", "visible");
      })
      .on("mouseout", () => {
        module.tooltip.style("visibility", "hidden");
      });

    // create legend
    const gLegend = this.svg
      .selectAll(".g-legend")
      // random value to be able to enter()
      .data([1])
      .enter()
      .append("g")
      .attr("class", "g-legend")
      .attr("height", 100)
      .attr("width", 300);

    // create legend color squares
    gLegend
      .selectAll(".legend-rect")
      .data(["Anzahl der Cluster"])
      .enter()
      .append("rect")
      .attr("class", "legend-rect")
      .attr("x", this.width + this.margin.left + this.margin.right - 175)
      .attr("y", 0)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", this.colorData);

    // create legend-text
    gLegend
      .selectAll(".legend-text")
      .data(["Anzahl der Cluster"])
      .enter()
      .append("text")
      .attr("class", "legend-text")
      .attr("x", this.width + this.margin.left + this.margin.right - 150)
      .attr("y", (a, b) => b * 20 + 10)
      .attr("cursor", "pointer")
      .attr("font-size", "11px")
      .text((a) => a);
  }

  // keep in mind where the tooltip div spawns: only with right x+y at the buttom-left-corner of edge
  getXTooltip(currentObject, tooltipSelection): string {
    return (
      window.pageXOffset +
      currentObject.getBoundingClientRect().x -
      tooltipSelection.node().getBoundingClientRect().width / 2 +
      currentObject.getBoundingClientRect().width / 2 +
      "px"
    );
  }

  getYTooltip(currentObject, tooltipSelection): string {
    return (
      window.pageYOffset +
      currentObject.getBoundingClientRect().y -
      tooltipSelection.node().getBoundingClientRect().height +
      "px"
    );
  }
}
