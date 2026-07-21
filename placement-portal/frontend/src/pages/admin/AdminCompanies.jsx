import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";
import ResponsiveTable from "../../components/ui/ResponsiveTable";
import tableStyles from "../../components/ui/tableStyles";

const AdminCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, []);

  // =========================================
  // FETCH COMPANIES
  // =========================================

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/companies");

      setCompanies(res.data.companies || []);
    } catch (err) {
      console.error("Failed to load companies:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load companies"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE COMPANY
  // =========================================

  const deleteCompany = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company? This may also delete its jobs and related applications."
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/companies/${id}`);

      // Remove deleted company immediately from UI
      setCompanies((previousCompanies) =>
        previousCompanies.filter(
          (company) => company._id !== id
        )
      );
    } catch (err) {
      console.error("Delete company failed:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete company"
      );
    }
  };

  // =========================================
  // SEARCH / FILTER
  // =========================================

  const filteredCompanies = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return companies;
    }

    return companies.filter((company) => {
      const companyName =
        company.company_name || "";

      const email =
        company.email || "";

      const phone =
        company.phone || "";

      const website =
        company.website || "";

      return (
        companyName
          .toLowerCase()
          .includes(query) ||
        email
          .toLowerCase()
          .includes(query) ||
        String(phone)
          .toLowerCase()
          .includes(query) ||
        website
          .toLowerCase()
          .includes(query)
      );
    });
  }, [companies, search]);

  // =========================================
  // UI
  // =========================================

  return (
    <DashboardLayout
      role="admin"
      title="Companies Management"
      subtitle="Manage registered company profiles"
    >
      {/* TOP BAR */}

      <div style={styles.topBar}>
        <div>
          <h2 style={styles.totalTitle}>
            Total Companies
          </h2>

          <p style={styles.totalNumber}>
            {filteredCompanies.length}
          </p>
        </div>

        <div style={styles.searchWrapper}>
          <input
            type="search"
            placeholder="Search company, email, phone..."
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
            onClick={fetchCompanies}
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
            Loading companies...
          </h3>

          <p style={styles.stateText}>
            Please wait while company records are
            being loaded.
          </p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        /* EMPTY STATE */

        <div style={styles.stateBox}>
          <h3 style={styles.stateTitle}>
            {search
              ? "No matching companies found"
              : "No companies found"}
          </h3>

          <p style={styles.stateText}>
            {search
              ? "Try searching with a different company name, email, phone, or website."
              : "Company profiles will appear here once they are created."}
          </p>
        </div>
      ) : (
        /* ================================= */
        /* RESPONSIVE COMPANIES TABLE */
        /* ================================= */

        <ResponsiveTable minWidth="850px">
          <table style={tableStyles.table}>
            <thead style={tableStyles.thead}>
              <tr>
                <th style={tableStyles.th}>
                  Company
                </th>

                <th style={tableStyles.th}>
                  Email
                </th>

                <th style={tableStyles.th}>
                  Phone
                </th>

                <th style={tableStyles.th}>
                  Website
                </th>

                <th style={tableStyles.th}>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCompanies.map(
                (company) => (
                  <tr key={company._id}>
                    {/* COMPANY NAME */}

                    <td style={tableStyles.td}>
                      <strong>
                        {company.company_name ||
                          "N/A"}
                      </strong>
                    </td>

                    {/* EMAIL */}

                    <td style={tableStyles.td}>
                      {company.email || "N/A"}
                    </td>

                    {/* PHONE */}

                    <td style={tableStyles.td}>
                      {company.phone || "N/A"}
                    </td>

                    {/* WEBSITE */}

                    <td style={tableStyles.td}>
                      {company.website ? (
                        <a
                          href={getWebsiteUrl(
                            company.website
                          )}
                          target="_blank"
                          rel="noreferrer"
                          style={
                            styles.websiteLink
                          }
                        >
                          Visit Website
                        </a>
                      ) : (
                        <span
                          style={
                            styles.notAvailable
                          }
                        >
                          N/A
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
                            deleteCompany(
                              company._id
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

      {/* MOBILE TABLE HELP */}

      {!loading &&
        filteredCompanies.length > 0 && (
          <p style={styles.scrollHint}>
            On smaller screens, swipe the table
            horizontally to view all columns.
          </p>
        )}
    </DashboardLayout>
  );
};

// =========================================
// WEBSITE URL HELPER
// =========================================

const getWebsiteUrl = (website) => {
  if (!website) return "#";

  if (
    website.startsWith("http://") ||
    website.startsWith("https://")
  ) {
    return website;
  }

  return `https://${website}`;
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

  websiteLink: {
    display: "inline-block",

    color: "#2563eb",

    textDecoration: "none",

    fontWeight: "600",

    whiteSpace: "nowrap",
  },

  notAvailable: {
    color: "#94a3b8",
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

export default AdminCompanies;