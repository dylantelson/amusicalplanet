import React, { useEffect } from "react";
import * as topojson from "topojson";
import * as d3 from "d3";
import "./World.scss";
import WorldLowQuality from "./WorldLowQuality";

const World = () => {
    let projection = d3
        .geoOrthographic()
        .scale(200)
        .translate([400 / 2, 400 / 2])
        .clipAngle(90);

    var path = d3.geoPath().projection(projection);

    var λ = d3.scaleLinear().domain([0, 400]).range([-180, 180]);

    let worldsvg;

    //cap at 30fps
    const framesPerAnimate = 1000/30;
    let lastRenderedFrameTime;


    useEffect(() => {
        worldsvg = d3.select("#worldsvg");
        worldsvg
            .append("path")
            .datum(topojson.feature(WorldLowQuality, WorldLowQuality.objects.land))
            .attr("class", "land")
            .attr("d", path);

        lastRenderedFrameTime = window.performance.now();
        rotateWorld();
  }, []);



    var curr = 0;
    // const rotate = () => {
    //     if(!worldsvg) return;
    //     curr += 1;
    //     projection.rotate([λ(curr), 0]);
    //     worldsvg.selectAll("path").attr("d", path);
    // }

    const rotateWorld = () => {
        // if(!worldsvg) return;
        window.requestAnimationFrame(rotateWorld);

        const currTime = window.performance.now();
        const timeElapsed = currTime - lastRenderedFrameTime;

        if(timeElapsed > framesPerAnimate) {
            lastRenderedFrameTime = currTime - (timeElapsed % framesPerAnimate);
            curr += 1;
            projection.rotate([λ(curr), 0]);
            worldsvg.selectAll("path").attr("d", path);
        }

    }

    // setInterval(rotate, rotateSpeed);
    
    return (
    <div id="worldsvgDiv">
        <svg id="worldsvg" viewBox="0 0 400 400"></svg>
    </div>
    )
};

export default World;
