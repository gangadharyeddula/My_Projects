const ResponsiveTable = ({ children, minWidth = "800px" }) => {
  return (
    <div style={styles.card}>
      <div style={styles.scrollArea}>
        <div
          style={{
            minWidth,
            width: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  card: {
    width: "100%",
    minWidth: 0,
    background: "#ffffff",
    borderRadius: "16px",
    boxShadow: "0 6px 20px rgba(15,23,42,0.07)",
    overflow: "hidden",
    boxSizing: "border-box",
  },

  scrollArea: {
    width: "100%",
    overflowX: "auto",
    WebkitOverflowScrolling: "touch",
  },
};

export default ResponsiveTable;