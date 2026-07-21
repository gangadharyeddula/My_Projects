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
      "Student Accounts",
      "Company Accounts",
      "Student Profiles",
      "Company Profiles",
      "Jobs",
      "Applications",
    ],

    datasets: [
      {
        label: "Portal Statistics",

        data: [
          stats?.total_student_accounts || 0,
          stats?.total_company_accounts || 0,
          stats?.total_student_profiles || 0,
          stats?.total_company_profiles || 0,
          stats?.total_jobs || 0,
          stats?.total_applications || 0,
        ],

        backgroundColor: [
          "#2563eb",
          "#7c3aed",
          "#0ea5e9",
          "#8b5cf6",
          "#f59e0b",
          "#16a34a",
        ],

        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,

    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },

      title: {
        display: true,
        text: "Placement Portal Overview",
        font: {
          size: 16,
        },
      },
    },

    scales: {
      y: {
        beginAtZero: true,

        ticks: {
          precision: 0,
        },
      },

      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <div style={styles.card}>
      <div style={styles.chartContainer}>
        <Bar
          data={data}
          options={options}
        />
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
    height: "clamp(280px, 35vw, 350px)",
  },
};

export default BarStatsChart;