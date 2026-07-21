import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await API.post("/auth/forgot-password", {
        email,
      });

      toast.success("OTP sent successfully");

      navigate("/verify-otp", {
        state: { email },
      });

    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
        "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>

        <p style={styles.subtitle}>
          Enter your registered email address.
        </p>

        <form onSubmit={handleSendOTP}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div style={styles.footer}>
          <Link
            to="/login"
            style={styles.link}
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
  },

  card: {
    width: "420px",
    background: "#fff",
    padding: "40px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    color: "#64748b",
    marginBottom: "25px",
  },

  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    marginBottom: "20px",
    fontSize: "15px",
    boxSizing: "border-box",
  },

  button: {
    width: "100%",
    padding: "14px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
  },

  footer: {
    marginTop: "20px",
    textAlign: "center",
  },

  link: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default ForgotPassword;