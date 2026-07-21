import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageCard from "../../components/ui/PageCard";
import StatusBadge from "../../components/ui/StatusBadge";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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

      const response = await API.get(
        "/applications/my-applications"
      );

      setApplications(
        response.data.applications || []
      );
    } catch (err) {
      console.error(
        "Failed to fetch applications:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to fetch applications."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // SEARCH + FILTER
  // =========================================

  const filteredApplications = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return applications.filter((app) => {
      const matchesSearch =
        !query ||
        app.job_title
          ?.toLowerCase()
          .includes(query) ||
        app.company_name
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        app.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleString();
  };

  // =========================================
  // STATUS PIPELINE
  // =========================================

  const getPipeline = (status) => {
    const normalStages = [
      "Applied",
      "Shortlisted",
      "Interview",
      "Selected",
      "Placed",
    ];

    if (status === "Rejected") {
      return {
        stages: [
          "Applied",
          "Shortlisted",
          "Interview",
          "Rejected",
        ],
        currentIndex: 3,
        rejected: true,
      };
    }

    let currentIndex =
      normalStages.indexOf(status);

    if (currentIndex === -1) {
      currentIndex = 0;
    }

    return {
      stages: normalStages,
      currentIndex,
      rejected: false,
    };
  };

  return (
    <DashboardLayout
      role="student"
      title="My Applications"
      subtitle="Track the jobs you applied for and monitor your placement progress"
    >
      {/* ================================= */}
      {/* SUMMARY / FILTER BAR */}
      {/* ================================= */}

      <div style={styles.topBar}>
        <div>
          <p style={styles.totalLabel}>
            Applications
          </p>

          <h2 style={styles.totalNumber}>
            {filteredApplications.length}
          </h2>
        </div>

        <div style={styles.filters}>
          <input
            type="search"
            placeholder="Search company or job..."
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
            style={styles.select}
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

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      {loading ? (
        <Loader text="Loading your applications..." />
      ) : error ? (
        <PageCard>
          <div style={styles.errorBox}>
            <div>
              <strong>
                Unable to load applications
              </strong>

              <p style={styles.errorText}>
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchApplications}
              style={styles.retryButton}
            >
              Retry
            </button>
          </div>
        </PageCard>
      ) : applications.length === 0 ? (
        <EmptyState
          title="No applications yet"
          subtitle="You haven’t applied for any jobs yet. Explore available jobs and start applying."
        />
      ) : filteredApplications.length === 0 ? (
        <div style={styles.emptyCard}>
          <h3 style={styles.emptyTitle}>
            No matching applications
          </h3>

          <p style={styles.emptyText}>
            Try changing your search or status
            filter.
          </p>

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
          {filteredApplications.map((app) => {
            const pipeline = getPipeline(
              app.status
            );

            return (
              <PageCard key={app._id}>
                <div style={styles.cardContent}>
                  {/* ============================= */}
                  {/* HEADER */}
                  {/* ============================= */}

                  <div style={styles.cardHeader}>
                    <div style={styles.titleArea}>
                      <h2
                        style={styles.jobTitle}
                      >
                        {app.job_title ||
                          "Job Position"}
                      </h2>

                      <p
                        style={
                          styles.companyName
                        }
                      >
                        {app.company_name ||
                          "Company not specified"}
                      </p>
                    </div>

                    <StatusBadge
                      status={
                        app.status || "Applied"
                      }
                    />
                  </div>

                  {/* ============================= */}
                  {/* APPLICATION INFO */}
                  {/* ============================= */}

                  <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                      <span
                        style={
                          styles.infoLabel
                        }
                      >
                        Application Status
                      </span>

                      <strong
                        style={
                          styles.infoValue
                        }
                      >
                        {app.status ||
                          "Applied"}
                      </strong>
                    </div>

                    <div style={styles.infoItem}>
                      <span
                        style={
                          styles.infoLabel
                        }
                      >
                        Applied At
                      </span>

                      <strong
                        style={
                          styles.infoValue
                        }
                      >
                        {formatDate(
                          app.applied_at
                        )}
                      </strong>
                    </div>

                    {app.updated_at && (
                      <div
                        style={styles.infoItem}
                      >
                        <span
                          style={
                            styles.infoLabel
                          }
                        >
                          Last Updated
                        </span>

                        <strong
                          style={
                            styles.infoValue
                          }
                        >
                          {formatDate(
                            app.updated_at
                          )}
                        </strong>
                      </div>
                    )}
                  </div>

                  {/* ============================= */}
                  {/* PIPELINE */}
                  {/* ============================= */}

                  <div
                    style={
                      styles.pipelineSection
                    }
                  >
                    <p
                      style={
                        styles.pipelineTitle
                      }
                    >
                      Application Progress
                    </p>

                    <div
                      style={
                        styles.pipelineScroll
                      }
                    >
                      <div
                        style={styles.pipeline}
                      >
                        {pipeline.stages.map(
                          (stage, index) => {
                            const completed =
                              index <=
                              pipeline.currentIndex;

                            const isRejected =
                              pipeline.rejected &&
                              stage ===
                                "Rejected";

                            return (
                              <div
                                key={stage}
                                style={
                                  styles.pipelineItem
                                }
                              >
                                <div
                                  style={{
                                    ...styles.circle,

                                    ...(completed
                                      ? isRejected
                                        ? styles.rejectedCircle
                                        : styles.completedCircle
                                      : styles.pendingCircle),
                                  }}
                                >
                                  {completed
                                    ? isRejected
                                      ? "×"
                                      : "✓"
                                    : index + 1}
                                </div>

                                <span
                                  style={{
                                    ...styles.stageText,

                                    ...(completed
                                      ? isRejected
                                        ? styles.rejectedText
                                        : styles.completedText
                                      : {}),
                                  }}
                                >
                                  {stage}
                                </span>

                                {index <
                                  pipeline.stages
                                    .length -
                                    1 && (
                                  <div
                                    style={{
                                      ...styles.connector,

                                      ...(index <
                                      pipeline.currentIndex
                                        ? isRejected
                                          ? styles.rejectedConnector
                                          : styles.completedConnector
                                        : {}),
                                    }}
                                  />
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>

                    {app.status ===
                      "Rejected" && (
                      <div
                        style={
                          styles.rejectedMessage
                        }
                      >
                        This application is no
                        longer active.
                      </div>
                    )}

                    {app.status ===
                      "Placed" && (
                      <div
                        style={
                          styles.placedMessage
                        }
                      >
                        🎉 Congratulations! This
                        application has reached
                        the placed stage.
                      </div>
                    )}
                  </div>
                </div>
              </PageCard>
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

    width: "100%",

    padding: "12px 14px",

    border: "1px solid #cbd5e1",

    borderRadius: "10px",

    outline: "none",

    fontSize: "14px",

    boxSizing: "border-box",
  },

  select: {
    flex: "1 1 150px",

    minWidth: 0,

    padding: "12px 14px",

    border: "1px solid #cbd5e1",

    borderRadius: "10px",

    background: "#ffffff",

    color: "#334155",

    outline: "none",

    boxSizing: "border-box",
  },

  grid: {
    width: "100%",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(400px, 100%), 1fr))",

    gap: "20px",

    boxSizing: "border-box",
  },

  cardContent: {
    minWidth: 0,
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

  companyName: {
    margin: "7px 0 0",

    color: "#475569",

    fontWeight: "600",

    overflowWrap: "anywhere",
  },

  infoGrid: {
    width: "100%",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(150px, 100%), 1fr))",

    gap: "12px",

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

    marginBottom: "6px",

    color: "#64748b",

    fontSize: "12px",

    fontWeight: "600",
  },

  infoValue: {
    display: "block",

    color: "#334155",

    fontSize: "14px",

    overflowWrap: "anywhere",
  },

  pipelineSection: {
    marginTop: "22px",

    minWidth: 0,
  },

  pipelineTitle: {
    margin: "0 0 16px",

    color: "#334155",

    fontWeight: "700",

    fontSize: "14px",
  },

  // On very narrow screens the pipeline can
  // scroll inside the card instead of breaking
  // the entire page width.

  pipelineScroll: {
    width: "100%",

    overflowX: "auto",

    paddingBottom: "8px",
  },

  pipeline: {
    display: "flex",

    alignItems: "flex-start",

    minWidth: "520px",

    padding: "4px 2px",
  },

  pipelineItem: {
    position: "relative",

    flex: 1,

    minWidth: "95px",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    textAlign: "center",
  },

  circle: {
    position: "relative",

    zIndex: 2,

    width: "34px",

    height: "34px",

    borderRadius: "50%",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    fontSize: "13px",

    fontWeight: "700",

    flexShrink: 0,
  },

  completedCircle: {
    background: "#16a34a",

    color: "#ffffff",
  },

  rejectedCircle: {
    background: "#dc2626",

    color: "#ffffff",
  },

  pendingCircle: {
    background: "#e2e8f0",

    color: "#64748b",
  },

  stageText: {
    marginTop: "8px",

    color: "#94a3b8",

    fontSize: "12px",

    fontWeight: "600",

    whiteSpace: "nowrap",
  },

  completedText: {
    color: "#15803d",
  },

  rejectedText: {
    color: "#dc2626",
  },

  connector: {
    position: "absolute",

    top: "16px",

    left: "calc(50% + 17px)",

    width: "calc(100% - 34px)",

    height: "3px",

    background: "#e2e8f0",

    zIndex: 1,
  },

  completedConnector: {
    background: "#16a34a",
  },

  rejectedConnector: {
    background: "#dc2626",
  },

  rejectedMessage: {
    marginTop: "14px",

    padding: "10px 12px",

    background: "#fff1f2",

    color: "#be123c",

    borderRadius: "9px",

    fontSize: "13px",
  },

  placedMessage: {
    marginTop: "14px",

    padding: "10px 12px",

    background: "#ecfdf5",

    color: "#047857",

    borderRadius: "9px",

    fontSize: "13px",

    fontWeight: "600",
  },

  errorBox: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "14px",

    color: "#be123c",
  },

  errorText: {
    margin: "6px 0 0",

    fontSize: "14px",
  },

  retryButton: {
    padding: "9px 15px",

    border: "none",

    borderRadius: "8px",

    background: "#be123c",

    color: "#ffffff",

    cursor: "pointer",

    fontWeight: "600",
  },

  emptyCard: {
    width: "100%",

    padding: "45px 20px",

    background: "#ffffff",

    borderRadius: "16px",

    textAlign: "center",

    boxSizing: "border-box",
  },

  emptyTitle: {
    margin: 0,

    color: "#334155",
  },

  emptyText: {
    margin: "8px 0 0",

    color: "#64748b",

    fontSize: "14px",
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

export default MyApplications;