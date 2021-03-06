import mapboxgl from "mapbox-gl";
// import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
import { ChartContainer, Title, Source } from "@newamerica/meta";

mapboxgl.accessToken =
  "pk.eyJ1IjoibmV3YW1lcmljYW1hcGJveCIsImEiOiJjaXVmdTUzbXcwMGdsMzNwMmRweXN5eG52In0.AXO-coBbL621lzrE14xtEA";

// simply so you can't scroll infinitely
var bounds = [
  [-201.21943658896294, -82.53867022120976], // Southwest coordinates
  [186.5540009109581, 80.0606203667802] // Northeast coordinates
];

let legend_content = `
<span style='background-color: rgba(0, 187, 180, 0.6); width: 12px; height: 12px; display: inline-block; border-radius:10px;'></span>
<span>Leader's List</span>
<br/>
<span style='background-color: rgba(28, 83, 110, 0.6); width: 12px; height: 12px; display: inline-block; border-radius:10px;'></span>
<span>Finalist</span>
<br/>
<span style='background-color: rgba(130, 130, 130, 0.6); width: 12px; height: 12px; display: inline-block; border-radius:10px;'></span>
<span>Other Rated Fund</span>
`;

export function RenderMap(container, all_funds) {
  let geojson = make_geo_json(all_funds);
  let map_comp = <MapComponent geojson={geojson} />;
  ReactDOM.render(map_comp, container);
}

function popup_html(selected) {
  // console.log(selected);
  let props = selected["properties"];
  let res = `<strong>${props["Fund Name"]}</strong><br/>AUM: $${props[
    "aum $bn"
  ].toLocaleString()} Billion <br/>`;
  res += `Inception: ${props["inception"]}<br/>Country: ${
    props["Country"]
  }<br/>`;
  res += `Quintile: ${props["quintile"]}`;
  return res;
}

class MapComponent extends React.Component {
  constructor(props) {
    super(props);
    // this.map_ref = React.createRef();
    // this.createRef
  }
  componentDidMount() {
    this.setup_map();
  }
  setup_map() {
    var map = new mapboxgl.Map({
      container: this.map_ref,
      // container: map_el,
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
        data: this.props.geojson
        // cluster: true, // https://www.mapbox.com/mapbox-gl-js/example/cluster/
        // clusterRadius: 25 // default is 50
      });
      // console.log("done adding data");
      map.addLayer(point_layer_obj());
      let popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
      });

      // mouseover
      // map.on("mouseenter", "point", function(e) {
      //   console.log("e");
      //   // console.log(e)
      // });
      // for click method
      // map.on("mousedown", function(e) {
      map.on("mouseleave", "point", function(e) {
        popup.remove();
      });
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
          .setHTML(popup_html(selected))
          .addTo(map);
      }); // end mousedown
    });
  }
  render() {
    return (
      <ChartContainer>
        <div
          id="map_el"
          ref={el => {
            this.map_ref = el;
          }}
        />
        <div
          id="map_legend_el"
          dangerouslySetInnerHTML={{ __html: legend_content }}
        />
      </ChartContainer>
    );
  }
}

function make_geo_json(all_funds) {
  // let marches = require("../../data/marches.json");
  var geojson = { features: [], type: "FeatureCollection" };
  for (let fund of all_funds) {
    let f = create_feature(fund.longitude, fund.latitude, fund);
    geojson.features.push(f);
  }
  return geojson;
}

function create_feature(lng, lat, properties = {}) {
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
