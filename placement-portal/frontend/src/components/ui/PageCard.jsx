const PageCard = ({ children }) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "18px",
        padding: "24px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
};

export default PageCard;