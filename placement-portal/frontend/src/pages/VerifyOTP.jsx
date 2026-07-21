import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            await API.post("/auth/verify-otp", {
                email,
                otp,
            });

            toast.success("OTP Verified");

            navigate("/reset-password", {
                state: {
                    email,
                    otp,
                },
            });
        } catch (err) {
            toast.error(
                err.response?.data?.detail ||
                "Invalid OTP"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>

                <h2 style={styles.title}>
                    Verify OTP
                </h2>

                <p style={styles.subtitle}>
                    Enter the OTP sent to
                </p>

                <p style={styles.email}>
                    {email}
                </p>

                <form onSubmit={handleVerifyOTP}>

                    <input
                        type="text"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                        style={styles.input}
                        required
                    />

                    <button
                        type="submit"
                        style={styles.button}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                </form>

                <div style={styles.footer}>
                    <Link
                        to="/forgot-password"
                        style={styles.link}
                    >
                        Back
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
        marginBottom: "5px",
    },

    email: {
        textAlign: "center",
        fontWeight: "bold",
        color: "#2563eb",
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
        fontWeight: "600",
        fontSize: "16px",
    },

    footer: {
        marginTop: "20px",
        textAlign: "center",
    },

    link: {
        textDecoration: "none",
        color: "#2563eb",
        fontWeight: "600",
    },
};

export default VerifyOTP;