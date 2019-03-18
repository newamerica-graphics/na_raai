import {
  Chart,
  Bar,
  HorizontalBar,
  VerticalGroupedBar
} from "@newamerica/charts";
// import "@newamerica/charts/dist/styles.css";

export function RenderAggregateBar(container, input_data) {
  // console.log("RenderAggregateBar");
  // console.log(input_data);
  // prettier-ignore
  if (!input_data){ return }

  input_data = input_data.map(x => {
    x["Criteria"] = abbrev(x["Criteria"]);
    return x;
  });

  let bar_chart = (
    <Chart
      maxWidth="100%"
      height={400}
      renderTooltip={({ datum }) => (
        <div>{datum.key.replace("% that", `${datum.value}%`)}</div>
      )}
    >
      {chartProps => (
        <VerticalGroupedBar
          data={input_data}
          x={d => d["Criteria"]}
          keys={[
            "Finalists - % that Scored",
            "Leaders - % that scored",
            "Rest of Funds - % that scored"
          ]}
          {...chartProps}
          colors={["#5BA4DA", "#2EBCB3", "gray"]}
        />
      )}
    </Chart>
  );
  ReactDOM.render(bar_chart, container);
}

function abbrev(s) {
  return s
    .split("-")[0]
    .replace("Accountability", "Account")
    .replace("Implementation", "Implem")
    .replace("Integration", "Integ")
    .replace("Partnership", "Partn")
    .replace("Development", "Devel")
    .replace("Commitment", "Commit")
    .replace("Organization", "Org")
    .trim();
}

/*<HorizontalBar
  data={data}
  x={d => d.value}
  y={d => d.key}
  // numTicksX={width => (width < 400 ? 4 : 6)}
  margin={{ top: 10, left: 40, right: 10, bottom: 20 }}
  {...chartProps}
/>*/
