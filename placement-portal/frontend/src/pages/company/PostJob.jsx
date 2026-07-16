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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = {
      ...formData,
      skills_required: formData.skills_required
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== ""),
    };

    try {
      // FIXED ENDPOINT
      const response = await API.post("/jobs/", payload);

      setMessage(response.data.message || "Job posted successfully");

      setFormData({
        title: "",
        description: "",
        location: "",
        salary: "",
        skills_required: "",
        deadline: "",
      });
    } catch (err) {
      console.error("Post job error:", err.response?.data || err.message);
      setError(err.response?.data?.detail || "Failed to post job");
    }
  };

  return (
    <DashboardLayout
      role="company"
      title="Post a New Job"
      subtitle="Create new placement opportunities for students"
    >
      <div style={styles.card}>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="5"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="skills_required"
            placeholder="Skills Required (comma separated)"
            value={formData.skills_required}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Post Job
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
};

const styles = {
  card: {
    background: "#fff",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
  },
  textarea: {
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
    outline: "none",
    resize: "vertical",
  },
  button: {
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  success: {
    color: "green",
    marginBottom: "14px",
  },
  error: {
    color: "red",
    marginBottom: "14px",
  },
};

export default PostJob;