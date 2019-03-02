import { DataTable, DataTableWithSearch } from "@newamerica/data-table";

// helpers

let PassFailCell = row => {
  return (
    <div style={{ textAlign: "center" }}>
      {row.value === "Pass" ? "✅" : "❌"}
    </div>
  );
};
let StatusCell = row => {
  let content = "";
  content = row.value === "Finalist" ? "🥈" : content;
  content = row.value === "Leader's List" ? "🥇" : content;

  return <div style={{ textAlign: "center", fontSize: "2em" }}>{content}</div>;
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
  }

  // console.log(columns);
  columns = columns.map((accessor, i) => {
    // prettier-ignore
    let Header = accessor.split(/_|\W/).map(s=> s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
    let Cell = row => <div>{row.value}</div>;
    let sortMethod;

    if (i > 6) {
      Cell = PassFailCell;
    }
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

    return { accessor, Header, Cell, sortMethod };
  });

  let table = show_top_only ? (
    <DataTable data={data} columns={columns} maxRows={50} resizable={false} />
  ) : (
    <DataTableWithSearch
      data={data}
      columns={columns}
      showPagination={true}
      resizable={false}
      maxRows={20}
    />
  );
  ReactDOM.render(table, container);
}
