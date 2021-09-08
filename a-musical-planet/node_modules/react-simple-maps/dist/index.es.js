import React, { createContext, useMemo, useCallback, useContext, useState, useEffect, memo, useRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import * as d3Geo from 'd3-geo';
import { geoPath as geoPath$1, geoGraticule } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import { zoom, zoomIdentity } from 'd3-zoom';
import { select } from 'd3-selection';

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var objectWithoutProperties = function (obj, keys) {
  var target = {};

  for (var i in obj) {
    if (keys.indexOf(i) >= 0) continue;
    if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
    target[i] = obj[i];
  }

  return target;
};

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var geoPath = geoPath$1,
    projections = objectWithoutProperties(d3Geo, ["geoPath"]);


var MapContext = createContext();

var makeProjection = function makeProjection(_ref) {
  var _ref$projectionConfig = _ref.projectionConfig,
      projectionConfig = _ref$projectionConfig === undefined ? {} : _ref$projectionConfig,
      _ref$projection = _ref.projection,
      projection = _ref$projection === undefined ? "geoEqualEarth" : _ref$projection,
      _ref$width = _ref.width,
      width = _ref$width === undefined ? 800 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 600 : _ref$height;

  var isFunc = typeof projection === "function";

  if (isFunc) return projection;

  var proj = projections[projection]().translate([width / 2, height / 2]);

  var supported = [proj.center ? "center" : null, proj.rotate ? "rotate" : null, proj.scale ? "scale" : null, proj.parallels ? "parallels" : null];

  supported.forEach(function (d) {
    if (!d) return;
    proj = proj[d](projectionConfig[d] || proj[d]());
  });

  return proj;
};

var MapProvider = function MapProvider(_ref2) {
  var width = _ref2.width,
      height = _ref2.height,
      projection = _ref2.projection,
      projectionConfig = _ref2.projectionConfig,
      restProps = objectWithoutProperties(_ref2, ["width", "height", "projection", "projectionConfig"]);

  var _ref3 = projectionConfig.center || [],
      _ref4 = slicedToArray(_ref3, 2),
      cx = _ref4[0],
      cy = _ref4[1];

  var _ref5 = projectionConfig.rotate || [],
      _ref6 = slicedToArray(_ref5, 3),
      rx = _ref6[0],
      ry = _ref6[1],
      rz = _ref6[2];

  var _ref7 = projectionConfig.parallels || [],
      _ref8 = slicedToArray(_ref7, 2),
      p1 = _ref8[0],
      p2 = _ref8[1];

  var s = projectionConfig.scale || null;

  var projMemo = useMemo(function () {
    return makeProjection({
      projectionConfig: {
        center: cx || cx === 0 || cy || cy === 0 ? [cx, cy] : null,
        rotate: rx || rx === 0 || ry || ry === 0 ? [rx, ry, rz] : null,
        parallels: p1 || p1 === 0 || p2 || p2 === 0 ? [p1, p2] : null,
        scale: s
      },
      projection: projection,
      width: width,
      height: height
    });
  }, [width, height, projection, cx, cy, rx, ry, rz, p1, p2, s]);

  var proj = useCallback(projMemo, [projMemo]);

  var value = useMemo(function () {
    return {
      width: width,
      height: height,
      projection: proj,
      path: geoPath().projection(proj)
    };
  }, [width, height, proj]);

  return React.createElement(MapContext.Provider, _extends({ value: value }, restProps));
};

MapProvider.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  projection: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  projectionConfig: PropTypes.object
};

var ComposableMap = function ComposableMap(_ref) {
  var _ref$width = _ref.width,
      width = _ref$width === undefined ? 800 : _ref$width,
      _ref$height = _ref.height,
      height = _ref$height === undefined ? 600 : _ref$height,
      _ref$projection = _ref.projection,
      projection = _ref$projection === undefined ? "geoEqualEarth" : _ref$projection,
      _ref$projectionConfig = _ref.projectionConfig,
      projectionConfig = _ref$projectionConfig === undefined ? {} : _ref$projectionConfig,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      restProps = objectWithoutProperties(_ref, ["width", "height", "projection", "projectionConfig", "className"]);

  return React.createElement(
    MapProvider,
    {
      width: width,
      height: height,
      projection: projection,
      projectionConfig: projectionConfig
    },
    React.createElement("svg", _extends({
      viewBox: "0 0 " + width + " " + height,
      className: "rsm-svg " + className
    }, restProps))
  );
};

