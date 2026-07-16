import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/college-logo.png";

const Sidebar = ({ role }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const studentLinks = [
    { name: "Dashboard", path: "/student/dashboard" },
    { name: "My Profile", path: "/student/profile" },
    { name: "Jobs", path: "/student/jobs" },
    { name: "Applications", path: "/student/applications" },
  ];

  const companyLinks = [
    { name: "Dashboard", path: "/company/dashboard" },
    { name: "Company Profile", path: "/company/profile" },
    { name: "Post Job", path: "/company/post-job" },
    { name: "Manage Jobs", path: "/company/manage-jobs" },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Students", path: "/admin/students" },
    { name: "Companies", path: "/admin/companies" },
    { name: "Jobs", path: "/admin/jobs" },
    { name: "Applications", path: "/admin/applications" },
  ];

  let links = [];
  let panelTitle = "";

  if (role === "student") {
    links = studentLinks;
    panelTitle = "Student Panel";
  } else if (role === "company") {
    links = companyLinks;
    panelTitle = "Company Panel";
  } else if (role === "admin") {
    links = adminLinks;
    panelTitle = "Admin Panel";
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={styles.sidebar}>
      <div>
        <div style={styles.logoSection}>
          <img src={logo} alt="College Logo" style={styles.logo} />
          <h2 style={styles.portalTitle}>NIE Placement Portal</h2>
          <p style={styles.userRole}>{panelTitle}</p>
        </div>

        <div style={styles.userBox}>
          <p style={styles.welcome}>Welcome</p>
          <h3 style={styles.userName}>{user?.name || "User"}</h3>
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
    background: "linear-gradient(180deg,#1e3a8a,#2563eb)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px 18px",
    boxSizing: "border-box",
  },

  logoSection: {
    textAlign: "center",
    marginBottom: "24px",
  },

  logo: {
    width: "80px",
    height: "80px",
    background: "#fff",
    borderRadius: "50%",
    padding: "6px",
    objectFit: "contain",
    marginBottom: "12px",
  },

  portalTitle: {
    fontSize: "22px",
    marginBottom: "6px",
  },

  userRole: {
    opacity: 0.9,
  },

  userBox: {
    background: "rgba(255,255,255,0.12)",
    padding: "16px",
    borderRadius: "14px",
    marginBottom: "24px",
  },

  welcome: {
    margin: 0,
    fontSize: "13px",
  },

  userName: {
    margin: "6px 0",
    fontSize: "18px",
  },

  userEmail: {
    margin: 0,
    fontSize: "13px",
    wordBreak: "break-word",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  link: {
    color: "#fff",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "10px",
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
    cursor: "pointer",
    fontWeight: "600",
  },
};

export default Sidebar;