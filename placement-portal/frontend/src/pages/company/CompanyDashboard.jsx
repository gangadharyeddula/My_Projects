import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import PageCard from "../../components/ui/PageCard";
import Loader from "../../components/ui/Loader";

const Stage = ({ title, value }) => (
  <div style={styles.stage}>
    <h2 style={styles.stageValue}>{value}</h2>
    <p style={styles.stageTitle}>{title}</p>
  </div>
);

const Arrow = () => (
  <div style={styles.arrow}>→</div>
);

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    profile_completed: false,
    jobs_posted: 0,
    total_applicants: 0,
    applied_count: 0,
    shortlisted_count: 0,
    interview_count: 0,
    selected_count: 0,
    placed_count: 0,
    rejected_count: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/dashboard/company");

      setStats((previous) => ({
        ...previous,
        ...(res.data.stats || {}),
      }));
    } catch (err) {
      console.error("Dashboard Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load company dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    [
      "Profile",
      stats.profile_completed ? "Completed" : "Incomplete",
      stats.profile_completed ? "#16a34a" : "#f59e0b",
    ],
    ["Jobs Posted", stats.jobs_posted, "#2563eb"],
    ["Applicants", stats.total_applicants, "#7c3aed"],
    ["Applied", stats.applied_count, "#f59e0b"],
    ["Shortlisted", stats.shortlisted_count, "#0ea5e9"],
    ["Interview", stats.interview_count, "#7c3aed"],
    ["Selected", stats.selected_count, "#16a34a"],
    ["Placed", stats.placed_count, "#15803d"],
    ["Rejected", stats.rejected_count, "#dc2626"],
  ];

  return (
    <DashboardLayout
      role="company"
      title={`Welcome, ${user?.name || "Company"} 👋`}
      subtitle="Placement Portal Dashboard"
    >
      {loading ? (
        <Loader text="Loading dashboard..." />
      ) : error ? (
        <div style={styles.errorBox}>
          <span>{error}</span>

          <button
            type="button"
            style={styles.retryButton}
            onClick={fetchDashboard}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <div style={styles.grid}>
            {cards.map(([title, value, color]) => (
              <StatCard
                key={title}
                title={title}
                value={value}
                color={color}
              />
            ))}
          </div>

          <div style={styles.two}>
            <PageCard>
              <h3 style={styles.sectionTitle}>
                Quick Actions
              </h3>

              <p style={styles.description}>
                Manage your company profile, publish jobs,
                and review recruitment activity.
              </p>

              <div style={styles.btns}>
                <button
                  type="button"
                  style={styles.btn}
                  onClick={() =>
                    navigate("/company/profile")
                  }
                >
                  Company Profile
                </button>

                <button
                  type="button"
                  style={styles.btn}
                  onClick={() =>
                    navigate("/company/post-job")
                  }
                >
                  Post Job
                </button>

                <button
                  type="button"
                  style={styles.btn}
                  onClick={() =>
                    navigate("/company/manage-jobs")
                  }
                >
                  Manage Jobs
                </button>
              </div>
            </PageCard>

            <PageCard>
              <h3 style={styles.sectionTitle}>
                Recruitment Tips
              </h3>

              <ul style={styles.list}>
                <li>Review applicants regularly.</li>
                <li>Keep your company profile updated.</li>
                <li>
                  Move candidates through hiring stages quickly.
                </li>
                <li>
                  Write clear and complete job descriptions.
                </li>
              </ul>
            </PageCard>
          </div>

          <PageCard>
            <h3 style={styles.sectionTitle}>
              Hiring Pipeline
            </h3>

            <p style={styles.description}>
              Track candidates as they move through your
              recruitment process.
            </p>

            <div style={styles.pipelineScroll}>
              <div style={styles.pipe}>
                <Stage
                  title="Applied"
                  value={stats.applied_count}
                />

                <Arrow />

                <Stage
                  title="Shortlisted"
                  value={stats.shortlisted_count}
                />

                <Arrow />

                <Stage
                  title="Interview"
                  value={stats.interview_count}
                />

                <Arrow />

                <Stage
                  title="Selected"
                  value={stats.selected_count}
                />

                <Arrow />

                <Stage
                  title="Placed"
                  value={stats.placed_count}
                />
              </div>
            </div>
          </PageCard>
        </>
      )}
    </DashboardLayout>
  );
};

const styles = {
  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
    gap: "18px",
    boxSizing: "border-box",
  },

  two: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
    gap: "20px",
    boxSizing: "border-box",
  },

  sectionTitle: {
    margin: "0 0 8px",
    color: "#1e293b",
    fontSize: "20px",
  },

  description: {
    margin: "0 0 18px",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  btns: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },

  btn: {
    flex: "1 1 140px",
    minWidth: 0,
    padding: "12px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },

  list: {
    margin: 0,
    paddingLeft: "20px",
    color: "#475569",
    lineHeight: "1.9",
  },

  pipelineScroll: {
    width: "100%",
    overflowX: "auto",
    paddingBottom: "8px",
  },

  pipe: {
    minWidth: "650px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
  },

  stage: {
    flex: 1,
    minWidth: "90px",
    textAlign: "center",
    padding: "15px 10px",
    background: "#f8fafc",
    borderRadius: "12px",
  },

  stageValue: {
    margin: 0,
    color: "#2563eb",
    fontSize: "26px",
  },

  stageTitle: {
    margin: "6px 0 0",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "600",
  },

  arrow: {
    flexShrink: 0,
    fontSize: "25px",
    color: "#94a3b8",
    fontWeight: "bold",
  },

  errorBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    padding: "16px",
    borderRadius: "12px",
    background: "#fff1f2",
    color: "#be123c",
  },

  retryButton: {
    padding: "9px 15px",
    border: "none",
    borderRadius: "8px",
    background: "#be123c",
    color: "#fff",
    cursor: "pointer",
  },
};

export default CompanyDashboard;