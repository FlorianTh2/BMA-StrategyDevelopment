// http://bl.ocks.org/nbremer/6506614
import * as d3 from "d3";

export const RadarChart = {
  draw: function (tag_id_to_attach_to, data, options) {
    var cfg = {
      radius: 5,
      w: 600,
      h: 600,
      factor: 1,
      factorLegend: 0.85,
      levels: 3,
      maxValue: 0,
      radians: 2 * Math.PI,
      opacityArea: 0.5,
      ToRight: 5,
      TranslateX: 80,
      TranslateY: 30,
      ExtraWidthX: 100,
      ExtraWidthY: 100,
      color: d3.scaleOrdinal(d3.schemeCategory10),
      ...options
    };

    // set maxValue to the actual max value in case it is higher than cfg.maxValue
    cfg.maxValue = data[0]["top-level-userPartialModel"].maxValue;

    data = [data.map((a) => a["top-level-userPartialModel"])];

    // init svg
    var allAxis = data[0].map(function (i, j) {
      return i.axis;
    });
    var total = allAxis.length;
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
    var tooltip;

    // create circular segments
    for (var j = 0; j < cfg.levels - 1; j++) {
      var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
      g.selectAll(".levels")
        .data(allAxis)
        .enter()
        .append("svg:line")
        .attr("x1", function (data, i) {
          return (
            levelFactor * (1 - cfg.factor * Math.sin((i * cfg.radians) / total))
          );
        })
        .attr("y1", function (data, i) {
          return (
            levelFactor * (1 - cfg.factor * Math.cos((i * cfg.radians) / total))
          );
        })
        .attr("x2", function (data, i) {
          return (
            levelFactor *
            (1 - cfg.factor * Math.sin(((i + 1) * cfg.radians) / total))
          );
        })
        .attr("y2", function (data, i) {
          return (
            levelFactor *
            (1 - cfg.factor * Math.cos(((i + 1) * cfg.radians) / total))
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

    // create setup for following
    var series = 0;
    var axis = g
      .selectAll(".axis")
      .data(allAxis)
      .enter()
      .append("g")
      .attr("class", "axis");

    // create lines from core to outside based on setup
    axis
      .append("line")
      .attr("x1", cfg.w / 2)
      .attr("y1", cfg.h / 2)
      .attr("x2", function (d, i) {
        return (
          (cfg.w / 2) * (1 - cfg.factor * Math.sin((i * cfg.radians) / total))
        );
      })
      .attr("y2", function (d, i) {
        return (
          (cfg.h / 2) * (1 - cfg.factor * Math.cos((i * cfg.radians) / total))
        );
      })
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

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
      .attr("dy", "1.5em")
      .attr("transform", function (d, i) {
        return "translate(0, -10)";
      })
      .attr("x", function (d, i) {
        return (
          (cfg.w / 2) *
            (1 - cfg.factorLegend * Math.sin((i * cfg.radians) / total)) -
          60 * Math.sin((i * cfg.radians) / total)
        );
      })
      .attr("y", function (d, i) {
        return (
          (cfg.h / 2) * (1 - Math.cos((i * cfg.radians) / total)) -
          20 * Math.cos((i * cfg.radians) / total)
        );
      });

    // forloop: 1. section: place datapoints in chart
    // forloop: 2. section: draw data-area (constraint by datapoints)
    //              (!= draw datapoints -> this edges will get print later)
    //              (this belongs only to the "area")
    data.forEach(function (y, x) {
      var dataValues = [];
      g.selectAll(".nodes").data(y, function (j, i) {
        dataValues.push([
          (cfg.w / 2) *
            (1 -
              (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                cfg.factor *
                Math.sin((i * cfg.radians) / total)),
          (cfg.h / 2) *
            (1 -
              (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                cfg.factor *
                Math.cos((i * cfg.radians) / total))
        ]);
      });
      dataValues.push(dataValues[0]);
      g.selectAll(".area")
        .data([dataValues])
        .enter()
        .append("polygon")
        .attr("class", "radar-chart-serie" + series)
        .style("stroke-width", "2px")
        .style("stroke", cfg.color(series))
        .attr("points", function (d) {
          var str = "";
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + "," + d[pti][1] + " ";
          }
          return str;
        })
        .style("fill", function (j, i) {
          return cfg.color(series);
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
      series++;
    });

    // draw single points for each datapoint (in data) and related things (e.g. tooltip)
    series = 0;
    data.forEach(function (y, x) {
      g.selectAll(".nodes")
        .data(y)
        .enter()
        .append("svg:circle")
        .attr("class", "radar-chart-serie" + series)
        .attr("r", cfg.radius)
        .attr("alt", function (j) {
          return Math.max(j.value, 0);
        })
        .attr("cx", function (j, i) {
          var dataValues = [];
          dataValues.push([
            (cfg.w / 2) *
              (1 -
                (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                  cfg.factor *
                  Math.sin((i * cfg.radians) / total)),
            (cfg.h / 2) *
              (1 -
                (parseFloat(Math.max(j.value, 0)) / cfg.maxValue) *
                  cfg.factor *
                  Math.cos((i * cfg.radians) / total))
          ]);
          return (
            (cfg.w / 2) *
            (1 -
              (Math.max(j.value, 0) / cfg.maxValue) *
                cfg.factor *
                Math.sin((i * cfg.radians) / total))
          );
        })
        .attr("cy", function (j, i) {
          return (
            (cfg.h / 2) *
            (1 -
              (Math.max(j.value, 0) / cfg.maxValue) *
                cfg.factor *
                Math.cos((i * cfg.radians) / total))
          );
        })
        .attr("data-id", function (j) {
          return j.axis;
        })
        .style("fill", cfg.color(series))
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
          return Math.max(j.value, 0);
        });
      series++;
    });

    // adjust tooltip for data-edge-points
    tooltip = g
      .append("text")
      .style("opacity", 0)
      .style("font-family", "sans-serif")
      .style("font-size", "23px");
  }
};