ComposableMap.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  projection: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  projectionConfig: PropTypes.object,
  className: PropTypes.string
};

function getCoords(w, h, t) {
  var xOffset = (w * t.k - w) / 2;
  var yOffset = (h * t.k - h) / 2;
  return [w / 2 - (xOffset + t.x) / t.k, h / 2 - (yOffset + t.y) / t.k];
}

function fetchGeographies(url) {
  return fetch(url).then(function (res) {
    if (!res.ok) {
      throw Error(res.statusText);
    }
    return res.json();
  }).catch(function (error) {
    console.log("There was a problem when fetching the data: ", error);
  });
}

function getFeatures(geographies, parseGeographies) {
  var isTopojson = geographies.type === "Topology";
  if (!isTopojson) {
    return parseGeographies ? parseGeographies(geographies.features || geographies) : geographies.features || geographies;
  }
  var feats = feature(geographies, geographies.objects[Object.keys(geographies.objects)[0]]).features;
  return parseGeographies ? parseGeographies(feats) : feats;
}

function getMesh(geographies) {
  var isTopojson = geographies.type === "Topology";
  if (!isTopojson) return null;
  var outline = mesh(geographies, geographies.objects[Object.keys(geographies.objects)[0]], function (a, b) {
    return a === b;
  });
  var borders = mesh(geographies, geographies.objects[Object.keys(geographies.objects)[0]], function (a, b) {
    return a !== b;
  });
  return { outline: outline, borders: borders };
}

function prepareMesh(outline, borders, path) {
  return outline && borders ? {
    outline: _extends({}, outline, { rsmKey: "outline", svgPath: path(outline) }),
    borders: _extends({}, borders, { rsmKey: "borders", svgPath: path(borders) })
  } : {};
}

function prepareFeatures(geographies, path) {
  return geographies ? geographies.map(function (d, i) {
    return _extends({}, d, {
      rsmKey: "geo-" + i,
      svgPath: path(d)
    });
  }) : [];
}

function createConnectorPath() {
  var dx = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 30;
  var dy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 30;
  var curve = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;

  var curvature = Array.isArray(curve) ? curve : [curve, curve];
  var curveX = dx / 2 * curvature[0];
  var curveY = dy / 2 * curvature[1];
  return "M" + 0 + "," + 0 + " Q" + (-dx / 2 - curveX) + "," + (-dy / 2 + curveY) + " " + -dx + "," + -dy;
}

function isString(geo) {
  return typeof geo === "string";
}

function useGeographies(_ref) {
  var geography = _ref.geography,
      parseGeographies = _ref.parseGeographies;

  var _useContext = useContext(MapContext),
      path = _useContext.path;

  var _useState = useState({}),
      _useState2 = slicedToArray(_useState, 2),
      output = _useState2[0],
      setOutput = _useState2[1];

  useEffect(function () {
    if (typeof window === "undefined") return;

    if (!geography) return;

    if (isString(geography)) {
      fetchGeographies(geography).then(function (geos) {
        if (geos) {
          setOutput({
            geographies: getFeatures(geos, parseGeographies),
            mesh: getMesh(geos)
          });
        }
      });
    } else {
      setOutput({
        geographies: getFeatures(geography, parseGeographies),
        mesh: getMesh(geography)
      });
    }
  }, [geography, parseGeographies]);

  var _useMemo = useMemo(function () {
    var mesh = output.mesh || {};
    var preparedMesh = prepareMesh(mesh.outline, mesh.borders, path);
    return {
      geographies: prepareFeatures(output.geographies, path),
      outline: preparedMesh.outline,
      borders: preparedMesh.borders
    };
  }, [output, path]),
      geographies = _useMemo.geographies,
      outline = _useMemo.outline,
      borders = _useMemo.borders;

  return { geographies: geographies, outline: outline, borders: borders };
}

var Geographies = function Geographies(_ref) {
  var geography = _ref.geography,
      children = _ref.children,
      parseGeographies = _ref.parseGeographies,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      restProps = objectWithoutProperties(_ref, ["geography", "children", "parseGeographies", "className"]);

  var _useContext = useContext(MapContext),
      path = _useContext.path,
      projection = _useContext.projection;

  var _useGeographies = useGeographies({ geography: geography, parseGeographies: parseGeographies }),
      geographies = _useGeographies.geographies,
      outline = _useGeographies.outline,
      borders = _useGeographies.borders;

  return React.createElement(
    "g",
    _extends({ className: "rsm-geographies " + className }, restProps),
    geographies && geographies.length > 0 && children({ geographies: geographies, outline: outline, borders: borders, path: path, projection: projection })
  );
};

