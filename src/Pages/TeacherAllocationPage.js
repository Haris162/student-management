/**
 * Teacher Allocation Management Page
 * 
 * Admin-only page for managing teacher assignments:
 * - View all teacher-to-class/section/subject assignments
 * - Assign new teachers to specific classes/sections
 * - Delete existing teacher assignments
 * - Prevent duplicate assignments
 */

import React, { useState, useEffect } from "react";

function TeacherAllocationPage({ apiBase, authHeaders, auth }) {
  const [teachers, setTeachers] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTeachers, setSelectedTeachers] = useState(new Set());
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subjects = ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"];

  const classes = ["8", "9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D"];

  useEffect(() => {
    fetchTeachers();
    fetchAllocations();
  }, []);

  const fetchTeachers = () => {
    fetch(`${apiBase}/users?role=lecturer`, { headers: { ...authHeaders } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setTeachers(data))
      .catch(err => console.error('Error fetching teachers:', err));
  };

  const fetchAllocations = () => {
    fetch(`${apiBase}/teacher-allocations`, { headers: { ...authHeaders } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllocations(data))
      .catch(err => console.error('Error fetching allocations:', err));
  };

  const handleAssignTeachers = async () => {
    if (!selectedClass || !selectedSection || !selectedSubject || selectedTeachers.size === 0) {
      setError("Please select class, section, subject, and at least one teacher");
      return;
    }

    setIsLoading(true);
    let successCount = 0;
    let failCount = 0;

    // Assign each selected teacher
    for (const teacherId of selectedTeachers) {
      const teacher = teachers.find(t => t._id === teacherId);
      if (!teacher || !teacher.subject) continue;

      try {
        const res = await fetch(`${apiBase}/teacher-allocations`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({
            teacherId,
            subject: selectedSubject,
            class: selectedClass,
            section: selectedSection,
          }),
        });

        const text = await res.text();
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        failCount++;
      }
    }

    if (successCount > 0) {
      setMessage(`Successfully assigned ${successCount} teacher(s) to Class ${selectedClass} Section ${selectedSection} for ${selectedSubject}`);
      setSelectedTeachers(new Set());
      setSelectedClass("");
      setSelectedSection("");
      setSelectedSubject("");
      fetchAllocations();
      setTimeout(() => setMessage(""), 3000);
    }

    if (failCount > 0) {
      setError(`Failed to assign ${failCount} teacher(s). Some may already be assigned.`);
      setTimeout(() => setError(""), 3000);
    }

    setIsLoading(false);
  };

  const handleTeacherToggle = (teacherId) => {
    const newSet = new Set(selectedTeachers);
    if (newSet.has(teacherId)) {
      newSet.delete(teacherId);
    } else {
      newSet.add(teacherId);
    }
    setSelectedTeachers(newSet);
  };

  const handleDeleteAllocation = (allocationId) => {
    if (window.confirm("Are you sure you want to remove this assignment?")) {
      setIsLoading(true);
      fetch(`${apiBase}/teacher-allocations/${allocationId}`, {
        method: "DELETE",
        headers: { ...authHeaders },
      })
        .then(async res => {
          const text = await res.text();
          if (!res.ok) throw new Error(text || "Failed to delete allocation");
          return text ? JSON.parse(text) : {};
        })
        .then(() => {
          setMessage("Assignment removed successfully!");
          fetchAllocations();
          setTimeout(() => setMessage(""), 3000);
        })
        .catch(err => setError(err.message || "Failed to delete allocation"))
        .finally(() => setIsLoading(false));
    }
  };

  const containerStyle = {
    maxWidth: "1200px",
    margin: "80px auto 30px",
    padding: "0 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "white",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
    marginBottom: "20px",
  };

  const titleStyle = {
    margin: "0 0 10px 0",
    fontSize: "28px",
    color: "#1e3c72",
    fontWeight: "700",
  };

  const subtitleStyle = {
    margin: "0 0 25px 0",
    fontSize: "14px",
    color: "#5c6c86",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.6px",
    marginBottom: "6px",
    marginTop: "16px",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #7ec8e3",
    fontSize: "14px",
    backgroundColor: "white",
    boxSizing: "border-box",
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
  };

  const buttonStyle = {
    padding: "10px 18px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2a5298",
    color: "white",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    marginRight: "10px",
    marginTop: "20px",
  };

  const buttonDangerStyle = {
    ...buttonStyle,
    backgroundColor: "#dc3545",
    marginRight: "0",
    marginTop: "0",
  };

  const messageStyle = {
    marginTop: "15px",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
  };

  const successStyle = {
    ...messageStyle,
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
  };

  const errorStyle = {
    ...messageStyle,
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const tableHeaderStyle = {
    backgroundColor: "rgba(42, 82, 152, 0.1)",
    padding: "12px",
    textAlign: "left",
    fontWeight: "700",
    color: "#1e3c72",
    borderBottom: "2px solid #2a5298",
  };

  const tableCellStyle = {
    padding: "12px",
    borderBottom: "1px solid #e0e0e0",
  };

  // Check admin access
  if (auth?.user?.role !== "admin") {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Teacher Allocation</h1>
          <div style={errorStyle}>
            ⚠️ Access denied. Only administrators can manage teacher allocations.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {/* Assignment Form Card */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>🎓 Assign Teacher to Class</h1>
        <p style={subtitleStyle}>
          Select a class, section, and subject, then choose which lecturers to assign
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "15px", marginBottom: "20px" }}>
          <div>
            <label style={labelStyle}>Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={selectStyle}
            >
              <option value="">-- Select Class --</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Section</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              style={selectStyle}
            >
              <option value="">-- Select Section --</option>
              {sections.map(sec => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={selectStyle}
            >
              <option value="">-- Select Subject --</option>
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
        </div>

        {selectedClass && selectedSection && selectedSubject && (
          <>
            <div style={{ marginBottom: "15px", padding: "12px", backgroundColor: "#f0f8ff", borderRadius: "6px" }}>
              <strong style={{ color: "#1e3c72" }}>Class {selectedClass} - Section {selectedSection} - {selectedSubject}</strong>
              <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#5c6c86" }}>
                Select {selectedSubject} lecturers to assign to this class:
              </p>
            </div>

            {teachers.filter(t => t.subject === selectedSubject).length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "10px", marginBottom: "20px" }}>
                {teachers.filter(t => t.subject === selectedSubject).map(teacher => (
                  <div
                    key={teacher._id}
                    onClick={() => handleTeacherToggle(teacher._id)}
                    style={{
                      padding: "12px",
                      border: selectedTeachers.has(teacher._id) ? "2px solid #2a5298" : "1px solid #e0e0e0",
                      borderRadius: "6px",
                      backgroundColor: selectedTeachers.has(teacher._id) ? "rgba(42, 82, 152, 0.1)" : "white",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <input
                        type="checkbox"
                        checked={selectedTeachers.has(teacher._id)}
                        onChange={() => handleTeacherToggle(teacher._id)}
                        style={{ marginTop: "2px", cursor: "pointer" }}
                      />
                      <div>
                        <div style={{ fontWeight: "700", color: "#1e3c72" }}>{teacher.name}</div>
                        <div style={{ fontSize: "12px", color: "#5c6c86" }}>{teacher.subject}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ 
                padding: "20px", 
                backgroundColor: "#f0f8ff", 
                borderRadius: "8px",
                color: "#5c6c86",
                textAlign: "center",
                marginBottom: "20px"
              }}>
                📭 No lecturers found for {selectedSubject}. Add teachers first.
              </div>
            )}

            <button
              style={buttonStyle}
              onClick={handleAssignTeachers}
              disabled={isLoading || selectedTeachers.size === 0}
            >
              {isLoading ? "Assigning..." : `✓ Assign ${selectedTeachers.size} Teacher(s)`}
            </button>
          </>
        )}

        {message && <div style={successStyle}>{message}</div>}
        {error && <div style={errorStyle}>{error}</div>}
      </div>

      {/* Allocations Table */}
      <div style={cardStyle}>
        <h1 style={titleStyle}>📋 Current Allocations</h1>
        <p style={subtitleStyle}>
          {allocations.length} teacher{allocations.length !== 1 ? "s" : ""} assigned to classes
        </p>

        {allocations.length > 0 ? (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>Teacher Name</th>
                <th style={tableHeaderStyle}>Subject</th>
                <th style={tableHeaderStyle}>Class</th>
                <th style={tableHeaderStyle}>Section</th>
                <th style={tableHeaderStyle}>Assigned On</th>
                <th style={tableHeaderStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map(alloc => (
                <tr key={alloc._id}>
                  <td style={tableCellStyle}>{alloc.teacherName}</td>
                  <td style={tableCellStyle}>
                    <span style={{ backgroundColor: "#2a5298", color: "white", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "700" }}>
                      {alloc.subject}
                    </span>
                  </td>
                  <td style={tableCellStyle}>{alloc.class}</td>
                  <td style={tableCellStyle}>{alloc.section}</td>
                  <td style={tableCellStyle}>
                    {new Date(alloc.createdAt).toLocaleDateString()}
                  </td>
                  <td style={tableCellStyle}>
                    <button
                      style={buttonDangerStyle}
                      onClick={() => handleDeleteAllocation(alloc._id)}
                      disabled={isLoading}
                    >
                      ✕ Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ 
            padding: "40px", 
            textAlign: "center", 
            backgroundColor: "#f9f9f9", 
            borderRadius: "8px",
            color: "#5c6c86",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "10px" }}>📭</div>
            No teacher allocations yet. Assign teachers to classes to get started.
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherAllocationPage;
