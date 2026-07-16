import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import BarStatsChart from "../../components/charts/BarStatsChart";
import StatusPieChart from "../../components/charts/StatusPieChart";
import RecentActivities from "../../components/RecentActivities";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    
  total_students: 0,
  total_companies: 0,
  total_jobs: 0,
  total_applications: 0,

  applied: 0,
  shortlisted: 0,
  selected: 0,
  rejected: 0,
});

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/admin/dashboard");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout
      role="admin"
      title="Admin Dashboard"
      subtitle="Placement Portal Analytics"
    >
      <StatusPieChart stats={stats} />
      <BarStatsChart stats={stats} />
      <RecentActivities />
      <div style={styles.grid}>
         <div style={styles.statusCard}>
          <h3>🟢 Selected</h3>
          <h1>{stats.selected}</h1>
        </div>
      
        <div style={styles.statusCard}>
          <h3>🟡 Shortlisted</h3>
          <h1>{stats.shortlisted}</h1>
        </div>
      
        <div style={styles.statusCard}>
          <h3>🔵 Applied</h3>
          <h1>{stats.applied}</h1>
        </div>
      
        <div style={styles.statusCard}>
          <h3>🔴 Rejected</h3>
          <h1>{stats.rejected}</h1>
        </div>

        <div style={styles.card}>
          <h2>👨‍🎓 Students</h2>
          <h1>{stats.total_students}</h1>
        </div>

        <div style={styles.card}>
          <h2>🏢 Companies</h2>
          <h1>{stats.total_companies}</h1>
        </div>

        <div style={styles.card}>
          <h2>💼 Jobs</h2>
          <h1>{stats.total_jobs}</h1>
        </div>

        <div style={styles.card}>
          <h2>📄 Applications</h2>
          <h1>{stats.total_applications}</h1>
        </div>

      </div>
    </DashboardLayout>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 6px 20px rgba(0,0,0,.08)",
    textAlign: "center",
  },
  statusCard: {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "25px",
  textAlign: "center",
  boxShadow: "0 8px 24px rgba(0,0,0,.08)",
},
};

export default AdminDashboard;