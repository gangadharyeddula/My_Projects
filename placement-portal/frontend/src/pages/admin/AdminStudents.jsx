import { useEffect, useMemo, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/students");
      setStudents(res.data.students || []);
    } catch (err) {
      console.log(err);
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase();

      return (
        student.full_name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.branch?.toLowerCase().includes(query)
      );
    });
  }, [students, search]);

  return (
    <DashboardLayout
      role="admin"
      title="Students Management"
      subtitle="Manage all registered students"
    >
      <div style={styles.topBar}>
        <h2>Total Students : {filteredStudents.length}</h2>

        <input
          type="text"
          placeholder="Search student..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />
      </div>

      {loading ? (
        <h3>Loading...</h3>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Branch</th>
              <th>CGPA</th>
              <th>Skills</th>
              <th>Resume</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.full_name}</td>
                <td>{student.email}</td>
                <td>{student.phone}</td>
                <td>{student.branch}</td>
                <td>{student.cgpa}</td>

                <td>
                  {Array.isArray(student.skills)
                    ? student.skills.join(", ")
                    : student.skills}
                </td>

                <td>
                  {student.resume_url ? (
                    <a
                      href={`http://127.0.0.1:8000${student.resume_url}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📄 View
                    </a>
                  ) : (
                    "No Resume"
                  )}
                </td>

                <td>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => deleteStudent(student._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </DashboardLayout>
  );
};

const styles = {
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },

  search: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    width: "280px",
  },

  table: {
    width: "100%",
    background: "#fff",
    borderCollapse: "collapse",
    borderRadius: "12px",
    overflow: "hidden",
  },

  deleteBtn: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AdminStudents;