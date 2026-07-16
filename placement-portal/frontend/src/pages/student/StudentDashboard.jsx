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

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await API.get("/dashboard/student");
      setStats(response.data.stats);
    } catch (err) {
      console.error("Failed to fetch student dashboard stats", err);
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
      ) : (
        <>
          <div style={styles.grid}>
            <StatCard
              title="Profile Status"
              value={stats.profile_completed ? "Completed" : "Incomplete"}
              color={stats.profile_completed ? "#16a34a" : "#f59e0b"}
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
              subtitle="Congratulations on your progress"
            />
          </div>

          <div style={styles.bottomGrid}>
            <PageCard>
              <h3 style={styles.sectionTitle}>Quick Actions</h3>
              <div style={styles.buttonGroup}>
                <button
                  style={styles.primaryButton}
                  onClick={() => navigate("/student/profile")}
                >
                  My Profile
                </button>

                <button
                  style={styles.primaryButton}
                  onClick={() => navigate("/student/jobs")}
                >
                  View Jobs
                </button>

                <button
                  style={styles.primaryButton}
                  onClick={() => navigate("/student/applications")}
                >
                  My Applications
                </button>
              </div>
            </PageCard>

            <PageCard>
              <h3 style={styles.sectionTitle}>Placement Tips</h3>
              <ul style={styles.list}>
                <li>Complete your profile to improve recruiter visibility.</li>
                <li>Apply early before deadlines close.</li>
                <li>Keep your resume link updated and working.</li>
                <li>Track application status regularly from the portal.</li>
              </ul>
            </PageCard>
          </div>

          <PageCard>
            <h3 style={styles.sectionTitle}>Profile Completion Overview</h3>
            <div style={styles.progressWrapper}>
              <div
                style={{
                  ...styles.progressBar,
                  width: stats.profile_completed ? "100%" : "45%",
                  background: stats.profile_completed ? "#16a34a" : "#f59e0b",
                }}
              />
            </div>
            <p style={styles.progressText}>
              {stats.profile_completed
                ? "Your profile is fully completed and ready for placements."
                : "Your profile is incomplete. Add all details to improve your placement readiness."}
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
  progressWrapper: {
    width: "100%",
    height: "16px",
    background: "#e2e8f0",
    borderRadius: "999px",
    overflow: "hidden",
    marginBottom: "14px",
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

export default StudentDashboard;
