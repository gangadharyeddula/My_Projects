import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const getStatusColor = (status) => {
  switch (status) {
    case "Applied":
      return "#f59e0b";

    case "Shortlisted":
      return "#2563eb";

    case "Interview":
      return "#7c3aed";

    case "Selected":
      return "#16a34a";

    case "Placed":
      return "#15803d";

    case "Rejected":
      return "#dc2626";

    default:
      return "#64748b";
  }
};

const getStatusBackground = (status) => {
  switch (status) {
    case "Applied":
      return "#fffbeb";

    case "Shortlisted":
      return "#eff6ff";

    case "Interview":
      return "#f5f3ff";

    case "Selected":
    case "Placed":
      return "#ecfdf5";

    case "Rejected":
      return "#fff1f2";

    default:
      return "#f8fafc";
  }
};

const Applicants = () => {
  const { jobId } = useParams();

  const [applicants, setApplicants] =
    useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [updatingId, setUpdatingId] =
    useState("");

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/applications/job-applicants/${jobId}`
      );

      setApplicants(
        res.data.applicants || []
      );
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          "Failed to load applicants."
      );
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (
    applicationId,
    status
  ) => {
    try {
      setUpdatingId(applicationId);

      await API.put(
        `/applications/update-status/${applicationId}`,
        {
          status,
        }
      );

      toast.success(
        `Status updated to ${status}`
      );

      setApplicants((previous) =>
        previous.map((applicant) =>
          applicant._id === applicationId
            ? {
                ...applicant,
                status,
              }
            : applicant
        )
      );
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
          "Failed to update status"
      );

      console.error(err);

      await fetchApplicants();
    } finally {
      setUpdatingId("");
    }
  };

  const filteredApplicants = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return applicants.filter((applicant) => {
      const matchesSearch =
        !query ||
        applicant.student_name
          ?.toLowerCase()
          .includes(query) ||
        applicant.student_email
          ?.toLowerCase()
          .includes(query) ||
        applicant.branch
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        applicant.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [
    applicants,
    search,
    statusFilter,
  ]);

  return (
    <DashboardLayout
      role="company"
      title="Applicants"
      subtitle="Review students who applied for this job and manage their hiring status"
    >
      <div style={styles.topBar}>
        <div>
          <p style={styles.totalLabel}>
            Total Applicants
          </p>

          <h2 style={styles.totalNumber}>
            {filteredApplicants.length}
          </h2>
        </div>

        <div style={styles.filters}>
          <input
            type="search"
            placeholder="Search applicants..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.search}
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            style={styles.filterSelect}
          >
            <option value="All">
              All Status
            </option>

            <option value="Applied">
              Applied
            </option>

            <option value="Shortlisted">
              Shortlisted
            </option>

            <option value="Interview">
              Interview
            </option>

            <option value="Selected">
              Selected
            </option>

            <option value="Placed">
              Placed
            </option>

            <option value="Rejected">
              Rejected
            </option>
          </select>
        </div>
      </div>

      {error && (
        <div style={styles.errorBox}>
          <span>{error}</span>

          <button
            type="button"
            style={styles.retryButton}
            onClick={fetchApplicants}
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div style={styles.emptyCard}>
          Loading applicants...
        </div>
      ) : applicants.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3 style={styles.emptyTitle}>
            No applicants found
          </h3>

          <p style={styles.emptyText}>
            Students who apply for this job will
            appear here.
          </p>
        </div>
      ) : filteredApplicants.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3 style={styles.emptyTitle}>
            No matching applicants
          </h3>

          <button
            type="button"
            style={styles.clearButton}
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filteredApplicants.map(
            (applicant) => {
              const isUpdating =
                updatingId === applicant._id;

              return (
                <div
                  key={applicant._id}
                  style={styles.card}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.nameArea}>
                      <h2
                        style={
                          styles.studentName
                        }
                      >
                        {applicant.student_name ||
                          "Student"}
                      </h2>

                      <p
                        style={
                          styles.studentEmail
                        }
                      >
                        {applicant.student_email ||
                          "Email not available"}
                      </p>
                    </div>

                    <span
                      style={{
                        ...styles.statusBadge,

                        color:
                          getStatusColor(
                            applicant.status
                          ),

                        background:
                          getStatusBackground(
                            applicant.status
                          ),
                      }}
                    >
                      {applicant.status ||
                        "Applied"}
                    </span>
                  </div>

                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span
                        style={
                          styles.infoLabel
                        }
                      >
                        Phone
                      </span>

                      <strong
                        style={
                          styles.infoValue
                        }
                      >
                        {applicant.phone ||
                          "N/A"}
                      </strong>
                    </div>

                    <div style={styles.infoItem}>
                      <span
                        style={
                          styles.infoLabel
                        }
                      >
                        Branch
                      </span>

                      <strong
                        style={
                          styles.infoValue
                        }
                      >
                        {applicant.branch ||
                          "N/A"}
                      </strong>
                    </div>

                    <div style={styles.infoItem}>
                      <span
                        style={
                          styles.infoLabel
                        }
                      >
                        CGPA
                      </span>

                      <strong
                        style={
                          styles.infoValue
                        }
                      >
                        {applicant.cgpa ||
                          "N/A"}
                      </strong>
                    </div>
                  </div>

                  <div style={styles.section}>
                    <p
                      style={
                        styles.sectionTitle
                      }
                    >
                      Skills
                    </p>

                    <div
                      style={
                        styles.skillsContainer
                      }
                    >
                      {Array.isArray(
                        applicant.skills
                      ) &&
                      applicant.skills.length >
                        0 ? (
                        applicant.skills.map(
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
                      ) : applicant.skills ? (
                        <span
                          style={
                            styles.skillBadge
                          }
                        >
                          {applicant.skills}
                        </span>
                      ) : (
                        <span
                          style={styles.noData}
                        >
                          No skills available
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={styles.actions}>
                    {applicant.resume_url ? (
                      <a
                        href={`http://127.0.0.1:8000${applicant.resume_url}`}
                        target="_blank"
                        rel="noreferrer"
                        style={styles.resume}
                      >
                        📄 View Resume
                      </a>
                    ) : (
                      <div
                        style={
                          styles.noResume
                        }
                      >
                        No resume uploaded
                      </div>
                    )}

                    <div
                      style={
                        styles.statusControl
                      }
                    >
                      <label
                        style={
                          styles.selectLabel
                        }
                      >
                        Change Status
                      </label>

                      <select
                        value={
                          applicant.status ||
                          "Applied"
                        }
                        disabled={isUpdating}
                        onChange={(e) =>
                          updateStatus(
                            applicant._id,
                            e.target.value
                          )
                        }
                        style={{
                          ...styles.selectBox,

                          ...(isUpdating
                            ? styles.disabled
                            : {}),
                        }}
                      >
                        <option value="Applied">
                          Applied
                        </option>

                        <option value="Shortlisted">
                          Shortlisted
                        </option>

                        <option value="Interview">
                          Interview
                        </option>

                        <option value="Selected">
                          Selected
                        </option>

                        <option value="Placed">
                          Placed
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>
                      </select>

                      {isUpdating && (
                        <span
                          style={
                            styles.updatingText
                          }
                        >
                          Updating...
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
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

  filters: {
    flex: "1 1 400px",
    maxWidth: "650px",
    minWidth: 0,
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  search: {
    flex: "2 1 220px",
    minWidth: 0,
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    boxSizing: "border-box",
  },

  filterSelect: {
    flex: "1 1 150px",
    minWidth: 0,
    padding: "12px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    background: "#fff",
    boxSizing: "border-box",
  },

  grid: {
    width: "100%",
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(400px, 100%), 1fr))",
    gap: "20px",
  },

  card: {
    minWidth: 0,
    background: "#fff",
    padding: "clamp(18px, 3vw, 25px)",
    borderRadius: "14px",
    boxShadow:
      "0 6px 20px rgba(0,0,0,0.07)",
    boxSizing: "border-box",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "12px",
    paddingBottom: "16px",
    borderBottom: "1px solid #e2e8f0",
  },

  nameArea: {
    flex: "1 1 200px",
    minWidth: 0,
  },

  studentName: {
    margin: 0,
    color: "#1e293b",
    fontSize: "21px",
    overflowWrap: "anywhere",
  },

  studentEmail: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
    overflowWrap: "anywhere",
  },

  statusBadge: {
    padding: "7px 11px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  infoGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(140px, 100%), 1fr))",
    gap: "10px",
    marginTop: "18px",
  },

  infoItem: {
    minWidth: 0,
    padding: "12px",
    background: "#f8fafc",
    borderRadius: "10px",
  },

  infoLabel: {
    display: "block",
    marginBottom: "5px",
    color: "#64748b",
    fontSize: "12px",
  },

  infoValue: {
    color: "#334155",
    overflowWrap: "anywhere",
  },

  section: {
    marginTop: "20px",
  },

  sectionTitle: {
    margin: "0 0 10px",
    color: "#334155",
    fontWeight: "700",
  },

  skillsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "7px",
  },

  skillBadge: {
    maxWidth: "100%",
    padding: "6px 10px",
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

  actions: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
    gap: "14px",
    marginTop: "22px",
    alignItems: "end",
  },

  resume: {
    width: "100%",
    padding: "12px",
    background: "#eff6ff",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "700",
    borderRadius: "10px",
    textAlign: "center",
    boxSizing: "border-box",
  },

  noResume: {
    width: "100%",
    padding: "12px",
    background: "#f8fafc",
    color: "#94a3b8",
    borderRadius: "10px",
    textAlign: "center",
    boxSizing: "border-box",
  },

  statusControl: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  selectLabel: {
    color: "#334155",
    fontSize: "13px",
    fontWeight: "700",
  },

  selectBox: {
    width: "100%",
    minWidth: 0,
    padding: "11px",
    borderRadius: "9px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    cursor: "pointer",
    background: "#fff",
    boxSizing: "border-box",
  },

  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  updatingText: {
    color: "#64748b",
    fontSize: "12px",
  },

  errorBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    padding: "14px",
    background: "#fff1f2",
    color: "#be123c",
    borderRadius: "10px",
  },

  retryButton: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#be123c",
    color: "#fff",
    cursor: "pointer",
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
  },

  clearButton: {
    marginTop: "10px",
    padding: "10px 16px",
    border: "none",
    borderRadius: "9px",
    background: "#475569",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Applicants;