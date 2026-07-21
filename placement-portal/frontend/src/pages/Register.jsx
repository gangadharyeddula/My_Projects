import { useEffect, useState } from "react";
import {
  useNavigate,
  Link,
} from "react-router-dom";

import API from "../api/axios";
import logo from "../assets/college-logo.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [isMobile, setIsMobile] =
    useState(
      () =>
        typeof window !== "undefined"
          ? window.innerWidth <= 768
          : false
    );

  // ==========================================
  // RESPONSIVE SCREEN
  // ==========================================

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(
        window.innerWidth <= 768
      );
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize
      );
    };
  }, []);

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError(
        "Passwords do not match."
      );

      return;
    }

    if (
      formData.password.length < 6
    ) {
      setError(
        "Password must contain at least 6 characters."
      );

      return;
    }

    try {
      setLoading(true);

      /*
        IMPORTANT SECURITY RULE:

        Public registration never accepts
        Company or Admin access.

        Every account begins as Student.

        Admin can later change access using
        Admin -> User Access.
      */

      const registerData = {
        name: formData.name.trim(),

        email: formData.email
          .trim()
          .toLowerCase(),

        password: formData.password,

        role: "student",
      };

      const response = await API.post(
        "/auth/register",
        registerData
      );

      setSuccess(
        response.data.message ||
          "Account created successfully. Redirecting to login..."
      );

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1500);
    } catch (err) {
      console.error(
        "Registration error:",
        err.response?.data ||
          err.message
      );

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        ...styles.page,

        padding: isMobile
          ? "0"
          : "30px 20px",
      }}
    >
      <div
        style={{
          ...styles.container,

          gridTemplateColumns: isMobile
            ? "1fr"
            : "minmax(320px, 0.9fr) minmax(400px, 1.1fr)",

          minHeight: isMobile
            ? "100vh"
            : "650px",

          borderRadius: isMobile
            ? "0"
            : "28px",
        }}
      >
        {/* ================================= */}
        {/* LEFT HERO */}
        {/* ================================= */}

        <section
          style={{
            ...styles.hero,

            padding: isMobile
              ? "30px 22px"
              : "50px",
          }}
        >
          <div>
            <div
              style={{
                ...styles.logoWrapper,

                width: isMobile
                  ? "72px"
                  : "92px",

                height: isMobile
                  ? "72px"
                  : "92px",
              }}
            >
              <img
                src={logo}
                alt="Newton's Institute of Engineering"
                style={styles.logo}
              />
            </div>

            <div
              style={{
                ...styles.heroContent,

                marginTop: isMobile
                  ? "25px"
                  : "55px",
              }}
            >
              <p style={styles.portalLabel}>
                NIE PLACEMENT PORTAL
              </p>

              <h1
                style={{
                  ...styles.heroTitle,

                  fontSize: isMobile
                    ? "clamp(27px, 8vw, 34px)"
                    : "42px",
                }}
              >
                Start your placement journey.
              </h1>

              <p
                style={{
                  ...styles.heroDescription,

                  fontSize: isMobile
                    ? "14px"
                    : "16px",
                }}
              >
                Create your account to explore
                placement opportunities, apply
                for jobs, track applications,
                and stay connected with the
                placement cell.
              </p>
            </div>
          </div>

          {!isMobile && (
            <div style={styles.infoBox}>
              <div style={styles.infoIcon}>
                🎓
              </div>

              <div>
                <strong
                  style={styles.infoTitle}
                >
                  Student access by default
                </strong>

                <p style={styles.infoText}>
                  Every new account starts with
                  Student access. Company and
                  Admin permissions can only be
                  assigned by an administrator.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ================================= */}
        {/* FORM */}
        {/* ================================= */}

        <section
          style={{
            ...styles.formSection,

            padding: isMobile
              ? "32px 20px 45px"
              : "55px 60px",
          }}
        >
          <div style={styles.formWrapper}>
            <div style={styles.formHeader}>
              <p style={styles.smallHeading}>
                CREATE ACCOUNT
              </p>

              <h2
                style={{
                  ...styles.formTitle,

                  fontSize: isMobile
                    ? "27px"
                    : "32px",
                }}
              >
                Register for the portal
              </h2>

              <p style={styles.formSubtitle}>
                Enter your details below to
                create your student account.
              </p>
            </div>

            {/* ERROR */}

            {error && (
              <div style={styles.errorBox}>
                <span>⚠️</span>

                <span style={styles.messageText}>
                  {error}
                </span>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div style={styles.successBox}>
                <span>✓</span>

                <span style={styles.messageText}>
                  {success}
                </span>
              </div>
            )}

            <form onSubmit={handleRegister}>
              {/* NAME */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Full Name
                </label>

                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  required
                />
              </div>

              {/* EMAIL */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Email Address
                </label>

                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                />
              </div>

              {/* PASSWORDS */}

              <div
                style={{
                  ...styles.passwordGrid,

                  gridTemplateColumns:
                    isMobile
                      ? "1fr"
                      : "repeat(2, minmax(0, 1fr))",
                }}
              >
                {/* PASSWORD */}

                <div style={styles.field}>
                  <label style={styles.label}>
                    Password
                  </label>

                  <div
                    style={
                      styles.passwordContainer
                    }
                  >
                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={
                        formData.password
                      }
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      autoComplete="new-password"
                      minLength={6}
                      style={
                        styles.passwordInput
                      }
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (prev) => !prev
                        )
                      }
                      style={styles.showButton}
                    >
                      {showPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>
                </div>

                {/* CONFIRM PASSWORD */}

                <div style={styles.field}>
                  <label style={styles.label}>
                    Confirm Password
                  </label>

                  <div
                    style={
                      styles.passwordContainer
                    }
                  >
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      autoComplete="new-password"
                      minLength={6}
                      style={
                        styles.passwordInput
                      }
                      required
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) => !prev
                        )
                      }
                      style={styles.showButton}
                    >
                      {showConfirmPassword
                        ? "Hide"
                        : "Show"}
                    </button>
                  </div>
                </div>
              </div>

              {/* ACCOUNT TYPE NOTICE */}

              <div style={styles.accountNotice}>
                <span
                  style={styles.studentIcon}
                >
                  👨‍🎓
                </span>

                <div style={styles.noticeContent}>
                  <strong
                    style={styles.noticeTitle}
                  >
                    Account Type: Student
                  </strong>

                  <p style={styles.noticeText}>
                    Your account will
                    automatically be registered
                    with Student access. An Admin
                    can change access later when
                    required.
                  </p>
                </div>
              </div>

              {/* REGISTER BUTTON */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.registerButton,

                  ...(loading
                    ? styles.disabledButton
                    : {}),
                }}
              >
                {loading
                  ? "Creating Account..."
                  : "Create Student Account"}
              </button>
            </form>

            <div style={styles.divider}>
              <span
                style={styles.dividerLine}
              />

              <span
                style={styles.dividerText}
              >
                Already registered?
              </span>

              <span
                style={styles.dividerLine}
              />
            </div>

            <p style={styles.loginText}>
              Already have an account?{" "}

              <Link
                to="/login"
                style={styles.loginLink}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

