import mapboxgl from "mapbox-gl";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
// TODO LOK AT
// https://github.com/zischwartz/womensmarches/blob/master/src/components/map.js

var bounds = [
  [-201.21943658896294, -82.53867022120976], // Southwest coordinates
  [186.5540009109581, 80.0606203667802] // Northeast coordinates
];

export function RenderMap(el, all_funds) {
  let geojson = make_geo_json(all_funds);
  // console.log(geojson);
  mapboxgl.accessToken =
    "pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA";
  var map = new mapboxgl.Map({
    container: el,
    // container: "map",
    style: "mapbox://styles/mapbox/light-v9",
    zoom: 1,
    minZoom: 1,
    maxZoom: 16,
    // center: [-99, 40],
    maxBounds: bounds // Sets bounds to prevent repeat/wrap
  });
  map.addControl(new mapboxgl.NavigationControl());
  // and once it's done, actually load the data
  map.on("load", () => {
    // console.log("load");
    map.addSource("data", {
      type: "geojson",
      data: geojson
      // cluster: true, // https://www.mapbox.com/mapbox-gl-js/example/cluster/
      // clusterRadius: 25 // default is 50
    });
    // console.log("done adding data");
    map.addLayer(point_layer_obj());
    let popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false });

    // mouseover
    // map.on("mouseenter", "point", function(e) {
    //   console.log("e");
    //   // console.log(e)
    // });
    // for click method
    // map.on("mousedown", function(e) {
    map.on("mouseenter", "point", function(e) {
      var bbox = [
        [e.point.x - 5, e.point.y - 5],
        [e.point.x + 5, e.point.y + 5]
      ];
      var features = map.queryRenderedFeatures(bbox, { layers: ["point"] });
      if (!features.length) {
        popup.remove();
        return;
      }
      let selected = features[0];
      // console.log(features[0]);
      popup
        .setLngLat(selected.geometry.coordinates)
        .setHTML(
          `<strong>${
            selected["properties"]["Fund Name"]
          }</strong><br/>AUM: $${selected["properties"][
            "aum $bn"
          ].toLocaleString()} Billion <br/>Inception: ${
            selected["properties"]["inception"]
          }<br/>Country: ${selected["properties"]["Country"]}`
        )
        .addTo(map);
    }); // end mousedown
  });
}

export function make_geo_json(all_funds) {
  // let marches = require("../../data/marches.json");
  var geojson = { features: [], type: "FeatureCollection" };
  for (let fund of all_funds) {
    let f = create_feature(fund.longitude, fund.latitude, fund);
    geojson.features.push(f);
  }
  return geojson;
}

export function create_feature(lng, lat, properties = {}) {
  return {
    type: "Feature",
    properties: properties,
    geometry: {
      type: "Point",
      coordinates: [lng, lat]
    }
  };
}

function point_layer_obj() {
  return {
    id: "point",
    type: "circle",
    source: "data",
    paint: {
      // "circle-color": "rgba(100, 150, 150, 0.2)",
      // 'circle-stroke-color': 'rgba(10, 70, 70, 0.5)',
      // "circle-stroke-color": "rgba(0, 150, 150, 0.5)",
      "circle-stroke-color": "rgba(255, 255, 255, 0.5)",
      "circle-stroke-width": 1,
      // 'circle-color': 'red',
      // 'circle-radius': 4,
      // "circle-radius": 12,
      "circle-radius": {
        property: "aum $bn",
        // type: "linear",
        type: "exponential",
        stops: [[1, 8], [1445, 40]]
      },
      "circle-color": [
        "match",
        ["get", "Leader, Finalist, Other"],
        "Other Rated Fund",
        "rgba(130, 130, 130, 0.6)",
        "Finalist",
        "rgba(28, 83, 110, 0.6)",
        "Leader's List",
        "rgba(0, 187, 180, 0.6)",

        /* other */ "#ccc"
      ]
    }
  };
}
