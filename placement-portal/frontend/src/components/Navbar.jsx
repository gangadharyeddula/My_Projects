import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.logoSection}>
        <h2 style={styles.logo}>Placement Portal</h2>
      </div>

      <div style={styles.links}>
        {role === "student" && (
          <>
            <Link to="/student/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/student/profile" style={styles.link}>Profile</Link>
            <Link to="/student/jobs" style={styles.link}>Jobs</Link>
            <Link to="/student/applications" style={styles.link}>My Applications</Link>
          </>
        )}

        {role === "company" && (
          <>
            <Link to="/company/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/company/profile" style={styles.link}>Profile</Link>
            <Link to="/company/post-job" style={styles.link}>Post Job</Link>
            <Link to="/company/manage-jobs" style={styles.link}>Manage Jobs</Link>
          </>
        )}
      </div>

      <div style={styles.userSection}>
        <span style={styles.userText}>{user?.name}</span>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    background: "#1e3a8a",
    color: "#fff",
    padding: "14px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
  },
  logoSection: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    margin: 0,
    fontSize: "22px",
  },
  links: {
    display: "flex",
    gap: "18px",
    flexWrap: "wrap",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "500",
  },
  userSection: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userText: {
    fontWeight: "500",
  },
  logoutBtn: {
    padding: "8px 14px",
    border: "none",
    borderRadius: "8px",
    background: "#ef4444",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Navbar;