import * as d3 from "d3";
import { DataTable, DataTableWithSearch } from "@newamerica/data-table";

import "./index.scss";
// guh try all these in the index like he said?
// import "../node_modules/mapbox-gl/dist/mapbox-gl.css";
// // import "react-table/react-table.css";
// import "../node_modules/react-table/react-table.css";
// import "../node_modules/@newamerica/data-table/dist/styles.css";
// import "../node_modules/@newamerica/charts/dist/styles.css";
// import "../node_modules/@newamerica/components/dist/styles.css";

import { RenderMap } from "./map";
import { RenderDataTable } from "./render_datatable";
import { RenderRegionBar } from "./region_bar";
import { RenderAggregateBar } from "./agg_bar";
// import all_funds_data_path from "../data/all_funds.csv";
// import region_data_path from "../data/geography.csv";
// import agg_data_path from "../data/aggregate_scores.csv";

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
    return RenderDataTable(
      container,
      process_all_funds_data(data["All Funds Data"]),
      true,
      TOP_FUND_DT_COLUMN_BLACKLIST
    );
  },
  raai_all_funds_dt: container => {
    return RenderDataTable(
      container,
      process_all_funds_data(data["All Funds Data"]),
      false,
      ALL_FUND_DT_COLUMN_BLACKLIST
    );
  },
  raai_all_funds_map: container => {
    return RenderMap(container, process_all_funds_data(data["All Funds Data"]));
  },
  raai_regional_composition_of_top: container => {
    // console.log("raai_regional_composition_of_top");
    return RenderRegionBar(container, data["leaders_major_region_comp_clean"]);
  },
  raai_aggregate_scores: container => {
    let agg_scores_data = process_agg_data(data["aggregate_scores"]);
    // console.log(agg_scores_data);
    return RenderAggregateBar(container, agg_scores_data);
  }
};

// data processing helpers
//
function process_agg_data(input_data) {
  // console.log(input_data);
  return (
    input_data
      .filter(row => row["Rest of Funds - average score"])
      .map(row => {
        row["Finalists - average score"] = parseInt(
          row["Finalists - average score"].slice(0, -1)
        );
        row["Leaders - average score"] = parseInt(
          row["Leaders - average score"].slice(0, -1)
        );
        row["Rest of Funds - average score"] = parseInt(
          row["Rest of Funds - average score"].slice(0, -1)
        );
        return row;
      })
      // .slice(0, -4)
      .reverse()
  );
}

function process_all_funds_data(input_data) {
  let results = input_data.map(row => {
    row["aum $bn"] = parseInt(row["aum $bn"]);
    return row;
  });
  results["columns"] = input_data["columns"];
  return results;
}

fetch("https://na-data-projects.s3.amazonaws.com/data/raii/index_2019.json")
  .then(response => response.json())
  .then(_data => {
    data = _data;
    // console.log(data);
    for (let i = 0; i < queue.length; i++) queue[i]();
  });

window.renderDataViz = function(el) {
  // console.log("renderDataViz");
  let id = el.getAttribute("id");
  let chart = settings[id];
  if (!chart) return;

  if (data) {
    chart(el);
  } else {
    queue.push(() => chart(el));
  }
};
