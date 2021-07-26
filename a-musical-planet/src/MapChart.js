import React, { memo, useState } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoMercator } from "d3-geo";

const countries = require("./countries.json");

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const rounded = (num) => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const MapChart = (props) => {
  const [currPos, setCurrPos] = useState({ zoom: 1, coordinates: [0, 0] });
  const renderStyle = (country) => {
    if (!country.area) return [{ fontSize: "0px" }, 0];
    const adjustedFont =
      country.area > 500000
        ? country.area / 800000 + 3.5
        : country.area / 800000 + 1.3;
    const rightOffset = adjustedFont - 1;
    return [
      {
        textAlign: "center",
        fontSize: `${adjustedFont}px`,
        width: `${adjustedFont * 70}px`,
      },
      rightOffset,
    ];
  };

  console.log("coords", currPos.coordinates);
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
        <ZoomableGroup
          translateExtent={[
            [-100, -50],
            [860, 600],
          ]}
          onMoveEnd={(props) => {
            setCurrPos({
              zoom: props.zoom,
              coordinates: props.coordinates,
            });
          }}
          maxZoom={12}
          zoom={currPos.zoom}
          center={currPos.coordinates}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => {
                    props.setCurrChosen(geo.properties.NAME);
                  }}
                  onMouseEnter={() => {
                    props.setTooltipContent(geo.properties.NAME);
                  }}
                  onMouseLeave={() => {
                    props.setTooltipContent("");
                  }}
                  style={{
                    default: {
                      fill: "#D6D6DA",
                      stroke: "#000000",
                      strokeWidth: 0.1,
                      outline: "none",
                    },
                    hover: {
                      fill: "#F53",
                      stroke: "#000000",
                      strokeWidth: 0.1,
                      outline: "none",
                    },
                    pressed: {
                      fill: "#E42",
                      stroke: "#000000",
                      strokeWidth: 0.1,
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
          {countries.map((country) => {
            return (
              <Marker
                coordinates={[
                  country.latlng[1] - renderStyle(country)[1],
                  country.latlng[0],
                ]}
                fill="#777"
              >
                {currPos.zoom * 2 + renderStyle(country)[1] > 9 ? (
                  <text style={renderStyle(country)[0]}>{country.name}</text>
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
