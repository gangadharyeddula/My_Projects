import { useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skills_required: "",
    deadline: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [posting, setPosting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const payload = {
      ...formData,

      skills_required:
        formData.skills_required
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
    };

    try {
      setPosting(true);

      const response = await API.post(
        "/jobs/",
        payload
      );

      setMessage(
        response.data.message ||
          "Job posted successfully"
      );

      setFormData({
        title: "",
        description: "",
        location: "",
        salary: "",
        skills_required: "",
        deadline: "",
      });
    } catch (err) {
      console.error(
        "Post job error:",
        err.response?.data || err.message
      );

      setError(
        err.response?.data?.detail ||
          "Failed to post job"
      );
    } finally {
      setPosting(false);
    }
  };

  return (
    <DashboardLayout
      role="company"
      title="Post a New Job"
      subtitle="Create new placement opportunities for students"
    >
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>
            Job Information
          </h2>

          <p style={styles.description}>
            Enter complete job details so students
            can understand the opportunity before
            applying.
          </p>
        </div>

        {message && (
          <div style={styles.success}>
            {message}
          </div>
        )}

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={styles.form}
        >
          <div style={styles.field}>
            <label style={styles.label}>
              Job Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Example: Software Engineer"
              value={formData.title}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="Example: Hyderabad"
              value={formData.location}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Salary / Package
            </label>

            <input
              type="text"
              name="salary"
              placeholder="Example: ₹6 LPA"
              value={formData.salary}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Application Deadline
            </label>

            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.fullWidth}>
            <label style={styles.label}>
              Skills Required
            </label>

            <input
              type="text"
              name="skills_required"
              placeholder="Python, FastAPI, React, MongoDB"
              value={formData.skills_required}
              onChange={handleChange}
              style={styles.input}
              required
            />

            <span style={styles.helpText}>
              Separate multiple skills using commas.
            </span>
          </div>

          <div style={styles.fullWidth}>
            <label style={styles.label}>
              Job Description
            </label>

            <textarea
              name="description"
              placeholder="Describe the role, responsibilities and requirements..."
              value={formData.description}
              onChange={handleChange}
              style={styles.textarea}
              rows="7"
              required
            />
          </div>

          <button
            type="submit"
            disabled={posting}
            style={{
              ...styles.button,
              ...(posting
                ? styles.disabledButton
                : {}),
            }}
          >
            {posting
              ? "Posting Job..."
              : "Post Job"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  card: {
    width: "100%",
    minWidth: 0,
    background: "#fff",
    borderRadius: "16px",
    padding: "clamp(18px, 3vw, 28px)",
    boxShadow:
      "0 8px 24px rgba(0,0,0,0.06)",
    boxSizing: "border-box",
  },

  header: {
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    color: "#1e293b",
    fontSize: "21px",
  },

  description: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  form: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
    gap: "18px",
  },

  field: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  fullWidth: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    gridColumn: "1 / -1",
  },

  label: {
    color: "#334155",
    fontSize: "14px",
    fontWeight: "600",
  },

  input: {
    width: "100%",
    minWidth: 0,
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",
    minWidth: 0,
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    fontFamily: "inherit",
    outline: "none",
    resize: "vertical",
    boxSizing: "border-box",
  },

  helpText: {
    color: "#64748b",
    fontSize: "12px",
  },

  button: {
    gridColumn: "1 / -1",
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  success: {
    marginBottom: "18px",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#ecfdf5",
    color: "#047857",
  },

  error: {
    marginBottom: "18px",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "#fff1f2",
    color: "#be123c",
  },
};

export default PostJob;