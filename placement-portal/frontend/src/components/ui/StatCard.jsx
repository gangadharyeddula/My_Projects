const StatCard = ({ title, value, subtitle, color = "#2563eb" }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        borderLeft: `6px solid ${color}`,
      }}
    >
      <h4
        style={{
          margin: 0,
          color: "#64748b",
          fontSize: "15px",
          fontWeight: "600",
        }}
      >
        {title}
      </h4>

      <h2
        style={{
          margin: "14px 0 8px",
          fontSize: "32px",
          color,
        }}
      >
        {value}
      </h2>

      {subtitle && (
        <p
          style={{
            margin: 0,
            color: "#94a3b8",
            fontSize: "14px",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;