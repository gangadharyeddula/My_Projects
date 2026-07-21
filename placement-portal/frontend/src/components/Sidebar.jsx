import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import logo from "../assets/college-logo.png";

const Sidebar = ({
  role,
  mobile = false,
  onClose,
}) => {
  const location = useLocation();

  const navigate = useNavigate();

  const { logout, user } = useAuth();

  /* =====================================
     STUDENT LINKS
  ===================================== */

  const studentLinks = [
    {
      name: "Dashboard",
      path: "/student/dashboard",
    },

    {
      name: "My Profile",
      path: "/student/profile",
    },

    {
      name: "Jobs",
      path: "/student/jobs",
    },

    {
      name: "Applications",
      path: "/student/applications",
    },
  ];

  /* =====================================
     COMPANY LINKS
  ===================================== */

  const companyLinks = [
    {
      name: "Dashboard",
      path: "/company/dashboard",
    },

    {
      name: "Company Profile",
      path: "/company/profile",
    },

    {
      name: "Post Job",
      path: "/company/post-job",
    },

    {
      name: "Manage Jobs",
      path: "/company/manage-jobs",
    },
  ];

  /* =====================================
     ADMIN LINKS
  ===================================== */

  const adminLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
    },

    {
      name: "Students",
      path: "/admin/students",
    },

    {
      name: "Companies",
      path: "/admin/companies",
    },

    {
      name: "Jobs",
      path: "/admin/jobs",
    },

    {
      name: "Applications",
      path: "/admin/applications",
    },

    {
      name: "User Access",
      path: "/admin/user-access",
    },
  ];

  /* =====================================
     SELECT LINKS BASED ON ROLE
  ===================================== */

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

  /* =====================================
     LOGOUT
  ===================================== */

  const handleLogout = () => {
    logout();

    if (onClose) {
      onClose();
    }

    navigate("/login");
  };

  /* =====================================
     CLOSE MOBILE SIDEBAR AFTER CLICK
  ===================================== */

  const handleNavigation = () => {
    if (mobile && onClose) {
      onClose();
    }
  };

  return (
    <aside style={styles.sidebar}>
      <div style={styles.topContent}>
        {/* =============================
            MOBILE CLOSE
        ============================= */}

        {mobile && (
          <div style={styles.closeRow}>
            <button
              type="button"
              onClick={onClose}
              style={styles.closeButton}
              aria-label="Close navigation menu"
            >
              ×
            </button>
          </div>
        )}

        {/* =============================
            LOGO
        ============================= */}

        <div style={styles.logoSection}>
          <img
            src={logo}
            alt="College Logo"
            style={styles.logo}
          />

          <h2 style={styles.portalTitle}>
            NIE Placement Portal
          </h2>

          <p style={styles.userRole}>
            {panelTitle}
          </p>
        </div>

        {/* =============================
            USER INFORMATION
        ============================= */}

        <div style={styles.userBox}>
          <p style={styles.welcome}>
            Welcome
          </p>

          <h3 style={styles.userName}>
            {user?.name || "User"}
          </h3>

          <p style={styles.userEmail}>
            {user?.email || ""}
          </p>
        </div>

        {/* =============================
            NAVIGATION
        ============================= */}

        <nav style={styles.nav}>
          {links.map((link) => {
            const isActive =
              location.pathname ===
              link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={handleNavigation}
                style={{
                  ...styles.link,

                  ...(isActive
                    ? styles.activeLink
                    : {}),
                }}
              >
                {isActive && (
                  <span
                    style={
                      styles.activeIndicator
                    }
                  />
                )}

                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* =============================
          LOGOUT
      ============================= */}

      <button
        type="button"
        onClick={handleLogout}
        style={styles.logoutBtn}
      >
        Logout
      </button>
    </aside>
  );
};

/* =====================================
   STYLES
===================================== */

const styles = {
  sidebar: {
    width: "270px",

    maxWidth: "100%",

    height: "100vh",

    margin: 0,

    padding: "24px 18px",

    flexShrink: 0,

    background:
      "linear-gradient(180deg, #1e3a8a 0%, #2563eb 100%)",

    color: "#ffffff",

    display: "flex",

    flexDirection: "column",

    justifyContent: "space-between",

    boxSizing: "border-box",

    overflowY: "auto",

    overflowX: "hidden",
  },

  topContent: {
    width: "100%",

    minWidth: 0,
  },

  /* =================================
     MOBILE CLOSE
  ================================= */

  closeRow: {
    display: "flex",

    justifyContent: "flex-end",

    marginBottom: "5px",
  },

  closeButton: {
    width: "38px",

    height: "38px",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    padding: 0,

    border:
      "1px solid rgba(255,255,255,0.2)",

    borderRadius: "10px",

    background:
      "rgba(255,255,255,0.12)",

    color: "#ffffff",

    fontSize: "28px",

    lineHeight: 1,

    cursor: "pointer",
  },

  /* =================================
     LOGO
  ================================= */

  logoSection: {
    textAlign: "center",

    marginBottom: "22px",
  },

  logo: {
    width: "78px",

    height: "78px",

    display: "block",

    margin:
      "0 auto 10px auto",

    padding: "6px",

    background: "#ffffff",

    borderRadius: "50%",

    objectFit: "contain",

    boxSizing: "border-box",
  },

  portalTitle: {
    margin: "0 0 6px",

    padding: 0,

    fontSize: "21px",

    lineHeight: "1.3",

    overflowWrap: "break-word",
  },

  userRole: {
    margin: 0,

    padding: 0,

    opacity: 0.85,

    fontSize: "14px",
  },

  /* =================================
     USER BOX
  ================================= */

  userBox: {
    width: "100%",

    marginBottom: "22px",

    padding: "15px",

    background:
      "rgba(255,255,255,0.12)",

    borderRadius: "14px",

    boxSizing: "border-box",
  },

  welcome: {
    margin: 0,

    padding: 0,

    fontSize: "11px",

    opacity: 0.8,

    textTransform: "uppercase",

    letterSpacing: "1px",
  },

  userName: {
    margin: "7px 0 5px",

    padding: 0,

    fontSize: "17px",

    overflowWrap: "break-word",
  },

  userEmail: {
    margin: 0,

    padding: 0,

    fontSize: "12px",

    opacity: 0.9,

    wordBreak: "break-word",

    lineHeight: "1.5",
  },

  /* =================================
     NAVIGATION
  ================================= */

  nav: {
    display: "flex",

    flexDirection: "column",

    gap: "8px",

    width: "100%",
  },

  link: {
    position: "relative",

    display: "flex",

    alignItems: "center",

    width: "100%",

    minHeight: "46px",

    padding: "11px 14px",

    color: "#ffffff",

    textDecoration: "none",

    borderRadius: "10px",

    fontSize: "14px",

    boxSizing: "border-box",

    transition:
      "background 0.2s ease",

    overflow: "hidden",
  },

  activeLink: {
    background:
      "rgba(255,255,255,0.20)",

    fontWeight: "600",

    paddingLeft: "28px",
  },

  activeIndicator: {
    position: "absolute",

    left: "14px",

    top: "50%",

    transform:
      "translateY(-50%)",

    width: "4px",

    height: "24px",

    borderRadius: "999px",

    background: "#ffffff",
  },

  /* =================================
     LOGOUT
  ================================= */

  logoutBtn: {
    width: "100%",

    flexShrink: 0,

    marginTop: "20px",

    padding: "12px",

    border: "none",

    borderRadius: "10px",

    background: "#ef4444",

    color: "#ffffff",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "14px",
  },
};

export default Sidebar;