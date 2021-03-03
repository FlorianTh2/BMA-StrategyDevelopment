// diagram sources
// http://techslides.com/over-1000-d3-js-examples-and-demos
// https://www.visualcinnamon.com/2013/09/making-d3-radar-chart-look-bit-better/
// http://bl.ocks.org/nbremer/6506614
// http://bl.ocks.org/tezzutezzu/c9d8706587e8f5b5d72084b083b502f8
// https://stackoverflow.com/a/42643557
// https://github.com/alangrafu/radar-chart-d3/blob/ea5d63a9472086dbb9aa2d8cdf317d5177b731e9/src/radar-chart.js#L94
//
// d3.js basics
// basics: d3.selectAll("tagA").data(array).enter().append("tagA"). ...
// if you dont have data (u want to create only one or something like that):
//    gLegend.append("...").attr("..."). ...
// example:
//  d3.select("body").selectAll("span").data([1,2,3]).enter().append("p").text("hi")
//  d3.select("body").selectAll("p").data(dataset).enter().append("p").text("New paragraph!");
// https://bost.ocks.org/mike/selection/
//  .data(...) = data-join, der mehrere selections anbietet und das einzelne data-datum in dem html-property speichert
//    enter(): bietet methode: append()
//    update:
//    exit(): bietet methode: remove()
// https://tmcw.github.io/presentations/dcjq/
// https://www.d3indepth.com/selections/
// https://github.com/d3/d3-selection
//  By convention, selection methods that return the current selection use four spaces of indent, while methods that return a new selection use only two.
// https://alignedleft.com/tutorials/d3/binding-data
// g-Element: http://tutorials.jenkov.com/svg/g-element.html
// Generally, though - position and size are .attr, and all other decoration is .style. But hey, that’s probably a lie, too.
//
// math basics
// https://medium.com/analytics-vidhya/the-mathematics-behind-radar-charts-8a4cbc1f14ee
// https://de.wikipedia.org/wiki/Kreisbogen#:~:text=Der%20zu%20einem%20Kreissektor%20geh%C3%B6rende,den%20beiden%20Radien%20als%20Mittelpunktswinkel.
//  Kreisumfang/ Gesamtkreisbogen = 2*r*pi (unter Annahme, dass r=1 [wie im Einheitskreis] bleibt: = 2*pi)
// https://de.wikipedia.org/wiki/Einheitskreis
// https://de.wikipedia.org/wiki/Radiant_(Einheit)
//  1 Kreis = 2 pi = 260°
// https://www.lernhelfer.de/schuelerlexikon/mathematik/artikel/bogenmass
// https://de.wikipedia.org/wiki/Sinus_und_Kosinus

