import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await API.get("/applications/jobs");
      setJobs(response.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to fetch jobs");
    }
  };

  const handleApply = async (jobId) => {
    setMessage("");
    setError("");

    try {
      const response = await API.post(`/applications/apply/${jobId}`);
      setMessage(response.data.message || "Applied successfully");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to apply for job");
    }
  };

  return (
    <DashboardLayout
      role="student"
      title="Available Jobs"
      subtitle="Explore opportunities and apply from your portal"
    >
      {message && <p style={styles.success}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}

      {jobs.length === 0 ? (
        <div style={styles.emptyCard}>
          <p>No jobs available right now.</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {jobs.map((job) => (
            <div key={job._id} style={styles.card}>
              <h2 style={styles.jobTitle}>{job.title}</h2>
              <p><strong>Company:</strong> {job.company_name}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Salary:</strong> {job.salary}</p>
              <p><strong>Skills:</strong> {job.skills_required?.join(", ")}</p>
              <p><strong>Deadline:</strong> {job.deadline}</p>
              <p style={styles.description}>{job.description}</p>

              <button
                style={styles.button}
                onClick={() => handleApply(job._id)}
              >
                Apply
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
  success: {
    color: "green",
    marginBottom: "16px",
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

export default StudentJobs;