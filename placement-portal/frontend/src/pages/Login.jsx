import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import logo from "../assets/college-logo.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined"
        ? window.innerWidth <= 768
        : false
  );

  // ==========================================
  // RESPONSIVE SCREEN DETECTION
  // ==========================================

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
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
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await API.post(
        "/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      const token =
        response.data.access_token ||
        response.data.token ||
        response.data.accessToken;

      if (!token) {
        setError(
          "Authentication token was not received."
        );

        return;
      }

      const userResponse = await API.get(
        "/auth/me",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userData =
        userResponse.data.user ||
        userResponse.data;

      if (!userData?.role) {
        setError(
          "Unable to determine account access."
        );

        return;
      }

      login(token, userData);

      toast.success("Login Successful");

      switch (userData.role) {
        case "student":
          navigate(
            "/student/dashboard",
            { replace: true }
          );
          break;

        case "company":
          navigate(
            "/company/dashboard",
            { replace: true }
          );
          break;

        case "admin":
          navigate(
            "/admin/dashboard",
            { replace: true }
          );
          break;

        default:
          setError(
            "Your account does not have a valid access role."
          );
      }
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err.message
      );

      const message =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Invalid email or password.";

      setError(message);

      toast.error("Login Failed");
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
            : "minmax(320px, 0.95fr) minmax(400px, 1.05fr)",

          borderRadius: isMobile
            ? "0"
            : "28px",

          minHeight: isMobile
            ? "100vh"
            : "650px",
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

            minHeight: isMobile
              ? "auto"
              : "650px",
          }}
        >
          <div style={styles.heroTop}>
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
                Welcome back.
              </h1>

              <p
                style={{
                  ...styles.heroDescription,

                  fontSize: isMobile
                    ? "14px"
                    : "16px",
                }}
              >
                Access placement opportunities,
                manage applications, recruitment,
                and placement activities through one
                secure portal.
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
                  One portal, three experiences
                </strong>

                <p style={styles.infoText}>
                  Students, approved companies and
                  administrators are automatically
                  redirected to their respective
                  dashboards after login.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ================================= */}
        {/* LOGIN FORM */}
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
                WELCOME BACK
              </p>

              <h2
                style={{
                  ...styles.formTitle,

                  fontSize: isMobile
                    ? "27px"
                    : "32px",
                }}
              >
                Sign in to your account
              </h2>

              <p style={styles.formSubtitle}>
                Enter your registered email and
                password to continue.
              </p>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <span>⚠️</span>

                <span style={styles.messageText}>
                  {error}
                </span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* EMAIL */}

              <div style={styles.field}>
                <label style={styles.label}>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  style={styles.input}
                  required
                />
              </div>

              {/* PASSWORD */}

              <div style={styles.field}>
                <div style={styles.passwordLabelRow}>
                  <label style={styles.labelNoMargin}>
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    style={styles.forgotLink}
                  >
                    Forgot Password?
                  </Link>
                </div>

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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
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
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.loginButton,

                  ...(loading
                    ? styles.disabledButton
                    : {}),
                }}
              >
                {loading
                  ? "Signing In..."
                  : "Sign In"}
              </button>
            </form>

            <div style={styles.divider}>
              <span
                style={styles.dividerLine}
              />

              <span
                style={styles.dividerText}
              >
                New to the portal?
              </span>

              <span
                style={styles.dividerLine}
              />
            </div>

            <p style={styles.registerText}>
              Don't have an account?{" "}

              <Link
                to="/register"
                style={styles.registerLink}
              >
                Create an account
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

  heroTop: {
    minWidth: 0,
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
    maxWidth: "460px",

    marginTop: "20px",

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

    maxWidth: "470px",

    minWidth: 0,
  },

  formHeader: {
    marginBottom: "30px",
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

    marginBottom: "20px",
  },

  label: {
    display: "block",

    marginBottom: "8px",

    color: "#334155",

    fontWeight: "650",

    fontSize: "14px",
  },

  labelNoMargin: {
    color: "#334155",

    fontWeight: "650",

    fontSize: "14px",
  },

  input: {
    width: "100%",

    minWidth: 0,

    height: "50px",

    padding: "0 15px",

    border:
      "1px solid #cbd5e1",

    borderRadius: "12px",

    background: "#f8fafc",

    color: "#0f172a",

    fontSize: "15px",

    outline: "none",

    boxSizing: "border-box",
  },

  passwordLabelRow: {
    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "8px",

    marginBottom: "8px",
  },

  forgotLink: {
    color: "#2563eb",

    textDecoration: "none",

    fontSize: "13px",

    fontWeight: "650",
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

    padding: "0 10px 0 15px",

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

    padding: "0 14px",

    border: "none",

    background: "transparent",

    color: "#2563eb",

    cursor: "pointer",

    fontWeight: "700",

    fontSize: "12px",
  },

  loginButton: {
    width: "100%",

    minHeight: "52px",

    marginTop: "4px",

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

  registerText: {
    margin: "18px 0 0",

    textAlign: "center",

    color: "#64748b",

    fontSize: "14px",
  },

  registerLink: {
    color: "#2563eb",

    fontWeight: "700",

    textDecoration: "none",
  },
};

export default Login;