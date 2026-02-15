import React from "react";
import { Link } from "react-router-dom";

function HomePage({ auth }) {
  const containerStyle = {
    minHeight: "calc(100vh - 120px)",
    background: "white",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const centerStyle = {
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "42px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "15px",
    letterSpacing: "1px",
  };

  const subtitleStyle = {
    fontSize: "18px",
    color: "#666",
    marginBottom: "50px",
    fontWeight: "300",
  };

  const cardsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    marginTop: "50px",
  };

  const cardStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    borderRadius: "15px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    textDecoration: "none",
  };

  const cardHoverStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.25)",
    boxShadow: "0 10px 30px rgba(42, 82, 152, 0.2)",
    transform: "translateY(-5px)",
  };

  const cardIconStyle = {
    fontSize: "48px",
    marginBottom: "15px",
  };

  const cardTitleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "10px",
  };

  const cardDescriptionStyle = {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
  };

  const featureListStyle = {
    marginTop: "60px",
    padding: "30px",
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    borderRadius: "15px",
    border: "2px solid rgba(42, 82, 152, 0.2)",
  };

  const featureListTitleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "20px",
  };

  const featuresStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  };

  const featureItemStyle = {
    fontSize: "14px",
    color: "#333",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "8px",
    textAlign: "left",
  };

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        <h1 style={titleStyle}>📚 Welcome to Student Management System</h1>
        <p style={subtitleStyle}>Efficiently manage, track, and organize student information all in one place</p>

        <div style={cardsContainerStyle}>
          {auth?.user?.role === 'admin' && (
            <Link
              to="/add-student"
              style={cardStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(126, 200, 227, 0.15)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={cardIconStyle}>➕</div>
              <h2 style={cardTitleStyle}>Add Student</h2>
              <p style={cardDescriptionStyle}>Create a new student record with name, age, and marks information</p>
            </Link>
          )}

          <Link
            to="/students"
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(126, 200, 227, 0.15)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={cardIconStyle}>📋</div>
            <h2 style={cardTitleStyle}>View Students</h2>
            <p style={cardDescriptionStyle}>Browse, search, filter, edit, and delete student records</p>
          </Link>

          <Link
            to="/students"
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(126, 200, 227, 0.15)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={cardIconStyle}>📊</div>
            <h2 style={cardTitleStyle}>Export Data</h2>
            <p style={cardDescriptionStyle}>Export student records to Excel or PDF format for reporting</p>
          </Link>
        </div>

        <div style={featureListStyle}>
          <h2 style={featureListTitleStyle}>✨ Key Features</h2>
          <div style={featuresStyle}>
            <div style={featureItemStyle}>
              ✅ Add & manage student records
            </div>
            <div style={featureItemStyle}>
              🔍 Search students by name
            </div>
            <div style={featureItemStyle}>
              📊 Filter by marks performance
            </div>
            <div style={featureItemStyle}>
              ✏️ Edit student information
            </div>
            <div style={featureItemStyle}>
              🗑️ Delete student records
            </div>
            <div style={featureItemStyle}>
              🖨️ Print to PDF
            </div>
            <div style={featureItemStyle}>
              📥 Export to Excel
            </div>
            <div style={featureItemStyle}>
              🎨 Clean & modern UI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
