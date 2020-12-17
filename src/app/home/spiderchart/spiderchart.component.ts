import {
  Component,
  ElementRef,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import * as d3 from "d3";

// good reference
// http://bl.ocks.org/nbremer/6506614
@Component({
  selector: "app-spiderchart",
  templateUrl: "./spiderchart.component.html",
  styleUrls: ["./spiderchart.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SpiderchartComponent implements OnInit {
  title = "Spiderchart with d3.js";
  private width: number;
  private height: number;
  private container: any;
  hostElement: any;
  private data = [
    { id: "d1", value: 10, region: "USA" },
    { id: "d2", value: 11, region: "India" },
    { id: "d3", value: 12, region: "China" },
    { id: "d4", value: 6, region: "Germany" }
  ];
  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit(): void {
    this.container = d3
      .select(this.hostElement)
      .select("svg")
      .classed("container", true);

    this.renderChart();
  }

  private renderChart() {}
}
