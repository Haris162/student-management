/**
 * Student Profile Page Component
 * 
 * Detailed individual student view with comprehensive features:
 * - Left sidebar: Photo upload, basic info display
 * - Tabbed interface: Profile tab and Exam Results tab
 * - Edit mode for updating student information
 * - Photo upload with base64 encoding
 * - PDF exam report generation with charts
 * - Subject-wise marks display across all exams
 * - Progress tracking with line, bar, and pie charts
 * - Downloadable PDF reports using jsPDF and Chart.js
 */

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Chart from "chart.js/auto";
import { useParams, useNavigate } from "react-router-dom";

function StudentProfilePage({ students, onUpdate, exams }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = students.find(s => s._id === id);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(student || {});
  const [activeTab, setActiveTab] = useState("profile");
  const [isPhotoHover, setIsPhotoHover] = useState(false);

  const examOrder = [
    "Unit Test-1",
    "Quarterly Assessment",
    "Unit Test-2",
    "Half Yearly Assessment",
    "Unit Test-3",
    "Final Assessment",
  ];

  const getMaxMarksPerSubject = (examName) => {
    if (!examName) return 25;
    const lowerName = examName.toLowerCase();
    if (lowerName.includes("quarterly") || lowerName.includes("halfyearly") || lowerName.includes("final")) {
      return 100;
    }
    return 25;
  };

  const buildExamSummaries = () => {
    if (!exams || !Array.isArray(exams) || !student) return [];
    const summaries = exams
      .filter(exam => exam && exam.subjects && exam.marks && exam.marks[student._id])
      .map(exam => {
        const studentMarks = exam.marks[student._id];
        const maxMarksPerSubject = getMaxMarksPerSubject(exam.name);
        const subjectMarks = exam.subjects.map(subject => parseInt(studentMarks[subject]) || 0);
        const total = subjectMarks.reduce((a, b) => a + b, 0);
        const maxMarks = exam.subjects.length * maxMarksPerSubject;
        const percentage = maxMarks > 0 ? (total / maxMarks) * 100 : 0;
        return {
          id: exam.id,
          name: exam.name,
          subjects: exam.subjects,
          subjectMarks,
          maxMarksPerSubject,
          total,
          maxMarks,
          percentage,
        };
      });
    summaries.sort((a, b) => examOrder.indexOf(a.name) - examOrder.indexOf(b.name));
    return summaries;
  };

  const createChartImage = (config, width = 600, height = 300) => {
    return new Promise(resolve => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      const chart = new Chart(ctx, { ...config, options: { ...config.options, animation: false } });
      const dataUrl = canvas.toDataURL("image/png", 1.0);
      chart.destroy();
      resolve(dataUrl);
    });
  };

  const handleDownloadExamReport = async () => {
    const summaries = buildExamSummaries();
    if (summaries.length === 0) {
      alert("No exam results available to export.");
      return;
    }

    const pdf = new jsPDF("p", "pt", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    let cursorY = 40;

    pdf.setFontSize(18);
    pdf.text("Student Exam Report", 40, cursorY);
    cursorY += 22;
    pdf.setFontSize(11);
    pdf.text(`Name: ${student.name}`, 40, cursorY);
    cursorY += 16;
    pdf.text(`Roll No: ${student.rollNumber || "N/A"}`, 40, cursorY);
    cursorY += 16;
    pdf.text(`Class: ${student.studentClass || "N/A"}  Section: ${student.section || "N/A"}`, 40, cursorY);
    cursorY += 24;

    const progressLabels = summaries.map(s => s.name);
    const progressData = summaries.map(s => Number(s.percentage.toFixed(2)));
    const totalMarksData = summaries.map(s => s.total);

    const lineChartUrl = await createChartImage({
      type: "line",
      data: {
        labels: progressLabels,
        datasets: [{
          label: "Progress (%)",
          data: progressData,
          borderColor: "#2a5298",
          backgroundColor: "rgba(42, 82, 152, 0.15)",
          tension: 0.3,
          fill: true,
        }],
      },
      options: {
        responsive: false,
        scales: { y: { min: 0, max: 100 } },
      }
    });

    pdf.setFontSize(12);
    pdf.text("Progress (First to Final Exam)", 40, cursorY);
    cursorY += 10;
    pdf.addImage(lineChartUrl, "PNG", 40, cursorY, pageWidth - 80, 220);
    cursorY += 240;

    const barChartUrl = await createChartImage({
      type: "bar",
      data: {
        labels: progressLabels,
        datasets: [{
          label: "Total Marks",
          data: totalMarksData,
          backgroundColor: "rgba(126, 200, 227, 0.6)",
          borderColor: "#2a5298",
          borderWidth: 1,
        }],
      },
      options: {
        responsive: false,
        scales: { y: { beginAtZero: true } },
      }
    });

    pdf.text("Total Marks by Exam", 40, cursorY);
    cursorY += 10;
    pdf.addImage(barChartUrl, "PNG", 40, cursorY, pageWidth - 80, 220);
    cursorY += 240;

    const lastExam = summaries[summaries.length - 1];
    const pieChartUrl = await createChartImage({
      type: "pie",
      data: {
        labels: lastExam.subjects,
        datasets: [{
          label: "Subject Distribution",
          data: lastExam.subjectMarks,
          backgroundColor: [
            "#1e3c72",
            "#2a5298",
            "#7ec8e3",
            "#27ae60",
            "#f39c12",
            "#e74c3c",
          ],
        }],
      },
      options: { responsive: false }
    }, 500, 300);

    if (cursorY + 280 > pdf.internal.pageSize.getHeight()) {
      pdf.addPage();
      cursorY = 40;
    }
    pdf.text(`Subject Distribution (${lastExam.name})`, 40, cursorY);
    cursorY += 10;
    pdf.addImage(pieChartUrl, "PNG", 70, cursorY, pageWidth - 140, 260);

    pdf.save(`${student.name}_Exam_Report.pdf`);
  };

  const containerStyle = {
    minHeight: "calc(100vh - 60px)",
    background: "white",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const centerStyle = {
    maxWidth: "100%",
    margin: "0",
    display: "block",
    marginLeft: "380px",
  };

  const leftSidebarStyle = {
    width: "300px",
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    borderRadius: "15px",
    padding: "30px 30px 16px",
    height: "fit-content",
    position: "fixed",
    left: "20px",
    top: "120px",
    backdropFilter: "blur(10px)",
  };


  const profilePictureWrapperStyle = {
    position: "relative",
    width: "100%",
    height: "200px",
    marginBottom: "20px",
  };

  const profilePictureStyle = {
    width: "100%",
    height: "200px",
    backgroundColor: "rgba(42, 82, 152, 0.1)",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "60px",
    border: "2px dashed rgba(42, 82, 152, 0.3)",
  };

  const photoOverlayStyle = {
    position: "absolute",
    inset: "0",
    backgroundColor: "rgba(30, 60, 114, 0.55)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    fontWeight: "700",
    borderRadius: "12px",
    opacity: isPhotoHover && isEditing ? 1 : 0,
    pointerEvents: isPhotoHover && isEditing ? "auto" : "none",
    transition: "opacity 0.2s ease",
  };

  const hiddenFileInputStyle = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    border: "0",
  };

  const profileImageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "10px",
  };

  const uploadInputStyle = {
    width: "100%",
    fontSize: "12px",
    marginBottom: "10px",
  };

  const personalInfoCardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: "10px",
    padding: "15px",
    marginTop: "15px",
  };

  const infoRowStyle = {
    marginBottom: "12px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const infoRowStyle_last = {
    marginBottom: "0",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const infoLabelStyle = {
    fontSize: "11px",
    fontWeight: "700",
    color: "#999",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    minWidth: "50px",
    whiteSpace: "nowrap",
  };

  const infoValueStyle = {
    fontSize: "15px",
    fontWeight: "600",
    color: "#1e3c72",
    flex: "1",
    textAlign: "right",
  };

  const rightContentStyle = {
    flex: "1",
    minWidth: "0",
  };

  const headerStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    borderRadius: "15px",
    padding: "30px",
    marginBottom: "30px",
    backdropFilter: "blur(10px)",
  };

  const tabBarStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
    flexWrap: "wrap",
  };

  const tabButtonStyle = (isActive) => ({
    padding: "8px 16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "13px",
    fontWeight: "600",
    backgroundColor: isActive ? "#2a5298" : "#e6eefc",
    color: isActive ? "white" : "#1e3c72",
    transition: "all 0.2s ease",
  });

  const buttonStyle = (type) => {
    const baseStyle = {
      padding: "7px 12px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "11px",
      fontWeight: "600",
      transition: "all 0.3s ease",
      width: "100%",
      textAlign: "center",
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

  const buttonGroupStyle = {
    display: "flex",
    gap: "6px",
    marginTop: "2px",
    flexDirection: "column",
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

  const handlePhotoChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setEditData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
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

  const photoUrl = (isEditing ? editData.photo : student.photo) || student.photo;

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        {/* Left Sidebar - Student Profile Card */}
        <div style={leftSidebarStyle}>
          <div
            style={profilePictureWrapperStyle}
            onMouseEnter={() => setIsPhotoHover(true)}
            onMouseLeave={() => setIsPhotoHover(false)}
          >
            <div style={profilePictureStyle}>
              {photoUrl ? <img src={photoUrl} alt="Student" style={profileImageStyle} /> : "👤"}
            </div>
            <input
              id="student-photo-upload"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              style={hiddenFileInputStyle}
              disabled={!isEditing}
            />
            <label htmlFor="student-photo-upload" style={photoOverlayStyle}>
              Add Photo
            </label>
          </div>
          <div style={personalInfoCardStyle}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1e3c72", margin: "0 0 15px 0", paddingBottom: "10px", borderBottom: "2px solid #7ec8e3" }}>
              {student.name}
            </h2>
            <div style={{ ...infoRowStyle }}>              <div style={infoLabelStyle}>📜 Roll Number</div>
              <div style={infoValueStyle}>{student.rollNumber || 'N/A'}</div>
            </div>
            <div style={{ ...infoRowStyle }}>              <div style={infoLabelStyle}> Class</div>
              <div style={infoValueStyle}>{student.studentClass}</div>
            </div>
            <div style={{ ...infoRowStyle }}>
              <div style={infoLabelStyle}>📋 Section</div>
              <div style={infoValueStyle}>Section {student.section}</div>
            </div>
            <div style={{ ...infoRowStyle }}>
              <div style={infoLabelStyle}>🎂 Age</div>
              <div style={infoValueStyle}>{student.age} years</div>
            </div>
            {student.city && (
              <div style={infoRowStyle_last}>
                <div style={infoLabelStyle}>📍 City</div>
                <div style={infoValueStyle}>{student.city}</div>
              </div>
            )}
          </div>
          <div style={buttonGroupStyle}>
            {!isEditing ? (
              <>
                <button style={buttonStyle("edit")} onClick={() => setIsEditing(true)}>✏️ Edit</button>
                <button style={buttonStyle("back")} onClick={() => navigate("/students")}>← Back</button>
              </>
            ) : (
              <>
                <button style={buttonStyle("save")} onClick={handleSaveEdit}>💾 Save</button>
                <button style={buttonStyle("cancel")} onClick={() => setIsEditing(false)}>❌ Cancel</button>
              </>
            )}
          </div>
        </div>

        {/* Right Content - Tabs and Details */}
        <div style={rightContentStyle}>

        <div style={tabBarStyle}>
          <button style={tabButtonStyle(activeTab === "profile")} onClick={() => setActiveTab("profile")}>Profile</button>
          <button style={tabButtonStyle(activeTab === "exams")} onClick={() => setActiveTab("exams")}>Exam Report</button>
        </div>

        {activeTab === "profile" && (
          <>
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
          </>
        )}

        {activeTab === "exams" && (
          <>
            {/* Exam Results */}
            {exams && Array.isArray(exams) && exams.length > 0 && (
              <div style={sectionStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
                  <h2 style={{ ...sectionTitleStyle, marginBottom: "0", display: "flex", alignItems: "center", gap: "8px" }}>
                    📊 Exam Results
                  </h2>
                  <button
                    style={{
                      ...buttonStyle("save"),
                      width: "auto",
                      padding: "6px 10px",
                      fontSize: "11px",
                      borderRadius: "8px",
                      backgroundColor: "#eef4ff",
                      color: "#1e3c72",
                      border: "1px solid rgba(42, 82, 152, 0.3)",
                      boxShadow: "0 2px 5px rgba(42, 82, 152, 0.12)",
                    }}
                    onClick={handleDownloadExamReport}
                  >
                    ⬇️ Download Report
                  </button>
                </div>
                {exams.map((exam) => {
                  if (!exam || !exam.subjects) return null;
                  const studentMarks = exam.marks && exam.marks[student._id];
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
                {exams.every(exam => !exam.marks || !exam.marks[student._id]) && (
                  <p style={{ color: "#999", fontSize: "14px" }}>📚 No exam results available yet</p>
                )}
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </div>
  );
}

export default StudentProfilePage;
