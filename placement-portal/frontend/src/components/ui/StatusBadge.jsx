const colors = {
  Applied: "#2563eb",
  Shortlisted: "#f59e0b",
  Selected: "#16a34a",
  Rejected: "#dc2626",
};

const StatusBadge = ({ status }) => {
  return (
    <span
      style={{
        background: colors[status] || "#64748b",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: "600",
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;