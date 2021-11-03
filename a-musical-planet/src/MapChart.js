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

const MapPropsJSON = require("./MapProps.json");
// const europeGeoSVG = require("./EuropeInfo.json");

// const locationInfo = {
//   world: worldCountries,
//   // europe: europeCountries,
// };

// const locationGeoSVG = {
//   world: worldGeoSVG,
// };

const borderWidth = 0.3;

//Calculate color for country hover/active states
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

//Format country names, Saudi Arabia -> saudiArabia
const camelize = (word) => {
  return word[0].toLowerCase() + word.slice(1).replace(/ /g, "");
};

//Returns a boolean based on whether the current country's difficulty
//matches the selected map's difficulty. If this returns false,
//this country is not used for the game.
const checkDifficulty = (mapDifficulty, countryDifficulty) => {
  if (mapDifficulty === "Easy") return countryDifficulty === "Easy";
  if (mapDifficulty === "Medium")
    return countryDifficulty === "Easy" || countryDifficulty === "Medium";
  //for some reason this necessary, otherwise it returns true even if mapDifficulty is Easy
  if (mapDifficulty === "Hard") return true;
  return false;
};

//keep track of what countries fit the current map
let countriesToShow = [];

let currSelectedCountry = null;

const MapChart = ({ handleNewChosen, currMap, setPlayLoading }) => {

  const [loading, setLoading] = useState(true);

  const mapProps =
    currMap.slice(0, 5) === "world"
      ? MapPropsJSON.world
      : MapPropsJSON[currMap];

  //Set countriesToShow to the map's countries
  useEffect(() => {
    countriesToShow = [];
    currSelectedCountry = null;
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
    //Wait until the map is loaded (map is very heavy),
    //then clear the interval and show the map to the user
    var waitForMapLoad = setInterval(function () {
      if (document.querySelectorAll(".rsm-geography").length !== 0) {
        clearInterval(waitForMapLoad);
        setLoading(false);
        setPlayLoading(false);
      }
    }, 100);
    return () => clearInterval(waitForMapLoad);
  }, [currMap]);


  if (!loading) {
    const countries = document.querySelectorAll(".rsm-geography");
    for (const country of countries) {
      country.setAttribute(
        "style",
        countriesToShow.indexOf(country.id) >= 0
          ? `fill: ${
              colors[country.getAttribute("continent")]
            }; pointer-events: all; stroke: #1e75bd; stroke-width: ${borderWidth}; outline: none; visibility: visible;`
          : `fill: ${colors.empty}; pointer-events: none; stroke: #1e75bd; stroke-width: ${borderWidth}; outline: none; visibility: visible`
      );
      if(country.id === "antarctica") country.setAttribute("style", "display: none");
    }
  }

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

  const renderStyle = (area) => {
    let fontSize;
    if (area > 5000000) fontSize = 19;
    else if (area > 2500000) fontSize = 11;
    else if (area > 1000000) fontSize = 8;
    else if (area > 500000) fontSize = 6;
    else if (area > 300000) fontSize = 5.2;
    // if (area > 200000) return { fontSize: "4px" };
    else if (area > 100000) fontSize = 4.2;
    else fontSize = 3;

    if(currMap === "worldEasy") fontSize += 3.5;
    return { fontSize: fontSize + "px" };
  };

  const hoveredStyle = (color) => {
    return {
      fill: LightenDarkenColor(color, 15),
      outline: "none",
    };
  };
  const selectedStyle = (color) => {
    return {
      fill: LightenDarkenColor(color, 40),
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
    <div className="map">
      {loading ? <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div> : <></>}
      <ComposableMap
        data-tip=""
        projection={projection}
        style={{
          width: "100%",
          height: "100%",
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
            return (
              <Marker
                key={country.name.common}
                coordinates={
                  country.name.common === "Russia" && currMap === "europe"
                    ? [country.latlngAlt[1], country.latlngAlt[0]]
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
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);
