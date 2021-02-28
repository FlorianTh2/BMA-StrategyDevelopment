// http://bl.ocks.org/nbremer/6506614
// http://bl.ocks.org/tezzutezzu/c9d8706587e8f5b5d72084b083b502f8
// https://stackoverflow.com/a/42643557
//
// https://medium.com/analytics-vidhya/the-mathematics-behind-radar-charts-8a4cbc1f14ee
// https://de.wikipedia.org/wiki/Kreisbogen#:~:text=Der%20zu%20einem%20Kreissektor%20geh%C3%B6rende,den%20beiden%20Radien%20als%20Mittelpunktswinkel.
//  Kreisumfang/ Gesamtkreisbogen = 2*r*pi (unter Annahme, dass r=1 [wie im Einheitskreis] bleibt: = 2*pi)
// https://de.wikipedia.org/wiki/Einheitskreis
// https://de.wikipedia.org/wiki/Radiant_(Einheit)
//  1 Kreis = 2 pi = 260°
// https://www.lernhelfer.de/schuelerlexikon/mathematik/artikel/bogenmass
// https://de.wikipedia.org/wiki/Sinus_und_Kosinus
import * as d3 from "d3";

export const RadarChart = {
  draw: function (tag_id_to_attach_to, data, options) {
    var cfg = {
      shiftFromCenter: 0.5,
      radius: 5,
      w: 600,
      h: 600,
      factor: 1,
      factorLegend: 0.85,
      levels: 8,
      maxValue: 4,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 5,
      TranslateX: 80,
      TranslateY: 30,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color: d3.scaleOrdinal(d3.schemeCategory10)
      // ...options
    };

    // set maxValue to the actual max value in case it is higher than cfg.maxValue
    cfg.maxValue = data[0]["top-level-userPartialModel"].maxValue;

    // data = [data.map((a) => a["top-level-userPartialModel"])];

    // init svg
    console.log(data);
    var top_level_axis = data.map((a) => {
      return a["top-level-userPartialModel"].axis;
    });

    var sub_level_axis_tmp = data.map((a) => {
      return a["top-level-userPartialModel"]["sub-level-userPartialModel"].map(
        (b) => {
          return b.axis;
        }
      );
    });
    var sub_level_axis = [].concat(...sub_level_axis_tmp);

    var number_top_level_axis = top_level_axis.length;
    var number_sub_level_axis = sub_level_axis.length;

    var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
    var Format = d3.format(".1f");
    d3.select(tag_id_to_attach_to).select("svg").remove();

    // create svg
    var g = d3
      .select(tag_id_to_attach_to)
      .append("svg")
      .attr("width", cfg.w + cfg.ExtraWidthX)
      .attr("height", cfg.h + cfg.ExtraWidthY)
      .append("g")
      .attr(
        "transform",
        "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")"
      );

    // create "spider net"
    for (var j = 0; j < cfg.levels - 1; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data(sub_level_axis)
        .enter()
        .append("svg:line")
        // first x-point of the svg:line
        .attr("x1", function (data, i) {
          return (
            levelFactor *
            (1 -
              cfg.factor *
                Math.sin(
                  ((i + cfg.shiftFromCenter) * cfg.radians) /
                    number_sub_level_axis
                ))
          );
        })
        // first y-point of the svg:line
        .attr("y1", function (data, i) {
          return (
            levelFactor *
            (1 -
              cfg.factor *
                Math.cos(
                  ((i + cfg.shiftFromCenter) * cfg.radians) /
                    number_sub_level_axis
                ))
          );
        })
        // second x-point of the svg:line
        .attr("x2", function (data, i) {
          return (
            levelFactor *
            (1 -
              cfg.factor *
                Math.sin(
                  ((i + cfg.shiftFromCenter + 1) * cfg.radians) /
                    number_sub_level_axis
                ))
          );
        })
        // second y-point of the svg:line
        .attr("y2", function (data, i) {
          return (
            levelFactor *
            (1 -
              cfg.factor *
                Math.cos(
                  ((i + cfg.shiftFromCenter + 1) * cfg.radians) /
                    number_sub_level_axis
                ))
          );
        })
        .attr("class", "line")
        .style("stroke", "grey")
        .style("stroke-opacity", "0.75")
        .style("stroke-width", "0.3px")
        .attr(
          "transform",
          "translate(" +
            (cfg.w / 2 - levelFactor) +
            ", " +
            (cfg.h / 2 - levelFactor) +
            ")"
        );
    }

    // create vertical %-scale from core to top
    for (var j = 0; j < cfg.levels; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data([1]) //dummy data
        .enter()
        .append("svg:text")
        .attr("x", function (d) {
          return levelFactor * (1 - cfg.factor * Math.sin(0));
        })
        .attr("y", function (d) {
          return levelFactor * (1 - cfg.factor * Math.cos(0));
        })
        .attr("class", "legend")
        .style("font-family", "sans-serif")
        .style("font-size", "10px")
        .attr(
          "transform",
          "translate(" +
            (cfg.w / 2 - levelFactor + cfg.ToRight) +
            ", " +
            (cfg.h / 2 - levelFactor) +
            ")"
        )
        .attr("fill", "#737373")
        .text(Format(((j + 1) * cfg.maxValue) / cfg.levels));
    }

    // for top-level-partial-models create lines from core to outside based on setup
    var axis = g
      .selectAll(".axis")
      .data(top_level_axis)
      .enter()
      .append("g")
      .attr("class", "axis");
    axis
      .append("line")
      .attr("x1", cfg.w / 2)
      .attr("y1", cfg.h / 2)
      .attr("x2", function (d, i) {
        return (
          (cfg.w / 2) *
          (1 - cfg.factor * Math.sin((i * cfg.radians) / number_top_level_axis))
        );
      })
      .attr("y2", function (d, i) {
        return (
          (cfg.h / 2) *
          (1 - cfg.factor * Math.cos((i * cfg.radians) / number_top_level_axis))
        );
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "2px");

    // for sub-level-partial-models create lines from core to outside based on setup
    var axis2 = g
      .selectAll(".axis2")
      .data(sub_level_axis)
      .enter()
      .append("g")
      .attr("class", "axis2");
    axis2
      .append("line")
      .attr("x1", cfg.w / 2)
      .attr("y1", cfg.h / 2)
      .attr("x2", function (d, i) {
        return (
          (cfg.w / 2) *
          (1 -
            cfg.factor *
              Math.sin(
                ((i + cfg.shiftFromCenter) * cfg.radians) /
                  number_sub_level_axis
              ))
        );
      })
      .attr("y2", function (d, i) {
        return (
          (cfg.h / 2) *
          (1 -
            cfg.factor *
              Math.cos(
                ((i + cfg.shiftFromCenter) * cfg.radians) /
                  number_sub_level_axis
              ))
        );
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "0.5px");

    // create labels (next to the outside going lines) based on setup
    axis
      .append("text")
      .attr("class", "legend")
      .text(function (d) {
        return d;
      })
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.0em")
      .attr("transform", function (d, i) {
        return "translate(0, -10)";
      })
      // adjust x-position of diagram labels
      .attr("x", function (d, i) {
        return (
          (cfg.w / 2) *
            (1 -
              cfg.factorLegend *
                Math.sin((i * cfg.radians) / number_top_level_axis)) -
          80 * Math.sin((i * cfg.radians) / number_top_level_axis)
        );
      })
      // adjust y-position of diagram labels
      .attr("y", function (d, i) {
        return (
          (cfg.h / 2) *
            (1 - Math.cos((i * cfg.radians) / number_top_level_axis)) -
          20 * Math.cos((i * cfg.radians) / number_top_level_axis)
        );
      });

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // 2 main for-loops:
    //  1. draw data-"area"
    //  2. draw data-"area"-edge points (data area is there, but this will draw proper points at each edge)
    //
    //y = value of current element
    // x = index / number of current iteration
    // var data = [[3,4], [7,8]]
    //
    // data.forEach(function(y,x){
    // 	console.log(y, " ", x)
    // })
    // [3, 4], " ", 0
    // [7, 8], " ", 1
    var series = 0;
    var dataValues = [];
    g.selectAll(".nodes").data(data, function (j, i) {
      console.log(j["top-level-userPartialModel"]);
      dataValues.push([
        (cfg.w / 2) *
          (1 -
            (parseFloat(Math.max(j["top-level-userPartialModel"].value, 0)) /
              cfg.maxValue) *
              cfg.factor *
              Math.sin((i * cfg.radians) / number_top_level_axis)),
        (cfg.h / 2) *
          (1 -
            (parseFloat(Math.max(j["top-level-userPartialModel"].value, 0)) /
              cfg.maxValue) *
              cfg.factor *
              Math.cos((i * cfg.radians) / number_top_level_axis))
      ]);
    });
    dataValues.push(dataValues[0]);
    g.selectAll(".area")
      .data([dataValues])
      .enter()
      .append("polygon")
      .attr("class", "radar-chart-serie")
      .style("stroke-width", "2px")
      .style("stroke", cfg.color(0))
      .attr("points", function (d) {
        var str = "";
        for (var pti = 0; pti < d.length; pti++) {
          str = str + d[pti][0] + "," + d[pti][1] + " ";
        }
        return str;
      })
      .style("fill", function (j, i) {
        return cfg.color(0);
      })
      .style("fill-opacity", cfg.opacityArea)
      .on("mouseover", function (d) {
        var z = "polygon." + d3.select(this).attr("class");
        g.selectAll("polygon").transition(200).style("fill-opacity", 0.1);
        g.selectAll(z).transition(200).style("fill-opacity", 0.7);
      })
      .on("mouseout", function () {
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
      });

    // draw single edge-points for each datapoint (in data) and related things (e.g. tooltip)
    var tooltip;
    g.selectAll(".nodes")
      .data(data)
      .enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie")
      .attr("r", cfg.radius)
      .attr("alt", function (j) {
        return Math.max(j["top-level-userPartialModel"].value, 0);
      })
      .attr("cx", function (j, i) {
        var dataValues = [];
        dataValues.push([
          (cfg.w / 2) *
            (1 -
              (parseFloat(Math.max(j["top-level-userPartialModel"].value, 0)) /
                cfg.maxValue) *
                cfg.factor *
                Math.sin((i * cfg.radians) / number_top_level_axis)),
          (cfg.h / 2) *
            (1 -
              (parseFloat(Math.max(j["top-level-userPartialModel"].value, 0)) /
                cfg.maxValue) *
                cfg.factor *
                Math.cos((i * cfg.radians) / number_top_level_axis))
        ]);
        return (
          (cfg.w / 2) *
          (1 -
            (Math.max(j["top-level-userPartialModel"].value, 0) /
              cfg.maxValue) *
              cfg.factor *
              Math.sin((i * cfg.radians) / number_top_level_axis))
        );
      })
      .attr("cy", function (j, i) {
        return (
          (cfg.h / 2) *
          (1 -
            (Math.max(j["top-level-userPartialModel"].value, 0) /
              cfg.maxValue) *
              cfg.factor *
              Math.cos((i * cfg.radians) / number_top_level_axis))
        );
      })
      .attr("data-id", function (j) {
        return j["top-level-userPartialModel"].axis;
      })
      .style("fill", cfg.color(0))
      .style("fill-opacity", 0.9)
      .on("mouseover", function (d) {
        var newX = parseFloat(d3.select(this).attr("cx")) - 10;
        var newY = parseFloat(d3.select(this).attr("cy")) - 5;

        // create tooltip for datapoints (if you hover over them)
        tooltip
          .attr("x", newX)
          .attr("y", newY)
          .text(Format(d.value))
          .transition(200)
          .style("opacity", 0.5);

        var z = "polygon." + d3.select(this).attr("class");
        g.selectAll("polygon").transition(200).style("fill-opacity", 0.9);
        g.selectAll(z).transition(200).style("fill-opacity", 0.1);
      })
      .on("mouseout", function () {
        tooltip.transition(200).style("opacity", 0);
        g.selectAll("polygon")
          .transition(200)
          .style("fill-opacity", cfg.opacityArea);
      })
      .append("svg:title")
      .text(function (j) {
        return Math.max(j["top-level-userPartialModel"].value, 0);
      });

    // adjust tooltip for data-edge-points
    tooltip = g
      .append("text")
      .style("opacity", 0)
      .style("font-family", "sans-serif")
      .style("font-size", "23px");
  }
};
