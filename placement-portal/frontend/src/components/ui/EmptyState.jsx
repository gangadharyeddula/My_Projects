const EmptyState = ({ title, subtitle }) => {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px",
        background: "#fff",
        borderRadius: "18px",
      }}
    >
      <h2>{title}</h2>

      <p
        style={{
          color: "#64748b",
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default EmptyState;