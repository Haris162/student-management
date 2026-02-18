/**
 * Attendance Page Component
 * 
 * Manages student attendance with features:
 * - Date-based attendance entry per subject
 * - Mark attendance for each student in a class/section/subject
 * - View attendance history and reports
 * - Attendance statistics per subject
 * - Role-based: Lecturers can only mark attendance for assigned classes/sections
 */

import React, { useState, useEffect } from "react";

function AttendancePage({ apiBase, authHeaders, auth }) {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("entry"); // 'entry' or 'report'
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");
  const [selectedReportClass, setSelectedReportClass] = useState("");
  const [selectedReportSection, setSelectedReportSection] = useState("");
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [teacherAllocations, setTeacherAllocations] = useState([]);

  const classes = ["8", "9", "10", "11", "12"];
  const sections = ["A", "B", "C", "D"];
  const allSubjects = ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"];

  // For lecturers, subject is fixed to their subject
  const isLecturer = auth?.user?.role === 'lecturer';
  const lecturerSubject = auth?.user?.subject;

  useEffect(() => {
    fetchStudents();
    if (isLecturer) {
      fetchTeacherAllocations();
    }
  }, []);

  const fetchStudents = () => {
    fetch(`${apiBase}/students`, { headers: { ...authHeaders } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setStudents(data))
      .catch(err => console.error('Error fetching students:', err));
  };

  const fetchTeacherAllocations = () => {
    fetch(`${apiBase}/teacher-allocations`, { headers: { ...authHeaders } })
      .then(res => res.ok ? res.json() : [])
      .then(data => setTeacherAllocations(data))
      .catch(err => console.error('Error fetching allocations:', err));
  };

  const filteredStudents = students.filter(s => 
    s.studentClass === selectedClass && s.section === selectedSection
  );

  const handleAttendanceToggle = (studentId, subject) => {
    const key = `${studentId}_${subject}`;
    setAttendance(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleMarkAll = (present) => {
    const newAttendance = {};
    filteredStudents.forEach(student => {
      allSubjects.forEach(subject => {
        const key = `${student._id}_${subject}`;
        newAttendance[key] = present;
      });
    });
    setAttendance(newAttendance);
  };

  const handleSelectClassSection = (classNum, section) => {
    setSelectedClass(classNum);
    setSelectedSection(section);
    setAttendance({});
  };

  const handleSaveAttendance = () => {
    if (!selectedClass || !selectedSection || !attendanceDate) {
      setError("Please select class, section, and date");
      return;
    }

    setIsLoading(true);
    const subjectsToSave = isLecturer ? [lecturerSubject] : allSubjects;
    const attendanceDataBySubject = {};

    // Group attendance by subject
    subjectsToSave.forEach(subject => {
      attendanceDataBySubject[subject] = filteredStudents.map(student => ({
        studentId: student._id,
        studentName: student.name,
        rollNumber: student.rollNumber,
        present: attendance[`${student._id}_${subject}`] || false,
      }));
    });

    // Save attendance for each subject
    const savePromises = Object.entries(attendanceDataBySubject).map(([subject, records]) => {
      return fetch(`${apiBase}/attendance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify({
          date: attendanceDate,
          class: selectedClass,
          section: selectedSection,
          subject: subject,
          records: records,
        }),
      }).then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(text || "Failed to save attendance");
        return text ? JSON.parse(text) : {};
      });
    });

    Promise.all(savePromises)
      .then(() => {
        setMessage("Attendance saved successfully!");
        setAttendance({});
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(err => setError(err.message || "Failed to save attendance"))
      .finally(() => setIsLoading(false));
  };

  const handleGenerateReport = () => {
    if (!reportStartDate || !reportEndDate) {
      setError("Please select start and end dates");
      return;
    }

    if (reportStartDate > reportEndDate) {
      setError("End date must be after start date");
      return;
    }

    setIsLoading(true);
    let url = `${apiBase}/attendance/report?startDate=${reportStartDate}&endDate=${reportEndDate}`;
    if (isLecturer) {
      url += `&subject=${lecturerSubject}`;
    }

    fetch(url, { headers: { ...authHeaders } })
      .then(async res => {
        const text = await res.text();
        if (!res.ok) throw new Error(text || "Failed to generate report");
        return text ? JSON.parse(text) : [];
      })
      .then(data => {
        setAttendanceReport(data);
      })
      .catch(err => setError(err.message || "Failed to generate report"))
      .finally(() => setIsLoading(false));
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

  const disabledStyle = {
    ...inputStyle,
    backgroundColor: "#f5f5f5",
    color: "#999",
    cursor: "not-allowed",
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

  const buttonSecondaryStyle = {
    ...buttonStyle,
    backgroundColor: "#7ec8e3",
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

  const tabStyle = {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    borderBottom: "2px solid #e0e0e0",
    paddingBottom: "10px",
  };

  const tabButtonStyle = (active) => ({
    padding: "10px 20px",
    border: "none",
    backgroundColor: active ? "#2a5298" : "transparent",
    color: active ? "white" : "#2a5298",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    borderRadius: "4px",
  });

  const studentTableStyle = {
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

  const checkboxStyle = {
    width: "20px",
    height: "20px",
    cursor: "pointer",
  };

  const rowsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "15px",
    marginTop: "20px",
  };

  const studentCardStyle = {
    backgroundColor: "#f9f9f9",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  };

  const studentCardPresentStyle = {
    ...studentCardStyle,
    backgroundColor: "#d4edda",
    borderColor: "#27ae60",
  };

  const subjectBadgeStyle = {
    display: "inline-block",
    backgroundColor: "#2a5298",
    color: "white",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    marginBottom: "15px",
  };

  if (isLecturer && !lecturerSubject) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>Attendance Management</h1>
          <div style={errorStyle}>
            ⚠️ Your subject is not set. Please update your profile to view attendance features.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Attendance Management</h1>
        <p style={subtitleStyle}>
          {isLecturer 
            ? `Mark and track attendance for ${lecturerSubject}` 
            : "Manage student attendance by subject"}
        </p>

        {isLecturer && (
          <div style={subjectBadgeStyle}>
            📚 Subject: {lecturerSubject}
          </div>
        )}

        <div style={tabStyle}>
          <button
            style={tabButtonStyle(view === "entry")}
            onClick={() => setView("entry")}
          >
            📝 Mark Attendance
          </button>
          <button
            style={tabButtonStyle(view === "report")}
            onClick={() => setView("report")}
          >
            📊 Attendance Report
          </button>
        </div>

        {view === "entry" ? (
          <>
            {isLecturer ? (
              // For Lecturers: Show allocated classes/sections as clickable boxes
              <>
                <div>
                  <label style={labelStyle}>My Assigned Classes & Sections</label>
                  {teacherAllocations.length > 0 ? (
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", 
                      gap: "12px",
                      marginBottom: "20px"
                    }}>
                      {teacherAllocations.map((alloc) => (
                        <div
                          key={alloc._id}
                          onClick={() => handleSelectClassSection(alloc.class, alloc.section)}
                          style={{
                            padding: "15px",
                            borderRadius: "8px",
                            border: selectedClass === alloc.class && selectedSection === alloc.section 
                              ? "2px solid #2a5298" 
                              : "2px solid #7ec8e3",
                            backgroundColor: selectedClass === alloc.class && selectedSection === alloc.section 
                              ? "rgba(42, 82, 152, 0.1)" 
                              : "white",
                            cursor: "pointer",
                            textAlign: "center",
                            fontWeight: "700",
                            color: "#1e3c72",
                            transition: "all 0.3s ease",
                            boxShadow: selectedClass === alloc.class && selectedSection === alloc.section 
                              ? "0 4px 12px rgba(42, 82, 152, 0.2)" 
                              : "0 2px 4px rgba(0, 0, 0, 0.08)",
                          }}
                        >
                          <div style={{ fontSize: "16px", marginBottom: "4px" }}>📚</div>
                          <div>Class {alloc.class}</div>
                          <div style={{ fontSize: "12px", color: "#5c6c86", marginTop: "4px" }}>
                            Section {alloc.section}
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
                      📭 No assigned classes yet. Contact your administrator.
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </>
            ) : (
              // For Admins/Principals: Show dropdown selectors
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
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
                  <label style={labelStyle}>Date</label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    style={inputStyle}
                  />
                </div>
              </div>
            )}

            {selectedClass && selectedSection && (
              <>
                <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                  <button
                    style={buttonStyle}
                    onClick={() => handleMarkAll(true)}
                  >
                    ✓ Mark All Present
                  </button>
                  <button
                    style={buttonSecondaryStyle}
                    onClick={() => handleMarkAll(false)}
                  >
                    ✗ Mark All Absent
                  </button>
                </div>

                {filteredStudents.length > 0 ? (
                  <div style={{ marginTop: "20px", overflowX: "auto" }}>
                    <table style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      border: "1px solid #e0e0e0",
                      minWidth: "900px"
                    }}>
                      <thead>
                        <tr style={{ backgroundColor: "rgba(42, 82, 152, 0.08)" }}>
                          <th style={{ ...tableHeaderStyle, minWidth: "180px" }}>Student Name</th>
                          <th style={{ ...tableHeaderStyle, minWidth: "80px" }}>Roll</th>
                          {allSubjects.map(subject => (
                            <th key={subject} style={{ ...tableHeaderStyle, minWidth: "110px", textAlign: "center" }}>
                              {subject}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredStudents.map((student, idx) => (
                          <tr key={student._id} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                            <td style={{
                              ...tableCellStyle,
                              fontWeight: "700",
                              color: "#1e3c72"
                            }}>
                              {student.name}
                            </td>
                            <td style={{
                              ...tableCellStyle,
                              textAlign: "center",
                              fontWeight: "700"
                            }}>
                              {student.rollNumber}
                            </td>
                            {allSubjects.map(subject => {
                              const isLecturerSubjectColumn = isLecturer && subject !== lecturerSubject;
                              const key = `${student._id}_${subject}`;
                              
                              return (
                                <td key={subject} style={{
                                  ...tableCellStyle,
                                  textAlign: "center",
                                  backgroundColor: isLecturerSubjectColumn ? "#f5f5f5" : "white"
                                }}>
                                  <input
                                    type="checkbox"
                                    checked={attendance[key] || false}
                                    onChange={() => handleAttendanceToggle(student._id, subject)}
                                    disabled={isLecturerSubjectColumn}
                                    style={{
                                      ...checkboxStyle,
                                      cursor: isLecturerSubjectColumn ? "not-allowed" : "pointer",
                                      opacity: isLecturerSubjectColumn ? 0.5 : 1
                                    }}
                                  />
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ marginTop: "20px", padding: "20px", textAlign: "center", color: "#5c6c86" }}>
                    No students found in this class and section
                  </div>
                )}

                <button
                  style={buttonStyle}
                  onClick={handleSaveAttendance}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "✓ Save Attendance"}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: !isLecturer ? "1fr 1fr 1fr 1fr auto" : "1fr 1fr auto", gap: "20px", alignItems: "flex-end" }}>
              {!isLecturer && (
                <>
                  <div>
                    <label style={labelStyle}>Class</label>
                    <select
                      value={selectedReportClass}
                      onChange={(e) => setSelectedReportClass(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="">-- All Classes --</option>
                      {classes.map(cls => (
                        <option key={cls} value={cls}>{cls}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={labelStyle}>Section</label>
                    <select
                      value={selectedReportSection}
                      onChange={(e) => setSelectedReportSection(e.target.value)}
                      style={selectStyle}
                    >
                      <option value="">-- All Sections --</option>
                      {sections.map(sec => (
                        <option key={sec} value={sec}>{sec}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div>
                <label style={labelStyle}>Start Date</label>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>End Date</label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <button
                style={buttonStyle}
                onClick={handleGenerateReport}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Generate Report"}
              </button>
            </div>

            {attendanceReport.length > 0 && (
              <div style={{ marginTop: "20px" }}>
                <h3 style={{ color: "#1e3c72", marginBottom: "15px" }}>
                  Attendance Report ({reportStartDate} to {reportEndDate})
                </h3>
                
                {!isLecturer ? (
                  // Admin/Principal view - subjects as columns
                  <div style={{ overflowX: "auto" }}>
                    {(() => {
                      // Filter by selected class and section
                      let filteredReport = attendanceReport;
                      if (selectedReportClass) {
                        filteredReport = filteredReport.filter(r => r.class === selectedReportClass);
                      }
                      if (selectedReportSection) {
                        filteredReport = filteredReport.filter(r => r.section === selectedReportSection);
                      }

                      // Group by class and section
                      const groupedByClass = {};
                      filteredReport.forEach(record => {
                        const key = `${record.class}-${record.section}`;
                        if (!groupedByClass[key]) {
                          groupedByClass[key] = {};
                        }
                        if (!groupedByClass[key][record.studentName]) {
                          groupedByClass[key][record.studentName] = {
                            rollNumber: record.rollNumber,
                            subjects: {}
                          };
                        }
                        groupedByClass[key][record.studentName].subjects[record.subject] = record;
                      });

                      // Get all subjects (use fixed list)
                      const reportSubjects = ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"];

                      return Object.entries(groupedByClass).map(([classSection, students]) => (
                        <div key={classSection} style={{ marginBottom: "30px" }}>
                          <div style={{
                            padding: "12px 15px",
                            backgroundColor: "#2a5298",
                            color: "white",
                            fontWeight: "700",
                            borderRadius: "6px 6px 0 0",
                            marginBottom: "0",
                            fontSize: "14px"
                          }}>
                            📚 Class {classSection}
                          </div>
                          <table style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginBottom: "20px",
                            border: "1px solid #e0e0e0",
                            borderTop: "none",
                            minWidth: "800px"
                          }}>
                            <thead>
                              <tr style={{ backgroundColor: "rgba(42, 82, 152, 0.08)" }}>
                                <th style={{ ...tableHeaderStyle, backgroundColor: "rgba(42, 82, 152, 0.08)", minWidth: "180px" }}>Student Name</th>
                                <th style={{ ...tableHeaderStyle, backgroundColor: "rgba(42, 82, 152, 0.08)", minWidth: "80px" }}>Roll</th>
                                {reportSubjects.map(subject => (
                                  <th key={subject} style={{ ...tableHeaderStyle, backgroundColor: "rgba(42, 82, 152, 0.08)", minWidth: "120px", textAlign: "center" }}>
                                    {subject}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(students).map(([studentName, studentData], idx) => (
                                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f9f9f9" : "white" }}>
                                  <td style={{
                                    ...tableCellStyle,
                                    fontWeight: "700",
                                    color: "#1e3c72"
                                  }}>
                                    {studentName}
                                  </td>
                                  <td style={{
                                    ...tableCellStyle,
                                    textAlign: "center",
                                    fontWeight: "700"
                                  }}>
                                    {studentData.rollNumber}
                                  </td>
                                  {reportSubjects.map(subject => {
                                    const record = studentData.subjects[subject];
                                    return (
                                      <td key={subject} style={{
                                        ...tableCellStyle,
                                        textAlign: "center"
                                      }}>
                                        {record ? (
                                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                                            <div style={{
                                              display: "inline-flex",
                                              alignItems: "center",
                                              justifyContent: "center",
                                              width: "28px",
                                              height: "28px",
                                              borderRadius: "4px",
                                              backgroundColor: record.percentage >= 75 ? "#d4edda" : "#f8d7da",
                                              fontWeight: "700",
                                              fontSize: "14px",
                                              color: record.percentage >= 75 ? "#27ae60" : "#e74c3c"
                                            }}>
                                              {record.percentage >= 75 ? "✓" : "✗"}
                                            </div>
                                            <div style={{ fontSize: "11px", color: "#5c6c86" }}>
                                              {record.percentage.toFixed(0)}%
                                            </div>
                                          </div>
                                        ) : (
                                          <span style={{ color: "#ccc" }}>—</span>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ));
                    })()}
                  </div>
                ) : (
                  // Lecturer view - table format
                  <table style={studentTableStyle}>
                    <thead>
                      <tr>
                        <th style={tableHeaderStyle}>Student Name</th>
                        <th style={tableHeaderStyle}>Roll Number</th>
                        <th style={tableHeaderStyle}>Class</th>
                        <th style={tableHeaderStyle}>Section</th>
                        <th style={tableHeaderStyle}>Present Days</th>
                        <th style={tableHeaderStyle}>Total Days</th>
                        <th style={tableHeaderStyle}>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceReport.map((record, idx) => (
                        <tr key={idx}>
                          <td style={tableCellStyle}>{record.studentName}</td>
                          <td style={tableCellStyle}>{record.rollNumber}</td>
                          <td style={tableCellStyle}>{record.class}</td>
                          <td style={tableCellStyle}>{record.section}</td>
                          <td style={tableCellStyle}>{record.presentDays}</td>
                          <td style={tableCellStyle}>{record.totalDays}</td>
                          <td style={{
                            ...tableCellStyle,
                            color: record.percentage >= 75 ? "#27ae60" : "#e74c3c",
                            fontWeight: "700",
                          }}>
                            {record.percentage.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}

        {message && <div style={successStyle}>{message}</div>}
        {error && <div style={errorStyle}>{error}</div>}
      </div>
    </div>
  );
}

export default AttendancePage;
