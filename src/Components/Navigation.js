import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navigation() {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm("");
    }
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7ec8e3 100%)",
    color: "white",
    boxShadow: "0 2px 8px rgba(42, 82, 152, 0.2)",
    marginBottom: "30px",
    borderRadius: "10px",
  };

  const brandStyle = {
    fontSize: "24px",
    fontWeight: "700",
    textDecoration: "none",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const navLinksStyle = {
    display: "flex",
    gap: "25px",
    alignItems: "center",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    padding: "8px 16px",
    borderRadius: "6px",
    transition: "all 0.3s ease",
  };

  const searchContainerStyle = {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  };

  const searchInputStyle = {
    padding: "8px 15px",
    borderRadius: "6px",
    border: "none",
    width: "200px",
    fontSize: "13px",
  };

  const searchButtonStyle = {
    padding: "8px 15px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.3s ease",
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={brandStyle} onMouseOver={(e) => e.target.style.opacity = "0.8"} onMouseOut={(e) => e.target.style.opacity = "1"}>
        📚 Student Management
      </Link>

      <div style={navLinksStyle}>
        <Link
          to="/"
          style={linkStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
        >
          🏠 Home
        </Link>

        <Link
          to="/add-student"
          style={linkStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
        >
          ➕ Add Student
        </Link>

        <Link
          to="/students"
          style={linkStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
        >
          📋 View Students
        </Link>

        <Link
          to="/exams"
          style={linkStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
          onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
        >
          📊 Exams
        </Link>

        <form onSubmit={handleSearch} style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
          />
          <button type="submit" style={searchButtonStyle} onMouseOver={(e) => e.target.style.backgroundColor = "#229954"} onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}>
            🔍
          </button>
        </form>
      </div>
    </nav>
  );
}

export default Navigation;
