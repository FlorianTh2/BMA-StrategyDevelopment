import {
  Component,
  Input,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from "@angular/core";
import { ScaleBand, ScaleLinear } from "d3";
import { ScatterPlotMdsData } from "../../models/scatterPlotMdsData";
import * as d3 from "d3";

@Component({
  selector: "app-scatter-plot-mds",
  templateUrl: "./scatter-plot-mds.component.html",
  styleUrls: ["./scatter-plot-mds.component.scss"]
})
export class ScatterPlotMdsComponent implements OnInit {
  @Input()
  // [[x,y], ...]
  data: ScatterPlotMdsData[];

  hostElement: any;
  private svg: any;
  // dont work directly on svg, instead work on group of svg
  private g1: any;
  private tooltip: any;
  private margin: any;
  private height: number;
  private width: number;
  private colorData: string = "#3D4D5D";
  private xscale: ScaleLinear<number, number, never>;
  private yscale: ScaleLinear<number, number, never>;
  private sequentialColorScale: ScaleLinear<number, number, never>;

  constructor() {}

  ngOnInit(): void {
    console.log("mds plot: ", this.data);
    this.initChart();
    this.createdConnectedScatterPlot(this.g1);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.data && this.svg && changes.data.currentValue) {
      this.data = changes.data.currentValue as ScatterPlotMdsData[];
      const oldData = changes.data.previousValue as ScatterPlotMdsData[];
      d3.select("#chart2").selectAll("*").remove();
      this.svg = undefined;
      this.g1 = undefined;
      this.tooltip = undefined;
      this.initChart();
      this.createdConnectedScatterPlot(this.g1);
    }
  }

  initChart(): void {
    this.margin = { top: 10, right: 80, bottom: 75, left: 60 };
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.width = 800 - this.margin.left - this.margin.right;

    const maxYValue = Math.max(...this.data.map((a) => a.y));
    // give 5px per digit more to properly display leftaxislabel
    this.margin.left =
      this.margin.left +
      [...maxYValue.toString()].reduce((aAcc, a) => aAcc + 5, 0);

    this.svg = d3
      .select("#chart2")
      .append("svg")
      .attr("class", "svg-class")
      .attr("width", this.width + this.margin.left + +this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    this.g1 = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.margin.left + "," + this.margin.top + ")"
      );

    // init/prepare tooltip for following definition of edge-point-hover
    this.tooltip = d3
      .select("#chart2")
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

    this.sequentialColorScale = d3
      .scaleLinear()
      .domain([0, this.data.length - 1])
      // @ts-ignore
      .range(["grey", "blue"]);
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
      .scaleLinear()
      .domain([
        Math.min(...this.data.map((a) => a.x)),
        Math.max(...this.data.map((a) => a.x)) * 1.1
      ])
      .range([0, this.width])
      .nice();

    this.yscale = d3
      .scaleLinear()
      .domain([
        Math.min(...this.data.map((a) => a.y)),
        Math.max(...this.data.map((a) => a.y)) * 1.1
      ])
      .range([this.height, 0])
      .nice();

    const axisBottom = g1
      .selectAll(".gAxisBottom")
      .data([-1])
      .enter()
      .append("g")
      .attr("class", "gAxisBottom")
      // .attr("transform", "translate(0," + this.height + ")")
      .attr("transform", "translate(0," + this.yscale(0) + ")")
      .call(
        d3.axisBottom(this.xscale)
        // .tickSizeInner(-this.height)
        // .tickSizeOuter(0)
        // .tickPadding(10)
      );

    // topic: proper placement of grid and axis labels
    // procedure: get min and max value of xscale, get the percentage from 1. x<0 (negativ) to x=0 2. from 0 to x>0
    // then transfer this given relationship to this.width (separate this.width into 2 parts: 1. from x<0 to 0 and 0 to x>0)
    // why?
    //  the grid will be printed FROM the y-axis (yes y-axis (aka x=0) -> at each tick at y-axis there will be printed a pseudo parallel
    //  line to the x-axis so that we get this lines ---), but we cannot just take this.width/2 since we cannot assume that
    //  x=0 (aka y-axis lies at the center of the svg (aka this.width/2))
    const xMin = this.xscale.domain()[0];
    const xMax = this.xscale.domain()[this.xscale.domain().length - 1];
    // pixel from x<0 to x=0
    const pixelToYAxis =
      (Math.abs(xMin) / (Math.abs(xMin) + Math.abs(xMax))) * this.width;
    // pixel from x=0 to x>0
    const pixelFromYAxis =
      (Math.abs(xMax) / (Math.abs(xMin) + Math.abs(xMax))) * this.width;

    const yMin = this.yscale.domain()[0];
    const yMax = this.yscale.domain()[this.yscale.domain().length - 1];
    const pixelToXAxis =
      (Math.abs(yMax) / (Math.abs(yMin) + Math.abs(yMax))) * this.height;
    const pixelFromXAxis =
      (Math.abs(yMin) / (Math.abs(yMin) + Math.abs(yMax))) * this.height;

    // offset, to move labels away from coordinate origin
    const labelAdjustment = 50;

    const axisBottomLabel = g1
      .selectAll(".gAxisBottomLabel")
      .data([-1])
      .enter()
      .append("text")
      .attr("class", "gAxisBottomLabel")
      .attr("x", pixelToYAxis + labelAdjustment)
      // pay attention: /2 is only applied to this.margin.bottom ()
      // .attr("y", this.height + this.margin.top + (this.margin.bottom / 2))
      .attr("y", pixelToXAxis + labelAdjustment)
      .text("x");

    const axisLeft = g1
      .selectAll(".gAxisLeft")
      .data([-1])
      .enter()
      .append("g")
      .attr("class", "gAxisLeft")
      .attr("transform", "translate(" + this.xscale(0) + ",0)")
      .call(
        d3.axisLeft(this.yscale)
        // .tickSizeInner(-this.width)
        // .tickSizeOuter(0)
        // .tickPadding(10)
      );

    const axisLeftLabel = g1
      .selectAll(".gAxisLeftLabel")
      .data([-1])
      .enter()
      .append("text")
      .attr("class", "gAxisLeftLabel")
      .attr("x", -1 * pixelToXAxis + labelAdjustment)
      // .attr("y", -this.margin.left / 2)
      // dx, dy is not affected of rotate, so to bring label to middle (instead of after rotating outer left)
      // .attr("dx", "50px")
      .attr("dy", pixelToYAxis - labelAdjustment)
      .attr("transform", "rotate(-90)") // translateX(100px)
      .style("text-anchor", "end")
      .text("y");

    // https://stackoverflow.com/questions/40766379/d3-adding-grid-to-simple-line-chart
    // in grid these lines
    // -----
    // -----
    const horizontalGrid = axisLeft
      .selectAll(".tick")
      .append("line")
      .attr("class", "gridline")
      .style("stroke", "black")
      .style("shape-rendering", "crispEdges")
      .style("stroke-opacity", 0.2)
      .attr("x1", -1 * pixelToYAxis)
      .attr("y1", 0)
      .attr("x2", pixelFromYAxis)
      .attr("y2", 0);

    // in grid these lines
    // ||||
    // ||||
    const verticalGrid = axisBottom
      .selectAll(".tick")
      .append("line")
      .attr("class", "gridline")
      .style("stroke", "black")
      .style("shape-rendering", "crispEdges")
      .style("stroke-opacity", 0.2)
      .attr("x1", 0)
      .attr("y1", -1 * pixelToXAxis)
      .attr("x2", 0)
      .attr("y2", pixelFromXAxis);

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
      .attr("cx", function (d: ScatterPlotMdsData) {
        return module.xscale(d.x);
      })
      .attr("cy", function (d: ScatterPlotMdsData) {
        return module.yscale(d.y);
      })
      .attr("r", 10)
      .attr("fill", (a, aIndex) => {
        return this.sequentialColorScale(aIndex);
      })
      .on("mouseover", function (event, data: ScatterPlotMdsData) {
        console.log("sadfasdf");
        module.tooltip
          .html(
            "<div>Cluster-Name: " +
              data.clusterName +
              "</div>" +
              "<div>Cluster-x: " +
              data.x.toFixed(2) +
              "</div>" +
              '<div style="height: 2px"></div>' +
              "<div>Cluster-y: " +
              data.y.toFixed(2) +
              "</div>"
          )
          .style("left", module.getXTooltip(this, module.tooltip) + "px")
          .style("top", module.getYTooltip(this, module.tooltip) + 20 + "px")
          .style("visibility", "visible");
      })
      .on("mouseout", () => {
        module.tooltip.style("visibility", "hidden");
      });

    // create legend
    const gLegend = this.svg
      .selectAll(".g-legend")
      // random value to be able to enter()
      .data([-1])
      .enter()
      .append("g")
      .attr("class", "g-legend")
      .attr("height", 100)
      .attr("width", 300);

    // for each data element (1 data element = 1 cluster) print 1 rect (coloured) + 1 Text
    // create legend color squares
    gLegend
      .selectAll(".legend-rect")
      .data(this.data)
      .enter()
      .append("rect")
      .attr("class", "legend-rect")
      .attr("x", this.width + this.margin.left + this.margin.right - 70)
      .attr("y", (a: ScatterPlotMdsData, aIndex) => {
        return 15 + aIndex * 20;
      })
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (a, aIndex) => {
        return this.sequentialColorScale(aIndex);
      });

    // create legend-text
    gLegend
      .selectAll(".legend-text")
      .data(this.data)
      .enter()
      .append("text")
      .attr("class", "legend-text")
      .attr("x", this.width + this.margin.left + this.margin.right - 50)
      .attr("y", (a: ScatterPlotMdsData, aIndex) => {
        return 25 + aIndex * 20;
      })
      .attr("font-size", "11px")
      .text((a: ScatterPlotMdsData) => {
        return a.clusterName;
      });
  }

  // keep in mind where the tooltip div spawns: only with right x+y at the buttom-left-corner of edge
  getXTooltip(currentObject, tooltipSelection): number {
    return (
      window.pageXOffset +
      currentObject.getBoundingClientRect().x -
      tooltipSelection.node().getBoundingClientRect().width / 2 +
      currentObject.getBoundingClientRect().width / 2
    );
  }

  getYTooltip(currentObject, tooltipSelection): number {
    return (
      window.pageYOffset +
      currentObject.getBoundingClientRect().y -
      tooltipSelection.node().getBoundingClientRect().height +
      currentObject.getBoundingClientRect().height
    );
  }
}
