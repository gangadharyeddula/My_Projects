import AdminSidebar from "../components/AdminSidebar";

const AdminLayout = ({ title, subtitle, children }) => {
  return (
    <div style={styles.wrapper}>
      <AdminSidebar />

      <div style={styles.main}>
        <div style={styles.header}>
          <h1 style={styles.title}>{title}</h1>
          {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
        </div>

        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};
[
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    label: "Students",
    path: "/admin/students",
  },
  {
    label: "Companies",
    path: "/admin/companies",
  },
  {
    label: "Jobs",
    path: "/admin/jobs",
  },
  {
    label: "Applications",
    path: "/admin/applications",
  },
]

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "#f1f5f9",
  },
  main: {
    flex: 1,
    padding: "30px",
  },
  header: {
    background: "#fff",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
  },
  title: {
    margin: 0,
    fontSize: "30px",
    color: "#1e293b",
  },
  subtitle: {
    marginTop: "8px",
    color: "#64748b",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
};

export default AdminLayout;