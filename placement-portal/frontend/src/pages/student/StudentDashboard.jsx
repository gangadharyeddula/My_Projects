import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import PageCard from "../../components/ui/PageCard";
import Loader from "../../components/ui/Loader";

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    profile_completed: false,
    jobs_available: 0,
    applications_count: 0,
    shortlisted_count: 0,
    selected_count: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  // =========================================
  // FETCH STUDENT DASHBOARD STATS
  // =========================================

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/dashboard/student"
      );

      setStats(
        response.data.stats || {
          profile_completed: false,
          jobs_available: 0,
          applications_count: 0,
          shortlisted_count: 0,
          selected_count: 0,
        }
      );
    } catch (err) {
      console.error(
        "Failed to fetch student dashboard stats:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load dashboard information."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="student"
      title={`Welcome, ${user?.name || "Student"} 👋`}
      subtitle="Newton’s Institute of Engineering Placement Portal"
    >
      {loading ? (
        <Loader text="Loading dashboard..." />
      ) : error ? (
        <div style={styles.errorBox}>
          <div>
            <strong>
              Unable to load dashboard
            </strong>

            <p style={styles.errorText}>
              {error}
            </p>
          </div>

          <button
            type="button"
            onClick={fetchStats}
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* ================================= */}
          {/* STATISTICS */}
          {/* ================================= */}

          <div style={styles.grid}>
            <StatCard
              title="Profile Status"
              value={
                stats.profile_completed
                  ? "Completed"
                  : "Incomplete"
              }
              color={
                stats.profile_completed
                  ? "#16a34a"
                  : "#f59e0b"
              }
              subtitle="Keep your profile updated"
            />

            <StatCard
              title="Jobs Available"
              value={stats.jobs_available}
              color="#2563eb"
              subtitle="Active opportunities for you"
            />

            <StatCard
              title="My Applications"
              value={stats.applications_count}
              color="#7c3aed"
              subtitle="Jobs you have applied for"
            />

            <StatCard
              title="Shortlisted"
              value={stats.shortlisted_count}
              color="#0ea5e9"
              subtitle="Applications moved to next round"
            />

            <StatCard
              title="Selected"
              value={stats.selected_count}
              color="#16a34a"
              subtitle="Your successful selections"
            />
          </div>

          {/* ================================= */}
          {/* QUICK ACTIONS + TIPS */}
          {/* ================================= */}

          <div style={styles.bottomGrid}>
            <PageCard>
              <h3 style={styles.sectionTitle}>
                Quick Actions
              </h3>

              <p style={styles.sectionDescription}>
                Access the most important placement
                features quickly.
              </p>

              <div style={styles.buttonGroup}>
                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={() =>
                    navigate("/student/profile")
                  }
                >
                  My Profile
                </button>

                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={() =>
                    navigate("/student/jobs")
                  }
                >
                  View Jobs
                </button>

                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={() =>
                    navigate(
                      "/student/applications"
                    )
                  }
                >
                  My Applications
                </button>
              </div>
            </PageCard>

            <PageCard>
              <h3 style={styles.sectionTitle}>
                Placement Tips
              </h3>

              <ul style={styles.list}>
                <li>
                  Complete your profile to improve
                  recruiter visibility.
                </li>

                <li>
                  Apply early before job deadlines
                  close.
                </li>

                <li>
                  Keep your resume updated with your
                  latest skills and projects.
                </li>

                <li>
                  Track your application status
                  regularly from the portal.
                </li>
              </ul>
            </PageCard>
          </div>

          {/* ================================= */}
          {/* PROFILE COMPLETION */}
          {/* ================================= */}

          <PageCard>
            <div style={styles.progressHeader}>
              <div>
                <h3 style={styles.sectionTitle}>
                  Profile Completion Overview
                </h3>

                <p
                  style={
                    styles.sectionDescription
                  }
                >
                  A complete profile helps companies
                  review your placement information.
                </p>
              </div>

              <span
                style={{
                  ...styles.profileBadge,

                  ...(stats.profile_completed
                    ? styles.completedBadge
                    : styles.incompleteBadge),
                }}
              >
                {stats.profile_completed
                  ? "Completed"
                  : "Incomplete"}
              </span>
            </div>

            <div style={styles.progressWrapper}>
              <div
                style={{
                  ...styles.progressBar,

                  width: stats.profile_completed
                    ? "100%"
                    : "45%",

                  background:
                    stats.profile_completed
                      ? "#16a34a"
                      : "#f59e0b",
                }}
              />
            </div>

            <p style={styles.progressText}>
              {stats.profile_completed
                ? "Your profile is completed and ready for placement opportunities."
                : "Your profile is incomplete. Add all required details and upload your resume to improve your placement readiness."}
            </p>

            {!stats.profile_completed && (
              <button
                type="button"
                style={styles.completeButton}
                onClick={() =>
                  navigate("/student/profile")
                }
              >
                Complete Profile
              </button>
            )}
          </PageCard>
        </>
      )}
    </DashboardLayout>
  );
};

