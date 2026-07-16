import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import StatCard from "../../components/ui/StatCard";
import PageCard from "../../components/ui/PageCard";
import Loader from "../../components/ui/Loader";

const CompanyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    profile_completed: false,
    jobs_posted: 0,
    total_applicants: 0,
    shortlisted_count: 0,
    selected_count: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/dashboard/company");
      setStats(response.data.stats);
    } catch (err) {
      console.error("Failed to fetch company dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="company"
      title={`Welcome, ${user?.name || "Company"} 👋`}
      subtitle="Newton’s Institute of Engineering Placement Portal"
    >
      {loading ? (
        <Loader text="Loading dashboard..." />
      ) : (
        <>
          <div style={styles.grid}>
            <StatCard
              title="Profile Status"
              value={stats.profile_completed ? "Completed" : "Incomplete"}
              color={stats.profile_completed ? "#16a34a" : "#f59e0b"}
              subtitle="Complete profile for better trust"
            />

            <StatCard
              title="Jobs Posted"
              value={stats.jobs_posted}
              color="#2563eb"
              subtitle="Total active and posted jobs"
            />

            <StatCard
              title="Total Applicants"
              value={stats.total_applicants}
              color="#7c3aed"
              subtitle="Students applied to your jobs"
            />

            <StatCard
              title="Shortlisted"
              value={stats.shortlisted_count}
              color="#0ea5e9"
              subtitle="Candidates moved to next round"
            />

            <StatCard
              title="Selected"
              value={stats.selected_count}
              color="#16a34a"
              subtitle="Final selected candidates"
            />
          </div>

          <div style={styles.bottomGrid}>
            <PageCard>
              <h3 style={styles.sectionTitle}>Quick Actions</h3>
              <div style={styles.buttonGroup}>
                <button
                  style={styles.primaryButton}
                  onClick={() => navigate("/company/profile")}
                >
                  Company Profile
                </button>

                <button
                  style={styles.primaryButton}
                  onClick={() => navigate("/company/post-job")}
                >
                  Post Job
                </button>

                <button
                  style={styles.primaryButton}
                  onClick={() => navigate("/company/manage-jobs")}
                >
                  Manage Jobs
                </button>
              </div>
            </PageCard>

            <PageCard>
              <h3 style={styles.sectionTitle}>Recruitment Tips</h3>
              <ul style={styles.list}>
                <li>Write clear job descriptions for better applicant quality.</li>
                <li>Shortlist candidates regularly to keep hiring active.</li>
                <li>Keep company profile complete for student trust.</li>
                <li>Review applicants quickly to improve engagement.</li>
              </ul>
            </PageCard>
          </div>

          <PageCard>
            <h3 style={styles.sectionTitle}>Hiring Activity Overview</h3>
            <div style={styles.progressRow}>
              <div style={styles.progressBlock}>
                <p style={styles.progressLabel}>Profile Completion</p>
                <div style={styles.progressWrapper}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width: stats.profile_completed ? "100%" : "45%",
                      background: stats.profile_completed ? "#16a34a" : "#f59e0b",
                    }}
                  />
                </div>
              </div>

              <div style={styles.progressBlock}>
                <p style={styles.progressLabel}>Hiring Pipeline</p>
                <div style={styles.progressWrapper}>
                  <div
                    style={{
                      ...styles.progressBar,
                      width:
                        stats.total_applicants > 0
                          ? `${Math.min(
                              (stats.shortlisted_count / stats.total_applicants) * 100,
                              100
                            )}%`
                          : "0%",
                      background: "#2563eb",
                    }}
                  />
                </div>
              </div>
            </div>

            <p style={styles.progressText}>
              Use your dashboard to track job postings, applicants, and hiring progress in one place.
            </p>
          </PageCard>
        </>
      )}
    </DashboardLayout>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  bottomGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  sectionTitle: {
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "20px",
    color: "#1e293b",
  },
  buttonGroup: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },
  primaryButton: {
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
  },
  list: {
    margin: 0,
    paddingLeft: "18px",
    color: "#475569",
    lineHeight: "1.9",
    fontSize: "15px",
  },
  progressRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "16px",
  },
  progressBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  progressLabel: {
    margin: 0,
    color: "#334155",
    fontWeight: "600",
  },
  progressWrapper: {
    width: "100%",
    height: "16px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: "999px",
    transition: "0.3s ease",
  },
  progressText: {
    margin: 0,
    color: "#475569",
    lineHeight: "1.7",
  },
};

export default CompanyDashboard;