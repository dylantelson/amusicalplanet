import React, { memo, useState, useEffect } from "react";
import {
  ZoomableGroup,
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { geoMercator } from "d3-geo";

import Playlists from "./Playlists";
import "./Map.css";

const worldCountries = require("./WorldInfo.json");
// const europeCountries = require("./EuropeInfo.json");

const worldGeoSVG = require("./WorldSVG50m.json");
const colors = require("./colors.json");
// const europeGeoSVG = require("./EuropeInfo.json");

// const locationInfo = {
//   world: worldCountries,
//   // europe: europeCountries,
// };

// const locationGeoSVG = {
//   world: worldGeoSVG,
// };

const borderWidth = 0.2;

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

const camelize = (word) => {
  return word[0].toLowerCase() + word.slice(1).replaceAll(" ", "");
};

const checkDifficulty = (mapDifficulty, countryDifficulty) => {
  if (mapDifficulty === "Easy") return countryDifficulty === "Easy";
  if (mapDifficulty === "Medium")
    return countryDifficulty === "Easy" || countryDifficulty === "Medium";
  //for some reason this necessary, otherwise it returns true even if mapDifficulty is Easy
  if (mapDifficulty === "Hard") return true;
  return false;
};

let countriesToShow = [];
let currSelectedCountry = null;
const MapChart = ({ handleNewChosen, mapProps, currMap }) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    countriesToShow = [];
    let currSelectedCountry = null;
    if (currMap.slice(0, 5) === "world") {
      for (const playlist of Playlists.world) {
        if (checkDifficulty(currMap.slice(5), playlist.difficulty))
          countriesToShow.push(camelize(playlist.country));
      }
    } else {
      for (const playlist of Playlists[currMap]) {
        countriesToShow.push(camelize(playlist.country));
      }
    }
    console.log(countriesToShow);
    var waitForMapLoad = setInterval(function () {
      if (document.querySelectorAll(".rsm-geography").length !== 0) {
        clearInterval(waitForMapLoad);
        setLoading(false);
      }
    }, 500);
  }, [currMap]);

  if (!loading) {
    const countries = document.querySelectorAll(".rsm-geography");
    for (const country of countries) {
      country.setAttribute(
        "style",
        countriesToShow.indexOf(country.id) >= 0
          ? `fill: ${
              colors[country.getAttribute("continent")]
            }; pointer-events: all; stroke: #000000; stroke-width: ${borderWidth}; outline: none; visibility: visible;`
          : `fill: #ccc; pointer-events: none; stroke: #000000; stroke-width: ${borderWidth}; outline: none; visibility: visible`
      );
    }
  }

  // style={{
  //                       currSelectedCountry &&
  //                       currSelectedCountry.element.id ===
  //                         geo.properties.NAME.replaceAll(" ", "")
  //                         ? selectedStyle(colors[geo.properties.CONTINENT])
  //                         : countriesToShow.indexOf(geo.properties.NAME) >= 0
  //                         ? {
  //                             fill: colors[geo.properties.CONTINENT],
  //                             pointerEvents: "all",
  //                             stroke: "#000000",
  //                             strokeWidth: borderWidth,
  //                             outline: "none",
  //                           }
  //                         : {
  //                             fill: "#ccc",
  //                             pointerEvents: "none",
  //                             stroke: "#000000",
  //                             strokeWidth: borderWidth,
  //                             outline: "none",
  //                           },
  //                     hover:
  //                       currSelectedCountry &&
  //                       currSelectedCountry.element.id ===
  //                         geo.properties.NAME.replaceAll(" ", "")
  //                         ? selectedStyle(colors[geo.properties.CONTINENT])
  //                         : hoveredStyle(colors[geo.properties.CONTINENT]),
  //                   }}

  const setPressedStyle = (country, event) => {
    if (currSelectedCountry) {
      //if user clicked on already selected country, return
      if (event.target.classList.contains("pressed")) return;
      if (!(currSelectedCountry.element.id === event.target.id)) {
        const prevCountry = document.querySelector(
          `#${currSelectedCountry.element.id}`
        );
        prevCountry.style.fill = colors[currSelectedCountry.props.CONTINENT];
        prevCountry.classList.remove("pressed");
      }
    }
    currSelectedCountry = { element: event.target, props: country };
    event.target.style.fill = selectedStyle(colors[country.CONTINENT]).fill;
    event.target.classList.add("pressed");
  };

  // const clearPressedStyle = () => {
  //   if (currSelectedCountry) {
  //     document.querySelector(`#${currSelectedCountry.element.id}`).style.fill =
  //       colors[currSelectedCountry.props.CONTINENT];
  //     currSelectedCountry = null;
  //   }
  // };

  // const renderStyle = (country) => {
  //   if (!country.area || country.area < 1500) return [{ fontSize: "0px" }, 0];
  //   let adjustedFont =
  //     country.area > 500000
  //       ? country.area / 800000 + 4.5
  //       : country.area / 800000 + 2.3;
  //   if (adjustedFont <= country.name.common.length) adjustedFont /= 1.3;

  //   if (country.name.common === "Russia" && currMap === "europe")
  //     adjustedFont /= 2.5;
  //   //const rightOffset = adjustedFont;
  //   return [
  //     {
  //       fontSize: `${adjustedFont}px`,
  //       // stroke: "#FFF",
  //       // stroke: colors[country.CONTINENT],
  //       // strokeWidth: `${adjustedFont / 50}px`,
  //     },
  //     adjustedFont - 1,
  //   ];
  // };

  const renderStyle = (area) => {
    if (area > 5000000) return { fontSize: "20px" };
    if (area > 2500000) return { fontSize: "12px" };
    if (area > 1000000) return { fontSize: "9px" };
    if (area > 500000) return { fontSize: "7px" };
    if (area > 300000) return { fontSize: "5px" };
    if (area > 200000) return { fontSize: "4px" };
    if (area > 100000) return { fontSize: "3px" };
    return { fontSize: "2px" };
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

  // const [currPos, setCurrPos] = useState({
  //   zoom: mapProps.minZoom,
  //   coordinates: mapProps.coordinates,
  // });
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
      {loading ? <h1 class="mapLoading">Loading...</h1> : <></>}
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
          minZoom={mapProps.minZoom}
          maxZoom={mapProps.maxZoom}
          zoom={mapProps.minZoom}
          center={mapProps.coordinates}
        >
          <Geographies geography={worldGeoSVG}>
            {({ geographies }) =>
              geographies.map((geo) => {
                return (
                  <Geography
                    id={camelize(geo.properties.NAME)}
                    continent={geo.properties.CONTINENT}
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={(event) => {
                      setPressedStyle(geo.properties, event);
                      handleNewChosen(geo.properties.NAME);
                    }}
                    onMouseEnter={(event) => {
                      if (
                        !currSelectedCountry ||
                        currSelectedCountry.element.id !== event.target.id ||
                        !currSelectedCountry.element.classList.contains(
                          "pressed"
                        )
                      ) {
                        event.target.style.fill = hoveredStyle(
                          colors[event.target.getAttribute("continent")]
                        ).fill;
                      }
                    }}
                    onMouseLeave={(event) => {
                      if (
                        currSelectedCountry &&
                        currSelectedCountry.element.id === event.target.id &&
                        currSelectedCountry.element.classList.contains(
                          "pressed"
                        )
                      ) {
                        event.target.style.fill = selectedStyle(
                          colors[event.target.getAttribute("continent")]
                        ).fill;
                      } else {
                        event.target.style.fill =
                          colors[event.target.getAttribute("continent")];
                      }
                    }}
                    visibility={"hidden"}
                  />
                );
              })
            }
          </Geographies>
          {worldCountries.map((country) => {
            if (
              loading ||
              countriesToShow.indexOf(camelize(country.name.common)) < 0
            )
              return null;
            // const currStyle = renderStyle(country);
            return (
              <Marker
                key={country.name.common}
                coordinates={
                  country.name.common === "Russia" && currMap === "europe"
                    ? [country.latlng[1] - 60, country.latlng[0] - 6]
                    : [country.latlng[1], country.latlng[0]]
                }
                fill="#000"
              >
                <text
                  textAnchor="middle"
                  pointerEvents="none"
                  style={renderStyle(country.area)}
                >
                  {country.name.common}
                </text>
                {/* {currPos.zoom * 2 + currStyle[1] > 9 ? (
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
                          key={word + index}
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
                )} */}
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </>
  );
};

export default memo(MapChart);
