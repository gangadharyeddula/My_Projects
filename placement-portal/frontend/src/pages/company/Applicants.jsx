import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const Applicants = () => {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await API.get(`/applications/job-applicants/${jobId}`);
      setApplicants(res.data.applicants);
    } catch (err) {
      console.log(err);
    }
  };

  const updateStatus = async (applicationId, status) => {
    try {
      await API.put(`/applications/update-status/${applicationId}`, {
        status,
      });

      fetchApplicants();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <DashboardLayout
      role="company"
      title="Applicants"
      subtitle="View students who applied for this job"
    >
      {applicants.length === 0 ? (
        <h3>No applicants found.</h3>
      ) : (
        applicants.map((applicant) => (
          <div key={applicant._id} style={styles.card}>
            <h2>{applicant.student_name}</h2>

            <p><b>Email:</b> {applicant.student_email}</p>
            <p><b>Phone:</b> {applicant.phone}</p>
            <p><b>Branch:</b> {applicant.branch}</p>
            <p><b>CGPA:</b> {applicant.cgpa}</p>

            <p>
              <b>Skills:</b>{" "}
              {Array.isArray(applicant.skills)
                ? applicant.skills.join(", ")
                : applicant.skills}
            </p>

            <p>
              <b>Status:</b>{" "}
              <span style={styles.status}>
                {applicant.status}
              </span>
            </p>

            {applicant.resume_url && (
              <a
                href={`http://127.0.0.1:8000${applicant.resume_url}`}
                target="_blank"
                rel="noreferrer"
                style={styles.resume}
              >
                📄 View Resume
              </a>
            )}

            <div style={styles.buttons}>
              <button
                style={styles.shortlist}
                onClick={() =>
                  updateStatus(applicant._id, "Shortlisted")
                }
              >
                Shortlist
              </button>

              <button
                style={styles.select}
                onClick={() =>
                  updateStatus(applicant._id, "Selected")
                }
              >
                Select
              </button>

              <button
                style={styles.reject}
                onClick={() =>
                  updateStatus(applicant._id, "Rejected")
                }
              >
                Reject
              </button>
            </div>
          </div>
        ))
      )}
    </DashboardLayout>
  );
};

const styles = {
  card: {
    background: "#fff",
    padding: "25px",
    marginBottom: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  status: {
    color: "#2563eb",
    fontWeight: "bold",
  },

  resume: {
    display: "inline-block",
    marginTop: "10px",
    marginBottom: "20px",
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "bold",
  },

  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  shortlist: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  select: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  reject: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default Applicants;