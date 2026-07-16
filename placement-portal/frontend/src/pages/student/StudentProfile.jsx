import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const StudentProfile = () => {
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    branch: "",
    cgpa: "",
    skills: "",
    resume_link: "",
  });

  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/students/profile");
      const profile = response.data.profile;

      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        branch: profile.branch || "",
        cgpa: profile.cgpa || "",
        skills: Array.isArray(profile.skills) ? profile.skills.join(", ") : "",
        resume_link: "",
      });

      setResumeUrl(profile.resume_url || "");
      setProfileExists(true);
    } catch (err) {
      setProfileExists(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResumeUpload = async () => {
  if (!resumeFile) {
    setError("Please choose a PDF resume.");
    return;
  }

  try {
    setError("");
    setMessage("");

    const formData = new FormData();
    formData.append("resume", resumeFile);

    const response = await API.post(
      "/students/upload-resume",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setResumeUrl(response.data.resume_url);
    setMessage("Resume uploaded successfully.");
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.detail || "Resume upload failed.");
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload = {
        full_name: formData.full_name,
        phone: formData.phone,
        branch: formData.branch,
        cgpa: parseFloat(formData.cgpa),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      if (profileExists) {
        const response = await API.put("/students/profile", payload);
        setMessage(response.data.message || "Profile updated successfully");
      } else {
        const response = await API.post("/students/profile", payload);
        setMessage(response.data.message || "Profile created successfully");
        setProfileExists(true);
      }

      await fetchProfile();
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <DashboardLayout
      role="student"
      title="My Student Profile"
      subtitle="Create and manage your placement profile"
    >
      <div style={styles.card}>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="branch"
            placeholder="Branch"
            value={formData.branch}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="number"
            step="0.01"
            name="cgpa"
            placeholder="CGPA"
            value={formData.cgpa}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChange={handleChange}
            style={styles.input}
            required
          />

            <label style={{ fontWeight: "600" }}>
             Resume (PDF)
            </label>
           
           <input
             type="file"
             accept=".pdf"
             onChange={(e) => setResumeFile(e.target.files[0])}
           />
           
           <button
              type="button"
              style={styles.button}
              onClick={handleResumeUpload}
              disabled={!resumeFile}
            >
              {resumeFile ? "Upload Resume" : "Choose Resume First"}
            </button>
           
           {resumeUrl && (
           <a
             href={`http://127.0.0.1:8000${resumeUrl}`}
             target="_blank"
             rel="noopener noreferrer"
             style={{
               color: "#2563eb",
               fontWeight: "600",
               textDecoration: "none",
               marginTop: "10px",
             }}
           >
             📄 View Uploaded Resume
           </a>
         )}
          <button type="submit" style={styles.button}>
            {profileExists ? "Update Profile" : "Create Profile"}
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

export default StudentProfile;