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

  const [profileExists, setProfileExists] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        "/companies/profile"
      );

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

      if (err.response?.status !== 404) {
        console.error(
          "Profile fetch error:",
          err
        );
      }
    } finally {
      setLoading(false);
    }
  };

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

    try {
      setSaving(true);

      let response;

      if (profileExists) {
        response = await API.put(
          "/companies/profile",
          formData
        );
      } else {
        response = await API.post(
          "/companies/profile",
          formData
        );

        setProfileExists(true);
      }

      setMessage(
        response.data.message ||
          "Profile saved successfully"
      );
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      role="company"
      title="Company Profile"
      subtitle="Manage your company details for the placement portal"
    >
      {loading ? (
        <div style={styles.loadingCard}>
          Loading company profile...
        </div>
      ) : (
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Company Information
              </h2>

              <p style={styles.cardDescription}>
                Keep your company information accurate
                for students and the placement cell.
              </p>
            </div>

            <span
              style={{
                ...styles.badge,
                ...(profileExists
                  ? styles.completeBadge
                  : styles.incompleteBadge),
              }}
            >
              {profileExists
                ? "Profile Created"
                : "Profile Incomplete"}
            </span>
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
                Company Name
              </label>

              <input
                type="text"
                name="company_name"
                placeholder="Company Name"
                value={formData.company_name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                HR Name
              </label>

              <input
                type="text"
                name="hr_name"
                placeholder="HR Name"
                value={formData.hr_name}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Company Email
              </label>

              <input
                type="email"
                name="email"
                placeholder="Company Email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Website
              </label>

              <input
                type="text"
                name="website"
                placeholder="Company Website"
                value={formData.website}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.fullWidth}>
              <label style={styles.label}>
                Company Description
              </label>

              <textarea
                name="description"
                placeholder="Tell students about your company..."
                value={formData.description}
                onChange={handleChange}
                style={styles.textarea}
                rows="6"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                ...styles.button,
                ...(saving
                  ? styles.disabledButton
                  : {}),
              }}
            >
              {saving
                ? "Saving..."
                : profileExists
                ? "Update Profile"
                : "Create Profile"}
            </button>
          </form>
        </div>
      )}
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

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "24px",
  },

  cardTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "21px",
  },

  cardDescription: {
    margin: "7px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  badge: {
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },

  completeBadge: {
    background: "#dcfce7",
    color: "#15803d",
  },

  incompleteBadge: {
    background: "#fef3c7",
    color: "#b45309",
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

  loadingCard: {
    padding: "30px",
    background: "#fff",
    borderRadius: "16px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default CompanyProfile;