const styles = {
  page: {
    width: "100%",

    minHeight: "100vh",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background:
      "linear-gradient(135deg, #eef4ff 0%, #f8fafc 45%, #eef2ff 100%)",

    boxSizing: "border-box",

    overflowX: "hidden",

    fontFamily:
      "'Inter', 'Segoe UI', Arial, sans-serif",
  },

  container: {
    width: "100%",

    maxWidth: "1150px",

    display: "grid",

    background: "#ffffff",

    overflow: "hidden",

    boxShadow:
      "0 25px 60px rgba(15,23,42,0.15)",

    boxSizing: "border-box",
  },

  hero: {
    minWidth: 0,

    background:
      "linear-gradient(145deg, #172554 0%, #1e3a8a 48%, #2563eb 100%)",

    color: "#ffffff",

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",

    gap: "40px",

    boxSizing: "border-box",
  },

  logoWrapper: {
    borderRadius: "22px",

    background: "#ffffff",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: "10px",

    boxSizing: "border-box",

    boxShadow:
      "0 12px 30px rgba(0,0,0,0.15)",
  },

  logo: {
    width: "100%",

    height: "100%",

    objectFit: "contain",
  },

  heroContent: {
    minWidth: 0,
  },

  portalLabel: {
    margin: "0 0 15px",

    fontSize: "12px",

    fontWeight: "700",

    letterSpacing: "2px",

    color: "#bfdbfe",
  },

  heroTitle: {
    margin: 0,

    lineHeight: "1.15",

    fontWeight: "750",

    letterSpacing: "-1px",

    overflowWrap: "anywhere",
  },

  heroDescription: {
    marginTop: "22px",

    maxWidth: "460px",

    color: "#dbeafe",

    lineHeight: "1.75",

    overflowWrap: "anywhere",
  },

  infoBox: {
    display: "flex",

    alignItems: "flex-start",

    gap: "14px",

    padding: "18px",

    borderRadius: "18px",

    background:
      "rgba(255,255,255,0.11)",

    border:
      "1px solid rgba(255,255,255,0.15)",
  },

  infoIcon: {
    flexShrink: 0,

    fontSize: "25px",
  },

  infoTitle: {
    display: "block",

    marginBottom: "5px",

    fontSize: "14px",
  },

  infoText: {
    margin: 0,

    color: "#dbeafe",

    lineHeight: "1.55",

    fontSize: "13px",
  },

  formSection: {
    minWidth: 0,

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    background: "#ffffff",

    boxSizing: "border-box",
  },

  formWrapper: {
    width: "100%",

    maxWidth: "520px",

    minWidth: 0,
  },

  formHeader: {
    marginBottom: "28px",
  },

  smallHeading: {
    margin: "0 0 10px",

    color: "#2563eb",

    fontSize: "12px",

    fontWeight: "800",

    letterSpacing: "2px",
  },

  formTitle: {
    margin: 0,

    color: "#0f172a",

    fontWeight: "750",

    lineHeight: "1.2",

    overflowWrap: "anywhere",
  },

  formSubtitle: {
    margin: "10px 0 0",

    color: "#64748b",

    lineHeight: "1.6",

    fontSize: "14px",
  },

  field: {
    width: "100%",

    minWidth: 0,

    marginBottom: "18px",
  },

  label: {
    display: "block",

    marginBottom: "8px",

    color: "#334155",

    fontWeight: "650",

    fontSize: "14px",
  },

  input: {
    width: "100%",

    minWidth: 0,

    height: "50px",

    padding: "0 15px",

    boxSizing: "border-box",

    border:
      "1px solid #cbd5e1",

    borderRadius: "12px",

    background: "#f8fafc",

    color: "#0f172a",

    fontSize: "15px",

    outline: "none",
  },

  passwordGrid: {
    display: "grid",

    gap: "15px",

    width: "100%",

    minWidth: 0,
  },

  passwordContainer: {
    width: "100%",

    minWidth: 0,

    display: "flex",

    alignItems: "center",

    border:
      "1px solid #cbd5e1",

    borderRadius: "12px",

    background: "#f8fafc",

    overflow: "hidden",

    boxSizing: "border-box",
  },

  passwordInput: {
    flex: 1,

    minWidth: 0,

    height: "48px",

    padding: "0 8px 0 15px",

    border: "none",

    background: "transparent",

    color: "#0f172a",

    fontSize: "15px",

    outline: "none",

    boxSizing: "border-box",
  },

  showButton: {
    flexShrink: 0,

    height: "48px",

    padding: "0 13px",

    border: "none",

    background: "transparent",

    color: "#2563eb",

    cursor: "pointer",

    fontSize: "12px",

    fontWeight: "700",
  },

  accountNotice: {
    width: "100%",

    minWidth: 0,

    display: "flex",

    gap: "13px",

    alignItems: "center",

    padding: "14px 16px",

    marginBottom: "22px",

    background: "#eff6ff",

    border:
      "1px solid #bfdbfe",

    borderRadius: "13px",

    boxSizing: "border-box",
  },

  studentIcon: {
    flexShrink: 0,

    fontSize: "25px",
  },

  noticeContent: {
    minWidth: 0,
  },

  noticeTitle: {
    color: "#1e40af",

    fontSize: "14px",
  },

  noticeText: {
    margin: "4px 0 0",

    color: "#64748b",

    fontSize: "12px",

    lineHeight: "1.5",

    overflowWrap: "anywhere",
  },

  registerButton: {
    width: "100%",

    minHeight: "52px",

    border: "none",

    borderRadius: "13px",

    background:
      "linear-gradient(90deg, #1d4ed8, #2563eb)",

    color: "#ffffff",

    fontSize: "15px",

    fontWeight: "700",

    cursor: "pointer",

    boxShadow:
      "0 8px 20px rgba(37,99,235,0.25)",
  },

  disabledButton: {
    opacity: 0.65,

    cursor: "not-allowed",
  },

  errorBox: {
    display: "flex",

    alignItems: "flex-start",

    gap: "10px",

    width: "100%",

    padding: "13px 15px",

    marginBottom: "20px",

    borderRadius: "12px",

    background: "#fff1f2",

    color: "#be123c",

    fontSize: "14px",

    boxSizing: "border-box",
  },

  successBox: {
    display: "flex",

    alignItems: "flex-start",

    gap: "10px",

    width: "100%",

    padding: "13px 15px",

    marginBottom: "20px",

    borderRadius: "12px",

    background: "#ecfdf5",

    color: "#047857",

    fontSize: "14px",

    boxSizing: "border-box",
  },

  messageText: {
    minWidth: 0,

    overflowWrap: "anywhere",
  },

  divider: {
    display: "flex",

    alignItems: "center",

    gap: "12px",

    marginTop: "28px",
  },

  dividerLine: {
    height: "1px",

    background: "#e2e8f0",

    flex: 1,
  },

  dividerText: {
    color: "#94a3b8",

    fontSize: "12px",

    textAlign: "center",
  },

  loginText: {
    margin: "18px 0 0",

    textAlign: "center",

    color: "#64748b",

    fontSize: "14px",
  },

  loginLink: {
    color: "#2563eb",

    fontWeight: "700",

    textDecoration: "none",
  },
};

export default Register;