import React from "react";
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend } from "chart.js";
import { lightPurple, purple } from "../../constants/color";

ChartJS.register(CategoryScale, Tooltip, Filler, LinearScale, PointElement, LineElement, ArcElement, Legend);

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

const LineChart = () => {
  const data = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        data: [1, 2, 3, 45, 54, 33],
        label: "Revenue",
        fill: true,
        backgroundcolor: lightPurple,
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

const DoughnutChart = () => {
  return <div>DoughnutChart</div>;
};

export { LineChart, DoughnutChart };
