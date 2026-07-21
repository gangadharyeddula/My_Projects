import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({
  role,
  title,
  subtitle,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [isMobile, setIsMobile] =
    useState(() => {
      if (typeof window === "undefined") {
        return false;
      }

      return window.innerWidth <= 900;
    });

  /* =====================================
     DETECT SCREEN SIZE
  ===================================== */

  useEffect(() => {
    const handleResize = () => {
      const mobile =
        window.innerWidth <= 900;

      setIsMobile(mobile);

      // Close mobile drawer when
      // switching back to desktop.
      if (!mobile) {
        setSidebarOpen(false);
      }
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

  /* =====================================
     PREVENT BODY SCROLL WHEN MOBILE
     SIDEBAR IS OPEN
  ===================================== */

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    if (sidebarOpen) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen, isMobile]);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div style={styles.wrapper}>
      {/* =================================
          DESKTOP SIDEBAR
      ================================= */}

      {!isMobile && (
        <div style={styles.desktopSidebar}>
          <Sidebar role={role} />
        </div>
      )}

      {/* =================================
          MOBILE SIDEBAR
      ================================= */}

      {isMobile && (
        <>
          {sidebarOpen && (
            <div
              style={styles.overlay}
              onClick={closeSidebar}
              aria-hidden="true"
            />
          )}

          <div
            style={{
              ...styles.mobileSidebar,

              transform: sidebarOpen
                ? "translateX(0)"
                : "translateX(-100%)",
            }}
          >
            <Sidebar
              role={role}
              mobile={true}
              onClose={closeSidebar}
            />
          </div>
        </>
      )}

      {/* =================================
          MAIN CONTENT
      ================================= */}

      <main
        style={{
          ...styles.main,

          padding: isMobile
            ? "14px"
            : "30px",
        }}
      >
        {/* ===============================
            PAGE HEADER
        =============================== */}

        <header
          style={{
            ...styles.header,

            padding: isMobile
              ? "16px"
              : "24px",
          }}
        >
          <div style={styles.headerRow}>
            {/* MOBILE MENU */}

            {isMobile && (
              <button
                type="button"
                onClick={openSidebar}
                style={styles.menuButton}
                aria-label="Open navigation menu"
              >
                <span
                  style={styles.menuLine}
                />

                <span
                  style={styles.menuLine}
                />

                <span
                  style={styles.menuLine}
                />
              </button>
            )}

            {/* TITLE */}

            <div style={styles.headingArea}>
              <h1
                style={{
                  ...styles.title,

                  fontSize: isMobile
                    ? "22px"
                    : "30px",
                }}
              >
                {title}
              </h1>

              {subtitle && (
                <p style={styles.subtitle}>
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        </header>

        {/* ===============================
            PAGE CONTENT
        =============================== */}

        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

/* =====================================
   STYLES
===================================== */

const styles = {
  /*
    Full browser viewport.

    margin/padding are explicitly 0
    so there is no white border.
  */

  wrapper: {
    display: "flex",

    width: "100%",
    maxWidth: "100vw",

    height: "100vh",

    margin: 0,
    padding: 0,

    background: "#f1f5f9",

    boxSizing: "border-box",

    overflow: "hidden",
  },

  /* =================================
     DESKTOP SIDEBAR HOLDER
  ================================= */

  desktopSidebar: {
    width: "270px",

    height: "100vh",

    flexShrink: 0,

    margin: 0,
    padding: 0,

    overflow: "hidden",
  },

  /* =================================
     MAIN CONTENT
  ================================= */

  main: {
    flex: 1,

    minWidth: 0,

    height: "100vh",

    margin: 0,

    background: "#f1f5f9",

    boxSizing: "border-box",

    overflowY: "auto",

    overflowX: "hidden",

    WebkitOverflowScrolling: "touch",
  },

  /* =================================
     HEADER
  ================================= */

  header: {
    width: "100%",

    margin: "0 0 24px 0",

    background: "#ffffff",

    borderRadius: "16px",

    boxShadow:
      "0 8px 24px rgba(0,0,0,0.06)",

    boxSizing: "border-box",
  },

  headerRow: {
    display: "flex",

    alignItems: "flex-start",

    gap: "14px",

    width: "100%",

    minWidth: 0,
  },

  headingArea: {
    flex: 1,

    minWidth: 0,
  },

  title: {
    margin: 0,

    padding: 0,

    color: "#1e293b",

    lineHeight: "1.25",

    overflowWrap: "break-word",
  },

  subtitle: {
    margin: "8px 0 0",

    padding: 0,

    color: "#64748b",

    fontSize: "14px",

    lineHeight: "1.5",

    overflowWrap: "break-word",
  },

  /* =================================
     CONTENT
  ================================= */

  content: {
    display: "flex",

    flexDirection: "column",

    gap: "20px",

    width: "100%",

    minWidth: 0,

    margin: 0,

    padding: "0 0 30px",

    boxSizing: "border-box",
  },

  /* =================================
     MOBILE MENU BUTTON
  ================================= */

  menuButton: {
    width: "44px",

    height: "44px",

    minWidth: "44px",

    flexShrink: 0,

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "5px",

    margin: 0,

    padding: 0,

    border: "none",

    borderRadius: "10px",

    background: "#2563eb",

    cursor: "pointer",
  },

  menuLine: {
    display: "block",

    width: "20px",

    height: "2px",

    borderRadius: "999px",

    background: "#ffffff",
  },

  /* =================================
     MOBILE SIDEBAR
  ================================= */

  mobileSidebar: {
    position: "fixed",

    top: 0,

    left: 0,

    bottom: 0,

    width: "min(290px, 85vw)",

    height: "100vh",

    margin: 0,

    padding: 0,

    zIndex: 1001,

    transition:
      "transform 0.25s ease",

    overflow: "hidden",

    boxShadow:
      "12px 0 30px rgba(15,23,42,0.25)",
  },

  /* =================================
     MOBILE OVERLAY
  ================================= */

  overlay: {
    position: "fixed",

    inset: 0,

    margin: 0,

    background:
      "rgba(15,23,42,0.55)",

    zIndex: 1000,
  },
};

export default DashboardLayout;