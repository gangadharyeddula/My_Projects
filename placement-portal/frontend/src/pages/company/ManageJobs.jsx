import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/jobs/my-jobs"
      );

      setJobs(response.data.jobs || []);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Failed to fetch jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter((job) => {
      return (
        job.title
          ?.toLowerCase()
          .includes(query) ||
        job.location
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [jobs, search]);

  const formatSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills;
    }

    if (typeof skills === "string") {
      return skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    return [];
  };

  return (
    <DashboardLayout
      role="company"
      title="Manage Jobs"
      subtitle="View your posted jobs and check applicants"
    >
      <div style={styles.topBar}>
        <div>
          <p style={styles.totalLabel}>
            Jobs Posted
          </p>

          <h2 style={styles.totalNumber}>
            {filteredJobs.length}
          </h2>
        </div>

        <input
          type="search"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          style={styles.search}
        />
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={styles.emptyCard}>
          Loading jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3 style={styles.emptyTitle}>
            No jobs posted yet
          </h3>

          <p style={styles.emptyText}>
            Post your first job opportunity to
            start receiving student applications.
          </p>

          <button
            type="button"
            style={styles.postButton}
            onClick={() =>
              navigate("/company/post-job")
            }
          >
            Post a Job
          </button>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3 style={styles.emptyTitle}>
            No matching jobs
          </h3>

          <button
            type="button"
            style={styles.postButton}
            onClick={() => setSearch("")}
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredJobs.map((job) => {
            const skills = formatSkills(
              job.skills_required
            );

            return (
              <div
                key={job._id}
                style={styles.card}
              >
                <h2 style={styles.jobTitle}>
                  {job.title}
                </h2>

                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.label}>
                      Location
                    </span>

                    <strong>
                      {job.location ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.label}>
                      Salary
                    </span>

                    <strong>
                      {job.salary ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div style={styles.infoItem}>
                    <span style={styles.label}>
                      Deadline
                    </span>

                    <strong>
                      {job.deadline ||
                        "Not specified"}
                    </strong>
                  </div>
                </div>

                <div style={styles.skillsSection}>
                  <p style={styles.sectionTitle}>
                    Required Skills
                  </p>

                  <div style={styles.skills}>
                    {skills.length > 0 ? (
                      skills.map(
                        (skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            style={
                              styles.skillBadge
                            }
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <span style={styles.noData}>
                        No skills specified
                      </span>
                    )}
                  </div>
                </div>

                <p style={styles.description}>
                  {job.description ||
                    "No description provided."}
                </p>

                <button
                  type="button"
                  style={styles.button}
                  onClick={() =>
                    navigate(
                      `/company/applicants/${job._id}`
                    )
                  }
                >
                  View Applicants
                </button>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

const styles = {
  topBar: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    padding: "20px",
    background: "#fff",
    borderRadius: "16px",
    boxSizing: "border-box",
  },

  totalLabel: {
    margin: 0,
    color: "#64748b",
    fontSize: "14px",
  },

  totalNumber: {
    margin: "5px 0 0",
    color: "#0f172a",
    fontSize: "30px",
  },

  search: {
    flex: "1 1 240px",
    maxWidth: "400px",
    minWidth: 0,
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    boxSizing: "border-box",
  },

  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
    gap: "20px",
  },

  card: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    background: "#fff",
    borderRadius: "16px",
    padding: "clamp(18px, 3vw, 22px)",
    boxShadow:
      "0 8px 24px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },

  jobTitle: {
    margin: "0 0 16px",
    fontSize: "22px",
    color: "#2563eb",
    overflowWrap: "anywhere",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(120px, 100%), 1fr))",
    gap: "10px",
  },

  infoItem: {
    minWidth: 0,
    padding: "11px",
    background: "#f8fafc",
    borderRadius: "9px",
    color: "#334155",
    overflowWrap: "anywhere",
  },

  label: {
    display: "block",
    marginBottom: "5px",
    color: "#64748b",
    fontSize: "12px",
  },

  skillsSection: {
    marginTop: "18px",
  },

  sectionTitle: {
    margin: "0 0 9px",
    color: "#334155",
    fontWeight: "700",
    fontSize: "14px",
  },

  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
  },

  skillBadge: {
    maxWidth: "100%",
    padding: "6px 9px",
    background: "#eff6ff",
    color: "#2563eb",
    borderRadius: "999px",
    fontSize: "12px",
    overflowWrap: "anywhere",
  },

  noData: {
    color: "#94a3b8",
    fontSize: "13px",
  },

  description: {
    flex: 1,
    marginTop: "18px",
    color: "#475569",
    lineHeight: "1.6",
    overflowWrap: "anywhere",
  },

  button: {
    width: "100%",
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
    padding: "13px",
    borderRadius: "10px",
    background: "#fff1f2",
    color: "#be123c",
  },

  emptyCard: {
    width: "100%",
    padding: "40px 20px",
    background: "#fff",
    borderRadius: "16px",
    textAlign: "center",
    boxSizing: "border-box",
  },

  emptyTitle: {
    margin: 0,
    color: "#334155",
  },

  emptyText: {
    color: "#64748b",
    lineHeight: "1.6",
  },

  postButton: {
    marginTop: "10px",
    padding: "11px 18px",
    border: "none",
    borderRadius: "9px",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  },
};

export default ManageJobs;