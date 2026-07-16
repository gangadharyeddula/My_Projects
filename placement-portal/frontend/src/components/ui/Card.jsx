const Card = ({ children, className = "" }) => {
  return (
    <div
      className={className}
      style={{
        background: "#ffffff",
        borderRadius: "20px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};

export default Card;