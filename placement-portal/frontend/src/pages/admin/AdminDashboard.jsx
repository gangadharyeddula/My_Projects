import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import BarStatsChart from "../../components/charts/BarStatsChart";
import StatusPieChart from "../../components/charts/StatusPieChart";
import RecentActivities from "../../components/RecentActivities";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_student_accounts: 0,
    total_company_accounts: 0,

    total_student_profiles: 0,
    total_company_profiles: 0,

    total_jobs: 0,
    total_applications: 0,

    applied: 0,
    shortlisted: 0,
    interview: 0,
    selected: 0,
    placed: 0,
    rejected: 0,
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

      const res = await API.get("/admin/dashboard");

      console.log("Admin Dashboard Data:", res.data);

      setStats((previousStats) => ({
        ...previousStats,
        ...res.data,
      }));
    } catch (err) {
      console.error(
        "Failed to fetch admin dashboard:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load dashboard statistics."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="admin"
      title="Admin Dashboard"
      subtitle="Placement Portal Analytics"
    >
      {/* ERROR MESSAGE */}
      {error && (
        <div style={styles.errorBox}>
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div style={styles.loadingBox}>
          Loading dashboard...
        </div>
      ) : (
        <>
          {/* ============================= */}
          {/* CHARTS */}
          {/* ============================= */}

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Placement Analytics
                </h2>

                <p style={styles.sectionSubtitle}>
                  Overview of portal activity and application
                  progress
                </p>
              </div>
            </div>

            <div style={styles.chartGrid}>
              <StatusPieChart stats={stats} />

              <BarStatsChart stats={stats} />
            </div>
          </section>

          {/* ============================= */}
          {/* APPLICATION STATUS */}
          {/* ============================= */}

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Application Status
                </h2>

                <p style={styles.sectionSubtitle}>
                  Current placement application pipeline
                </p>
              </div>
            </div>

            <div style={styles.statusGrid}>
              <StatusCard
                icon="🔵"
                title="Applied"
                value={stats.applied}
              />

              <StatusCard
                icon="🟡"
                title="Shortlisted"
                value={stats.shortlisted}
              />

              <StatusCard
                icon="🟣"
                title="Interview"
                value={stats.interview}
              />

              <StatusCard
                icon="🟢"
                title="Selected"
                value={stats.selected}
              />

              <StatusCard
                icon="🏆"
                title="Placed"
                value={stats.placed}
              />

              <StatusCard
                icon="🔴"
                title="Rejected"
                value={stats.rejected}
              />
            </div>
          </section>

          {/* ============================= */}
          {/* PORTAL STATISTICS */}
          {/* ============================= */}

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Portal Statistics
                </h2>

                <p style={styles.sectionSubtitle}>
                  Registered accounts, profiles, jobs and
                  applications
                </p>
              </div>
            </div>

            <div style={styles.statsGrid}>
              <StatCard
                icon="👨‍🎓"
                title="Student Accounts"
                value={stats.total_student_accounts}
                subtitle="Registered users with student access"
              />

              <StatCard
                icon="🏢"
                title="Company Accounts"
                value={stats.total_company_accounts}
                subtitle="Users approved with company access"
              />

              <StatCard
                icon="📋"
                title="Student Profiles"
                value={stats.total_student_profiles}
                subtitle="Completed student profiles"
              />

              <StatCard
                icon="🏬"
                title="Company Profiles"
                value={stats.total_company_profiles}
                subtitle="Completed company profiles"
              />

              <StatCard
                icon="💼"
                title="Jobs"
                value={stats.total_jobs}
                subtitle="Jobs posted on the portal"
              />

              <StatCard
                icon="📄"
                title="Applications"
                value={stats.total_applications}
                subtitle="Total placement applications"
              />
            </div>
          </section>

          {/* ============================= */}
          {/* RECENT ACTIVITIES */}
          {/* ============================= */}

          <section style={styles.section}>
            <div style={styles.sectionHeader}>
              <div>
                <h2 style={styles.sectionTitle}>
                  Recent Activities
                </h2>

                <p style={styles.sectionSubtitle}>
                  Latest placement portal activity
                </p>
              </div>
            </div>

            <div style={styles.activityWrapper}>
              <RecentActivities />
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  );
};

/* ========================================= */
/* SMALL REUSABLE STATUS CARD */
/* ========================================= */

const StatusCard = ({ icon, title, value }) => {
  return (
    <div style={styles.statusCard}>
      <div style={styles.iconBox}>
        {icon}
      </div>

      <div style={styles.cardContent}>
        <p style={styles.statusTitle}>
          {title}
        </p>

        <h2 style={styles.statusNumber}>
          {value ?? 0}
        </h2>
      </div>
    </div>
  );
};

/* ========================================= */
/* SMALL REUSABLE STAT CARD */
/* ========================================= */

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <div style={styles.iconBox}>
          {icon}
        </div>

        <h3 style={styles.cardHeading}>
          {title}
        </h3>
      </div>

      <h1 style={styles.number}>
        {value ?? 0}
      </h1>

      <p style={styles.cardSubtitle}>
        {subtitle}
      </p>
    </div>
  );
};

