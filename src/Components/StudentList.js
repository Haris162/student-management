import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentList({ students, onDelete }) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const navigate = useNavigate();

  const tableContainerStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    borderRadius: "15px",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    boxShadow: "0 5px 20px rgba(42, 82, 152, 0.1)",
    overflow: "hidden",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  };

  const tableHeaderStyle = {
    padding: "30px",
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7ec8e3 100%)",
    color: "white",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    margin: "0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const statsStyle = {
    marginTop: "10px",
    fontSize: "14px",
    opacity: "0.9",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
  };

  const headerCellStyle = {
    backgroundColor: "rgba(42, 82, 152, 0.1)",
    color: "#1e3c72",
    padding: "18px",
    textAlign: "left",
    fontWeight: "700",
    fontSize: "14px",
    letterSpacing: "0.5px",
    borderBottom: "3px solid #2a5298",
  };

  const getRowStyle = (index) => ({
    backgroundColor: hoveredIndex === index ? "rgba(42, 82, 152, 0.08)" : "transparent",
    transition: "all 0.3s ease",
    borderBottom: "1px solid rgba(42, 82, 152, 0.1)",
  });

  const cellStyle = {
    padding: "18px",
    color: "#333",
    fontSize: "14px",
  };

  const checkboxStyle = {
    width: "18px",
    height: "18px",
    cursor: "pointer",
    accentColor: "#2a5298",
  };

  const actionButtonStyle = (type) => {
    const baseStyle = {
      padding: "6px 12px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "12px",
      fontWeight: "600",
      margin: "0 4px",
      transition: "all 0.2s ease",
    };
    if (type === "delete") {
      return { ...baseStyle, backgroundColor: "#ff6b6b", color: "white" };
    } else if (type === "view") {
      return { ...baseStyle, backgroundColor: "#2a5298", color: "white" };
    }
  };

  const filterContainerStyle = {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
  };

  const searchInputStyle = {
    flex: "1 1 200px",
    padding: "10px 15px",
    border: "2px solid #7ec8e3",
    borderRadius: "8px",
    fontSize: "14px",
    transition: "all 0.3s ease",
  };

  const bulkActionStyle = {
    padding: "10px 15px",
    backgroundColor: "#ff6b6b",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  };

  const emptyContainerStyle = {
    padding: "80px 30px",
    textAlign: "center",
    backgroundColor: "linear-gradient(135deg, #f5f7ff 0%, #f0f4ff 100%)",
  };

  const emptyMessageStyle = {
    fontSize: "18px",
    color: "#666",
    margin: "0",
    fontWeight: "500",
  };

  const emptySubtextStyle = {
    fontSize: "14px",
    color: "#999",
    marginTop: "10px",
  };

  const classOptions = Array.from(new Set(students.map(s => s.studentClass).filter(Boolean)));
  const filteredStudents = students.filter(student => {
    const matchesName = student.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = classFilter ? student.studentClass === classFilter : true;
    return matchesName && matchesClass;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(new Set(filteredStudents.map(s => s._id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleSelectStudent = (id) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one student");
      return;
    }
    if (window.confirm(`Delete ${selectedIds.size} selected student(s)?`)) {
      selectedIds.forEach(id => onDelete(id));
      setSelectedIds(new Set());
    }
  };

  return (
    <div style={tableContainerStyle}>
      <div style={tableHeaderStyle}>
        <h2 style={titleStyle}>📋 Student Records</h2>
        <div style={statsStyle}>Total Students: {students.length} | Displaying: {filteredStudents.length} | Selected: {selectedIds.size}</div>
      </div>

      {students.length > 0 && (
        <div style={filterContainerStyle}>
          <input
            type="text"
            placeholder="🔍 Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInputStyle}
            onFocus={(e) => e.target.style.borderColor = "#2a5298"}
            onBlur={(e) => e.target.style.borderColor = "#7ec8e3"}
          />
          <select
            value={classFilter}
            onChange={e => setClassFilter(e.target.value)}
            style={{ padding: '10px 15px', border: '2px solid #7ec8e3', borderRadius: '8px', fontSize: '14px', minWidth: '120px' }}
          >
            <option value="">All Classes</option>
            {classOptions.map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
          {selectedIds.size > 0 && (
            <button style={bulkActionStyle} onClick={handleBulkDelete}>
              🗑️ Delete Selected ({selectedIds.size})
            </button>
          )}
        </div>
      )}

      {filteredStudents.length === 0 && students.length === 0 ? (
        <div style={emptyContainerStyle}>
          <p style={emptyMessageStyle}>📚 No students added yet</p>
          <p style={emptySubtextStyle}>Start by filling the form above and adding your first student!</p>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div style={emptyContainerStyle}>
          <p style={emptyMessageStyle}>🔍 No students found</p>
          <p style={emptySubtextStyle}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>
                  <input
                    type="checkbox"
                    style={checkboxStyle}
                    checked={selectedIds.size === filteredStudents.length && filteredStudents.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th style={headerCellStyle}>#</th>
                <th style={headerCellStyle}>👤 Name</th>
                <th style={headerCellStyle}>🎂 Age</th>
                <th style={headerCellStyle}>📚 Class</th>
                <th style={headerCellStyle}>📋 Section</th>
                <th style={headerCellStyle}>⚙️ Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr
                  key={student._id}
                  style={getRowStyle(index)}
                  onMouseOver={() => setHoveredIndex(index)}
                  onMouseOut={() => setHoveredIndex(null)}
                >
                  <td style={cellStyle}>
                    <input
                      type="checkbox"
                      style={checkboxStyle}
                      checked={selectedIds.has(student._id)}
                      onChange={() => handleSelectStudent(student._id)}
                    />
                  </td>
                  <td style={cellStyle}><strong>{String(index + 1).padStart(2, "0")}</strong></td>
                  <td style={cellStyle}>
                    <strong>{student.name}</strong>
                    {student.rollNumber && (
                      <span style={{ marginLeft: '8px', color: '#2a5298', fontWeight: 400 }}>
                        (Roll No: {student.rollNumber})
                      </span>
                    )}
                  </td>
                  <td style={cellStyle}>{student.age}</td>
                  <td style={cellStyle}><strong>{student.studentClass}</strong></td>
                  <td style={cellStyle}><strong>{student.section}</strong></td>
                  <td style={cellStyle}>
                    <button style={actionButtonStyle("view")} onClick={() => navigate(`/student/${student._id}`)}>👁️ View</button>
                    <button style={actionButtonStyle("delete")} onClick={() => onDelete(student._id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentList;
