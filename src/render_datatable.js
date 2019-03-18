import { DataTable, DataTableWithSearch } from "@newamerica/data-table";
import { ChartContainer, Title, Source } from "@newamerica/meta";

// helpers
let pass = `<svg class="passfailcheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17.33 13.75" style="fill: none; stroke: rgb(45, 187, 179); stroke-linecap: square; stroke-width: 4px; width: 15px; height: 15px;"><title>check-mark</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><polyline class="check-mark" points="3.53 6.9 7.07 10.26 13.79 3.54"></polyline></g></g></svg>`;
let fail = `<svg class="passfailcheck" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13.32 13.32" style="fill: none; stroke: rgb(230, 92, 100); stroke-linecap: square; stroke-width: 3px; width: 15px; height: 15px;"><title>x-mark</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><line class="x-mark" x1="3.54" y1="3.54" x2="9.78" y2="9.78"></line><line class="x-mark" x1="9.78" y1="3.54" x2="3.54" y2="9.78"></line></g></g></svg>`;

let PassFailCell = row => {
  let mu = row.value === "Pass" ? { __html: pass } : { __html: fail };
  return (
    <div style={{ textAlign: "center" }}>
      <div dangerouslySetInnerHTML={mu} />
      {/*{row.value === "Pass" ? "✅" : "❌"}*/}
    </div>
  );
};
let StatusCell = row => {
  // let content = "";
  // content = row.value === "Finalist" ? "🥈" : content;
  // content = row.value === "Leader's List" ? "🥇" : content;
  let content = row.value == "Other Rated Fund" ? "" : row.value;

  // return <div style={{ textAlign: "center", fontSize: "2em" }}>{content}</div>;
  return <div>{content}</div>;
};
let sort_status_func = (a, b) => {
  if (a === "Finalist" && b == "Leader's List") {
    return 1;
  } else if (a === "Leader's List" && b == "Finalist") {
    return -1;
  }
  // prettier-ignore
  if (a === "Other Rated Fund") {  return 1;  }
  // prettier-ignore
  if (b === "Other Rated Fund") {  return -1; }
};

// the actual render
export function RenderDataTable(
  container,
  data,
  show_top_only,
  COLUMN_BLACKLIST
) {
  let columns = data["columns"];
  columns = columns.filter(col_name => !COLUMN_BLACKLIST.includes(col_name));
  if (show_top_only) {
    data = data.filter(x => x["Leader, Finalist, Other"] != "Other Rated Fund");
    columns = columns.slice(0, 7);
    // console.log(data.length);
  }

  // console.log(columns);
  // let's create the actual columns we pass to react-table
  columns = columns.map((accessor, i) => {
    // prettier-ignore
    let Header = accessor.split(/_|\W/).map(s=> s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    let Cell = row => <div>{row.value}</div>;
    let sortMethod;

    if (i > 6) {
      Cell = PassFailCell;
    }
    let small_width = show_top_only ? 50 : 100;
    let minWidth = accessor == "Fund Name" ? 125 : small_width;
    let style = accessor == "Fund Name" ? { "white-space": "unset" } : {};
    // if (accessor == "Fund Name") {
    //   console.log("FUND NAME");
    //   minWidth=
    // }
    if (accessor == "Leader, Finalist, Other") {
      Cell = StatusCell;
      sortMethod = sort_status_func;
    }
    if (accessor == "aum date") {
      Header = "AUM Date";
    }
    if (accessor == "aum $bn") {
      Cell = row => {
        return <div>${row.value}</div>;
      };
      Header = "$AUM (Billions)";
    }

    Header = Header.split(" ").map(x => <div>{x}</div>);

    return { accessor, Header, Cell, sortMethod, minWidth, style };
  });
  // console.log(show_top_only);
  let table = show_top_only ? (
    <DataTable
      data={data}
      columns={columns}
      resizable={false}
      paginate={false}
      showPagination={false}
      defaultPageSize={data.length}
    />
  ) : (
    <DataTableWithSearch
      data={data}
      columns={columns}
      showPagination={true}
      resizable={false}
      defaultPageSize={25}
    />
  );
  let wrapped_table = <ChartContainer>{table}</ChartContainer>;
  ReactDOM.render(wrapped_table, container);
}
