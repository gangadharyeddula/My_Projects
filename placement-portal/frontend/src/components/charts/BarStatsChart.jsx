import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarStatsChart = ({ stats }) => {

  const data = {
    labels: [
      "Students",
      "Companies",
      "Jobs",
      "Applications",
    ],

    datasets: [
      {
        label: "Portal Statistics",

        data: [
          stats.total_students,
          stats.total_companies,
          stats.total_jobs,
          stats.total_applications,
        ],
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: {
        position: "top",
      },

      title: {
        display: true,
        text: "Placement Portal Overview",
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
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarStatsChart;