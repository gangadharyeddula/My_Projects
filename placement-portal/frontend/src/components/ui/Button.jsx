const Button = ({
  children,
  type = "button",
  onClick,
  className = "",
  disabled = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        width: "100%",
        padding: "14px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "12px",
        fontWeight: "600",
        fontSize: "15px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "0.3s",
      }}
    >
      {children}
    </button>
  );
};

export default Button;