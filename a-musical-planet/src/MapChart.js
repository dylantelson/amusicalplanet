import React, { memo, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoMercator } from "d3-geo";

import "./Map.css";

const countries = require("./countriesInfo.json");

const geoSVG = require("./countriesSVG.json");

const rounded = (num) => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const borderWidth = 0.2;

const colors = {
  Asia: "#E5B961",
  Europe: "#D4A29C",
  Africa: "#EDCC8B",
  SouthAmerica: "#E8B298",
  //NorthAmerica: "#A26360",
  NorthAmerica: "#C7877F",
  Oceania: "#7FC6A4",
  Water: "#BDD1C5",
  Russia: "#DDAE7F",
  Selected: "#FFAAFA",
};

function LightenDarkenColor(col, amt) {
  var usePound = false;

  if (!col) return "#000";

  if (col[0] == "#") {
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

const MapChart = (props) => {
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

  const [currPos, setCurrPos] = useState({ zoom: 1, coordinates: [0, 0] });
  const renderStyle = (country) => {
    if (!country.area) return [{ fontSize: "0px" }, 0];
    let adjustedFont =
      country.area > 500000
        ? country.area / 800000 + 3.5
        : country.area / 800000 + 1.3;
    adjustedFont += 1;
    if (adjustedFont <= country.name.length) adjustedFont = adjustedFont / 1.3;
    //const rightOffset = adjustedFont;
    return [
      {
        fontSize: `${adjustedFont}px`,
        //stroke: "#FFF",
        stroke: colors[country.CONTINENT],
        strokeWidth: `${adjustedFont / 50}px`,
      },
      adjustedFont - 1,
    ];
  };
  const projection = geoMercator().scale(153).center([40, 50]);

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
        <rect width="100%" height="100%" style={{ fill: colors.Water }}></rect>
        <ZoomableGroup
          translateExtent={[
            [-100, -50],
            [860, 600],
          ]}
          onMoveEnd={({ zoom, coordinates }) => {
            setCurrPos({
              zoom: zoom,
              coordinates: coordinates,
            });
          }}
          maxZoom={6}
          zoom={currPos.zoom}
          center={currPos.coordinates}
        >
          <Geographies geography={geoSVG}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    props.setCurrChosen(geo.properties.NAME);
                  }}
                  visibility={
                    geo.properties.CONTINENT === "Antarctica"
                      ? "hidden"
                      : "visible"
                  }
                  style={{
                    default:
                      props.currChosen === geo.properties.NAME
                        ? selectedStyle(colors[geo.properties.CONTINENT])
                        : {
                            fill: colors[geo.properties.CONTINENT],
                            stroke: "#000000",
                            strokeWidth: borderWidth,
                            outline: "none",
                          },
                    hover:
                      props.currChosen === geo.properties.NAME
                        ? selectedStyle(colors[geo.properties.CONTINENT])
                        : hoveredStyle(colors[geo.properties.CONTINENT]),
                  }}
                />
              ))
            }
          </Geographies>
          {countries.map((country) => {
            return (
              <Marker
                coordinates={[country.latlng[1], country.latlng[0]]}
                fill="#000"
              >
                {currPos.zoom * 2 + renderStyle(country)[1] > 9 ? (
                  renderStyle(country)[1] > country.name.length ? (
                    <text
                      textAnchor="middle"
                      pointerEvents="none"
                      style={renderStyle(country)[0]}
                    >
                      {country.name}
                    </text>
                  ) : (
                    country.name.split(" ").map((word, index) => {
                      return (
                        <text
                          textAnchor="middle"
                          pointerEvents="none"
                          y={(renderStyle(country)[1] / 1.3 + 1.3) * index}
                          style={renderStyle(country)[0]}
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
