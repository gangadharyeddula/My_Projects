import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get("/jobs/my-jobs");
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch jobs");
    }
  };

  return (
    <DashboardLayout
      role="company"
      title="Manage Jobs"
      subtitle="View your posted jobs and check applicants"
    >
      {error && <p style={styles.error}>{error}</p>}

      {jobs.length === 0 ? (
        <div style={styles.emptyCard}>
          <p>No jobs posted yet.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => (
            <div key={job._id} style={styles.card}>
              <h2 style={styles.jobTitle}>{job.title}</h2>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Deadline:</strong> {job.deadline}</p>
              <p><strong>Skills:</strong> {job.skills_required?.join(", ")}</p>
              <p style={styles.description}>{job.description}</p>

              <button
                style={styles.button}
                onClick={() => navigate(`/company/applicants/${job._id}`)}
              >
                View Applicants
              </button>
            </div>
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
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  jobTitle: {
    fontSize: "22px",
    marginBottom: "10px",
    color: "#2563eb",
  },
  description: {
    marginTop: "12px",
    color: "#475569",
    lineHeight: "1.6",
  },
  button: {
    marginTop: "16px",
    padding: "12px 18px",
    border: "none",
    borderRadius: "10px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
  error: {
    color: "red",
    marginBottom: "16px",
  },
  emptyCard: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
};

export default ManageJobs;