import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewEncapsulation
} from "@angular/core";
import * as d3 from "d3";
import {
  InputMaturityModelSpiderChart,
  InputSubUserPartialModelSpiderChart,
  InputUserPartialModelSpiderChart
} from "../../models/InputMaturityModelSpiderChart";
@Component({
  selector: "app-spiderchart",
  templateUrl: "./spiderchart.component.html",
  styleUrls: ["./spiderchart.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class SpiderchartComponent implements OnInit {
  @Input()
  inputMaturityModel: InputMaturityModelSpiderChart;
  hostElement: any;
  private svg: any;
  private factor: number = 1;
  private height: number = 500;
  private width: number = this.height;
  private radius: number =
    this.factor * Math.min(this.width / 2, this.height / 2);
  private factorLegend: number = 0.85;
  private maxValue: number = 4;
  // needed since all scales with height but for external things like label
  // we need extra Width or Height, but if we increase width or hight
  // directly -> all increases/shrinks and we need a way to just increase
  // the base svg (only applied to that)
  private extraWidth: number = 400;
  private extraHeight: number = 200;
  private levels: number = 8;
  private shiftFromCenter: number = 1;
  private opacityArea: number = 0.6;
  private toRight: number = 5;
  private customFormat = d3.format(".1f");

  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit(): void {
    this.createRadarChart();
  }

  createRadarChart() {
    // needed since in annonym-function declared with "function"-keyword: the "this"-context changes to the functions-scope
    const module = this;
    const top_level_axis = this.inputMaturityModel.userPartialModels;
    const number_top_level_axis: number = top_level_axis.length;

    const sub_level_axis = this.flattenArray(
      this.inputMaturityModel.userPartialModels.map(
        (a) => a.subUserPartialModel
      )
    );
    const number_sub_level_axis: number = sub_level_axis.length;

    this.svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", this.width + this.extraWidth)
      .attr("height", this.height + this.extraHeight);

    const g1 = this.svg
      .append("g")
      .attr(
        "transform",
        "translate(" + this.extraWidth / 2 + "," + this.extraHeight / 2 + ")"
      );

    // create "spider net" (the circles approximated with lines)
    // -> level = 1 and this.levels +1, since: to not begin at the middle but at the actually first position (since we dont want to display 0.0 in the middle)
    // in the middle (level=0) would have been just a dot
    for (var level = 1; level < this.levels + 1; level++) {
      const spiderNet = g1
        .selectAll(".lineSelection")
        .data(sub_level_axis) // .slice(0, -2)
        .enter()
        .append("svg:line")
        .attr("x1", (a, b) =>
          this.getXPosition(
            b,
            number_sub_level_axis,
            -this.shiftFromCenter,
            level / this.levels,
            1
          )
        )
        .attr("y1", (a, b) =>
          this.getYPosition(
            b,
            number_sub_level_axis,
            -this.shiftFromCenter,
            level / this.levels,
            1
          )
        )
        .attr("x2", (a, b) =>
          this.getXPosition(
            b + 1,
            number_sub_level_axis,
            -this.shiftFromCenter,
            level / this.levels,
            1
          )
        )
        .attr("y2", (a, b) =>
          this.getYPosition(
            b + 1,
            number_sub_level_axis,
            -this.shiftFromCenter,
            level / this.levels,
            1
          )
        )
        .attr("class", "line")
        .style("stroke", "#7f7f7f")
        .style("stroke-width", "0.75px")
        .attr(
          "transform",
          "translate(" +
            (1 - level / this.levels) * this.radius +
            ", " +
            (1 - level / this.levels) * this.radius +
            ")"
        );
    }

    // create vertical %-scale from core to top
    // -> level = 1 and this.levels +1, since: to not begin at the middle but at the actually first position (since we dont want to display 0.0 in the middle)
    for (var level = 1; level < this.levels + 1; level++) {
      g1.selectAll(".legendSelection")
        .data([1])
        .enter()
        .append("svg:text")
        .attr("x", (a) => this.getXPosition(1, 1, 0, 1 / 1, 1))
        .attr("y", (a) => this.getYPosition(1, 1, 0, level / this.levels, 1))
        // important since this.getYPosition returns always (e.g. different currentIndex or fraction) the same (=0)
        // take a look at problem 6 - in short: to get all centered (x not needed since always the same (1))
        .attr(
          "transform",
          "translate(" +
            this.toRight +
            ", " +
            (1 - level / this.levels) * this.radius +
            ")"
        )
        .attr("class", "legend")
        .style("font-size", "12px")
        .text(this.customFormat((level * this.maxValue) / this.levels));
    }

    // for top-level-partial-models create lines from core to outside based on setup
    const gPartialModelAxis = g1
      .selectAll(".partialModelAxis")
      .data(top_level_axis)
      .enter()
      .append("g")
      .attr("class", ".axis");

    gPartialModelAxis
      .append("line")
      .attr("x1", this.radius)
      .attr("y1", this.radius)
      .attr("x2", (a, b) =>
        this.getXPosition(b, number_top_level_axis, 0, 1 / 1, 1.0)
      )
      .attr("y2", (a, b) =>
        this.getYPosition(b, number_top_level_axis, 0, 1 / 1, 1.0)
      )
      .attr("class", "line")
      .style("stroke", "#7f7f7f")
      .attr("stroke-width", "2px");

    // create labels
    gPartialModelAxis
      .append("text")
      .attr("class", "labels")
      .text((d: InputUserPartialModelSpiderChart) => d.partialModel.name)
      .style("font-size", "11px")
      .attr("dx", "-75px")
      .attr("x", (a, b) =>
        this.getXPosition(b, number_top_level_axis, 0, 1 / 1, 1.25)
      )
      .attr("y", (a, b) =>
        this.getYPosition(b, number_top_level_axis, 0, 1 / 1, 1.1)
      );

    // for sub-level-partial-models create lines from core to outside based on setup
    const gSubPartialModelAxis = g1
      .selectAll(".subPartialModels")
      .data(sub_level_axis)
      .enter()
      .append("g")
      .attr("class", "subPartialModelAxis")
      .append("line")
      .attr("x1", this.radius)
      .attr("y1", this.radius)
      .attr("x2", (a, b) =>
        this.getXPosition(
          b,
          number_sub_level_axis,
          -this.shiftFromCenter,
          1 / 1,
          1.0
        )
      )
      .attr("y2", (a, b) =>
        this.getYPosition(
          b,
          number_sub_level_axis,
          -this.shiftFromCenter,
          1 / 1,
          1.0
        )
      )
      .attr("class", "line")
      .style("stroke", "#7f7f7f")
      .attr("stroke-width", "1px");

    // init/prepare tooltip for following definition of edge-point-hover
    var tooltip = d3
      .select("#chart")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    // draw data-"area" from coordinates for top-level-partial-model
    g1.selectAll(".area")
      // packed in list since its a polygon-element and we need 1 element with all points
      .data([top_level_axis])
      .enter()
      .append("polygon")
      .attr("class", "radar-chart-area")
      .style("stroke-width", "1.5px")
      .style("stroke", "#7f7f7f")
      .attr("points", (a: InputUserPartialModelSpiderChart[]) => {
        const result = a
          .map(
            (b, c) =>
              this.getXPosition(
                c,
                number_top_level_axis,
                0,
                1 / 1,
                b.maturityLevelEvaluationMetrics /
                  b.maxMaturityLevelEvaluationMetrics
              ) +
              "," +
              this.getYPosition(
                c,
                number_top_level_axis,
                0,
                1 / 1,
                b.maturityLevelEvaluationMetrics /
                  b.maxMaturityLevelEvaluationMetrics
              )
          )
          .reduce((d, e) => d + " " + e);
        return result;
      })
      .style("fill", "#8ac4d0")
      .style("fill-opacity", this.opacityArea)
      // needed function-keyword to get context of "this" otherwise this points to the module
      .on("mouseover", function (a) {
        const thisPolygon = "polygon." + d3.select(this).attr("class");
        g1.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
        g1.selectAll(thisPolygon).transition(200).style("fill-opacity", 0.9);
      })
      .on("mouseout", () =>
        g1
          .selectAll("polygon")
          .transition(200)
          .style("fill-opacity", this.opacityArea)
      );

    // draw single edge-points for top-level-partial-models
    g1.selectAll(".edges")
      .data(top_level_axis)
      .enter()
      .append("svg:circle")
      .attr("class", "circle-edge-point")
      .attr("r", 7.5)
      .attr("cx", (a: InputUserPartialModelSpiderChart, b) =>
        this.getXPosition(
          b,
          number_top_level_axis,
          0,
          1 / 1,
          a.maturityLevelEvaluationMetrics / a.maxMaturityLevelEvaluationMetrics
        )
      )
      .attr("cy", (a: InputUserPartialModelSpiderChart, b) =>
        this.getYPosition(
          b,
          number_top_level_axis,
          0,
          1 / 1,
          a.maturityLevelEvaluationMetrics / a.maxMaturityLevelEvaluationMetrics
        )
      )
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .style("fill", "#ff7f0e")
      // needed function-keyword to get context of "this" otherwise this points to the module
      .on(
        "mouseover",
        function (event, data: InputUserPartialModelSpiderChart) {
          tooltip
            .html(
              "<div>Partial Model: " +
                data.partialModel.name +
                "<br> Value: " +
                data.maturityLevelEvaluationMetrics +
                "</div>"
            )
            .style("left", module.getXTooltip(this, tooltip))
            .style("top", module.getYTooltip(this, tooltip))
            .style("visibility", "visible");

          const thisPolygon = "polygon." + d3.select(this).attr("class");
          // why changed idk
          g1.selectAll("polygon").transition(200).style("fill-opacity", 0.9);
          g1.selectAll(thisPolygon).transition(200).style("fill-opacity", 0.1);
        }
      )
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
        g1.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", this.opacityArea);
      });

    // draw same thing (area+edgepoints) for sub-partialmodels -> cant merge with above since i want
    // to get top-level-partial-models in the "middle" and sub-partial-models to be shiftet, so that
    // top-level-partial-models are in the middle -> because of this the calculation changes and cant be merged
    g1.selectAll(".area-sub-level-partial-model")
      // packed in list since its a polygon-element and we need 1 element with all points
      .data([sub_level_axis])
      .enter()
      .append("polygon")
      .attr("class", "radar-chart-area-sub-level-partial-model")
      .style("stroke-width", "1.5px")
      .style("stroke", "#7f7f7f")
      .attr("points", (a: InputSubUserPartialModelSpiderChart[]) => {
        const result = a
          .map(
            (b, c) =>
              this.getXPosition(
                c,
                number_sub_level_axis,
                -this.shiftFromCenter,
                1 / 1,
                b.maturityLevelEvaluationMetrics /
                  b.maxMaturityLevelEvaluationMetrics
              ) +
              "," +
              this.getYPosition(
                c,
                number_sub_level_axis,
                -this.shiftFromCenter,
                1 / 1,
                b.maturityLevelEvaluationMetrics /
                  b.maxMaturityLevelEvaluationMetrics
              )
          )
          .reduce((d, e) => d + " " + e);
        return result;
      })
      .style("fill", "#f4d160")
      .style("fill-opacity", this.opacityArea)
      .on("mouseover", function (a) {
        const thisPolygon = "polygon." + d3.select(this).attr("class");
        g1.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
        g1.selectAll(thisPolygon).transition(200).style("fill-opacity", 0.9);
      })
      .on("mouseout", () =>
        g1
          .selectAll("polygon")
          .transition(200)
          .style("fill-opacity", this.opacityArea)
      );

    // draw single edge-points
    g1.selectAll(".edges-sub-level-partial-model")
      .data(sub_level_axis)
      .enter()
      .append("svg:circle")
      .attr("class", "circle-edge-point-sub-level-partial-model")
      .attr("r", 7.5)
      .attr("cx", (a: InputSubUserPartialModelSpiderChart, b) =>
        this.getXPosition(
          b,
          number_sub_level_axis,
          -this.shiftFromCenter,
          1 / 1,
          a.maturityLevelEvaluationMetrics / a.maxMaturityLevelEvaluationMetrics
        )
      )
      .attr("cy", (a: InputSubUserPartialModelSpiderChart, b) =>
        this.getYPosition(
          b,
          number_sub_level_axis,
          -this.shiftFromCenter,
          1 / 1,
          a.maturityLevelEvaluationMetrics / a.maxMaturityLevelEvaluationMetrics
        )
      )
      .attr("stroke", "white")
      .attr("stroke-width", 3)
      .style("fill", "#fbeeac")
      // needed function-keyword to get context of "this" otherwise this points to the module
      .on(
        "mouseover",
        function (event, data: InputSubUserPartialModelSpiderChart) {
          tooltip
            .html(
              "<div>Sub-Partial Model: " +
                data.partialModel.name +
                "<br>Parent: " +
                data.parentUserPartialModel.partialModel.name +
                "<br> Value: " +
                data.maturityLevelEvaluationMetrics +
                "</div>"
            )
            .style("left", module.getXTooltip(this, tooltip))
            .style("top", module.getYTooltip(this, tooltip))
            .style("visibility", "visible");

          const thisPolygon = "polygon." + d3.select(this).attr("class");
          // why changed idk
          g1.selectAll("polygon").transition(200).style("fill-opacity", 0.9);
          g1.selectAll(thisPolygon).transition(200).style("fill-opacity", 0.1);
        }
      )
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
        g1.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", this.opacityArea);
      });

    // create legend
    const gLegend = this.svg
      .append("g")
      .attr("class", "main-legend")
      .attr("height", 100)
      .attr("width", 200);

    // create legend color squares
    gLegend
      .selectAll("rect")
      .data(["Partial Models", "Sub-Partial Models"])
      .enter()
      .append("rect")
      .attr("x", this.width + this.extraWidth - 150)
      .attr("y", (a, b) => b * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", (a, b) =>
        b === 0 ? "rgb(138, 196, 208)" : "rgb(244, 209, 96)"
      );

    // create legend-text
    gLegend
      .selectAll("text")
      .data(["Partial Models", "Sub-Partial Models"])
      .enter()
      .append("text")
      .attr("x", this.width + this.extraWidth - 130)
      .attr("y", (a, b) => b * 20 + 10)
      .attr("font-size", "11px")
      .text((a) => a);
  }

  // Nebenbemerkung
  // Länge Kreisbogen im Gradmaß = b = 2*r*pi*(winkel/360)
  // Umrechnung von GradMaß in Bogenmaß = Bogenmaß = 2*pi/360*winkel
  // radian = default in math + programming-lenguages (important if you use Math.sin())
  // 360° gradmaß entspricht einer Länge des kreisbogens von 2 pi bogenmaß
  // https://de.wikipedia.org/wiki/Kreisbogen

  // Prozess
  // 0 alle angaben im Bogenmaß
  // 1. Umfang eines Kreises (gebraucht, da über Dreiecksgleichung später gegangen wird und dafür der Winkel benötigt wird)
  // 1.1 Umfang eines beliebigen Kreises = u = circumference = 2*r*pi
  //    - Return u ist in der Einheit des radiuses (somit weder Bogenmaß noch Gradmaß)
  // 1.2 Umfang eines Einheitskreises = u = circumference = 2*pi (r=1: u=2*1*pi=2*pi=u)
  //    - Return u ist in der Einheit rad (radiant)
  //      - d.h. Radiant bezieht sich auf Einheitskreis d.h.
  //    - hier wird (erstmal) von einem Einheitskreis ausgegangen
  //    - hier wird folgend im Bogenmaß (Radiant) weitergerechnet
  //      - nicht verwechseln: hier wird zwar damit r "ausgelassen" (da r=1), später wird aber nochmal
  //        mit dem radius multipliziert um aus dem -Einheitskreis/der Einheit Radiant- herauszukommen
  // 2. Winkel zwischen verschiedenen Kategorien = Länge eines Kreisbogens = u/anzahlKreisbögen = u/anzahlKategorien
  // 3. Aufstellen von Dreiecken zu jeder imaginären Kategory, damit man
  //    durch Dreiecksgleichungen/Trigonometrische Funktionen die Dreiecksseiten berechnen kann
  //  - siehe: https://medium.com/analytics-vidhya/the-mathematics-behind-radar-charts-8a4cbc1f14ee
  //      - Aufpassen: dort wird das dreieck anders kreiert als hier folgend
  //  - Gegeben:
  //      - winkel alpha zwischen den kategorien
  //      - Hypothenuse (= radius des kreises)
  //  - Gesucht:
  //      - Länge Gegenkathese (= x-position)
  //      - Länge Ankathese (= y-position)
  //  - Lösung:
  //      - Gegenkathese = x-position:
  //          - betrachten der Formel zur Berechnung sinus(alpha) (da wir alpha + hypothese haben und diese Formel die Gegenkathese beinhaltet, nach der man umstellen kann)
  //          - sinus(alpha) = Gegenkathese/Hypothenuse
  //          - d.h. Gegenkathete = sinus(alpha) * Hypothenuse
  //            - alpha wird im bogenmaß übergeben (wird so von Math.sin und Math.cos erwartet)
  //      - Berechnung Ankathete = y-position
  //          - betrachten der Formel zur Berechnung cos(alpha) (da wir alpha + hypothese haben und diese Formel die Ankathese beinhaltet, nach der man umstellen kann)
  //          - cos(alpha) = ankathete/Hypothenuse
  //          - d.h. Ankathete = cos(alpha) * hypothenuse
  //            - = y-position
  //              - alpha wird im bogenmaß übergeben (wird so von Math.sin und Math.cos erwartet)
  //
  // 4. Problem: wir wollen nicht nur den ersten (rechts neben der Mittelsenkrechten)
  //    Punkt berechnen, sondern alle benötigten Punkte des Kreisen rings herum
  //    Lösung: bei der berechnung des ersten (rechten) Punktes startet man mit dem winkel zwischen der mittelsenkrechten
  //            und eben des ersten bisher noch imaginären Punktes und zur berechnung startet man einfach immer wieder
  //            von besagter mittelsenkrechten (den gesamten kreis herum). Durch den Sinus/Cosinus werden die jeweiligen
  //            Werte größer und wieder kleiner und ...
  //            - sieht man auch sehr schön in https://medium.com/analytics-vidhya/the-mathematics-behind-radar-charts-8a4cbc1f14ee
  //              -> also dass man immer wieder von der mittelsenkrechten startet
  // 5. Problem: der Koordinatenursprung von d3.js ist oben links, d.h. ohne adjustments sieht man nur den Kreis unten rechts
  //    Lösung: Es gibt u.a. 2 Lösungen:
  //      1. man translatiert einfach alle Punkte/Striche innerhalb eines transform-elementes via attribute in d3.js
  //      2. mathematisch: man geht in die Rechnung, während man noch innerhalb des Einheitskreises rechnet
  //         - da man nun im Einheitskreis ist, ist bekannt, dass der radius 1 ist, d.h. man muss den Kreis nur um
  //            diesen radius einerseits nach rechts verschieben und andererseteis (mathematisch nach oben in den positiven Berech) nach unten
  //            (positives y heißt ja in d3.js nach unten) bewegen.
  //            - d.h. man einfach "1 - die Koordinate" rechnen, wenn dann z.B. Sinus negativ wird, kommt 1- -Zahl und damit
  //              wird man wieder positiv und die niedrigste Zahl ist 1-1 (da radius=1=der max radius) = 0 und damit hat man
  //              Kreis je nach Koordinate um 1 Radius nach rechts oder nach oben verschoben
  //               - spiegelt den Kreis
  //            - ähnlich funktioniert es wenn man rechnet "die Koordinate + 1"
  //                - spiegelt den Kreis nicht
  //            - empfohlen: Ausgang: d3.js: koordinatenursprung ist oben links und positive y bewirken, dass die Figur nach
  //                          unten geht (unten sind höhere y-koordinaten) d.h. mathematisch betrachtet ist das Koordinaten
  //                          system an der y-Achse gespiegelt
  //                          -> bei der x-Achse ist das anders: d3.js wie auch mathematisch: höhere x-Werte = translation
  //                              nach rechts
  //                          -> deshalb: bei Berechnung von x: + 1 (keine spiegellung durch +1)
  //                                      bei der Berechnung von y: -1 sodass man im Grunde das Ergebnis spiegelt
  //                                        und dadurch (jetzt durch 2 spiegellungen 1. durch d3.js und 2. durch diese Rechnung)
  //                                        wieder "normal ist" und damit die grafische Darstellung mit der mathematiscehn
  //                                        Rechnung übereinstimmt (wenn vor 1-koordinate ein hoher y wert herauskommt, ist
  //                                        dieser auch oben und nicht weiter unten)
  //                                        -> gerade bei der legende ist das wichtig, die soll ja nicht von der mitte nach unten gehen
  // 6. Problem: wenn man nun mehrere ineinander-verschachtelte Kreise haben möchte (eine art Level) ist zwar
  //             nach der Lösung des vorrangegangenen Problems jeder Kreis voll ersichtlich, da um r=1 in den ersten
  //             Quadranten translatiert wurde, aber nicht alle Kreise sind mittig, der größte ist mittig, alle
  //             anderen nicht, diese "hängen" alle leicht verschoben in der linken oberen Ecke
  //    Lösung: einfach translatieren mit (1-level/levels) * radius in x+y-richtung
  //            -> * radius geht nur, wenn höhe und breite gleich sein sollen, andernfalls müssen beide einzelnd
  //                spezifiziert werden

  // UC=unit circle = hint for calculations/results in the measurements of a unit circle
  // fraction = a possibility to introduce some levels
  //  - without levels = max = 1/1 = without levels, min=0
  //  - e.g. draw a circle with 1/2 the radius: fraction=0.5
  getXPosition(
    currentIndex,
    totalNumber,
    shiftFromCenter,
    fraction,
    stretch
  ): number {
    const circumferenceUC: number = 2 * Math.PI;
    const angleBetweenUC = circumferenceUC / totalNumber;
    const resultXPosUC =
      this.factor * Math.sin((currentIndex + shiftFromCenter) * angleBetweenUC);
    const resultYPosShiftedUC = 1 + stretch * resultXPosUC;

    const radiusFactor = this.factor * this.radius * fraction;
    const resultYPosShifted = radiusFactor * resultYPosShiftedUC;
    return resultYPosShifted;
  }

  getYPosition(
    currentIndex,
    totalNumber,
    shiftFromCenter,
    fraction,
    stretch
  ): number {
    const circumferenceUC: number = 2 * Math.PI;
    const angleBetweenSectorsUC = circumferenceUC / totalNumber;
    const resultYPosUC =
      this.factor *
      Math.cos((currentIndex + shiftFromCenter) * angleBetweenSectorsUC);
    const resultXPosShiftedUC = 1 - stretch * resultYPosUC;

    const radiusFactor = this.factor * this.radius * fraction;
    const resultXPosShifted = radiusFactor * resultXPosShiftedUC;
    return resultXPosShifted;
  }

  // keep in mind where the tooltip div spawns: only with right x+y at the buttom-left-corner of edge
  getXTooltip(currentObject, tooltipSelection): string {
    return (
      currentObject.getBoundingClientRect().x -
      tooltipSelection.node().getBoundingClientRect().width / 2 +
      currentObject.getBoundingClientRect().width / 2 +
      "px"
    );
  }

  getYTooltip(currentObject, tooltipSelection): string {
    return (
      currentObject.getBoundingClientRect().y -
      tooltipSelection.node().getBoundingClientRect().height -
      currentObject.getBoundingClientRect().height +
      "px"
    );
  }

  flattenArray(array: any[]): any[] {
    return [].concat.apply([], array);
  }
}
