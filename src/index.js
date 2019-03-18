import "./index.scss";
import "../node_modules/mapbox-gl/dist/mapbox-gl.css";

import * as d3 from "d3";
import { DataTable, DataTableWithSearch } from "@newamerica/data-table";
import "@newamerica/data-table/dist/styles.css";
import "react-table/react-table.css";

import { RenderMap } from "./map";
import { RenderDataTable } from "./render_datatable";
import { RenderRegionBar } from "./region_bar";
import { RenderAggregateBar } from "./agg_bar";
import all_funds_data_path from "../data/all_funds.csv";
import region_data_path from "../data/geography.csv";
import agg_data_path from "../data/aggregate_scores.csv";

// window.d3 = d3;

let queue = [];
let data = null;
let region_data = null;
let agg_scores_data = null;
let TOP_FUND_DT_COLUMN_BLACKLIST = [
  "Region",
  "latitude",
  "longitude",
  "quintile"
];
let ALL_FUND_DT_COLUMN_BLACKLIST = ["Region", "latitude", "longitude"];

const settings = {
  raai_top_funds_dt: container => {
    // console.log("skipping top funds because DEV XXX");
    // return;
    // console.log(data.columns);
    return RenderDataTable(container, data, true, TOP_FUND_DT_COLUMN_BLACKLIST);
  },
  raai_all_funds_dt: container => {
    return RenderDataTable(
      container,
      data,
      false,
      ALL_FUND_DT_COLUMN_BLACKLIST
    );
  },
  raai_all_funds_map: container => {
    return RenderMap(container, data);
  },
  raai_regional_composition_of_top: container => {
    // console.log("raai_regional_composition_of_top");
    return RenderRegionBar(container, region_data);
  },
  raai_aggregate_scores: container => {
    return RenderAggregateBar(container, agg_scores_data);
  }
};

function process_all_funds_data(input_data) {
  let results = input_data.map(row => {
    row["aum $bn"] = parseInt(row["aum $bn"]);
    return row;
  });
  results["columns"] = input_data["columns"];
  return results;
}

// XXX because i'm not checking which is loaded, the way I've got it
// this updates when each file loads, but hopefully drive shaft will fix that
//
d3.csv(all_funds_data_path)
  // .then(response => response.json())
  .then(_data => {
    // console.log("then");
    data = process_all_funds_data(_data);
    for (let i = 0; i < queue.length; i++) queue[i]();
  });
d3.csv(region_data_path).then(_data => {
  region_data = _data;
  for (let i = 0; i < queue.length; i++) queue[i]();
});
d3.csv(agg_data_path).then(_data => {
  agg_scores_data = _data
    .map(row => {
      row["Finalists - % that Scored"] = parseInt(
        row["Finalists - % that Scored"].slice(0, -1)
      );
      row["Leaders - % that scored"] = parseInt(
        row["Leaders - % that scored"].slice(0, -1)
      );
      row["Rest of Funds - % that scored"] = parseInt(
        row["Rest of Funds - % that scored"].slice(0, -1)
      );
      return row;
    })
    .slice(0, -4)
    .reverse();

  for (let i = 0; i < queue.length; i++) queue[i]();
});

// fetch("endpoint")
//   .then(response => response.json())
//   .then(_data => {
//     data = _data;
//     for (let i = 0; i < queue.length; i++) queue[i]();
//   });

window.renderDataViz = function(el) {
  console.log("renderDataViz");
  let id = el.getAttribute("id");
  let chart = settings[id];
  // console.log(chart);
  if (!chart) return;

  if (data && region_data && agg_scores_data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
