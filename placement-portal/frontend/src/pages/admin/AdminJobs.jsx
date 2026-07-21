import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ResponsiveTable from "../../components/ui/ResponsiveTable";
import tableStyles from "../../components/ui/tableStyles";

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  // =========================================
  // FETCH JOBS
  // =========================================

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/jobs");

      setJobs(res.data.jobs || []);
    } catch (err) {
      console.error("Failed to load jobs:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE JOB
  // =========================================

  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job? All applications related to this job will also be deleted."
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/jobs/${id}`);

      // Remove deleted job immediately
      setJobs((previousJobs) =>
        previousJobs.filter(
          (job) => job._id !== id
        )
      );
    } catch (err) {
      console.error("Delete job failed:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete job"
      );
    }
  };

  // =========================================
  // SEARCH / FILTER
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
      const company = job.company_name || "";
      const location = job.location || "";
      const salary = job.salary || "";

      return (
        title.toLowerCase().includes(query) ||
        company.toLowerCase().includes(query) ||
        location.toLowerCase().includes(query) ||
        String(salary)
          .toLowerCase()
          .includes(query)
      );
    });
  }, [jobs, search]);

  return (
    <DashboardLayout
      role="admin"
      title="Jobs Management"
      subtitle="Manage all jobs posted on the placement portal"
    >
      {/* ================================= */}
      {/* TOP BAR */}
      {/* ================================= */}

      <div style={styles.topBar}>
        <div>
          <h2 style={styles.totalTitle}>
            Total Jobs
          </h2>

          <p style={styles.totalNumber}>
            {filteredJobs.length}
          </p>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="search"
            placeholder="Search job, company, location..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.search}
          />
        </div>
      </div>

      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (
        <div style={styles.errorBox}>
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchJobs}
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {/* ================================= */}
      {/* LOADING */}
      {/* ================================= */}

      {loading ? (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>
            Loading jobs...
          </h3>

          <p style={styles.stateText}>
            Please wait while job records are being
            loaded.
          </p>
        </div>
      ) : filteredJobs.length === 0 ? (
        /* ================================= */
        /* EMPTY STATE */
        /* ================================= */

        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>
            {search
              ? "No matching jobs found"
              : "No jobs found"}
          </h3>

          <p style={styles.stateText}>
            {search
              ? "Try searching with a different job title, company, or location."
              : "Jobs posted by companies will appear here."}
          </p>
        </div>
      ) : (
        /* ================================= */
        /* RESPONSIVE JOBS TABLE */
        /* ================================= */

        <ResponsiveTable minWidth="950px">
          <table style={tableStyles.table}>
            <thead style={tableStyles.thead}>
              <tr>
                <th style={tableStyles.th}>
                  Company
                </th>

                <th style={tableStyles.th}>
                  Job Title
                </th>

                <th style={tableStyles.th}>
                  Location
                </th>

                <th style={tableStyles.th}>
                  Salary
                </th>

                <th style={tableStyles.th}>
                  Deadline
                </th>

                <th style={tableStyles.th}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job._id}>
                  {/* COMPANY */}

                  <td style={tableStyles.td}>
                    <strong>
                      {job.company_name || "N/A"}
                    </strong>
                  </td>

                  {/* JOB TITLE */}

                  <td style={tableStyles.td}>
                    <div style={styles.jobTitle}>
                      {job.title || "N/A"}
                    </div>
                  </td>

                  {/* LOCATION */}

                  <td style={tableStyles.td}>
                    {job.location || "N/A"}
                  </td>

                  {/* SALARY */}

                  <td style={tableStyles.td}>
                    {job.salary || "N/A"}
                  </td>

                  {/* DEADLINE */}

                  <td style={tableStyles.td}>
                    <span style={styles.deadline}>
                      {formatDeadline(job.deadline)}
                    </span>
                  </td>

                  {/* ACTION */}

                  <td style={tableStyles.td}>
                    <div
                      style={
                        tableStyles.actionGroup
                      }
                    >
                      <button
                        type="button"
                        style={
                          tableStyles.deleteButton
                        }
                        onClick={() =>
                          deleteJob(job._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTable>
      )}

      {/* MOBILE TABLE HELP */}

      {!loading &&
        filteredJobs.length > 0 && (
          <p style={styles.scrollHint}>
            On smaller screens, swipe the table
            horizontally to view all job details.
          </p>
        )}
    </DashboardLayout>
  );
};

// =========================================
// DEADLINE FORMATTER
// =========================================

const formatDeadline = (deadline) => {
  if (!deadline) {
    return "N/A";
  }

  const date = new Date(deadline);

  // If value cannot be parsed as a date,
  // show the original backend value.
  if (Number.isNaN(date.getTime())) {
    return deadline;
  }

  return date.toLocaleDateString();
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

  totalTitle: {
    margin: 0,

    color: "#64748b",

    fontSize: "14px",

    fontWeight: "600",
  },

  totalNumber: {
    margin: "5px 0 0",

    color: "#0f172a",

    fontSize: "30px",

    fontWeight: "700",
  },

  searchWrapper: {
    flex: "1 1 280px",

    maxWidth: "420px",

    minWidth: 0,
  },

  search: {
    width: "100%",

    padding: "12px 14px",

    borderRadius: "10px",

    border: "1px solid #cbd5e1",

    outline: "none",

    fontSize: "14px",

    boxSizing: "border-box",

    background: "#ffffff",

    color: "#0f172a",
  },

  jobTitle: {
    minWidth: "160px",

    maxWidth: "260px",

    fontWeight: "600",

    color: "#334155",

    lineHeight: "1.5",

    whiteSpace: "normal",

    overflowWrap: "break-word",
  },

  deadline: {
    whiteSpace: "nowrap",
  },

  errorBox: {
    width: "100%",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "12px",

    padding: "14px 16px",

    background: "#fff1f2",

    border: "1px solid #fecdd3",

    color: "#be123c",

    borderRadius: "12px",

    boxSizing: "border-box",
  },

  retryButton: {
    border: "none",

    borderRadius: "8px",

    padding: "8px 14px",

    background: "#be123c",

    color: "#ffffff",

    fontWeight: "600",

    cursor: "pointer",
  },

  stateBox: {
    width: "100%",

    padding: "45px 20px",

    background: "#ffffff",

    borderRadius: "16px",

    textAlign: "center",

    boxShadow:
      "0 6px 20px rgba(15,23,42,0.06)",

    boxSizing: "border-box",
  },

  stateTitle: {
    margin: 0,

    color: "#334155",

    fontSize: "19px",
  },

  stateText: {
    margin: "8px 0 0",

    color: "#64748b",

    fontSize: "14px",

    lineHeight: "1.6",
  },

  scrollHint: {
    margin: "-5px 0 0",

    color: "#64748b",

    fontSize: "12px",

    lineHeight: "1.5",
  },
};

export default AdminJobs;