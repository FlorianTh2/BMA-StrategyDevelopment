// diagram sources
// https://www.visualcinnamon.com/2013/09/making-d3-radar-chart-look-bit-better/
// http://bl.ocks.org/nbremer/6506614
// http://bl.ocks.org/tezzutezzu/c9d8706587e8f5b5d72084b083b502f8
// https://stackoverflow.com/a/42643557
// https://github.com/alangrafu/radar-chart-d3/blob/ea5d63a9472086dbb9aa2d8cdf317d5177b731e9/src/radar-chart.js#L94
//
// d3.js basics
// g-Element: http://tutorials.jenkov.com/svg/g-element.html
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

import * as d3 from "d3";

export const RadarChart = {
  draw: function (tag_id_to_attach_to, data, options) {
    var cfg = {
      shiftFromCenter: 0.5,
      radius: 5,
      width: 600,
      height: 600,
      factor: 1,
      factorLegend: 0.85,
      levels: 8,
      maxValue: 4,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      toRight: 5,
      extraWidthX: 250,
      extraWidthY: 100,
      translateX: 100,
      translateY: 30,
      color: d3.scaleOrdinal(d3.schemeCategory10),
      ...options
    };

    // set maxValue to the actual max value in case it is higher than cfg.maxValue
    cfg.maxValue = data[0]["top-level-userPartialModel"].maxValue;

    // initial things for svg (delete possible created svg, createsvg, how many elements do we have, ...)
    var top_level_axis = data.map((a) => {
      return a["top-level-userPartialModel"].axis;
    });
    var sub_level_axis_tmp = data.map((a) => {
      return a["top-level-userPartialModel"]["sub-level-userPartialModel"].map(
        (b) => b.axis
      );
    });
    var sub_level_axis = [].concat(...sub_level_axis_tmp);
    var number_top_level_axis = top_level_axis.length;
    var number_sub_level_axis = sub_level_axis.length;
    var radius = cfg.factor * Math.min(cfg.width / 2, cfg.height / 2);
    var Format = d3.format(".1f");
    d3.select(tag_id_to_attach_to).select("svg").remove();

    // create svg and a g
    var g = d3
      .select(tag_id_to_attach_to)
      .append("svg")
      // extra width needed to create more space
      // (for additional things like labels which width isnt considers in the first place and so on)
      .attr("width", cfg.width + cfg.extraWidthX)
      .attr("height", cfg.height + cfg.extraWidthY)
      .append("g")
      // move g-element (which will have all elements attached) down + to right
      // to fill up the ExtraWidthX and ExtraWithY which is specified above
      .attr(
        "transform",
        "translate(" + cfg.translateX + "," + cfg.translateY + ")"
      );

    // create "spider net"
    // -1: dont render most outer circle
    for (var j = 0; j < cfg.levels; j++) {
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
                  // +1 since the endpoint of the line should be the startpoint of the next line
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
            (cfg.width / 2 - levelFactor) +
            ", " +
            (cfg.height / 2 - levelFactor) +
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
        .style("font-size", "12px")
        .attr(
          "transform",
          "translate(" +
            (cfg.width / 2 - levelFactor + cfg.toRight) +
            ", " +
            (cfg.height / 2 - levelFactor) +
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
      .attr("x1", cfg.width / 2)
      .attr("y1", cfg.height / 2)
      .attr("x2", function (d, i) {
        return (
          (cfg.width / 2) *
          (1 -
            cfg.factor *
              // to make top-level-partial-model-lines 1 level higher
              (1 + 1 / cfg.levels) *
              Math.sin((i * cfg.radians) / number_top_level_axis))
        );
      })
      .attr("y2", function (d, i) {
        return (
          (cfg.height / 2) *
          (1 -
            cfg.factor *
              // to make top-level-partial-model-lines 1 level higher
              (1 + 1 / cfg.levels) *
              Math.cos((i * cfg.radians) / number_top_level_axis))
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
      .attr("x1", cfg.width / 2)
      .attr("y1", cfg.height / 2)
      .attr("x2", function (d, i) {
        return (
          (cfg.width / 2) *
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
          (cfg.height / 2) *
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
      // adjust x-position of diagram labels
      // pay attention to the multiplier constants (80 and 50)
      .attr("x", function (d, i) {
        return (
          (cfg.width / 2) *
            (1 -
              cfg.factorLegend *
                Math.sin((i * cfg.radians) / number_top_level_axis)) -
          80 * Math.sin((i * cfg.radians) / number_top_level_axis)
        );
      })
      // adjust y-position of diagram labels
      .attr("y", function (d, i) {
        return (
          (cfg.height / 2) *
            (1 - Math.cos((i * cfg.radians) / number_top_level_axis)) -
          50 * Math.cos((i * cfg.radians) / number_top_level_axis)
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
    // calculate coordinates from data to be later drawn
    // j = element, i = index
    var dataValues = data.map((j, i) => [
      (cfg.width / 2) *
        (1 -
          (parseFloat(Math.max(j["top-level-userPartialModel"].value, 0)) /
            cfg.maxValue) *
            cfg.factor *
            Math.sin((i * cfg.radians) / number_top_level_axis)),
      (cfg.height / 2) *
        (1 -
          (parseFloat(Math.max(j["top-level-userPartialModel"].value, 0)) /
            cfg.maxValue) *
            cfg.factor *
            Math.cos((i * cfg.radians) / number_top_level_axis))
    ]);

    var dataValues2 = data.map((j, i) => [
      (cfg.width / 2) *
        (1 -
          (parseFloat(Math.max(j["top-level-userPartialModel"].value, 0)) /
            cfg.maxValue) *
            cfg.factor *
            Math.sin((i * cfg.radians) / number_top_level_axis)),
      (cfg.height / 2) *
        (1 -
          (parseFloat(Math.max(j["top-level-userPartialModel"].value, 0)) /
            cfg.maxValue) *
            cfg.factor *
            Math.cos((i * cfg.radians) / number_top_level_axis))
    ]);

    // ["sub-level-userPartialModel"]

    // draw data-"area" from coordinates
    g.selectAll(".area")
      .data([dataValues])
      .enter()
      .append("polygon")
      .attr("class", "radar-chart-serie")
      .style("stroke-width", "px")
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
    // since edgepoints have hover-effect (open tooltip) we have to init tooltip at first
    var tooltip = g
      .append("text")
      .style("opacity", 1)
      .style("font-size", "23px");

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
        return (
          (cfg.width / 2) *
          (1 -
            (Math.max(j["top-level-userPartialModel"].value, 0) /
              cfg.maxValue) *
              cfg.factor *
              Math.sin((i * cfg.radians) / number_top_level_axis))
        );
      })
      .attr("cy", function (j, i) {
        return (
          (cfg.height / 2) *
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
      // start tooltip effect creation
      // d is mouseover-event
      .on("mouseover", function (d) {
        var newX = parseFloat(d3.select(this).attr("cx")) - 10;
        var newY = parseFloat(d3.select(this).attr("cy")) - 5;

        // console.log("here33");
        // console.log(d);
        // create tooltip for datapoints (if you hover over them)
        tooltip
          .attr("x", newX)
          .attr("y", newY)
          // result currently: NaN, why this should be possible on mouseoverevent: idk
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
      });
  }
};