Geographies.propTypes = {
  geography: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),
  children: PropTypes.func,
  parseGeographies: PropTypes.func,
  className: PropTypes.string
};

var Geography = function Geography(_ref) {
  var geography = _ref.geography,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      onMouseDown = _ref.onMouseDown,
      onMouseUp = _ref.onMouseUp,
      onFocus = _ref.onFocus,
      onBlur = _ref.onBlur,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      restProps = objectWithoutProperties(_ref, ["geography", "onMouseEnter", "onMouseLeave", "onMouseDown", "onMouseUp", "onFocus", "onBlur", "style", "className"]);

  var _useState = useState(false),
      _useState2 = slicedToArray(_useState, 2),
      isPressed = _useState2[0],
      setPressed = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = slicedToArray(_useState3, 2),
      isFocused = _useState4[0],
      setFocus = _useState4[1];

  function handleMouseEnter(evt) {
    setFocus(true);
    if (onMouseEnter) onMouseEnter(evt);
  }

  function handleMouseLeave(evt) {
    setFocus(false);
    if (isPressed) setPressed(false);
    if (onMouseLeave) onMouseLeave(evt);
  }

  function handleFocus(evt) {
    setFocus(true);
    if (onFocus) onFocus(evt);
  }

  function handleBlur(evt) {
    setFocus(false);
    if (isPressed) setPressed(false);
    if (onBlur) onBlur(evt);
  }

  function handleMouseDown(evt) {
    setPressed(true);
    if (onMouseDown) onMouseDown(evt);
  }

  function handleMouseUp(evt) {
    setPressed(false);
    if (onMouseUp) onMouseUp(evt);
  }

  return React.createElement("path", _extends({
    tabIndex: "0",
    className: "rsm-geography " + className,
    d: geography.svgPath,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    style: style[isPressed || isFocused ? isPressed ? "pressed" : "hover" : "default"]
  }, restProps));
};

Geography.propTypes = {
  geography: PropTypes.object,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string
};

var Geography$1 = memo(Geography);

var Graticule = function Graticule(_ref) {
  var _ref$fill = _ref.fill,
      fill = _ref$fill === undefined ? "transparent" : _ref$fill,
      _ref$stroke = _ref.stroke,
      stroke = _ref$stroke === undefined ? "currentcolor" : _ref$stroke,
      _ref$step = _ref.step,
      step = _ref$step === undefined ? [10, 10] : _ref$step,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      restProps = objectWithoutProperties(_ref, ["fill", "stroke", "step", "className"]);

  var _useContext = useContext(MapContext),
      path = _useContext.path;

  return React.createElement("path", _extends({
    d: path(geoGraticule().step(step)()),
    fill: fill,
    stroke: stroke,
    className: "rsm-graticule " + className
  }, restProps));
};

Graticule.propTypes = {
  fill: PropTypes.string,
  stroke: PropTypes.string,
  step: PropTypes.array,
  className: PropTypes.string
};

var Graticule$1 = memo(Graticule);

