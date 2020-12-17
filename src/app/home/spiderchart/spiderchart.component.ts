import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-spiderchart",
  templateUrl: "./spiderchart.component.html",
  styleUrls: ["./spiderchart.component.scss"]
})
export class SpiderchartComponent implements OnInit {
  title: string = "Spiderchart with d3.js";
  constructor() {}

  ngOnInit(): void {}
}
