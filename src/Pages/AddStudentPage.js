/**
 * Add Student Page Component
 * 
 * Wrapper page that renders both:
 * - Single Student Form for manual entry
 * - CSV Uploader for bulk import
 * - Import History tracking
 */

import React, { useState } from "react";
import StudentForm from "../Components/StudentForm";
import { CSVUploader } from "../dataflow/addstudentsfromcsv";
import ImportHistory from "../dataflow/ImportHistory";

function AddStudentPage({ onAddStudent, apiBase, authHeaders }) {
  const [activeTab, setActiveTab] = useState('single'); // 'single' or 'bulk'
  const [uploadCount, setUploadCount] = useState(0);

  const containerStyle = {
    minHeight: "calc(100vh - 120px)",
    background: "white",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const centerStyle = {
    maxWidth: "700px",
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
    marginBottom: "30px",
    textAlign: "center",
  };

  const tabContainerStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "30px",
    borderBottom: "2px solid #ecf0f1",
  };

  const tabStyle = (isActive) => ({
    padding: "12px 24px",
    fontSize: "14px",
    fontWeight: isActive ? "600" : "400",
    border: "none",
    background: "none",
    cursor: "pointer",
    color: isActive ? "#1e3c72" : "#95a5a6",
    borderBottom: isActive ? "3px solid #3498db" : "none",
    transition: "all 0.3s",
  });

  const handleCSVUploadSuccess = (result) => {
    setUploadCount(result.successCount);
    // Optionally refresh parent data
    if (onAddStudent) {
      onAddStudent();
    }
    // Switch back to single after successful upload
    setTimeout(() => setActiveTab('single'), 2000);
  };

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        <h1 style={titleStyle}>➕ Add New Student</h1>
        <p style={descriptionStyle}>Choose how you want to add students to the system</p>

        {/* Tab Navigation */}
        <div style={tabContainerStyle}>
          <button
            style={tabStyle(activeTab === 'single')}
            onClick={() => setActiveTab('single')}
          >
            📝 Single Student
          </button>
          <button
            style={tabStyle(activeTab === 'bulk')}
            onClick={() => setActiveTab('bulk')}
          >
            📤 Bulk Import (CSV)
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'single' && (
          <div>
            <p style={{ color: "#666", fontSize: "13px", marginBottom: "20px" }}>
              Fill in the information below to add a single student to the system
            </p>
            <StudentForm onAddStudent={onAddStudent} />
          </div>
        )}

        {activeTab === 'bulk' && (
          <div>
            {uploadCount > 0 && (
              <div style={{
                padding: '12px',
                backgroundColor: '#d4edda',
                border: '1px solid #28a745',
                color: '#155724',
                borderRadius: '4px',
                marginBottom: '20px',
              }}>
                ✓ Successfully imported {uploadCount} student(s)!
              </div>
            )}
            <CSVUploader
              apiBase={apiBase}
              authHeaders={authHeaders}
              onUploadSuccess={handleCSVUploadSuccess}
            />
          </div>
        )}
      </div>

      {/* Import History - Full Width */}
      <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #ecf0f1' }}>
        <ImportHistory apiBase={apiBase} authHeaders={authHeaders} />
      </div>
    </div>
  );
}

export default AddStudentPage;
