import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageCard from "../../components/ui/PageCard";
import StatusBadge from "../../components/ui/StatusBadge";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await API.get("/applications/my-applications");
      setApplications(response.data.applications || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout
      role="student"
      title="My Applications"
      subtitle="Track the jobs you applied for and their current status"
    >
      {loading ? (
        <Loader text="Loading your applications..." />
      ) : error ? (
        <PageCard>
          <p style={styles.error}>{error}</p>
        </PageCard>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          subtitle="You haven’t applied for any jobs yet. Explore available jobs and start applying."
        />
      ) : (
        <div style={styles.grid}>
          {applications.map((app) => (
            <PageCard key={app._id}>
              <h2 style={styles.jobTitle}>{app.job_title}</h2>

              <div style={styles.infoBlock}>
                <p><strong>Company:</strong> {app.company_name}</p>
                <p><strong>Email:</strong> {app.student_email}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <StatusBadge status={app.status} />
                </p>
                <p>
                  <strong>Applied At:</strong>{" "}
                  {app.applied_at
                    ? new Date(app.applied_at).toLocaleString()
                    : "N/A"}
                </p>
              </div>
            </PageCard>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
  },
  jobTitle: {
    fontSize: "22px",
    marginTop: 0,
    marginBottom: "12px",
    color: "#2563eb",
  },
  infoBlock: {
    color: "#475569",
    lineHeight: "1.8",
    fontSize: "15px",
  },
  error: {
    color: "red",
    margin: 0,
  },
};

export default MyApplications;