import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const AdminApplications = () => {

  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get("/admin/applications");
      setApplications(res.data.applications || []);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteApplication = async (id) => {
    if (!window.confirm("Delete this application?")) return;

    try {
      await API.delete(`/admin/applications/${id}`);
      fetchApplications();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = useMemo(() => {
    return applications.filter(app =>
      app.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.job_title?.toLowerCase().includes(search.toLowerCase())
    );
  }, [applications, search]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Selected":
        return "#16a34a";
      case "Shortlisted":
        return "#f59e0b";
      case "Rejected":
        return "#dc2626";
      default:
        return "#2563eb";
    }
  };

  return (
    <DashboardLayout
      role="admin"
      title="Applications"
      subtitle="Manage all applications"
    >
      <div style={styles.header}>
        <h2>Total Applications: {filtered.length}</h2>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Student</th>
            <th>Company</th>
            <th>Job</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((app) => (
            <tr key={app._id}>
              <td>{app.student_name}</td>
              <td>{app.company_name}</td>
              <td>{app.job_title}</td>

              <td>
                <span
                  style={{
                    background: getStatusColor(app.status),
                    color: "#fff",
                    padding: "6px 10px",
                    borderRadius: "20px",
                    fontSize: "13px",
                  }}
                >
                  {app.status}
                </span>
              </td>

              <td>
                {new Date(app.applied_at).toLocaleDateString()}
              </td>

              <td>
                <button
                  style={styles.delete}
                  onClick={() => deleteApplication(app._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardLayout>
  );
};

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  search: {
    padding: "10px",
    width: "300px",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },

  table: {
    width: "100%",
    background: "#fff",
    borderCollapse: "collapse",
  },

  delete: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminApplications;