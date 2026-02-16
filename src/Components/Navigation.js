/**
 * Navigation Component
 * 
 * Fixed top navigation bar providing:
 * - Student search with autocomplete suggestions
 * - User profile dropdown with account management
 * - Responsive design with gradient blue theme
 * - Role-based menu items
 */

import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navigation({ students = [], onLogout, auth, notificationCount = 0 }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
    padding: "10px 30px",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7ec8e3 100%)",
    color: "white",
    boxShadow: "0 2px 8px rgba(42, 82, 152, 0.2)",
    marginBottom: "0",
    borderRadius: "0",
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    zIndex: "1000",
    height: "60px",
  };

  const brandStyle = {
    fontSize: "24px",
    fontWeight: "700",
    textDecoration: "none",
    color: "white",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: "0 0 auto",
  };

  const centerContainerStyle = {
    flex: "1",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const profileContainerStyle = {
    position: "relative",
    flex: "0 0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
  };

  const adminLabelStyle = {
    fontSize: "11px",
    fontWeight: "600",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const profileButtonStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    border: "2px solid rgba(255, 255, 255, 0.4)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    color: "white",
    transition: "all 0.3s ease",
  };

  const profileButtonWrapperStyle = {
    position: "relative",
  };

  const notificationsButtonStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "0",
    backgroundColor: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
    color: "white",
    transition: "all 0.3s ease",
  };


  const notificationsWrapperStyle = {
    position: "relative",
    marginRight: "8px",
    display: "flex",
    alignItems: "center",
    transform: "translateY(-6px)",
    cursor: "pointer",
  };

  const bellIconStyle = {
    transform: "translateY(-1px)",
    pointerEvents: "none",
  };

  const notificationBadgeStyle = {
    position: "absolute",
    top: "-4px",
    right: "-4px",
    minWidth: "18px",
    height: "18px",
    padding: "0 5px",
    borderRadius: "9px",
    backgroundColor: "#e74c3c",
    color: "white",
    fontSize: "11px",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "2px solid white",
    pointerEvents: "none",
  };

  const profileMenuStyle = {
    position: "absolute",
    top: "50px",
    right: "0",
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    width: "200px",
    zIndex: 1001,
    overflow: "hidden",
    border: "1px solid rgba(42, 82, 152, 0.2)",
  };

  const menuItemStyle = {
    padding: "12px 16px",
    cursor: "pointer",
    color: "#1e3c72",
    textDecoration: "none",
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    borderBottom: "1px solid rgba(42, 82, 152, 0.1)",
    transition: "background-color 0.2s ease",
  };

  const menuButtonStyle = {
    ...menuItemStyle,
    width: "100%",
    textAlign: "left",
    backgroundColor: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(42, 82, 152, 0.1)",
  };

  const searchContainerStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    position: "relative",
  };

  const searchInputStyle = {
    padding: "12px 18px",
    borderRadius: "25px",
    border: "none",
    width: "400px",
    fontSize: "14px",
    outline: "none",
  };

  const searchButtonStyle = {
    padding: "12px 24px",
    backgroundColor: "#1e3c72",
    color: "white",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
  };

  const suggestionsStyle = {
    position: "absolute",
    top: "50px",
    left: 0,
    backgroundColor: "white",
    color: "#1e3c72",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
    width: "400px",
    zIndex: 20,
    overflow: "hidden",
    border: "1px solid rgba(42, 82, 152, 0.2)",
  };

  const suggestionItemStyle = {
    padding: "10px 12px",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const suggestionMetaStyle = {
    fontSize: "12px",
    color: "#666",
  };

  const suggestions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    return students
      .filter(s =>
        (s.name || "").toLowerCase().includes(q) ||
        (s.studentClass || "").toLowerCase().includes(q) ||
        (s.section || "").toLowerCase().includes(q) ||
        (s.rollNumber || "").toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchTerm, students]);

  return (
    <nav style={navStyle}>
      <Link 
        to="/" 
        style={brandStyle} 
        onMouseOver={(e) => e.target.style.opacity = "0.8"} 
        onMouseOut={(e) => e.target.style.opacity = "1"}
      >
        📚 Student Management
      </Link>

      <div style={centerContainerStyle}>
        <form onSubmit={handleSearch} style={searchContainerStyle}>
          <input
            type="text"
            placeholder="Search name, class, section, roll..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            style={searchInputStyle}
          />
          <button 
            type="submit" 
            style={searchButtonStyle} 
            onMouseOver={(e) => e.target.style.backgroundColor = "#2a5298"} 
            onMouseOut={(e) => e.target.style.backgroundColor = "#1e3c72"}
          >
            🔍 Search
          </button>
          {showSuggestions && suggestions.length > 0 && (
            <div style={suggestionsStyle}>
              {suggestions.map((student) => (
                <div
                  key={student._id}
                  style={suggestionItemStyle}
                  onMouseDown={() => {
                    navigate(`/student/${student._id}`);
                    setSearchTerm("");
                    setShowSuggestions(false);
                  }}
                >
                  <div><strong>{student.name}</strong></div>
                  <div style={suggestionMetaStyle}>
                    Class: {student.studentClass || "N/A"} • Section: {student.section || "N/A"} • Roll: {student.rollNumber || "N/A"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={notificationsWrapperStyle} onClick={() => navigate("/notifications")}>
          <button
            type="button"
            style={notificationsButtonStyle}
            aria-label="Notifications"
          >
            <span aria-hidden="true" style={bellIconStyle}>🔔︎</span>
          </button>
          {notificationCount > 0 && (
            <div style={notificationBadgeStyle}>
              {notificationCount > 99 ? "99+" : notificationCount}
            </div>
          )}
        </div>
        <div style={profileContainerStyle}>
        <div style={profileButtonWrapperStyle}>
          <div
            style={profileButtonStyle}
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)"}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.2)"}
          >
            {auth?.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
        </div>
        <span style={adminLabelStyle}>
          {auth?.user?.role ? auth.user.role.charAt(0).toUpperCase() + auth.user.role.slice(1) : "User"}
        </span>

        {showProfileMenu && (
          <div 
            style={profileMenuStyle}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <Link
              to="/"
              style={menuItemStyle}
              onClick={() => setShowProfileMenu(false)}
              onMouseOver={(e) => e.target.style.backgroundColor = "rgba(42, 82, 152, 0.1)"}
              onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
            >
              🏠 Home
            </Link>

            <Link
              to="/students"
              style={menuItemStyle}
              onClick={() => setShowProfileMenu(false)}
              onMouseOver={(e) => e.target.style.backgroundColor = "rgba(42, 82, 152, 0.1)"}
              onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
            >
              📋 View Students
            </Link>

            <Link
              to="/exams"
              style={menuItemStyle}
              onClick={() => setShowProfileMenu(false)}
              onMouseOver={(e) => e.target.style.backgroundColor = "rgba(42, 82, 152, 0.1)"}
              onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
            >
              📊 Exams
            </Link>

            <Link
              to="/account"
              style={menuItemStyle}
              onClick={() => setShowProfileMenu(false)}
              onMouseOver={(e) => e.target.style.backgroundColor = "rgba(42, 82, 152, 0.1)"}
              onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
            >
              ⚙️ Account
            </Link>

            {onLogout && (
              <button
                type="button"
                style={menuButtonStyle}
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = "rgba(192, 57, 43, 0.1)"}
                onMouseOut={(e) => e.target.style.backgroundColor = "transparent"}
              >
                🚪 Logout
              </button>
            )}
          </div>
        )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