function useZoomPan(_ref) {
  var center = _ref.center,
      filterZoomEvent = _ref.filterZoomEvent,
      onMoveStart = _ref.onMoveStart,
      onMoveEnd = _ref.onMoveEnd,
      onMove = _ref.onMove,
      _ref$translateExtent = _ref.translateExtent,
      translateExtent = _ref$translateExtent === undefined ? [[-Infinity, -Infinity], [Infinity, Infinity]] : _ref$translateExtent,
      _ref$scaleExtent = _ref.scaleExtent,
      scaleExtent = _ref$scaleExtent === undefined ? [1, 8] : _ref$scaleExtent,
      _ref$zoom = _ref.zoom,
      zoom$1 = _ref$zoom === undefined ? 1 : _ref$zoom;

  var _useContext = useContext(MapContext),
      width = _useContext.width,
      height = _useContext.height,
      projection = _useContext.projection;

  var _center = slicedToArray(center, 2),
      lon = _center[0],
      lat = _center[1];

  var _useState = useState({ x: 0, y: 0, k: 1 }),
      _useState2 = slicedToArray(_useState, 2),
      position = _useState2[0],
      setPosition = _useState2[1];

  var lastPosition = useRef({ x: 0, y: 0, k: 1 });
  var mapRef = useRef();
  var zoomRef = useRef();
  var bypassEvents = useRef(false);

  var _translateExtent = slicedToArray(translateExtent, 2),
      a = _translateExtent[0],
      b = _translateExtent[1];

  var _a = slicedToArray(a, 2),
      a1 = _a[0],
      a2 = _a[1];

  var _b = slicedToArray(b, 2),
      b1 = _b[0],
      b2 = _b[1];

  var _scaleExtent = slicedToArray(scaleExtent, 2),
      minZoom = _scaleExtent[0],
      maxZoom = _scaleExtent[1];

  useEffect(function () {
    var svg = select(mapRef.current);

    function handleZoomStart(d3Event) {
      if (!onMoveStart || bypassEvents.current) return;
      onMoveStart({ coordinates: projection.invert(getCoords(width, height, d3Event.transform)), zoom: d3Event.transform.k }, d3Event);
    }

    function handleZoom(d3Event) {
      if (bypassEvents.current) return;
      var transform = d3Event.transform,
          sourceEvent = d3Event.sourceEvent;

      setPosition({ x: transform.x, y: transform.y, k: transform.k, dragging: sourceEvent });
      if (!onMove) return;
      onMove({ x: transform.x, y: transform.y, k: transform.k, dragging: sourceEvent }, d3Event);
    }

    function handleZoomEnd(d3Event) {
      if (bypassEvents.current) {
        bypassEvents.current = false;
        return;
      }

      var _projection$invert = projection.invert(getCoords(width, height, d3Event.transform)),
          _projection$invert2 = slicedToArray(_projection$invert, 2),
          x = _projection$invert2[0],
          y = _projection$invert2[1];

      lastPosition.current = { x: x, y: y, k: d3Event.transform.k };
      if (!onMoveEnd) return;
      onMoveEnd({ coordinates: [x, y], zoom: d3Event.transform.k }, d3Event);
    }

    function filterFunc(d3Event) {
      if (filterZoomEvent) {
        return filterZoomEvent(d3Event);
      }
      return d3Event ? !d3Event.ctrlKey && !d3Event.button : false;
    }

    var zoom$1 = zoom().filter(filterFunc).scaleExtent([minZoom, maxZoom]).translateExtent([[a1, a2], [b1, b2]]).on("start", handleZoomStart).on("zoom", handleZoom).on("end", handleZoomEnd);

    zoomRef.current = zoom$1;
    svg.call(zoom$1);
  }, [width, height, a1, a2, b1, b2, minZoom, maxZoom, projection, onMoveStart, onMove, onMoveEnd, filterZoomEvent]);

  useEffect(function () {
    if (lon === lastPosition.current.x && lat === lastPosition.current.y && zoom$1 === lastPosition.current.k) return;

    var coords = projection([lon, lat]);
    var x = coords[0] * zoom$1;
    var y = coords[1] * zoom$1;
    var svg = select(mapRef.current);

    bypassEvents.current = true;

    svg.call(zoomRef.current.transform, zoomIdentity.translate(width / 2 - x, height / 2 - y).scale(zoom$1));
    setPosition({ x: width / 2 - x, y: height / 2 - y, k: zoom$1 });

    lastPosition.current = { x: lon, y: lat, k: zoom$1 };
  }, [lon, lat, zoom$1, width, height, projection]);

  return {
    mapRef: mapRef,
    position: position,
    transformString: "translate(" + position.x + " " + position.y + ") scale(" + position.k + ")"
  };
}

