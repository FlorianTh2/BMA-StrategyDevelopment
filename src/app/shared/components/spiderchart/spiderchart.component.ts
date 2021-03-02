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
  private extraWidth: number = 0;
  private extraHeight: number = 20;
  private translateX: number = 100;
  private translateY: number = 100;
  private levels: number = 8;
  private shiftFromCenter: number = 0.0;
  private opacityArea: number = 0.5;
  private toRight: number = 5;
  private customFormat = d3.format(".1f");
  private colorscale = d3.scaleOrdinal(d3.schemeCategory10);
  private legendOptions = ["Reifegrad (ungewichtet)"];

  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit(): void {
    this.createRadarChart();
  }

  createRadarChart() {
    console.log(this.inputMaturityModel);

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

    // -> level = 1 and this.levels +1, since: to not begin at the middle but at the actually first position (since we dont want to display 0.0 in the middle)
    // in the middle (level=0) would have been just a dot
    for (var level = 1; level < this.levels + 1; level++) {
      const spiderNet = g1
        .selectAll(".levels")
        .data(sub_level_axis.slice(0, -2))
        .enter()
        .append("svg:line")
        .attr("x1", (a, b) =>
          this.getXPosition(
            b,
            number_sub_level_axis,
            this.shiftFromCenter,
            level / this.levels
          )
        )
        .attr("y1", (a, b) =>
          this.getYPosition(
            b,
            number_sub_level_axis,
            this.shiftFromCenter,
            level / this.levels
          )
        )
        .attr("x2", (a, b) =>
          this.getXPosition(
            b + 1,
            number_sub_level_axis,
            this.shiftFromCenter,
            level / this.levels
          )
        )
        .attr("y2", (a, b) =>
          this.getYPosition(
            b + 1,
            number_sub_level_axis,
            this.shiftFromCenter,
            level / this.levels
          )
        )
        .attr("class", "line")
        .style("stroke", "grey")
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

    // -> level = 1 and this.levels +1, since: to not begin at the middle but at the actually first position (since we dont want to display 0.0 in the middle)
    for (var level = 1; level < this.levels + 1; level++) {
      g1.selectAll(".levels1")
        .data([1])
        .enter()
        .append("svg:text")
        .attr("x", (a) => this.getXPosition(1, 1, 0, 1 / 1))
        .attr("y", (a) => this.getYPosition(1, 1, 0, level / this.levels))
        // important since this.getYPosition returns always (e.g. different currentIndex or fraction) the same (=0)
        // take a look at problem 6: short: to get all centered (x not needed since always the same (1))
        .attr(
          "transform",
          "translate(0, " + (1 - level / this.levels) * this.radius + ")"
        )
        .attr("class", "legend")
        .style("font-size", "12px")
        // -> level +1 to not begin at the middle but at the actually first position (since we dont want to display 0.0 in the middle)
        .text(this.customFormat((level * this.maxValue) / this.levels));
    }
  }

  flattenArray(array: any[]): any[] {
    return [].concat.apply([], array);
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
  getXPosition(currentIndex, totalNumber, shiftFromCenter, fraction): number {
    const circumferenceUC: number = 2 * Math.PI;
    const angleBetweenUC = circumferenceUC / totalNumber;
    const resultXPosUC =
      this.factor * Math.sin((currentIndex + shiftFromCenter) * angleBetweenUC);
    const resultYPosShiftedUC = 1 + resultXPosUC;

    const radiusFactor = this.factor * this.radius * fraction;
    const resultYPosShifted = radiusFactor * resultYPosShiftedUC;
    return resultYPosShifted;
  }

  getYPosition(currentIndex, totalNumber, shiftFromCenter, fraction): number {
    const circumferenceUC: number = 2 * Math.PI;
    const angleBetweenSectorsUC = circumferenceUC / totalNumber;
    const resultYPosUC =
      this.factor *
      Math.cos((currentIndex + shiftFromCenter) * angleBetweenSectorsUC);
    const resultXPosShiftedUC = 1 - resultYPosUC;

    const radiusFactor = this.factor * this.radius * fraction;
    const resultXPosShifted = radiusFactor * resultXPosShiftedUC;
    return resultXPosShifted;
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