const styles = {
  // Automatically becomes fewer columns
  // as screen width decreases.

  grid: {
    width: "100%",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",

    gap: "18px",

    boxSizing: "border-box",
  },

  // Unlike the old fixed 1fr 1fr layout,
  // this automatically stacks on smaller screens.

  bottomGrid: {
    width: "100%",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",

    gap: "20px",

    boxSizing: "border-box",
  },

  sectionTitle: {
    margin: 0,

    marginBottom: "8px",

    fontSize: "20px",

    color: "#1e293b",

    overflowWrap: "break-word",
  },

  sectionDescription: {
    margin: "0 0 18px",

    color: "#64748b",

    fontSize: "14px",

    lineHeight: "1.6",
  },

  buttonGroup: {
    width: "100%",

    display: "flex",

    gap: "12px",

    flexWrap: "wrap",
  },

  primaryButton: {
    flex: "1 1 140px",

    minWidth: 0,

    padding: "12px 16px",

    border: "none",

    borderRadius: "10px",

    background: "#2563eb",

    color: "#ffffff",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "14px",

    textAlign: "center",
  },

  list: {
    margin: 0,

    paddingLeft: "20px",

    color: "#475569",

    lineHeight: "1.9",

    fontSize: "15px",

    overflowWrap: "break-word",
  },

  progressHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    flexWrap: "wrap",

    gap: "12px",

    marginBottom: "5px",
  },

  profileBadge: {
    display: "inline-block",

    padding: "7px 12px",

    borderRadius: "999px",

    fontSize: "12px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },

  completedBadge: {
    background: "#dcfce7",

    color: "#15803d",
  },

  incompleteBadge: {
    background: "#fef3c7",

    color: "#b45309",
  },

  progressWrapper: {
    width: "100%",

    height: "14px",

    background: "#e2e8f0",

    borderRadius: "999px",

    overflow: "hidden",

    marginBottom: "14px",
  },

  progressBar: {
    height: "100%",

    borderRadius: "999px",

    transition: "width 0.3s ease",
  },

  progressText: {
    margin: 0,

    color: "#475569",

    lineHeight: "1.7",

    fontSize: "14px",

    overflowWrap: "break-word",
  },

  completeButton: {
    marginTop: "18px",

    width: "100%",

    maxWidth: "220px",

    padding: "12px 16px",

    border: "none",

    borderRadius: "10px",

    background: "#f59e0b",

    color: "#ffffff",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "14px",
  },

  errorBox: {
    width: "100%",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "15px",

    padding: "20px",

    background: "#fff1f2",

    border: "1px solid #fecdd3",

    borderRadius: "14px",

    color: "#be123c",

    boxSizing: "border-box",
  },

  errorText: {
    margin: "6px 0 0",

    fontSize: "14px",
  },

  retryButton: {
    padding: "9px 16px",

    border: "none",

    borderRadius: "8px",

    background: "#be123c",

    color: "#ffffff",

    cursor: "pointer",

    fontWeight: "600",
  },
};

export default StudentDashboard;