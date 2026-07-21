import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import { Doughnut } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const StatusPieChart = ({ stats }) => {
  const data = {
    labels: [
      "Applied",
      "Shortlisted",
      "Interview",
      "Selected",
      "Placed",
      "Rejected",
    ],

    datasets: [
      {
        data: [
          stats?.applied || 0,
          stats?.shortlisted || 0,
          stats?.interview || 0,
          stats?.selected || 0,
          stats?.placed || 0,
          stats?.rejected || 0,
        ],
        
        backgroundColor: [
          "#3b82f6",
          "#f59e0b",
          "#8b5cf6",
          "#22c55e",
          "#10b981",
          "#ef4444",
        ],

        borderWidth: 1,
      },
    ],
  };

  const options = {
  responsive: true,
  maintainAspectRatio: false,

  plugins: {
    legend: {
      position: "bottom",
      labels: {
        boxWidth: 12,
        padding: 14,
      },
    },

    title: {
      display: true,
      text: "Application Status Distribution",
    },
  },
};

  return (
    <div style={styles.card}>
      <div style={styles.chartContainer}>
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
    background: "#ffffff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  chartContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "420px",
    height: "clamp(260px, 35vw, 350px)",
    margin: "0 auto",
  },
};

export default StatusPieChart;