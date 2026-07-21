import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ResponsiveTable from "../../components/ui/ResponsiveTable";
import tableStyles from "../../components/ui/tableStyles";

const UserAccess = () => {
  const [users, setUsers] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const [updatingId, setUpdatingId] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // =========================================
  // FETCH USERS ON PAGE LOAD
  // =========================================

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================================
  // FETCH ALL REGISTERED USERS
  // =========================================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      setError("");

      const response = await API.get(
        "/admin/users"
      );

      const fetchedUsers =
        response.data.users || [];

      setUsers(fetchedUsers);

      // Save each user's current role
      // so dropdown initially shows correct role.

      const roles = {};

      fetchedUsers.forEach((user) => {
        roles[user._id] = user.role;
      });

      setSelectedRoles(roles);
    } catch (err) {
      console.error(
        "Failed to fetch users:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load registered users."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DROPDOWN ROLE CHANGE
  // =========================================

  const handleRoleChange = (
    userId,
    role
  ) => {
    setSelectedRoles((previousRoles) => ({
      ...previousRoles,

      [userId]: role,
    }));

    setSuccess("");

    setError("");
  };

  // =========================================
  // UPDATE USER ACCESS
  // =========================================

  const updateRole = async (user) => {
    const newRole =
      selectedRoles[user._id];

    if (!newRole) {
      setError(
        "Please select an access role."
      );

      return;
    }

    if (newRole === user.role) {
      setError(
        `${user.name || "This user"} already has ${newRole} access.`
      );

      return;
    }

    const confirmed = window.confirm(
      `Change ${user.name || user.email}'s access from ${user.role} to ${newRole}?`
    );

    if (!confirmed) {
      // Reset dropdown
      setSelectedRoles((previous) => ({
        ...previous,

        [user._id]: user.role,
      }));

      return;
    }

    try {
      setUpdatingId(user._id);

      setError("");

      setSuccess("");

      const response = await API.put(
        `/admin/users/${user._id}/role`,
        {
          role: newRole,
        }
      );

      // Update user immediately in UI

      setUsers((previousUsers) =>
        previousUsers.map((item) =>
          item._id === user._id
            ? {
                ...item,

                role: newRole,
              }
            : item
        )
      );

      setSelectedRoles((previous) => ({
        ...previous,

        [user._id]: newRole,
      }));

      setSuccess(
        response.data.message ||
          `${user.name || "User"} now has ${newRole} access.`
      );
    } catch (err) {
      console.error(
        "Role update failed:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to update user access."
      );

      // Reset dropdown if backend update failed

      setSelectedRoles((previous) => ({
        ...previous,

        [user._id]: user.role,
      }));
    } finally {
      setUpdatingId("");
    }
  };

  // =========================================
  // SEARCH USERS
  // =========================================

  const filteredUsers = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const name =
        user.name || "";

      const email =
        user.email || "";

      const role =
        user.role || "";

      return (
        name
          .toLowerCase()
          .includes(query) ||

        email
          .toLowerCase()
          .includes(query) ||

        role
          .toLowerCase()
          .includes(query)
      );
    });
  }, [users, search]);

  // =========================================
  // COUNT USERS BY ROLE
  // =========================================

  const studentCount = users.filter(
    (user) => user.role === "student"
  ).length;

  const companyCount = users.filter(
    (user) => user.role === "company"
  ).length;

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return "N/A";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return String(dateValue);
    }

    return date.toLocaleString();
  };

  // =========================================
  // ROLE BADGE STYLE
  // =========================================

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case "admin":
        return styles.adminBadge;

      case "company":
        return styles.companyBadge;

      default:
        return styles.studentBadge;
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <DashboardLayout
      role="admin"
      title="User Access Management"
      subtitle="Manage access permissions for registered portal users"
    >
      {/* ================================= */}
      {/* ACCESS SUMMARY CARDS */}
      {/* ================================= */}

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>
            Total Users
          </p>

          <h2 style={styles.statNumber}>
            {users.length}
          </h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>
            Student Access
          </p>

          <h2 style={styles.statNumber}>
            {studentCount}
          </h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>
            Company Access
          </p>

          <h2 style={styles.statNumber}>
            {companyCount}
          </h2>
        </div>

        <div style={styles.statCard}>
          <p style={styles.statLabel}>
            Admin Access
          </p>

          <h2 style={styles.statNumber}>
            {adminCount}
          </h2>
        </div>
      </div>

      {/* ================================= */}
      {/* TOP BAR */}
      {/* ================================= */}

      <div style={styles.topBar}>
        <div style={styles.headingBlock}>
          <h2 style={styles.sectionTitle}>
            Registered Users
          </h2>

          <p style={styles.description}>
            New accounts start with Student
            access. Admin can grant Company
            access when required.
          </p>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="search"
            placeholder="Search name, email, role..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={styles.search}
          />
        </div>
      </div>

      {/* ================================= */}
      {/* ERROR MESSAGE */}
      {/* ================================= */}

      {error && (
        <div style={styles.errorBox}>
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            style={styles.messageClose}
          >
            ×
          </button>
        </div>
      )}

      {/* ================================= */}
      {/* SUCCESS MESSAGE */}
      {/* ================================= */}

      {success && (
        <div style={styles.successBox}>
          <span>{success}</span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            style={styles.successClose}
          >
            ×
          </button>
        </div>
      )}

      {/* ================================= */}
      {/* LOADING */}
      {/* ================================= */}

      {loading ? (
        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>
            Loading registered users...
          </h3>

          <p style={styles.stateText}>
            Please wait while user accounts are
            being loaded.
          </p>
        </div>
      ) : filteredUsers.length === 0 ? (
        /* ================================= */
        /* EMPTY / SEARCH STATE */
        /* ================================= */

        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>
            {search
              ? "No matching users found"
              : "No registered users found"}
          </h3>

          <p style={styles.stateText}>
            {search
              ? "Try searching with a different name, email, or role."
              : "Registered portal users will appear here."}
          </p>
        </div>
      ) : (
        /* ================================= */
        /* RESPONSIVE USERS TABLE */
        /* ================================= */

        <ResponsiveTable minWidth="1000px">
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
                  Current Role
                </th>

                <th style={tableStyles.th}>
                  Registered
                </th>

                <th style={tableStyles.th}>
                  New Access
                </th>

                <th style={tableStyles.th}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => {
                const isAdmin =
                  user.role === "admin";

                const hasChanged =
                  selectedRoles[user._id] !==
                  user.role;

                const isUpdating =
                  updatingId === user._id;

                return (
                  <tr key={user._id}>
                    {/* NAME */}

                    <td style={tableStyles.td}>
                      <strong>
                        {user.name || "N/A"}
                      </strong>
                    </td>

                    {/* EMAIL */}

                    <td style={tableStyles.td}>
                      {user.email || "N/A"}
                    </td>

                    {/* CURRENT ROLE */}

                    <td style={tableStyles.td}>
                      <span
                        style={{
                          ...styles.badge,

                          ...getRoleBadgeStyle(
                            user.role
                          ),
                        }}
                      >
                        {user.role || "Unknown"}
                      </span>
                    </td>

                    {/* REGISTERED DATE */}

                    <td style={tableStyles.td}>
                      <span
                        style={
                          styles.registeredDate
                        }
                      >
                        {formatDate(
                          user.created_at
                        )}
                      </span>
                    </td>

                    {/* NEW ACCESS */}

                    <td style={tableStyles.td}>
                      {isAdmin ? (
                        <span
                          style={
                            styles.protected
                          }
                        >
                          🔒 Protected
                        </span>
                      ) : (
                        <select
                          value={
                            selectedRoles[
                              user._id
                            ] || user.role
                          }
                          onChange={(e) =>
                            handleRoleChange(
                              user._id,

                              e.target.value
                            )
                          }
                          disabled={isUpdating}
                          style={styles.select}
                        >
                          <option value="student">
                            Student
                          </option>

                          <option value="company">
                            Company
                          </option>
                        </select>
                      )}
                    </td>

                    {/* ACTION */}

                    <td style={tableStyles.td}>
                      {isAdmin ? (
                        <span
                          style={
                            styles.noAction
                          }
                        >
                          No changes allowed
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            updateRole(user)
                          }
                          disabled={
                            !hasChanged ||
                            isUpdating
                          }
                          style={{
                            ...styles.updateButton,

                            ...(!hasChanged ||
                            isUpdating
                              ? styles.disabledButton
                              : {}),
                          }}
                        >
                          {isUpdating
                            ? "Updating..."
                            : "Update Access"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </ResponsiveTable>
      )}

      {/* ================================= */}
      {/* MOBILE HELP */}
      {/* ================================= */}

      {!loading &&
        filteredUsers.length > 0 && (
          <p style={styles.scrollHint}>
            On smaller screens, swipe the table
            horizontally to view all user access
            controls.
          </p>
        )}
    </DashboardLayout>
  );
};

// =========================================
// STYLES
// =========================================

const styles = {
  statsGrid: {
    width: "100%",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(180px, 1fr))",

    gap: "16px",
  },

  statCard: {
    minWidth: 0,

    padding: "20px",

    background: "#ffffff",

    borderRadius: "14px",

    boxShadow:
      "0 6px 20px rgba(15,23,42,0.06)",

    boxSizing: "border-box",
  },

  statLabel: {
    margin: 0,

    color: "#64748b",

    fontSize: "13px",

    fontWeight: "600",
  },

  statNumber: {
    margin: "8px 0 0",

    color: "#0f172a",

    fontSize: "28px",
  },

  topBar: {
    width: "100%",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "18px",

    padding: "20px",

    background: "#ffffff",

    borderRadius: "16px",

    boxShadow:
      "0 6px 20px rgba(15,23,42,0.06)",

    boxSizing: "border-box",
  },

  headingBlock: {
    flex: "1 1 300px",

    minWidth: 0,
  },

  sectionTitle: {
    margin: 0,

    color: "#0f172a",

    fontSize: "21px",
  },

  description: {
    margin: "7px 0 0",

    color: "#64748b",

    fontSize: "14px",

    lineHeight: "1.6",
  },

  searchWrapper: {
    flex: "1 1 260px",

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

  badge: {
    display: "inline-block",

    padding: "6px 11px",

    borderRadius: "999px",

    textTransform: "capitalize",

    fontSize: "12px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },

  studentBadge: {
    background: "#eff6ff",

    color: "#2563eb",
  },

  companyBadge: {
    background: "#f0fdf4",

    color: "#15803d",
  },

  adminBadge: {
    background: "#f3e8ff",

    color: "#7e22ce",
  },

  registeredDate: {
    whiteSpace: "nowrap",

    fontSize: "13px",
  },

  select: {
    minWidth: "135px",

    padding: "9px 10px",

    borderRadius: "9px",

    border: "1px solid #cbd5e1",

    background: "#ffffff",

    color: "#334155",

    outline: "none",

    cursor: "pointer",
  },

  updateButton: {
    padding: "9px 14px",

    border: "none",

    borderRadius: "9px",

    background: "#2563eb",

    color: "#ffffff",

    cursor: "pointer",

    fontWeight: "600",

    whiteSpace: "nowrap",
  },

  disabledButton: {
    background: "#94a3b8",

    cursor: "not-allowed",

    opacity: 0.65,
  },

  protected: {
    color: "#7e22ce",

    fontWeight: "600",

    fontSize: "13px",

    whiteSpace: "nowrap",
  },

  noAction: {
    color: "#94a3b8",

    fontSize: "13px",

    whiteSpace: "nowrap",
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
  },

  messageClose: {
    border: "none",

    background: "transparent",

    color: "#be123c",

    fontSize: "22px",

    cursor: "pointer",
  },

  successClose: {
    border: "none",

    background: "transparent",

    color: "#047857",

    fontSize: "22px",

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

export default UserAccess;