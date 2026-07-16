import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const StatusPieChart = ({ stats }) => {

  const data = {
    labels: [
      "Applied",
      "Shortlisted",
      "Selected",
      "Rejected",
    ],

    datasets: [
      {
        data: [
          stats.applied,
          stats.shortlisted,
          stats.selected,
          stats.rejected,
        ],

        backgroundColor: [
          "#3b82f6",
          "#f59e0b",
          "#22c55e",
          "#ef4444",
        ],

        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "bottom",
      },

      title: {
        display: true,
        text: "Application Status Distribution",
      },
    },
  };

  return (
    <div
      style={{
        background: "#fff",
        padding: "25px",
        borderRadius: "16px",
        marginTop: "30px",
        boxShadow: "0 8px 24px rgba(0,0,0,.08)",
      }}
    >
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default StatusPieChart;