var ZoomableGroup = function ZoomableGroup(_ref) {
  var _ref$center = _ref.center,
      center = _ref$center === undefined ? [0, 0] : _ref$center,
      _ref$zoom = _ref.zoom,
      zoom = _ref$zoom === undefined ? 1 : _ref$zoom,
      _ref$minZoom = _ref.minZoom,
      minZoom = _ref$minZoom === undefined ? 1 : _ref$minZoom,
      _ref$maxZoom = _ref.maxZoom,
      maxZoom = _ref$maxZoom === undefined ? 8 : _ref$maxZoom,
      translateExtent = _ref.translateExtent,
      filterZoomEvent = _ref.filterZoomEvent,
      onMoveStart = _ref.onMoveStart,
      onMove = _ref.onMove,
      onMoveEnd = _ref.onMoveEnd,
      className = _ref.className,
      restProps = objectWithoutProperties(_ref, ["center", "zoom", "minZoom", "maxZoom", "translateExtent", "filterZoomEvent", "onMoveStart", "onMove", "onMoveEnd", "className"]);

  var _useContext = useContext(MapContext),
      width = _useContext.width,
      height = _useContext.height;

  var _useZoomPan = useZoomPan({
    center: center,
    filterZoomEvent: filterZoomEvent,
    onMoveStart: onMoveStart,
    onMove: onMove,
    onMoveEnd: onMoveEnd,
    scaleExtent: [minZoom, maxZoom],
    translateExtent: translateExtent,
    zoom: zoom
  }),
      mapRef = _useZoomPan.mapRef,
      transformString = _useZoomPan.transformString;

  return React.createElement(
    "g",
    { ref: mapRef },
    React.createElement("rect", { width: width, height: height, fill: "transparent" }),
    React.createElement("g", _extends({ transform: transformString, className: "rsm-zoomable-group " + className }, restProps))
  );
};

ZoomableGroup.propTypes = {
  center: PropTypes.array,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  translateExtent: PropTypes.arrayOf(PropTypes.array),
  onMoveStart: PropTypes.func,
  onMove: PropTypes.func,
  onMoveEnd: PropTypes.func,
  className: PropTypes.string
};

var Sphere = function Sphere(_ref) {
  var _ref$id = _ref.id,
      id = _ref$id === undefined ? "rsm-sphere" : _ref$id,
      _ref$fill = _ref.fill,
      fill = _ref$fill === undefined ? "transparent" : _ref$fill,
      _ref$stroke = _ref.stroke,
      stroke = _ref$stroke === undefined ? "currentcolor" : _ref$stroke,
      _ref$strokeWidth = _ref.strokeWidth,
      strokeWidth = _ref$strokeWidth === undefined ? 0.5 : _ref$strokeWidth,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      restProps = objectWithoutProperties(_ref, ["id", "fill", "stroke", "strokeWidth", "className"]);

  var _useContext = useContext(MapContext),
      path = _useContext.path;

  var spherePath = useMemo(function () {
    return path({ type: "Sphere" });
  }, [path]);
  return React.createElement(
    Fragment,
    null,
    React.createElement(
      "defs",
      null,
      React.createElement(
        "clipPath",
        { id: id },
        React.createElement("path", { d: spherePath })
      )
    ),
    React.createElement("path", _extends({
      d: spherePath,
      fill: fill,
      stroke: stroke,
      strokeWidth: strokeWidth,
      style: { pointerEvents: "none" },
      className: "rsm-sphere " + className
    }, restProps))
  );
};

Sphere.propTypes = {
  id: PropTypes.string,
  fill: PropTypes.string,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  className: PropTypes.string
};

var Sphere$1 = memo(Sphere);

var Marker = function Marker(_ref) {
  var coordinates = _ref.coordinates,
      children = _ref.children,
      onMouseEnter = _ref.onMouseEnter,
      onMouseLeave = _ref.onMouseLeave,
      onMouseDown = _ref.onMouseDown,
      onMouseUp = _ref.onMouseUp,
      onFocus = _ref.onFocus,
      onBlur = _ref.onBlur,
      _ref$style = _ref.style,
      style = _ref$style === undefined ? {} : _ref$style,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      restProps = objectWithoutProperties(_ref, ["coordinates", "children", "onMouseEnter", "onMouseLeave", "onMouseDown", "onMouseUp", "onFocus", "onBlur", "style", "className"]);

  var _useContext = useContext(MapContext),
      projection = _useContext.projection;

  var _useState = useState(false),
      _useState2 = slicedToArray(_useState, 2),
      isPressed = _useState2[0],
      setPressed = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = slicedToArray(_useState3, 2),
      isFocused = _useState4[0],
      setFocus = _useState4[1];

  var _projection = projection(coordinates),
      _projection2 = slicedToArray(_projection, 2),
      x = _projection2[0],
      y = _projection2[1];

  function handleMouseEnter(evt) {
    setFocus(true);
    if (onMouseEnter) onMouseEnter(evt);
  }

  function handleMouseLeave(evt) {
    setFocus(false);
    if (isPressed) setPressed(false);
    if (onMouseLeave) onMouseLeave(evt);
  }

  function handleFocus(evt) {
    setFocus(true);
    if (onFocus) onFocus(evt);
  }

  function handleBlur(evt) {
    setFocus(false);
    if (isPressed) setPressed(false);
    if (onBlur) onBlur(evt);
  }

  function handleMouseDown(evt) {
    setPressed(true);
    if (onMouseDown) onMouseDown(evt);
  }

  function handleMouseUp(evt) {
    setPressed(false);
    if (onMouseUp) onMouseUp(evt);
  }

  return React.createElement(
    "g",
    _extends({
      transform: "translate(" + x + ", " + y + ")",
      className: "rsm-marker " + className,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onFocus: handleFocus,
      onBlur: handleBlur,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
      style: style[isPressed || isFocused ? isPressed ? "pressed" : "hover" : "default"]
    }, restProps),
    children
  );
};

