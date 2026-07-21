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
  });

  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // =========================================
  // FETCH PROFILE
  // =========================================

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        "/students/profile"
      );

      const profile = response.data.profile;

      setFormData({
        full_name: profile.full_name || "",
        phone: profile.phone || "",
        branch: profile.branch || "",
        cgpa: profile.cgpa ?? "",
        skills: Array.isArray(profile.skills)
          ? profile.skills.join(", ")
          : profile.skills || "",
      });

      setResumeUrl(profile.resume_url || "");
      setProfileExists(true);
    } catch (err) {
      // A missing profile is normal for a
      // newly registered student.
      setProfileExists(false);

      if (
        err.response &&
        err.response.status !== 404
      ) {
        console.error(
          "Failed to fetch profile:",
          err
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // INPUT CHANGE
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================
  // FILE SELECTION
  // =========================================

  const handleFileChange = (e) => {
    setError("");
    setMessage("");

    const file = e.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      setResumeFile(null);

      setError(
        "Please select a PDF file only."
      );

      e.target.value = "";

      return;
    }

    setResumeFile(file);
  };

  // =========================================
  // UPLOAD RESUME
  // =========================================

  const handleResumeUpload = async () => {
    if (!resumeFile) {
      setError(
        "Please choose a PDF resume first."
      );

      return;
    }

    try {
      setUploading(true);

      setError("");
      setMessage("");

      const uploadData = new FormData();

      uploadData.append(
        "resume",
        resumeFile
      );

      const response = await API.post(
        "/students/upload-resume",
        uploadData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setResumeUrl(
        response.data.resume_url || ""
      );

      setResumeFile(null);

      setMessage(
        response.data.message ||
          "Resume uploaded successfully."
      );
    } catch (err) {
      console.error(
        "Resume upload failed:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Resume upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  // =========================================
  // CREATE / UPDATE PROFILE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const parsedCgpa = Number(
      formData.cgpa
    );

    if (
      Number.isNaN(parsedCgpa) ||
      parsedCgpa < 0 ||
      parsedCgpa > 10
    ) {
      setError(
        "Please enter a valid CGPA between 0 and 10."
      );

      return;
    }

    const payload = {
      full_name: formData.full_name.trim(),

      phone: formData.phone.trim(),

      branch: formData.branch.trim(),

      cgpa: parsedCgpa,

      skills: formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
    };

    try {
      setSaving(true);

      let response;

      if (profileExists) {
        response = await API.put(
          "/students/profile",
          payload
        );
      } else {
        response = await API.post(
          "/students/profile",
          payload
        );

        setProfileExists(true);
      }

      setMessage(
        response.data.message ||
          (profileExists
            ? "Profile updated successfully."
            : "Profile created successfully.")
      );

      await fetchProfile();
    } catch (err) {
      console.error(
        "Profile save failed:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Something went wrong while saving your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout
      role="student"
      title="My Student Profile"
      subtitle="Create and manage your placement profile"
    >
      {loading ? (
        <div style={styles.stateCard}>
          <h3 style={styles.stateTitle}>
            Loading profile...
          </h3>

          <p style={styles.stateText}>
            Please wait while your profile is
            being loaded.
          </p>
        </div>
      ) : (
        <div style={styles.pageGrid}>
          {/* ================================= */}
          {/* PROFILE FORM */}
          {/* ================================= */}

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <h2 style={styles.cardTitle}>
                  Personal & Academic Details
                </h2>

                <p style={styles.cardDescription}>
                  Keep your information accurate
                  so recruiters can review your
                  profile.
                </p>
              </div>

              <span
                style={{
                  ...styles.statusBadge,

                  ...(profileExists
                    ? styles.completedBadge
                    : styles.incompleteBadge),
                }}
              >
                {profileExists
                  ? "Profile Created"
                  : "Profile Incomplete"}
              </span>
            </div>

            {message && (
              <div style={styles.successBox}>
                {message}
              </div>
            )}

            {error && (
              <div style={styles.errorBox}>
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              style={styles.form}
            >
              <div style={styles.formGrid}>
                {/* FULL NAME */}

                <div style={styles.field}>
                  <label style={styles.label}>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    placeholder="Enter your full name"
                    value={formData.full_name}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                {/* PHONE */}

                <div style={styles.field}>
                  <label style={styles.label}>
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                {/* BRANCH */}

                <div style={styles.field}>
                  <label style={styles.label}>
                    Branch
                  </label>

                  <input
                    type="text"
                    name="branch"
                    placeholder="Example: CSE AI & ML"
                    value={formData.branch}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>

                {/* CGPA */}

                <div style={styles.field}>
                  <label style={styles.label}>
                    CGPA
                  </label>

                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    name="cgpa"
                    placeholder="Example: 8.5"
                    value={formData.cgpa}
                    onChange={handleChange}
                    style={styles.input}
                    required
                  />
                </div>
              </div>

              {/* SKILLS */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Skills
                </label>

                <textarea
                  name="skills"
                  placeholder="Python, FastAPI, React, MongoDB"
                  value={formData.skills}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows={4}
                  required
                />

                <span style={styles.helpText}>
                  Separate multiple skills using
                  commas.
                </span>
              </div>

              <button
                type="submit"
                style={{
                  ...styles.primaryButton,

                  ...(saving
                    ? styles.disabledButton
                    : {}),
                }}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : profileExists
                  ? "Update Profile"
                  : "Create Profile"}
              </button>
            </form>
          </div>

          {/* ================================= */}
          {/* RESUME SECTION */}
          {/* ================================= */}

          <div style={styles.resumeCard}>
            <div>
              <h2 style={styles.cardTitle}>
                Resume
              </h2>

              <p style={styles.cardDescription}>
                Upload your latest resume in PDF
                format for placement applications.
              </p>
            </div>

            <div style={styles.resumeStatus}>
              <span
                style={{
                  ...styles.statusDot,

                  background: resumeUrl
                    ? "#16a34a"
                    : "#f59e0b",
                }}
              />

              <span>
                {resumeUrl
                  ? "Resume uploaded"
                  : "No resume uploaded"}
              </span>
            </div>

            <div style={styles.uploadBox}>
              <label style={styles.label}>
                Choose Resume
              </label>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                style={styles.fileInput}
              />

              {resumeFile && (
                <div style={styles.fileSelected}>
                  <strong>
                    Selected:
                  </strong>{" "}
                  <span
                    style={
                      styles.fileName
                    }
                  >
                    {resumeFile.name}
                  </span>
                </div>
              )}

              <button
                type="button"
                style={{
                  ...styles.uploadButton,

                  ...(!resumeFile ||
                  uploading
                    ? styles.disabledButton
                    : {}),
                }}
                onClick={
                  handleResumeUpload
                }
                disabled={
                  !resumeFile ||
                  uploading
                }
              >
                {uploading
                  ? "Uploading..."
                  : resumeFile
                  ? "Upload Resume"
                  : "Choose Resume First"}
              </button>
            </div>

            {resumeUrl && (
              <a
                href={`http://127.0.0.1:8000${resumeUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.resumeLink}
              >
                📄 View Uploaded Resume
              </a>
            )}

            <div style={styles.resumeTip}>
              <strong>Tip:</strong> Keep your
              resume updated with your latest
              skills, projects, internships, and
              contact information.
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// =========================================
// STYLES
// =========================================

const styles = {
  pageGrid: {
    width: "100%",

    display: "grid",

    gridTemplateColumns:
      "minmax(0, 2fr) minmax(280px, 1fr)",

    gap: "20px",

    alignItems: "start",

    boxSizing: "border-box",
  },

  card: {
    minWidth: 0,

    background: "#ffffff",

    borderRadius: "16px",

    padding: "clamp(18px, 3vw, 28px)",

    boxShadow:
      "0 8px 24px rgba(0,0,0,0.06)",

    boxSizing: "border-box",
  },

  resumeCard: {
    minWidth: 0,

    background: "#ffffff",

    borderRadius: "16px",

    padding: "clamp(18px, 3vw, 24px)",

    boxShadow:
      "0 8px 24px rgba(0,0,0,0.06)",

    boxSizing: "border-box",

    display: "flex",

    flexDirection: "column",

    gap: "18px",
  },

  cardHeader: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "flex-start",

    flexWrap: "wrap",

    gap: "12px",

    marginBottom: "22px",
  },

  cardTitle: {
    margin: 0,

    color: "#1e293b",

    fontSize: "20px",

    overflowWrap: "break-word",
  },

  cardDescription: {
    margin: "7px 0 0",

    color: "#64748b",

    fontSize: "14px",

    lineHeight: "1.6",
  },

  statusBadge: {
    display: "inline-block",

    padding: "7px 11px",

    borderRadius: "999px",

    fontSize: "12px",

    fontWeight: "700",

    whiteSpace: "nowrap",
  },

  completedBadge: {
    background: "#dcfce7",

    color: "#15803d",
  },

  incompleteBadge: {
    background: "#fef3c7",

    color: "#b45309",
  },

  form: {
    width: "100%",

    display: "flex",

    flexDirection: "column",

    gap: "20px",
  },

  formGrid: {
    width: "100%",

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",

    gap: "18px",
  },

  field: {
    minWidth: 0,

    display: "flex",

    flexDirection: "column",

    gap: "8px",
  },

  label: {
    color: "#334155",

    fontSize: "14px",

    fontWeight: "600",
  },

  input: {
    width: "100%",

    minWidth: 0,

    padding: "13px 14px",

    borderRadius: "10px",

    border: "1px solid #cbd5e1",

    fontSize: "15px",

    outline: "none",

    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",

    minWidth: 0,

    padding: "13px 14px",

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

    lineHeight: "1.5",
  },

  primaryButton: {
    width: "100%",

    padding: "14px 18px",

    borderRadius: "10px",

    border: "none",

    background: "#2563eb",

    color: "#ffffff",

    fontSize: "15px",

    fontWeight: "600",

    cursor: "pointer",
  },

  uploadBox: {
    width: "100%",

    minWidth: 0,

    display: "flex",

    flexDirection: "column",

    gap: "12px",

    padding: "16px",

    background: "#f8fafc",

    border: "1px dashed #cbd5e1",

    borderRadius: "12px",

    boxSizing: "border-box",
  },

  fileInput: {
    width: "100%",

    maxWidth: "100%",

    minWidth: 0,

    fontSize: "13px",

    boxSizing: "border-box",
  },

  fileSelected: {
    width: "100%",

    minWidth: 0,

    padding: "10px",

    background: "#ffffff",

    borderRadius: "8px",

    color: "#475569",

    fontSize: "13px",

    boxSizing: "border-box",

    overflow: "hidden",
  },

  fileName: {
    overflowWrap: "anywhere",
  },

  uploadButton: {
    width: "100%",

    padding: "12px",

    border: "none",

    borderRadius: "9px",

    background: "#2563eb",

    color: "#ffffff",

    fontWeight: "600",

    cursor: "pointer",
  },

  disabledButton: {
    opacity: 0.6,

    cursor: "not-allowed",
  },

  resumeStatus: {
    display: "flex",

    alignItems: "center",

    gap: "8px",

    color: "#475569",

    fontSize: "14px",

    fontWeight: "600",
  },

  statusDot: {
    width: "9px",

    height: "9px",

    borderRadius: "50%",

    flexShrink: 0,
  },

  resumeLink: {
    display: "block",

    width: "100%",

    padding: "12px",

    background: "#eff6ff",

    color: "#2563eb",

    borderRadius: "9px",

    textDecoration: "none",

    textAlign: "center",

    fontWeight: "600",

    fontSize: "14px",

    boxSizing: "border-box",

    overflowWrap: "break-word",
  },

  resumeTip: {
    padding: "13px",

    background: "#f8fafc",

    borderRadius: "10px",

    color: "#64748b",

    fontSize: "13px",

    lineHeight: "1.6",

    overflowWrap: "break-word",
  },

  successBox: {
    marginBottom: "18px",

    padding: "12px 14px",

    borderRadius: "10px",

    background: "#ecfdf5",

    color: "#047857",

    fontSize: "14px",

    overflowWrap: "break-word",
  },

  errorBox: {
    marginBottom: "18px",

    padding: "12px 14px",

    borderRadius: "10px",

    background: "#fff1f2",

    color: "#be123c",

    fontSize: "14px",

    overflowWrap: "break-word",
  },

  stateCard: {
    width: "100%",

    padding: "40px 20px",

    background: "#ffffff",

    borderRadius: "16px",

    textAlign: "center",

    boxSizing: "border-box",
  },

  stateTitle: {
    margin: 0,

    color: "#334155",
  },

  stateText: {
    margin: "8px 0 0",

    color: "#64748b",

    fontSize: "14px",
  },
};

export default StudentProfile;