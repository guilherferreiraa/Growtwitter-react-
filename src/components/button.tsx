export function Button({ onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: "#1D9BF0",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "30px",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}