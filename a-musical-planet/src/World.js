import React, { useEffect } from "react";
import * as topojson from "topojson";
import * as d3 from "d3";
import "./World.scss";
import WorldLowQuality from "./WorldLowQuality";
import { useHistory } from "react-router";

const World = () => {
    const history = useHistory();
    let projection = d3
        .geoOrthographic()
        .scale(200)
        .translate([400 / 2, 400 / 2])
        .clipAngle(90);

    var path = d3.geoPath().projection(projection);

    var λ = d3.scaleLinear().domain([0, 400]).range([-180, 180]);

    var φ = d3.scaleLinear().domain([0, 400]).range([90, -90]);

    let worldsvg;

    useEffect(() => {
        worldsvg = d3.select("#worldsvg");
        worldsvg
            .append("path")
            .datum(topojson.feature(WorldLowQuality, WorldLowQuality.objects.land))
            .attr("class", "land")
            .attr("d", path);
  }, []);

    var scrollSpeed = 50;
    var current = 0;
    function bgscroll() {
        if(!worldsvg) return;
        current += 1;
        projection.rotate([λ(current), 0]);
        worldsvg.selectAll("path").attr("d", path);
    }

    setInterval(bgscroll, scrollSpeed);
    
    return (
    <div id="worldsvgDiv">
        <svg id="worldsvg" viewBox="0 0 400 400"></svg>
    </div>
    )
};

export default World;
