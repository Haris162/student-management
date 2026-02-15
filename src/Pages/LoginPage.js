import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage({ apiBase, onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const containerStyle = {
    height: "100vh",
    display: "flex",
    alignItems: "stretch",
    justifyContent: "space-between",
    background: "#f6f8fb",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  };

  const leftPanelStyle = {
    flex: "0 0 60%",
    height: "100%",
    position: "relative",
    overflow: "hidden",
    backgroundImage: "url('/images/school-background.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };

  const rightPanelStyle = {
    flex: "0 0 40%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    background: "#f6f8fb",
    height: "100%",
  };

  const cardStyle = {
    width: "360px",
    backgroundColor: "white",
    border: "1px solid rgba(30, 60, 114, 0.12)",
    borderRadius: "16px",
    padding: "28px",
    boxShadow: "0 18px 50px rgba(30, 60, 114, 0.18)",
    position: "relative",
    margin: "0 auto",
  };

  const titleStyle = {
    margin: "0 0 6px 0",
    fontSize: "22px",
    color: "#1e3c72",
    fontWeight: "700",
  };

  const subtitleStyle = {
    margin: "0 0 18px 0",
    fontSize: "13px",
    color: "#5c6c86",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "6px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #7ec8e3",
    marginBottom: "14px",
    fontSize: "14px",
    backgroundColor: "white",
    boxSizing: "border-box",
  };

  const buttonStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2a5298",
    color: "white",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const errorStyle = {
    marginTop: "10px",
    color: "#c0392b",
    fontSize: "12px",
    fontWeight: "600",
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Login failed");
        }
        return res.json();
      })
      .then((data) => {
        onLogin(data);
        navigate('/');
      })
      .catch((err) => {
        setError(err.message || "Login failed");
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div style={containerStyle}>
      <div style={leftPanelStyle}>
        {/* School background image will be displayed here */}
      </div>

      <div style={rightPanelStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Login</h1>
          <p style={subtitleStyle}>Sign in to access the dashboard.</p>
          <form onSubmit={handleSubmit}>
            <div style={labelStyle}>Email</div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="admin@school.com"
              required
            />
            <div style={labelStyle}>Password</div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter password"
              required
            />
            <button type="submit" style={buttonStyle} disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          {error && <div style={errorStyle}>{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
