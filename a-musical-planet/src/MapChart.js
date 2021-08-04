import React, { memo, useState, useEffect } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoMercator } from "d3-geo";

import "./Map.css";

const worldCountries = require("./WorldInfo.json");
// const europeCountries = require("./EuropeInfo.json");

const worldGeoSVG = require("./worldSVG.json");
// const europeGeoSVG = require("./EuropeInfo.json");

const locationInfo = {
  world: worldCountries,
  // europe: europeCountries,
};

const locationGeoSVG = {
  world: worldGeoSVG,
};

const borderWidth = 0.2;

const colors = {
  Asia: "#E5B961",
  Europe: "#D4A29C",
  Africa: "#EDCC8B",
  SouthAmerica: "#E8B298",
  NorthAmerica: "#C7877F",
  Oceania: "#7FC6A4",
  Water: "#BDD1C5",
  Russia: "#DDAE7F",
  Selected: "#FFAAFA",
};

function LightenDarkenColor(col, amt) {
  var usePound = false;

  if (!col) return "#000";

  if (col[0] === "#") {
    col = col.slice(1);
    usePound = true;
  }

  var num = parseInt(col, 16);

  var r = (num >> 16) + amt;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  var b = ((num >> 8) & 0x00ff) + amt;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  var g = (num & 0x0000ff) + amt;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
}

const MapChart = ({ setCurrChosen, currChosen, mapProps, currMap }) => {
  const renderStyle = (country) => {
    if (!country.area || country.area < 1500) return [{ fontSize: "0px" }, 0];
    let adjustedFont =
      country.area > 500000
        ? country.area / 800000 + 4.5
        : country.area / 800000 + 2.3;
    if (adjustedFont <= country.name.common.length) adjustedFont /= 1.3;

    if (country.name.common === "Russia" && currMap === "Europe")
      adjustedFont /= 2.5;
    //const rightOffset = adjustedFont;
    return [
      {
        fontSize: `${adjustedFont}px`,
        // stroke: "#FFF",
        // stroke: colors[country.CONTINENT],
        // strokeWidth: `${adjustedFont / 50}px`,
      },
      adjustedFont - 1,
    ];
  };

  const hoveredStyle = (color) => {
    return {
      fill: LightenDarkenColor(color, 15),
      stroke: "#000",
      strokeWidth: borderWidth,
      outline: "none",
    };
  };
  const selectedStyle = (color) => {
    return {
      fill: LightenDarkenColor(color, 40),
      stroke: "#000",
      strokeWidth: borderWidth,
      outline: "none",
    };
  };

  const [currPos, setCurrPos] = useState({
    zoom: mapProps.minZoom,
    coordinates: mapProps.coordinates,
  });
  const projection = geoMercator()
    .scale(mapProps.scale)
    .center(mapProps.center)
    .rotate(mapProps.rotate);

  //Uncomment this to make map reset after guess
  // useEffect(() => {
  //   setCurrPos({
  //     zoom: 1,
  //     coordinates: [0, 40],
  //   });
  // }, [currLocation]);

  return (
    <>
      <ComposableMap
        data-tip=""
        projection={projection}
        style={{
          width: "100%",
          height: "auto",
          outline: "none",
        }}
      >
        <ZoomableGroup
          translateExtent={mapProps.translateExtent}
          onMoveEnd={({ zoom, coordinates }) => {
            setCurrPos({
              zoom: zoom,
              coordinates: coordinates,
            });
          }}
          minZoom={mapProps.minZoom}
          maxZoom={mapProps.maxZoom}
          zoom={currPos.zoom}
          center={currPos.coordinates}
        >
          <Geographies geography={worldGeoSVG}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    setCurrChosen(geo.properties.NAME);
                  }}
                  visibility={
                    geo.properties.CONTINENT === "Antarctica"
                      ? "hidden"
                      : "visible"
                  }
                  style={{
                    default:
                      currChosen === geo.properties.NAME
                        ? selectedStyle(colors[geo.properties.CONTINENT])
                        : {
                            fill:
                              currMap === "World" ||
                              geo.properties.CONTINENT === currMap
                                ? colors[geo.properties.CONTINENT]
                                : "#ccc",
                            pointerEvents:
                              currMap === "World" ||
                              geo.properties.CONTINENT === currMap
                                ? "all"
                                : "none",
                            stroke: "#000000",
                            strokeWidth: borderWidth,
                            outline: "none",
                          },
                    hover:
                      currChosen === geo.properties.NAME
                        ? selectedStyle(colors[geo.properties.CONTINENT])
                        : hoveredStyle(colors[geo.properties.CONTINENT]),
                  }}
                />
              ))
            }
          </Geographies>
          {worldCountries.map((country) => {
            if (
              (currMap !== "World" && country.region !== currMap) ||
              country.area < 1500
            )
              return;
            const currStyle = renderStyle(country);
            return (
              <Marker
                coordinates={
                  country.name.common === "Russia" && currMap === "Europe"
                    ? [country.latlng[1] - 60, country.latlng[0] - 6]
                    : [country.latlng[1], country.latlng[0]]
                }
                fill="#000"
              >
                {currPos.zoom * 2 + currStyle[1] > 9 ? (
                  currStyle[1] > country.name.common.length ? (
                    <text
                      textAnchor="middle"
                      pointerEvents="none"
                      style={currStyle[0]}
                    >
                      {country.name.common}
                    </text>
                  ) : (
                    country.name.common.split(" ").map((word, index) => {
                      return (
                        <text
                          textRendering="optimizeSpeed"
                          textAnchor="middle"
                          pointerEvents="none"
                          y={(currStyle[1] / 1.3 + 1.3) * index}
                          style={currStyle[0]}
                        >
                          {word}
                        </text>
                      );
                    })
                  )
                ) : (
                  <></>
                )}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
