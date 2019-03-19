import {
  Chart,
  Bar,
  HorizontalBar,
  VerticalGroupedBar
} from "@newamerica/charts";
// import "@newamerica/charts/dist/styles.css";
import { ChartContainer, Title, Source } from "@newamerica/meta";

let legend_content = `
<span style='background-color: rgba(28, 83, 110, 0.6); width: 10px; height: 10px; display: inline-block;'></span>
<span class="name">Finalists -  Average Score</span>

<span style='background-color: rgba(0, 187, 180, 0.6); width: 10px; height: 10px; display: inline-block;'></span>
<span class="name">Leaders -  Average Score</span>

<span style='background-color: gray; width: 10px; height: 10px; display: inline-block;'></span>
<span class="name">Rest of Funds -  Average Score</span>
`;

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
    <ChartContainer>
      <Chart
        maxWidth="100%"
        height={400}
        renderTooltip={arg => {
          let { datum } = arg;
          return (
            <div style={{ textTransform: "capitalize" }}>
              {datum.key + " " + datum.value}%
            </div>
          );
        }}
      >
        {chartProps => (
          <VerticalGroupedBar
            data={input_data}
            x={d => d["Criteria"]}
            keys={[
              "Finalists - average score",
              "Leaders - average score",
              "Rest of Funds - average score"
            ]}
            {...chartProps}
            colors={["#5BA4DA", "#2EBCB3", "gray"]}
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

function abbrev(s) {
  // prettier-ignore
  if (!s) { return s }
  return s
    .split("-")[0]
    .replace("Total", "Average")
    .replace("Disclosure", "Discl")
    .replace("Standards", "Stan")
    .replace("Intention", "Intent")
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
