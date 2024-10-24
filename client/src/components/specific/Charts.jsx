import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend } from "chart.js";
import { lightOrange, lightPurple, orange, purple } from "../../constants/color";
import { getLast7Days } from "../../lib/features";

ChartJS.register(CategoryScale, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend);

const labels = getLast7Days();

const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: "false",
    },
    title: {
      display: "false",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      grid: {
        display: false,
      },
    },
  },
};

const LineChart = ({ value = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        label: "Revenue",
        fill: true,
        backgroundColor: lightPurple,
        borderColor: purple,
      },
    ],
  };
  return (
    <Line
      data={data}
      options={lineChartOptions}
    />
  );
};

const doughnutChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
  cutout: 120,
};

const DoughnutChart = ({ value = [], labels = [] }) => {
  const data = {
    labels,
    datasets: [
      {
        data: value,
        backgroundColor: [lightPurple, lightOrange],
        hoverBackgroundColor: [purple, orange],
        borderColor: [purple, orange],
        offset: 10,
      },
    ],
  };
  return (
    <>
      <Doughnut
        data={data}
        options={doughnutChartOptions}
        style={{ zIndex: 10 }}
      />
    </>
  );
};

export { LineChart, DoughnutChart };
