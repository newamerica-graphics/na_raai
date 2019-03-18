import {
  Chart,
  Bar,
  HorizontalBar,
  VerticalGroupedBar
} from "@newamerica/charts";
// import "@newamerica/charts/dist/styles.css";

let legend_content = `
<span style='background-color: rgba(0, 187, 180, 0.6); width: 10px; height: 10px; display: inline-block;'></span>
<span class="name">% of Leaders Funds</span>

<span style='background-color: rgba(28, 83, 110, 0.6); width: 10px; height: 10px; display: inline-block;'></span>
<span class="name">% of AUM</span>
`;

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
    <ChartContainer>
      <Chart
        maxWidth="100%"
        height={400}
        renderTooltip={({ datum }) => (
          <div>
            {datum.key}: {datum.value}%
          </div>
        )}
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
      <div
        className="legend"
        dangerouslySetInnerHTML={{ __html: legend_content }}
      />
    </ChartContainer>
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
