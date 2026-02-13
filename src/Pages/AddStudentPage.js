import React from "react";
import StudentForm from "../Components/StudentForm";

function AddStudentPage({ onAddStudent }) {
  const containerStyle = {
    minHeight: "calc(100vh - 120px)",
    background: "white",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const centerStyle = {
    maxWidth: "600px",
    margin: "0 auto",
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "10px",
    textAlign: "center",
  };

  const descriptionStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "40px",
    textAlign: "center",
  };

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        <h1 style={titleStyle}>➕ Add New Student</h1>
        <p style={descriptionStyle}>Fill in the information below to add a new student to the system</p>
        <StudentForm onAddStudent={onAddStudent} />
      </div>
    </div>
  );
}

export default AddStudentPage;
