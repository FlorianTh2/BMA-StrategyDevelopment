import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "app-testchart",
  templateUrl: "./testchart.component.html",
  styleUrls: ["./testchart.component.scss"],
  // needed to make component css affect the d3.js
  // otherwise we call classed() -> the css class is attached in browser but not applied/sended
  // https://stackoverflow.com/a/42189051/11244995
  encapsulation: ViewEncapsulation.None
})
export class TestchartComponent implements OnInit {
  title: string = "Testchart with d3.js";
  private width: number;
  private height: number;
  private margin = { top: 20, right: 20, bottom: 30, left: 50 };
  private svg: any;
  private container: any;
  hostElement: any;
  private data = [
    { id: "d1", value: 10, region: "USA" },
    { id: "d2", value: 11, region: "India" },
    { id: "d3", value: 12, region: "China" },
    { id: "d4", value: 6, region: "Germany" }
  ];

  constructor(private elRef: ElementRef) {
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;
    this.hostElement = this.elRef.nativeElement;
  }

  // selection can be seen as one block (sure it can be multiple statements but you will get 1 selection)
  // if you select div's(childs) on a div(parent) -> the parent gets included (solution: css-class)
  // Your "enter" selection contains all data points without a corresponding element.
  //
  // there are basicly 2 blocks: 1. select 2. do something with selection
  // you can not .data in the/at the end of 2 -> you can only do that at beginning of 2.
  ngOnInit(): void {
    this.container = d3
      .select(this.hostElement)
      .select("div")
      .classed("container", true)
      .style("border", "1px solid blue")
      .selectAll(".bar")
      .data(this.data)
      .enter()
      .append("div")
      .classed("bar1", true)
      .style("width", "50px")
      .style("height", "150px");
  }

  private initSvg() {}
}
