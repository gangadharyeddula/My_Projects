import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/college-logo.png";

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Students", path: "/admin/students" },
    { name: "Companies", path: "/admin/companies" },
    { name: "Jobs", path: "/admin/jobs" },
    { name: "Applications", path: "/admin/applications" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <div>
        <div style={styles.logoSection}>
          <img src={logo} alt="College Logo" style={styles.logo} />
          <h2 style={styles.portalTitle}>NIE Admin Portal</h2>
          <p style={styles.userRole}>Administrator Panel</p>
        </div>

        <div style={styles.userBox}>
          <p style={styles.welcome}>Welcome</p>
          <h3 style={styles.userName}>{user?.name || "Admin"}</h3>
          <p style={styles.userEmail}>{user?.email}</p>
        </div>

        <nav style={styles.nav}>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {}),
                }}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "270px",
    minHeight: "100vh",
    background: "linear-gradient(180deg, #0f172a, #1e293b)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px 18px",
    boxSizing: "border-box",
    position: "sticky",
    top: 0,
  },
  logoSection: {
    textAlign: "center",
    marginBottom: "24px",
  },
  logo: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    background: "#fff",
    borderRadius: "50%",
    padding: "6px",
    marginBottom: "12px",
  },
  portalTitle: {
    fontSize: "22px",
    marginBottom: "6px",
  },
  userRole: {
    fontSize: "14px",
    opacity: 0.9,
  },
  userBox: {
    background: "rgba(255,255,255,0.12)",
    borderRadius: "14px",
    padding: "16px",
    marginBottom: "24px",
  },
  welcome: {
    margin: 0,
    fontSize: "13px",
    opacity: 0.9,
  },
  userName: {
    margin: "6px 0",
    fontSize: "18px",
  },
  userEmail: {
    margin: 0,
    fontSize: "13px",
    wordBreak: "break-word",
    opacity: 0.9,
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
    padding: "12px 14px",
    borderRadius: "10px",
    background: "transparent",
    fontWeight: "500",
  },
  activeLink: {
    background: "rgba(255,255,255,0.18)",
  },
  logoutBtn: {
    marginTop: "20px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "#fff",
    fontWeight: "600",
    cursor: "pointer",
  },
};

export default AdminSidebar;