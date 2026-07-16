const Loader = ({ text = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "300px",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid #e2e8f0",
          borderTop: "5px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <p>{text}</p>

      <style>
        {`
          @keyframes spin {
            from {transform:rotate(0deg);}
            to {transform:rotate(360deg);}
          }
        `}
      </style>
    </div>
  );
};

export default Loader;