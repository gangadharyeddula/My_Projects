import { useState } from "react";
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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await API.post("/auth/login", formData);

      const token =
        response.data.access_token ||
        response.data.token ||
        response.data.accessToken;

      if (!token) {
        setError("Token not received");
        return;
      }

      const userResponse = await API.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userResponse.data.user || userResponse.data;

      login(token, userData);

      toast.success("Login Successful");

      switch (userData.role) {
        case "student":
          navigate("/student/dashboard");
          break;

        case "company":
          navigate("/company/dashboard");
          break;

        case "admin":
          navigate("/admin/dashboard");
          break;

        default:
          setError("Invalid user role");
      }
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
          err.response?.data?.message ||
          "Invalid Email or Password"
      );

      toast.error("Login Failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.leftPanel}>
        <img src={logo} alt="College Logo" style={styles.logo} />

        <h1 style={styles.heading}>
          Newton's Institute of Engineering
        </h1>

        <p style={styles.description}>
          Welcome to the Placement Portal.
          <br />
          Login as Student, Company or Admin to continue.
        </p>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <h2 style={styles.loginTitle}>Login</h2>

          {error && (
            <div style={styles.errorBox}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div style={styles.formGroup}>
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label>Password</label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                style={styles.input}
                required
              />
            </div>

            <button
              type="submit"
              style={styles.button}
            >
              Login
            </button>

            <p style={styles.registerText}>
              Don't have an account?{" "}
              <Link
                to="/register"
                style={styles.link}
              >
                Register
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
    container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f5f9",
    flexWrap: "wrap",
  },

  leftPanel: {
    flex: 1,
    minWidth: "350px",
    background: "linear-gradient(135deg,#1e3a8a,#2563eb)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "50px",
    textAlign: "center",
  },

  logo: {
    width: "130px",
    height: "130px",
    background: "#fff",
    borderRadius: "50%",
    padding: "10px",
    marginBottom: "25px",
    objectFit: "contain",
  },

  heading: {
    fontSize: "36px",
    marginBottom: "18px",
    lineHeight: 1.3,
  },

  description: {
    maxWidth: "420px",
    fontSize: "17px",
    lineHeight: "1.8",
    opacity: 0.95,
  },

  rightPanel: {
    flex: 1,
    minWidth: "350px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    borderRadius: "18px",
    padding: "40px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
  },

  loginTitle: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#1e293b",
    fontSize: "30px",
  },

  errorBox: {
    background: "#fee2e2",
    color: "#b91c1c",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "18px",
    textAlign: "center",
  },

  formGroup: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "18px",
  },

  input: {
    marginTop: "8px",
    padding: "14px",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    fontSize: "15px",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: "15px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "10px",
  },

  registerText: {
    marginTop: "20px",
    textAlign: "center",
    color: "#475569",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
