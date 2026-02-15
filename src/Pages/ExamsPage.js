import React, { useState } from "react";

function ExamsPage({ students, exams, onUpdateExamMarks }) {
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [marksData, setMarksData] = useState({});

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

  const headerStyle = {
    marginBottom: "40px",
  };

  const titleStyle = {
    fontSize: "36px",
    fontWeight: "700",
    color: "#1e3c72",
    margin: "0 0 10px 0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const subtitleStyle = {
    fontSize: "14px",
    color: "#666",
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
    };
    if (type === "primary") {
      return { ...baseStyle, backgroundColor: "#2a5298", color: "white" };
    } else if (type === "success") {
      return { ...baseStyle, backgroundColor: "#27ae60", color: "white" };
    } else if (type === "danger") {
      return { ...baseStyle, backgroundColor: "#ff6b6b", color: "white" };
    }
  };

  const formContainerStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    padding: "30px",
    borderRadius: "15px",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    marginBottom: "40px",
    backdropFilter: "blur(10px)",
  };

  const formGroupStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
    fontSize: "14px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Segoe UI', sans-serif",
    boxSizing: "border-box",
    transition: "all 0.3s ease",
  };

  const examCardStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    borderRadius: "12px",
    padding: "30px",
    marginBottom: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  const examTitleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "10px",
  };

  const examSubjectsStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  };

  const tableHeaderStyle = {
    backgroundColor: "rgba(42, 82, 152, 0.1)",
    color: "#1e3c72",
    padding: "15px",
    textAlign: "left",
    fontWeight: "700",
    fontSize: "13px",
    borderBottom: "2px solid #2a5298",
  };

  const tableCellStyle = {
    padding: "12px 15px",
    borderBottom: "1px solid rgba(42, 82, 152, 0.1)",
    fontSize: "13px",
  };

  const handleSaveMarks = (examId) => {
    onUpdateExamMarks(examId, marksData);
    setMarksData({});
    setSelectedExamId(null);
    alert("Marks saved successfully!");
  };

  const calculateGrade = (failedAny) => {
    if (failedAny) return "F";
    return "P";
  };

  if (!students || students.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={centerStyle}>
          <h1 style={titleStyle}>📊 Exams & Results</h1>
          <p style={subtitleStyle}>Add students first, then create exams and manage marks.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>📊 Exams & Test Results Management</h1>
          <p style={subtitleStyle}>Select an exam to add subject-wise marks and track student performance</p>
        </div>

        {/* Exams Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "40px" }}>
          {exams && Array.isArray(exams) && exams.map((exam) => (
            <div
              key={exam.id}
              style={{
                ...examCardStyle,
                backgroundColor: selectedExamId === exam.id ? "rgba(42, 82, 152, 0.25)" : "rgba(126, 200, 227, 0.15)",
                borderColor: selectedExamId === exam.id ? "#2a5298" : "rgba(42, 82, 152, 0.2)",
                transform: selectedExamId === exam.id ? "scale(1.02)" : "scale(1)",
                cursor: 'pointer',
              }}
              onClick={() => setSelectedExamId(selectedExamId === exam.id ? null : exam.id)}
              tabIndex={0}
              role="button"
              onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setSelectedExamId(selectedExamId === exam.id ? null : exam.id); }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#1e3c72", fontSize: "18px", fontWeight: "700" }}>
                {exam.name}
              </h3>
              <p style={{ margin: "0 0 10px 0", color: "#666", fontSize: "13px" }}>
                Subjects: <strong>{exam.subjects.length}</strong>
              </p>
              <p style={{ margin: "0", color: "#999", fontSize: "12px" }}>
                {exam.subjects.join(", ")}
              </p>
              <button
                style={{ ...buttonStyle("primary"), marginTop: "15px", width: "100%", fontSize: "13px" }}
                onClick={e => { e.stopPropagation(); setSelectedExamId(selectedExamId === exam.id ? null : exam.id); }}
              >
                {selectedExamId === exam.id ? "✅ Selected" : "Select Exam"}
              </button>
            </div>
          ))}
        </div>

        {/* Marks Entry Section */}
        {selectedExamId && (
          <div style={formContainerStyle}>
            <h2 style={{ fontSize: "20px", fontWeight: "700", color: "#1e3c72", marginBottom: "20px" }}>
              ➕ Add Marks - {exams.find(e => e.id === selectedExamId)?.name}
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={tableStyle}>
                <thead>
                  <tr style={{ backgroundColor: "rgba(42, 82, 152, 0.2)" }}>
                    <th style={tableHeaderStyle}>Student Name</th>
                    {exams.find(e => e.id === selectedExamId)?.subjects.map((subject, idx) => (
                      <th key={idx} style={tableHeaderStyle}>{subject}</th>
                    ))}
                    <th style={tableHeaderStyle}>Total</th>
                    <th style={tableHeaderStyle}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => {
                    const exam = exams.find(e => e.id === selectedExamId);
                    const studentMarks = marksData[student._id] || (exam?.marks && exam.marks[student._id]) || {};
                    // Determine max marks per subject
                    let maxMarksPerSubject = 25;
                    if (
                      exam.name.toLowerCase().includes('quarterly') ||
                      exam.name.toLowerCase().includes('halfyearly') ||
                      exam.name.toLowerCase().includes('final')
                    ) {
                      maxMarksPerSubject = 100;
                    }
                    const passPercent = 35;
                    let passCount = 0;
                    let failCount = 0;
                    let failedAny = false;
                    const subjectMarks = exam?.subjects.map(s => {
                      const mark = parseInt(studentMarks[s]) || 0;
                      const isPass = mark >= Math.ceil((passPercent / 100) * maxMarksPerSubject);
                      if (mark !== 0) {
                        if (isPass) passCount++; else { failCount++; failedAny = true; }
                      }
                      return { mark, isPass };
                    }) || [];
                    const total = subjectMarks.reduce((a, b) => a + b.mark, 0);
                    // If failed any subject, grade is F
                    const grade = calculateGrade(failedAny);

                    return (
                      <React.Fragment key={student._id}>
                        <tr style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
                          <td style={tableCellStyle}><strong>{student.name}</strong></td>
                          {exam?.subjects.map((subject, idx) => {
                            const { mark, isPass } = subjectMarks[idx] || { mark: 0, isPass: true };
                            return (
                              <td key={idx} style={{
                                ...tableCellStyle,
                                color: !isPass && mark !== 0 ? '#ff0000' : undefined,
                                fontWeight: !isPass && mark !== 0 ? 'bold' : undefined,
                              }}>
                                <input
                                  type="number"
                                  min="0"
                                  max={maxMarksPerSubject}
                                  placeholder="0"
                                  value={studentMarks[subject] || ""}
                                  onChange={(e) => {
                                    let value = e.target.value;
                                    if (parseInt(value) > maxMarksPerSubject) value = maxMarksPerSubject;
                                    setMarksData({
                                      ...marksData,
                                      [student._id]: {
                                        ...studentMarks,
                                        [subject]: value,
                                      },
                                    });
                                  }}
                                  style={{
                                    width: "60px",
                                    padding: "8px",
                                    border: "1px solid #7ec8e3",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    textAlign: "center",
                                    color: !isPass && mark !== 0 ? '#ff0000' : undefined,
                                    fontWeight: !isPass && mark !== 0 ? 'bold' : undefined,
                                  }}
                                />
                              </td>
                            );
                          })}
                          <td style={{ ...tableCellStyle, fontWeight: "700", color: "#2a5298", fontSize: "14px" }}>
                            {total}
                          </td>
                          <td style={{ ...tableCellStyle, fontWeight: "700", color: failedAny ? '#ff0000' : '#1e3c72', fontSize: "14px" }}>
                            {grade}
                          </td>
                        </tr>
                        {/* Show pass/fail count after all subjects for this student */}
                        <tr>
                          <td colSpan={(exam?.subjects.length || 0) + 3} style={{ textAlign: 'right', fontSize: '13px', color: '#333', background: 'rgba(255,255,255,0.5)' }}>
                            <span style={{ color: '#27ae60', fontWeight: 'bold' }}>Passed: {passCount}</span> &nbsp;|&nbsp; <span style={{ color: '#ff0000', fontWeight: 'bold' }}>Failed: {failCount}</span>
                            {failedAny && <span style={{ color: '#ff0000', fontWeight: 'bold', marginLeft: '15px' }}>Student failed the test</span>}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
              <button
                style={buttonStyle("success")}
                onClick={() => handleSaveMarks(selectedExamId)}
              >
                💾 Save All Marks
              </button>
              <button
                style={buttonStyle("danger")}
                onClick={() => {
                  setSelectedExamId(null);
                  setMarksData({});
                }}
              >
                ❌ Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamsPage;
