import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function StudentProfilePage({ students, onUpdate, exams }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = students.find(s => s._id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(student || {});

  const containerStyle = {
    minHeight: "calc(100vh - 120px)",
    background: "white",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const centerStyle = {
    maxWidth: "900px",
    margin: "0 auto",
  };

  const headerStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    borderRadius: "15px",
    padding: "30px",
    marginBottom: "30px",
    backdropFilter: "blur(10px)",
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "700",
    color: "#1e3c72",
    margin: "0 0 5px 0",
  };

  const subtitleStyle = {
    fontSize: "14px",
    color: "#666",
    margin: "5px 0 0 0",
  };

  const buttonGroupStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  };

  const buttonStyle = (type) => {
    const baseStyle = {
      padding: "10px 20px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "13px",
      fontWeight: "600",
      transition: "all 0.3s ease",
    };
    if (type === "edit") {
      return { ...baseStyle, backgroundColor: "#7ec8e3", color: "#1e3c72" };
    } else if (type === "save") {
      return { ...baseStyle, backgroundColor: "#27ae60", color: "white" };
    } else if (type === "cancel") {
      return { ...baseStyle, backgroundColor: "#999", color: "white" };
    } else if (type === "back") {
      return { ...baseStyle, backgroundColor: "#2a5298", color: "white" };
    }
  };

  const backButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#2a5298",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s ease",
  };

  const errorTitleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "15px",
  };

  const errorTextStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
  };
  const handleSaveEdit = () => {
    onUpdate(student._id, editData);
    setIsEditing(false);
  };

  if (!student) {
    return (
      <div style={containerStyle}>
        <div style={centerStyle}>
          <h1 style={errorTitleStyle}>❌ Student Not Found</h1>
          <p style={errorTextStyle}>The student profile you're looking for doesn't exist.</p>
          <button style={backButtonStyle} onClick={() => navigate("/students")}>← Back to Students</button>
        </div>
      </div>
    );
  }
  const sectionStyle = {
    paddingTop: "25px",
    paddingBottom: "25px",
    marginBottom: "25px",
    borderTop: "2px solid #2a5298",
  };

  const sectionTitleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "20px",
    paddingBottom: "10px",
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "15px",
  };

  const fieldStyle = {
    display: "flex",
    flexDirection: "column",
  };

  const labelStyle = {
    fontSize: "12px",
    fontWeight: "700",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "5px",
  };

  const valueStyle = {
    fontSize: "16px",
    fontWeight: "600",
    color: "#1e3c72",
  };

  const inputStyle = {
    padding: "10px",
    border: "1px solid #7ec8e3",
    borderRadius: "6px",
    fontSize: "14px",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  };

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>👤 {student.name}</h1>
          <p style={subtitleStyle}>
            {student.rollNumber && <>Roll No: {student.rollNumber} • </>}
            Class: {student.studentClass} • Section: {student.section}
          </p>
          <div style={buttonGroupStyle}>
            {!isEditing ? (
              <>
                <button style={buttonStyle("edit")} onClick={() => setIsEditing(true)}>✏️ Edit Profile</button>
                <button style={buttonStyle("back")} onClick={() => navigate("/students")}>← Back to List</button>
              </>
            ) : (
              <>
                <button style={buttonStyle("save")} onClick={handleSaveEdit}>💾 Save Changes</button>
                <button style={buttonStyle("cancel")} onClick={() => setIsEditing(false)}>❌ Cancel</button>
              </>
            )}
          </div>
        </div>

        {/* Academic Information */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📚 Academic Information</h2>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}> Class</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.studentClass}
                  onChange={(e) => setEditData({ ...editData, studentClass: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.studentClass}</span>
              )}
            </div>
          </div>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}>📋 Section</span>
              {isEditing ? (
                <select
                  value={editData.section}
                  onChange={(e) => setEditData({ ...editData, section: e.target.value })}
                  style={inputStyle}
                >
                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                </select>
              ) : (
                <span style={valueStyle}>Section {student.section}</span>
              )}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>🎂 Age</span>
              {isEditing ? (
                <input
                  type="number"
                  value={editData.age}
                  onChange={(e) => setEditData({ ...editData, age: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.age} years</span>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>👤 Personal Information</h2>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}>👤 Full Name</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.name}</span>
              )}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>🎂 Age</span>
              <span style={valueStyle}>{student.age} years</span>
            </div>
          </div>
        </div>

        {/* Parent Information */}
        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>👨‍👩‍👧 Parent Information</h2>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}>👨 Father's Name</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.fatherName}
                  onChange={(e) => setEditData({ ...editData, fatherName: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.fatherName || "Not provided"}</span>
              )}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>👩 Mother's Name</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.motherName}
                  onChange={(e) => setEditData({ ...editData, motherName: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.motherName || "Not provided"}</span>
              )}
            </div>
          </div>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}>💼 Father's Occupation</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.fatherOccupation}
                  onChange={(e) => setEditData({ ...editData, fatherOccupation: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.fatherOccupation || "Not provided"}</span>
              )}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>💰 Father's Income</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.fatherIncome}
                  onChange={(e) => setEditData({ ...editData, fatherIncome: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.fatherIncome || "Not provided"}</span>
              )}
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={sectionTitleStyle}>📍 Address Information</h2>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}>Address Line 1</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.addressLine1 || ""}
                  onChange={(e) => setEditData({ ...editData, addressLine1: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.addressLine1 || "Not provided"}</span>
              )}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Address Line 2</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.addressLine2 || ""}
                  onChange={(e) => setEditData({ ...editData, addressLine2: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.addressLine2 || "Not provided"}</span>
              )}
            </div>
          </div>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}>City</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.city || ""}
                  onChange={(e) => setEditData({ ...editData, city: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.city || "Not provided"}</span>
              )}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>State</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.state || ""}
                  onChange={(e) => setEditData({ ...editData, state: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.state || "Not provided"}</span>
              )}
            </div>
          </div>
          <div style={rowStyle}>
            <div style={fieldStyle}>
              <span style={labelStyle}>Postal Code</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.postalCode || ""}
                  onChange={(e) => setEditData({ ...editData, postalCode: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.postalCode || "Not provided"}</span>
              )}
            </div>
            <div style={fieldStyle}>
              <span style={labelStyle}>Country</span>
              {isEditing ? (
                <input
                  type="text"
                  value={editData.country || ""}
                  onChange={(e) => setEditData({ ...editData, country: e.target.value })}
                  style={inputStyle}
                />
              ) : (
                <span style={valueStyle}>{student.country || "Not provided"}</span>
              )}
            </div>
          </div>
        </div>

        {/* Exam Results */}
        {exams && Array.isArray(exams) && exams.length > 0 && (
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>📊 Exam Results</h2>
            {exams.map((exam) => {
              if (!exam || !exam.subjects) return null;
              const studentMarks = exam.marks && exam.marks[student.id];
              if (!studentMarks) return null;

              let maxMarksPerSubject = 25;
              if (
                exam.name && (
                  exam.name.toLowerCase().includes('quarterly') ||
                  exam.name.toLowerCase().includes('halfyearly') ||
                  exam.name.toLowerCase().includes('final')
                )
              ) {
                maxMarksPerSubject = 100;
              }
              const subjectMarks = exam.subjects.map(subject => parseInt(studentMarks[subject]) || 0);
              // Determine if student failed any subject
              const passPercent = 35;
              let failedAny = false;
              subjectMarks.forEach(mark => {
                if (mark < Math.ceil((passPercent / 100) * maxMarksPerSubject)) failedAny = true;
              });
              const total = subjectMarks.reduce((a, b) => a + b, 0);
              const maxMarks = exam.subjects.length * maxMarksPerSubject;
              const percentage = (total / maxMarks) * 100;

              let grade = "N/A";
              if (failedAny) grade = "F";
              else if (percentage >= 80) grade = "A";
              else if (percentage >= 60) grade = "B";
              else if (percentage >= 40) grade = "C";
              else grade = "F";

              return (
                <div key={exam.id} style={{ marginBottom: "30px", paddingBottom: "20px", borderBottom: "1px solid rgba(42, 82, 152, 0.1)" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e3c72", marginBottom: "15px" }}>
                    {exam.name}
                  </h3>
                  <div style={rowStyle}>
                    {exam.subjects.map((subject, idx) => (
                      <div key={idx} style={fieldStyle}>
                        <span style={labelStyle}>{subject}</span>
                        <span style={{ fontSize: "18px", fontWeight: "700", color: "#2a5298" }}>
                          {studentMarks[subject] || 0} / {maxMarksPerSubject}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div style={{ ...rowStyle, marginTop: "15px" }}>
                                        {failedAny && (
                                          <div style={{ color: '#ff0000', fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>Student Failed</div>
                                        )}
                    <div style={fieldStyle}>
                      <span style={labelStyle}>Total Marks</span>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: "#1e3c72" }}>
                        {total} / {maxMarks}
                      </span>
                    </div>
                    <div style={fieldStyle}>
                      <span style={labelStyle}>Percentage</span>
                      <span style={{ fontSize: "18px", fontWeight: "700", color: percentage >= 60 ? "#27ae60" : "#ff6b6b" }}>
                        {percentage.toFixed(2)}%
                      </span>
                    </div>
                    <div style={fieldStyle}>
                      <span style={labelStyle}>Grade</span>
                      <span style={{ fontSize: "20px", fontWeight: "700", color: grade === "A" ? "#27ae60" : grade === "F" ? "#ff6b6b" : "#f57c00", backgroundColor: "rgba(126, 200, 227, 0.2)", padding: "8px 16px", borderRadius: "8px", display: "inline-block" }}>
                        {grade}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {exams.every(exam => !exam.marks || !exam.marks[student.id]) && (
              <p style={{ color: "#999", fontSize: "14px" }}>📚 No exam results available yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentProfilePage;
