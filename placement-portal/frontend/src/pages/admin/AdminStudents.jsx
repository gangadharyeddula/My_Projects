import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ResponsiveTable from "../../components/ui/ResponsiveTable";
import tableStyles from "../../components/ui/tableStyles";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  // =========================================
  // FETCH STUDENTS
  // =========================================

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/students");

      setStudents(res.data.students || []);
    } catch (err) {
      console.error("Failed to load students:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE STUDENT
  // =========================================

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/students/${id}`);

      // Remove immediately from UI
      setStudents((previousStudents) =>
        previousStudents.filter(
          (student) => student._id !== id
        )
      );
    } catch (err) {
      console.error("Delete student failed:", err);

      alert(
        err.response?.data?.detail ||
          "Delete failed"
      );
    }
  };

  // =========================================
  // SEARCH / FILTER
  // =========================================

  const filteredStudents = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return students;
    }

    return students.filter((student) => {
      const name =
        student.full_name ||
        student.name ||
        "";

      const email =
        student.email || "";

      const phone =
        student.phone || "";

      const branch =
        student.branch || "";

      const skills = Array.isArray(
        student.skills
      )
        ? student.skills.join(" ")
        : student.skills || "";

      return (
        name.toLowerCase().includes(query) ||
        email.toLowerCase().includes(query) ||
        String(phone)
          .toLowerCase()
          .includes(query) ||
        branch.toLowerCase().includes(query) ||
        skills.toLowerCase().includes(query)
      );
    });
  }, [students, search]);

  // =========================================
  // UI
  // =========================================

  return (
    <DashboardLayout
      role="admin"
      title="Students Management"
      subtitle="Manage all registered student profiles"
    >
      {/* TOP BAR */}

      <div style={styles.topBar}>
        <div>
          <h2 style={styles.totalTitle}>
            Total Students
          </h2>

          <p style={styles.totalNumber}>
            {filteredStudents.length}
          </p>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="search"
            placeholder="Search name, email, branch, skills..."
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
          {error}

          <button
            type="button"
            onClick={fetchStudents}
            style={styles.retryButton}
          >
            Retry
          </button>
        </div>
      )}

      {/* LOADING */}

      {loading ? (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>
            Loading students...
          </h3>

          <p style={styles.stateText}>
            Please wait while student records are
            being loaded.
          </p>
        </div>
      ) : filteredStudents.length === 0 ? (
        /* EMPTY STATE */

        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>
            {search
              ? "No matching students found"
              : "No students found"}
          </h3>

          <p style={styles.stateText}>
            {search
              ? "Try searching with a different name, email, branch, or skill."
              : "Student profiles will appear here once they are created."}
          </p>
        </div>
      ) : (
        /* ================================= */
        /* RESPONSIVE STUDENTS TABLE */
        /* ================================= */

        <ResponsiveTable minWidth="1050px">
          <table style={tableStyles.table}>
            <thead style={tableStyles.thead}>
              <tr>
                <th style={tableStyles.th}>
                  Name
                </th>

                <th style={tableStyles.th}>
                  Email
                </th>

                <th style={tableStyles.th}>
                  Phone
                </th>

                <th style={tableStyles.th}>
                  Branch
                </th>

                <th style={tableStyles.th}>
                  CGPA
                </th>

                <th style={tableStyles.th}>
                  Skills
                </th>

                <th style={tableStyles.th}>
                  Resume
                </th>

                <th style={tableStyles.th}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map(
                (student) => (
                  <tr key={student._id}>
                    {/* NAME */}

                    <td style={tableStyles.td}>
                      <strong>
                        {student.full_name ||
                          student.name ||
                          "N/A"}
                      </strong>
                    </td>

                    {/* EMAIL */}

                    <td style={tableStyles.td}>
                      {student.email || "N/A"}
                    </td>

                    {/* PHONE */}

                    <td style={tableStyles.td}>
                      {student.phone || "N/A"}
                    </td>

                    {/* BRANCH */}

                    <td style={tableStyles.td}>
                      {student.branch || "N/A"}
                    </td>

                    {/* CGPA */}

                    <td style={tableStyles.td}>
                      {student.cgpa ?? "N/A"}
                    </td>

                    {/* SKILLS */}

                    <td style={tableStyles.td}>
                      <div style={styles.skills}>
                        {Array.isArray(
                          student.skills
                        )
                          ? student.skills.length >
                            0
                            ? student.skills.join(
                                ", "
                              )
                            : "N/A"
                          : student.skills ||
                            "N/A"}
                      </div>
                    </td>

                    {/* RESUME */}

                    <td style={tableStyles.td}>
                      {student.resume_url ? (
                        <a
                          href={`http://127.0.0.1:8000${student.resume_url}`}
                          target="_blank"
                          rel="noreferrer"
                          style={
                            styles.resumeLink
                          }
                        >
                          📄 View Resume
                        </a>
                      ) : (
                        <span
                          style={
                            styles.noResume
                          }
                        >
                          No Resume
                        </span>
                      )}
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
                            deleteStudent(
                              student._id
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

      {/* MOBILE HELP TEXT */}

      {!loading &&
        filteredStudents.length > 0 && (
          <p style={styles.scrollHint}>
            On smaller screens, swipe the table
            horizontally to view all columns.
          </p>
        )}
    </DashboardLayout>
  );
};

// =========================================
// PAGE STYLES
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

  skills: {
    maxWidth: "230px",

    whiteSpace: "normal",

    overflowWrap: "break-word",

    lineHeight: "1.5",
  },

  resumeLink: {
    display: "inline-block",

    color: "#2563eb",

    textDecoration: "none",

    fontWeight: "600",

    whiteSpace: "nowrap",
  },

  noResume: {
    color: "#94a3b8",

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

    borderRadius: "12px",

    background: "#fff1f2",

    border: "1px solid #fecdd3",

    color: "#be123c",

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

export default AdminStudents;