const tableStyles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#ffffff",
  },

  thead: {
    background: "#f8fafc",
  },

  th: {
    padding: "14px 16px",
    textAlign: "left",
    color: "#475569",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
    borderBottom: "1px solid #e2e8f0",
  },

  td: {
    padding: "14px 16px",
    color: "#334155",
    fontSize: "14px",
    lineHeight: "1.5",
    borderBottom: "1px solid #e2e8f0",
    verticalAlign: "middle",
  },

  actionGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },

  deleteButton: {
    border: "none",
    borderRadius: "8px",
    padding: "9px 13px",
    background: "#ef4444",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  editButton: {
    border: "none",
    borderRadius: "8px",
    padding: "9px 13px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  empty: {
    padding: "35px 20px",
    textAlign: "center",
    color: "#64748b",
  },
};

export default tableStyles;