Marker.propTypes = {
  coordinates: PropTypes.array,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  style: PropTypes.object,
  className: PropTypes.string
};

var Line = function Line(_ref) {
  var _ref$from = _ref.from,
      from = _ref$from === undefined ? [0, 0] : _ref$from,
      _ref$to = _ref.to,
      to = _ref$to === undefined ? [0, 0] : _ref$to,
      coordinates = _ref.coordinates,
      _ref$stroke = _ref.stroke,
      stroke = _ref$stroke === undefined ? "currentcolor" : _ref$stroke,
      _ref$strokeWidth = _ref.strokeWidth,
      strokeWidth = _ref$strokeWidth === undefined ? 3 : _ref$strokeWidth,
      _ref$fill = _ref.fill,
      fill = _ref$fill === undefined ? "transparent" : _ref$fill,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      restProps = objectWithoutProperties(_ref, ["from", "to", "coordinates", "stroke", "strokeWidth", "fill", "className"]);

  var _useContext = useContext(MapContext),
      path = _useContext.path;

  var lineData = {
    type: "LineString",
    coordinates: coordinates || [from, to]
  };

  return React.createElement("path", _extends({
    d: path(lineData),
    className: "rsm-line " + className,
    stroke: stroke,
    strokeWidth: strokeWidth,
    fill: fill
  }, restProps));
};

Line.propTypes = {
  from: PropTypes.array,
  to: PropTypes.array,
  coordinates: PropTypes.array,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  fill: PropTypes.string,
  className: PropTypes.string
};

var Annotation = function Annotation(_ref) {
  var subject = _ref.subject,
      children = _ref.children,
      connectorProps = _ref.connectorProps,
      _ref$dx = _ref.dx,
      dx = _ref$dx === undefined ? 30 : _ref$dx,
      _ref$dy = _ref.dy,
      dy = _ref$dy === undefined ? 30 : _ref$dy,
      _ref$curve = _ref.curve,
      curve = _ref$curve === undefined ? 0 : _ref$curve,
      _ref$className = _ref.className,
      className = _ref$className === undefined ? "" : _ref$className,
      restProps = objectWithoutProperties(_ref, ["subject", "children", "connectorProps", "dx", "dy", "curve", "className"]);

  var _useContext = useContext(MapContext),
      projection = _useContext.projection;

  var _projection = projection(subject),
      _projection2 = slicedToArray(_projection, 2),
      x = _projection2[0],
      y = _projection2[1];

  var connectorPath = createConnectorPath(dx, dy, curve);

  return React.createElement(
    "g",
    _extends({
      transform: "translate(" + (x + dx) + ", " + (y + dy) + ")",
      className: "rsm-annotation " + className
    }, restProps),
    React.createElement("path", _extends({ d: connectorPath, fill: "transparent", stroke: "#000" }, connectorProps)),
    children
  );
};

Annotation.propTypes = {
  subject: PropTypes.array,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.arrayOf(PropTypes.node)]),
  dx: PropTypes.number,
  dy: PropTypes.number,
  curve: PropTypes.number,
  connectorProps: PropTypes.object,
  className: PropTypes.string
};

export { Annotation, ComposableMap, Geographies, Geography$1 as Geography, Graticule$1 as Graticule, Line, MapContext, MapProvider, Marker, Sphere$1 as Sphere, ZoomableGroup, useGeographies, useZoomPan };
