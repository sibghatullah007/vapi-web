export default function AccessDeniedPage() {
  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "#f4f6f8",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        textAlign: "center",
        padding: "2rem",
        background: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        maxWidth: "400px"
      }}>
        <h1 style={{ color: "#e74c3c", marginBottom: "1rem" }}>🔒 Access Denied</h1>
        <p style={{ color: "#666", lineHeight: "1.6" }}>
          This content can only be accessed from authorized domains. 
          Please ensure you're accessing this page from the correct source.
        </p>
      </div>
    </div>
  );
} 