/* ========================================= */
/* STYLES */
/* ========================================= */

const styles = {
  section: {
    width: "100%",
    minWidth: 0,
    boxSizing: "border-box",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "15px",
  },

  sectionTitle: {
    margin: 0,
    color: "#0f172a",
    fontSize: "clamp(19px, 2.5vw, 24px)",
    lineHeight: "1.3",
  },

  sectionSubtitle: {
    margin: "5px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  /* CHARTS */

  chartGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 380px), 1fr))",

    gap: "20px",

    width: "100%",

    minWidth: 0,

    alignItems: "stretch",
  },

  /* APPLICATION STATUS */

  statusGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 180px), 1fr))",

    gap: "16px",

    width: "100%",

    minWidth: 0,
  },

  statusCard: {
    minWidth: 0,

    display: "flex",

    alignItems: "center",

    gap: "15px",

    background: "#ffffff",

    padding: "clamp(16px, 3vw, 22px)",

    borderRadius: "16px",

    boxShadow:
      "0 6px 20px rgba(15,23,42,0.07)",

    boxSizing: "border-box",
  },

  statusTitle: {
    margin: 0,

    color: "#64748b",

    fontSize: "14px",

    fontWeight: "600",
  },

  statusNumber: {
    margin: "5px 0 0",

    color: "#0f172a",

    fontSize: "clamp(25px, 4vw, 32px)",
  },

  /* GENERAL STATS */

  statsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",

    gap: "16px",

    width: "100%",

    minWidth: 0,
  },

  card: {
    minWidth: 0,

    background: "#ffffff",

    padding: "clamp(18px, 3vw, 25px)",

    borderRadius: "16px",

    boxShadow:
      "0 6px 20px rgba(15,23,42,0.07)",

    boxSizing: "border-box",

    overflow: "hidden",
  },

  cardTop: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    minWidth: 0,
  },

  iconBox: {
    width: "44px",

    height: "44px",

    minWidth: "44px",

    borderRadius: "12px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#eff6ff",

    fontSize: "21px",
  },

  cardContent: {
    minWidth: 0,
  },

  cardHeading: {
    margin: 0,

    color: "#334155",

    fontSize: "16px",

    lineHeight: "1.4",

    overflowWrap: "break-word",
  },

  number: {
    margin: "18px 0 0",

    color: "#0f172a",

    fontSize: "clamp(28px, 4vw, 36px)",

    lineHeight: 1,
  },

  cardSubtitle: {
    margin: "10px 0 0",

    color: "#64748b",

    fontSize: "13px",

    lineHeight: "1.5",

    overflowWrap: "break-word",
  },

  /* RECENT ACTIVITY */

  activityWrapper: {
    width: "100%",

    minWidth: 0,

    overflowX: "auto",

    boxSizing: "border-box",
  },

  /* STATES */

  loadingBox: {
    width: "100%",

    padding: "50px 20px",

    background: "#ffffff",

    borderRadius: "16px",

    textAlign: "center",

    color: "#64748b",

    boxSizing: "border-box",
  },

  errorBox: {
    width: "100%",

    padding: "14px 16px",

    background: "#fff1f2",

    color: "#be123c",

    border: "1px solid #fecdd3",

    borderRadius: "12px",

    boxSizing: "border-box",
  },
};

export default AdminDashboard;