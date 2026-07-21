import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/axios";

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";
    const otp = location.state?.otp || "";

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await API.post("/auth/reset-password", {
                email,
                otp,
                new_password: newPassword,
            });

            toast.success("Password Reset Successfully");

            navigate("/login");

        } catch (err) {
            toast.error(
                err.response?.data?.detail ||
                "Password reset failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <h2 style={styles.title}>
                    Reset Password
                </h2>

                <p style={styles.subtitle}>
                    Create a new password
                </p>

                <form onSubmit={handleResetPassword}>

                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) =>
                            setNewPassword(e.target.value)
                        }
                        style={styles.input}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        style={styles.input}
                        required
                    />

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading
                            ? "Updating..."
                            : "Reset Password"}
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
        borderRadius: "15px",
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
        marginBottom: "20px",
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        boxSizing: "border-box",
        fontSize: "15px",
    },

    button: {
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "600",
        fontSize: "16px",
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

export default ResetPassword;