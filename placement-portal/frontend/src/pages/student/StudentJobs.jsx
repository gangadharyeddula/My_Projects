import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const StudentJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================================
  // FETCH AVAILABLE JOBS
  // =========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get(
        "/applications/jobs"
      );

      setJobs(response.data.jobs || []);
    } catch (err) {
      console.error(
        "Failed to fetch jobs:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to fetch available jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // APPLY FOR JOB
  // =========================================

  const handleApply = async (jobId) => {
    setMessage("");
    setError("");

    try {
      setApplyingJobId(jobId);

      const response = await API.post(
        `/applications/apply/${jobId}`
      );

      setMessage(
        response.data.message ||
          "Applied successfully."
      );
    } catch (err) {
      console.error(
        "Job application failed:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to apply for this job."
      );
    } finally {
      setApplyingJobId("");
    }
  };

  // =========================================
  // SEARCH JOBS
  // =========================================

  const filteredJobs = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return jobs;
    }

    return jobs.filter((job) => {
      const title = job.title || "";

      const company =
        job.company_name || "";

      const location =
        job.location || "";

      const skills = Array.isArray(
        job.skills_required
      )
        ? job.skills_required.join(" ")
        : job.skills_required || "";

      return (
        title
          .toLowerCase()
          .includes(query) ||
        company
          .toLowerCase()
          .includes(query) ||
        location
          .toLowerCase()
          .includes(query) ||
        skills
          .toLowerCase()
          .includes(query)
      );
    });
  }, [jobs, search]);

  // =========================================
  // DATE FORMATTER
  // =========================================

  const formatDeadline = (deadline) => {
    if (!deadline) {
      return "Not specified";
    }

    const date = new Date(deadline);

    if (Number.isNaN(date.getTime())) {
      return deadline;
    }

    return date.toLocaleDateString();
  };

  // =========================================
  // SKILLS FORMATTER
  // =========================================

  const getSkills = (skills) => {
    if (Array.isArray(skills)) {
      return skills.filter(Boolean);
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
      role="student"
      title="Available Jobs"
      subtitle="Explore placement opportunities and apply directly from your portal"
    >
      {/* ================================= */}
      {/* TOP BAR */}
      {/* ================================= */}

      <div style={styles.topBar}>
        <div>
          <p style={styles.totalLabel}>
            Available Opportunities
          </p>

          <h2 style={styles.totalNumber}>
            {filteredJobs.length}
          </h2>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="search"
            placeholder="Search jobs, companies, skills..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.search}
          />
        </div>
      </div>

      {/* ================================= */}
      {/* SUCCESS MESSAGE */}
      {/* ================================= */}

      {message && (
        <div style={styles.successBox}>
          <span>{message}</span>

          <button
            type="button"
            onClick={() => setMessage("")}
            style={styles.successClose}
          >
            ×
          </button>
        </div>
      )}

      {/* ================================= */}
      {/* ERROR MESSAGE */}
      {/* ================================= */}

      {error && (
        <div style={styles.errorBox}>
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            style={styles.errorClose}
          >
            ×
          </button>
        </div>
      )}

      {/* ================================= */}
      {/* LOADING */}
      {/* ================================= */}

      {loading ? (
        <div style={styles.stateCard}>
          <h3 style={styles.stateTitle}>
            Loading jobs...
          </h3>

          <p style={styles.stateText}>
            Please wait while placement
            opportunities are being loaded.
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        /* ================================= */
        /* EMPTY STATE */
        /* ================================= */

        <div style={styles.stateCard}>
          <h3 style={styles.stateTitle}>
            {search
              ? "No matching jobs found"
              : "No jobs available right now"}
          </h3>

          <p style={styles.stateText}>
            {search
              ? "Try searching with a different job title, company, location, or skill."
              : "New placement opportunities will appear here when companies post jobs."}
          </p>

          {search && (
            <button
              type="button"
              style={styles.clearButton}
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        /* ================================= */
        /* JOB CARDS */
        /* ================================= */

        <div style={styles.grid}>
          {filteredJobs.map((job) => {
            const skills = getSkills(
              job.skills_required
            );

            const isApplying =
              applyingJobId === job._id;

            return (
              <div
                key={job._id}
                style={styles.card}
              >
                {/* JOB HEADER */}

                <div style={styles.cardHeader}>
                  <div style={styles.titleArea}>
                    <h2 style={styles.jobTitle}>
                      {job.title ||
                        "Untitled Position"}
                    </h2>

                    <p style={styles.company}>
                      {job.company_name ||
                        "Company not specified"}
                    </p>
                  </div>

                  <span style={styles.jobBadge}>
                    Open
                  </span>
                </div>

                {/* JOB INFORMATION */}

                <div style={styles.detailsGrid}>
                  <div style={styles.detailItem}>
                    <span
                      style={styles.detailLabel}
                    >
                      Location
                    </span>

                    <strong
                      style={styles.detailValue}
                    >
                      {job.location ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div style={styles.detailItem}>
                    <span
                      style={styles.detailLabel}
                    >
                      Salary
                    </span>

                    <strong
                      style={styles.detailValue}
                    >
                      {job.salary ||
                        "Not specified"}
                    </strong>
                  </div>

                  <div style={styles.detailItem}>
                    <span
                      style={styles.detailLabel}
                    >
                      Deadline
                    </span>

                    <strong
                      style={styles.detailValue}
                    >
                      {formatDeadline(
                        job.deadline
                      )}
                    </strong>
                  </div>
                </div>

                {/* SKILLS */}

                <div style={styles.section}>
                  <p style={styles.sectionLabel}>
                    Skills Required
                  </p>

                  {skills.length > 0 ? (
                    <div
                      style={
                        styles.skillsContainer
                      }
                    >
                      {skills.map(
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
                      )}
                    </div>
                  ) : (
                    <p style={styles.noData}>
                      No specific skills listed.
                    </p>
                  )}
                </div>

                {/* DESCRIPTION */}

                <div style={styles.section}>
                  <p style={styles.sectionLabel}>
                    Job Description
                  </p>

                  <p style={styles.description}>
                    {job.description ||
                      "No job description provided."}
                  </p>
                </div>

                {/* APPLY BUTTON */}

                <div style={styles.cardFooter}>
                  <button
                    type="button"
                    style={{
                      ...styles.applyButton,

                      ...(isApplying
                        ? styles.disabledButton
                        : {}),
                    }}
                    disabled={isApplying}
                    onClick={() =>
                      handleApply(job._id)
                    }
                  >
                    {isApplying
                      ? "Applying..."
                      : "Apply Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

// =========================================
// STYLES
// =========================================

const styles = {
  topBar: {
    width: "100%",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "16px",

    padding: "20px",

    background: "#ffffff",

    borderRadius: "16px",

    boxShadow:
      "0 6px 20px rgba(15,23,42,0.06)",

    boxSizing: "border-box",
  },

  totalLabel: {
    margin: 0,

    color: "#64748b",

    fontSize: "14px",

    fontWeight: "600",
  },

  totalNumber: {
    margin: "5px 0 0",

    color: "#0f172a",

    fontSize: "30px",
  },

  searchWrapper: {
    flex: "1 1 260px",

    maxWidth: "450px",

    minWidth: 0,
  },

  search: {
    width: "100%",

    minWidth: 0,

    padding: "12px 14px",

    border: "1px solid #cbd5e1",

    borderRadius: "10px",

    outline: "none",

    fontSize: "14px",

    color: "#0f172a",

    boxSizing: "border-box",
  },

  // min(..., 100%) prevents cards from
  // forcing horizontal overflow on phones.

  grid: {
    width: "100%",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",

    gap: "20px",

    boxSizing: "border-box",
  },

  card: {
    minWidth: 0,

    display: "flex",

    flexDirection: "column",

    background: "#ffffff",

    borderRadius: "16px",

    padding: "clamp(18px, 3vw, 24px)",

    boxShadow:
      "0 8px 24px rgba(0,0,0,0.06)",

    boxSizing: "border-box",

    overflow: "hidden",
  },

  cardHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    gap: "12px",

    flexWrap: "wrap",

    paddingBottom: "16px",

    borderBottom: "1px solid #e2e8f0",
  },

  titleArea: {
    flex: "1 1 200px",

    minWidth: 0,
  },

  jobTitle: {
    margin: 0,

    color: "#2563eb",

    fontSize: "21px",

    lineHeight: "1.35",

    overflowWrap: "anywhere",
  },

  company: {
    margin: "7px 0 0",

    color: "#475569",

    fontWeight: "600",

    fontSize: "14px",

    overflowWrap: "anywhere",
  },

  jobBadge: {
    display: "inline-block",

    padding: "6px 10px",

    background: "#dcfce7",

    color: "#15803d",

    borderRadius: "999px",

    fontSize: "12px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },

  detailsGrid: {
    width: "100%",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(130px, 100%), 1fr))",

    gap: "12px",

    marginTop: "18px",
  },

  detailItem: {
    minWidth: 0,

    padding: "12px",

    background: "#f8fafc",

    borderRadius: "10px",
  },

  detailLabel: {
    display: "block",

    marginBottom: "5px",

    color: "#64748b",

    fontSize: "12px",

    fontWeight: "600",
  },

  detailValue: {
    display: "block",

    color: "#334155",

    fontSize: "14px",

    overflowWrap: "anywhere",
  },

  section: {
    marginTop: "20px",

    minWidth: 0,
  },

  sectionLabel: {
    margin: "0 0 10px",

    color: "#334155",

    fontSize: "14px",

    fontWeight: "700",
  },

  skillsContainer: {
    display: "flex",

    flexWrap: "wrap",

    gap: "8px",
  },

  skillBadge: {
    maxWidth: "100%",

    padding: "6px 10px",

    borderRadius: "999px",

    background: "#eff6ff",

    color: "#2563eb",

    fontSize: "12px",

    fontWeight: "600",

    overflowWrap: "anywhere",
  },

  noData: {
    margin: 0,

    color: "#94a3b8",

    fontSize: "13px",
  },

  description: {
    margin: 0,

    color: "#475569",

    lineHeight: "1.7",

    fontSize: "14px",

    whiteSpace: "pre-wrap",

    overflowWrap: "anywhere",
  },

  cardFooter: {
    marginTop: "auto",

    paddingTop: "22px",
  },

  applyButton: {
    width: "100%",

    padding: "13px 18px",

    border: "none",

    borderRadius: "10px",

    background: "#2563eb",

    color: "#ffffff",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "14px",
  },

  disabledButton: {
    opacity: 0.6,

    cursor: "not-allowed",
  },

  successBox: {
    width: "100%",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "12px",

    padding: "13px 15px",

    borderRadius: "10px",

    background: "#ecfdf5",

    color: "#047857",

    boxSizing: "border-box",

    overflowWrap: "anywhere",
  },

  errorBox: {
    width: "100%",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    gap: "12px",

    padding: "13px 15px",

    borderRadius: "10px",

    background: "#fff1f2",

    color: "#be123c",

    boxSizing: "border-box",

    overflowWrap: "anywhere",
  },

  successClose: {
    flexShrink: 0,

    border: "none",

    background: "transparent",

    color: "#047857",

    fontSize: "22px",

    cursor: "pointer",
  },

  errorClose: {
    flexShrink: 0,

    border: "none",

    background: "transparent",

    color: "#be123c",

    fontSize: "22px",

    cursor: "pointer",
  },

  stateCard: {
    width: "100%",

    padding: "45px 20px",

    background: "#ffffff",

    borderRadius: "16px",

    textAlign: "center",

    boxShadow:
      "0 8px 24px rgba(0,0,0,0.06)",

    boxSizing: "border-box",
  },

  stateTitle: {
    margin: 0,

    color: "#334155",

    fontSize: "19px",
  },

  stateText: {
    margin: "8px auto 0",

    maxWidth: "550px",

    color: "#64748b",

    fontSize: "14px",

    lineHeight: "1.6",
  },

  clearButton: {
    marginTop: "18px",

    padding: "10px 16px",

    border: "none",

    borderRadius: "9px",

    background: "#475569",

    color: "#ffffff",

    cursor: "pointer",

    fontWeight: "600",
  },
};

export default StudentJobs;