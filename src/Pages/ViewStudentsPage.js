/**
 * View Students Page Component
 * 
 * Main student records page with:
 * - Print functionality for hard copies
 * - Export to Excel with class filter option
 * - StudentList component for displaying records
 * - Export modal for class selection
 */

import React, { useState } from "react";
import StudentList from "../Components/StudentList";

function ViewStudentsPage({ students, onDelete, onUpdate, handlePrint, handleExportExcel }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportClass, setExportClass] = useState("");
  const classOptions = Array.from(new Set(students.map(s => s.studentClass).filter(Boolean)));
  const containerStyle = {
    minHeight: "calc(100vh - 120px)",
    background: "white",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const centerStyle = {
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "30px",
    textAlign: "center",
  };

  const buttonContainerStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  };
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const modalCardStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    width: "360px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
  };

  const modalTitleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
    color: "#1e3c72",
  };

  const modalButtonRowStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  };

  const buttonStyle = (type) => {
    const baseStyle = {
      padding: "12px 24px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 12px rgba(42, 82, 152, 0.2)",
    };
    if (type === "print") {
      return { ...baseStyle, backgroundColor: "#2a5298", color: "white" };
    } else if (type === "excel") {
      return { ...baseStyle, backgroundColor: "#27ae60", color: "white" };
    } else if (type === "cancel") {
      return { ...baseStyle, backgroundColor: "#999", color: "white" };
    }
  };

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        <h1 style={titleStyle}>📋 Student Records</h1>

        <div style={buttonContainerStyle}>
          <button style={buttonStyle("print")} onClick={handlePrint} onMouseOver={(e) => e.target.style.backgroundColor = "#1e3c72"} onMouseOut={(e) => e.target.style.backgroundColor = "#2a5298"}>
            🖨️ Print Records
          </button>
          <button style={buttonStyle("excel")} onClick={() => setShowExportModal(true)} onMouseOver={(e) => e.target.style.backgroundColor = "#229954"} onMouseOut={(e) => e.target.style.backgroundColor = "#27ae60"}>
            📊 Export to Excel
          </button>
        </div>

        {showExportModal && (
          <div style={modalOverlayStyle}>
            <div style={modalCardStyle}>
              <div style={modalTitleStyle}>Export Students</div>
              <label htmlFor="exportClass" style={{ fontWeight: 600, display: "block", marginBottom: "8px" }}>Select Class</label>
              <select
                id="exportClass"
                value={exportClass}
                onChange={e => setExportClass(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", fontSize: "14px", border: "1px solid #7ec8e3" }}
              >
                <option value="">All Classes</option>
                {classOptions.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <div style={modalButtonRowStyle}>
                <button style={buttonStyle("cancel")} onClick={() => setShowExportModal(false)}>Cancel</button>
                <button
                  style={buttonStyle("excel")}
                  onClick={() => {
                    handleExportExcel(exportClass);
                    setShowExportModal(false);
                  }}
                >
                  Export
                </button>
              </div>
            </div>
          </div>
        )}

        <StudentList students={students} onDelete={onDelete} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

export default ViewStudentsPage;
