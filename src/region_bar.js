import {
  Chart,
  Bar,
  HorizontalBar,
  VerticalGroupedBar
} from "@newamerica/charts";
import "@newamerica/charts/dist/styles.css";

export function RenderRegionBar(container, input_data) {
  // console.log(typeof input_data);
  // prettier-ignore
  if (!input_data){ return}
  // console.log(input_data);

  input_data = input_data.map((row, i) => {
    let per_leader = row["Percent of Leaders Funds"];
    // only convert if we haven't before, todo move so this isn't a problem
    // prettier-ignore
    if (typeof per_leader != "string"){ return row}
    row["Percent of Leaders Funds"] = parseInt(per_leader.slice(0, -1));
    row["Percent of AUM"] = parseInt(row["Percent of AUM"].slice(0, -1));
    return row;
  });
  input_data.pop();

  // console.log("bar", data);
  let bar_chart = (
    <Chart
      maxWidth="100%"
      height={400}
      renderTooltip={({ datum }) => <div>{JSON.stringify(datum)}</div>}
    >
      {chartProps => (
        <VerticalGroupedBar
          data={input_data}
          x={d => d["Major Region and Geographies"]}
          keys={["Percent of Leaders Funds", "Percent of AUM"]}
          {...chartProps}
          colors={["#2EBCB3", "#5BA4DA"]}
        />
      )}
    </Chart>
  );
  ReactDOM.render(bar_chart, container);
}

/*<HorizontalBar
  data={data}
  x={d => d.value}
  y={d => d.key}
  // numTicksX={width => (width < 400 ? 4 : 6)}
  margin={{ top: 10, left: 40, right: 10, bottom: 20 }}
  {...chartProps}
/>*/
