import {
  Chart,
  Colors,
  Tooltip,
  BarController,
  BarElement,
  PieController,
  LineController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  ArcElement,
  Title,
  Filler,
  TimeSeriesScale,
} from "chart.js";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

import type { Revenue, SortTypes, TopTen } from "./types";

Chart.register(
  LineController,
  Tooltip,
  ArcElement,
  BarController,
  BarElement,
  PieController,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
  Legend,
  Colors,
  Title,
  TimeSeriesScale
);

// eslint-disable-next-line
let topTenChart: Chart<"pie", any, unknown>;
export function drawTopTen(topTen: TopTen[]) {
  if (topTenChart) {
    topTenChart.destroy();
  }

  const el = document.getElementById("topTen") as HTMLCanvasElement;
  if (el) {
    topTenChart = new Chart(el, {
      type: "pie",
      data: {
        labels: (topTen || []).map((d) => d.account),
        datasets: [
          {
            data: (topTen || []).map((d) => d.revenue),
            hoverOffset: 4,
          },
        ],
      },

      options: {
        responsive: true,
        resizeDelay: 200,
        plugins: {
          title: {
            display: true,
            text: "Top 10 Customers",
            fullSize: true,
            font: {
              weight: 600,
              size: 25,
            },
          },
          legend: {
            display: true,
            position: "top",

            labels: {
              font: {
                size: 15,
              },
            },
          },
        },
      },
    });
  }
}

function convertToDateString(m: number) {
  // Ensure the input is a 6-character string
  const s = m.toString();
  if (s.length !== 6) {
    throw new Error(
      "Input must be a 6-character string in the format 'YYYYMM'"
    );
  }

  // Extract the year and month
  const year = s.slice(0, 4);
  const month = s.slice(4, 6);

  // Construct the new date string
  return new Date(`${year}.${month}.01`);
}

// eslint-disable-next-line
let revByMonth: Chart<"bar", any, unknown>;
export function drawRevByState(
  activeStates: string[],
  revenue: Revenue,
  sorts: SortTypes[]
) {
  if (revByMonth) {
    revByMonth.destroy();
    if (activeStates.length === 0) {
      // dont make the graph if there is no states to display
      return;
    }
  }

  const data: {
    [state: string]: {
      bulk: { x: Date; y: number }[];
      sort: { x: Date; y: number }[];
    };
  } = {};

  activeStates.forEach((state) => {
    data[state] = {
      bulk: [],
      sort: [],
    };
    revenue.monthKeys.forEach((month) => {
      sorts.forEach((s) => {
        data[state][s].push({
          x: convertToDateString(month),
          y: revenue.rev[state].rev[s][month].r,
        });
      });
    });
  });

  const el = document.getElementById("revByMonth") as HTMLCanvasElement;
  if (el) {
    revByMonth = new Chart(el, {
      type: "bar",

      data: {
        // labels,

        datasets: Object.keys(data).flatMap((state) =>
          sorts.map((s) => {
            return {
              fill: "origin",
              label: state + "-" + s,
              data: data[state][s],
              stack: s,
            };
          })
        ),
      },
      options: {
        // animation: true,
        responsive: true,
        resizeDelay: 200,
        interaction: {
          mode: "nearest",
          axis: "x",
          intersect: false,
        },
        plugins: {
          legend: {
            display: true,
          },
          tooltip: {
            mode: "index",
            callbacks: {
              footer: function (tooltipItems) {
                let sum = 0;

                tooltipItems.forEach(function (tooltipItem) {
                  sum += tooltipItem.parsed.y;
                });
                return "Sum: " + sum.toFixed(2);
              },
            },
          },
          filler: {
            propagate: true,
          },
        },
        scales: {
          x: {
            stacked: true,

            ticks: {
              source: "auto",
            },
            title: {
              display: true,
              text: "Month",
              font: {
                size: 18,
              },
            },

            type: "timeseries",
            time: {
              unit: "month",
              tooltipFormat: "MMM YYYY",
              displayFormats: {
                quarter: "MMM YYYY",
              },
            },
          },
          y: {
            stacked: true,
            title: {
              display: true,
              font: {
                size: 18,
              },
            },
          },
        },
      },
    });
  }
}
