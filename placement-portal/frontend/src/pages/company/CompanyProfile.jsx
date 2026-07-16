import { useEffect, useState } from "react";
import API from "../../api/axios";
import DashboardLayout from "../../layouts/DashboardLayout";

const CompanyProfile = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    hr_name: "",
    email: "",
    phone: "",
    website: "",
    location: "",
    description: "",
  });

  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await API.get("/companies/profile");
      const profile = response.data.profile;

      setFormData({
        company_name: profile.company_name || "",
        hr_name: profile.hr_name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        website: profile.website || "",
        location: profile.location || "",
        description: profile.description || "",
      });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (profileExists) {
        const response = await API.put("/companies/profile", formData);
        setMessage(response.data.message || "Profile updated successfully");
      } else {
        const response = await API.post("/companies/profile", formData);
        setMessage(response.data.message || "Profile created successfully");
        setProfileExists(true);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <DashboardLayout
      role="company"
      title="Company Profile"
      subtitle="Manage your company details for the placement portal"
    >
      <div style={styles.card}>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="text"
            name="hr_name"
            placeholder="HR Name"
            value={formData.hr_name}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Company Email"
            value={formData.email}
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
            name="website"
            placeholder="Website"
            value={formData.website}
            onChange={handleChange}
            style={styles.input}
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

          <textarea
            name="description"
            placeholder="Company Description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            rows="5"
          />

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

export default CompanyProfile;