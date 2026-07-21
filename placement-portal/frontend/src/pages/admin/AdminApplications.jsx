import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ResponsiveTable from "../../components/ui/ResponsiveTable";
import tableStyles from "../../components/ui/tableStyles";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  // =========================================
  // FETCH APPLICATIONS
  // =========================================

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/applications");

      setApplications(res.data.applications || []);
    } catch (err) {
      console.error("Failed to load applications:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE APPLICATION
  // =========================================

  const deleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/applications/${id}`);

      // Remove immediately from UI
      setApplications((previousApplications) =>
        previousApplications.filter(
          (application) => application._id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete application failed:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to delete application"
      );
    }
  };

  // =========================================
  // SEARCH / FILTER
  // =========================================

  const filteredApplications = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return applications;
    }

    return applications.filter((app) => {
      const studentName =
        app.student_name || "";

      const studentEmail =
        app.student_email || "";

      const companyName =
        app.company_name || "";

      const jobTitle =
        app.job_title || "";

      const status =
        app.status || "";

      return (
        studentName
          .toLowerCase()
          .includes(query) ||
        studentEmail
          .toLowerCase()
          .includes(query) ||
        companyName
          .toLowerCase()
          .includes(query) ||
        jobTitle
          .toLowerCase()
          .includes(query) ||
        status
          .toLowerCase()
          .includes(query)
      );
    });
  }, [applications, search]);

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    switch (
      String(status || "").toLowerCase()
    ) {
      case "applied":
        return {
          background: "#dbeafe",
          color: "#1d4ed8",
        };

      case "shortlisted":
        return {
          background: "#fef3c7",
          color: "#b45309",
        };

      case "interview":
        return {
          background: "#ede9fe",
          color: "#6d28d9",
        };

      case "selected":
        return {
          background: "#dcfce7",
          color: "#15803d",
        };

      case "placed":
        return {
          background: "#d1fae5",
          color: "#047857",
        };

      case "rejected":
        return {
          background: "#fee2e2",
          color: "#b91c1c",
        };

      default:
        return {
          background: "#e2e8f0",
          color: "#475569",
        };
    }
  };

  // =========================================
  // DATE FORMATTER
  // =========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleDateString();
  };

  // =========================================
  // UI
  // =========================================

  return (
    <DashboardLayout
      role="admin"
      title="Applications Management"
      subtitle="Manage and monitor all placement applications"
    >
      {/* TOP BAR */}

      <div style={styles.topBar}>
        <div>
          <h2 style={styles.totalTitle}>
            Total Applications
          </h2>

          <p style={styles.totalNumber}>
            {filteredApplications.length}
          </p>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="search"
            placeholder="Search student, company, job, status..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.search}
          />
        </div>
      </div>

      {/* ERROR */}

      {error && (
        <div style={styles.errorBox}>
          <span>{error}</span>

          <button
            type="button"
            onClick={fetchApplications}
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING / EMPTY / TABLE */}

      {loading ? (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>
            Loading applications...
          </h3>

          <p style={styles.stateText}>
            Please wait while application records
            are being loaded.
          </p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>
            {search
              ? "No matching applications found"
              : "No applications found"}
          </h3>

          <p style={styles.stateText}>
            {search
              ? "Try searching with a different student, company, job, or status."
              : "Student job applications will appear here."}
          </p>
        </div>
      ) : (
        <ResponsiveTable minWidth="1000px">
          <table style={tableStyles.table}>
            <thead style={tableStyles.thead}>
              <tr>
                <th style={tableStyles.th}>
                  Student
                </th>

                <th style={tableStyles.th}>
                  Email
                </th>

                <th style={tableStyles.th}>
                  Company
                </th>

                <th style={tableStyles.th}>
                  Job
                </th>

                <th style={tableStyles.th}>
                  Status
                </th>

                <th style={tableStyles.th}>
                  Applied
                </th>

                <th style={tableStyles.th}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map(
                (app) => (
                  <tr key={app._id}>
                    {/* STUDENT */}

                    <td style={tableStyles.td}>
                      <strong>
                        {app.student_name ||
                          "N/A"}
                      </strong>
                    </td>

                    {/* EMAIL */}

                    <td style={tableStyles.td}>
                      {app.student_email ||
                        "N/A"}
                    </td>

                    {/* COMPANY */}

                    <td style={tableStyles.td}>
                      {app.company_name ||
                        "N/A"}
                    </td>

                    {/* JOB */}

                    <td style={tableStyles.td}>
                      <div
                        style={styles.jobTitle}
                      >
                        {app.job_title || "N/A"}
                      </div>
                    </td>

                    {/* STATUS */}

                    <td style={tableStyles.td}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          ...getStatusStyle(
                            app.status
                          ),
                        }}
                      >
                        {app.status ||
                          "Unknown"}
                      </span>
                    </td>

                    {/* APPLIED DATE */}

                    <td style={tableStyles.td}>
                      <span
                        style={styles.dateText}
                      >
                        {formatDate(
                          app.applied_at
                        )}
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
                            deleteApplication(
                              app._id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </ResponsiveTable>
      )}

      {!loading &&
        filteredApplications.length > 0 && (
          <p style={styles.scrollHint}>
            On smaller screens, swipe the table
            horizontally to view all application
            details.
          </p>
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
    maxWidth: "450px",
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
    minWidth: "150px",
    maxWidth: "260px",
    whiteSpace: "normal",
    overflowWrap: "break-word",
    lineHeight: "1.5",
  },

  statusBadge: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  dateText: {
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

export default AdminApplications;