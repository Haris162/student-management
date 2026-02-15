import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import * as XLSX from "xlsx";
import Navigation from "./Components/Navigation";
import HomePage from "./Pages/HomePage";
import AddStudentPage from "./Pages/AddStudentPage";
import ViewStudentsPage from "./Pages/ViewStudentsPage";
import SearchResultsPage from "./Pages/SearchResultsPage";
import StudentProfilePage from "./Pages/StudentProfilePage";
import ExamsPage from "./Pages/ExamsPage";
import LoginPage from "./Pages/LoginPage";
import AccountPage from "./Pages/AccountPage";
import AddUserPage from "./Pages/AddUserPage";

function App() {
  const apiBase = `http://${window.location.hostname}:5000`;
  const predefinedExams = [
    {
      id: 1001,
      name: "Unit Test-1",
      subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"],
      marks: {},
    },
    {
      id: 1002,
      name: "Quarterly Assessment",
      subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"],
      marks: {},
    },
    {
      id: 1003,
      name: "Unit Test-2",
      subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"],
      marks: {},
    },
    {
      id: 1004,
      name: "Half Yearly Assessment",
      subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"],
      marks: {},
    },
    {
      id: 1005,
      name: "Unit Test-3",
      subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"],
      marks: {},
    },
    {
      id: 1006,
      name: "Final Assessment",
      subjects: ["Telugu", "Hindi", "English", "Mathematics", "Science", "Social"],
      marks: {},
    },
  ];

  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [auth, setAuth] = useState(() => {
    const raw = localStorage.getItem("sms_auth");
    return raw ? JSON.parse(raw) : null;
  });

  const token = auth?.token;
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const handleLogin = (data) => {
    localStorage.setItem("sms_auth", JSON.stringify(data));
    setAuth(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("sms_auth");
    setAuth(null);
  };

  const refreshStudents = () => {
    return fetch(`${apiBase}/students`, { headers: { ...authHeaders } })
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  React.useEffect(() => {
    if (!token) return;
    refreshStudents();
  }, [token]);

  const normalizeExams = (data) => data.map(exam => ({
    ...exam,
    id: exam.examId ?? exam.id,
  }));

  React.useEffect(() => {
    if (!token) return;
    fetch(`${apiBase}/exams`, { headers: { ...authHeaders } })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setExams(normalizeExams(data));
          return;
        }
        Promise.all(
          predefinedExams.map(exam =>
            fetch(`${apiBase}/exams`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', ...authHeaders },
              body: JSON.stringify(exam)
            }).then(res => res.json())
          )
        ).then(created => setExams(normalizeExams(created)));
      });
  }, [token]);

  const addStudent = (student) => {
    fetch(`${apiBase}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(student)
    })
      .then(res => res.json())
      .then(() => refreshStudents());
  };

  const deleteStudent = (id) => {
    fetch(`${apiBase}/students/${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders }
    })
      .then(res => {
        if (res.ok) refreshStudents();
      });
  };

  const updateStudent = (id, updatedStudent) => {
    fetch(`${apiBase}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify(updatedStudent)
    })
      .then(res => res.json())
      .then(() => refreshStudents());
  };

  const addExam = (exam) => {
    fetch(`${apiBase}/exams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ ...exam, id: Date.now(), marks: {} })
    })
      .then(res => res.json())
      .then(newExam => setExams(prev => [...prev, { ...newExam, id: newExam.examId ?? newExam.id }]));
  };

  const updateExamMarks = (examId, marksData) => {
    fetch(`${apiBase}/exams/${examId}/marks`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ marks: marksData })
    })
      .then(res => res.json())
      .then(updated => setExams(prev => prev.map(exam => (exam.id === examId || exam.examId === examId) ? { ...updated, id: updated.examId ?? updated.id } : exam)));
  };

  const deleteExam = (examId) => {
    setExams(exams.filter(exam => exam.id !== examId));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportExcel = (selectedClass = "") => {
    let exportStudents = students;
    if (selectedClass) {
      exportStudents = students.filter(s => s.studentClass === selectedClass);
    }
    if (exportStudents.length === 0) {
      alert("No students to export!");
      return;
    }
    const excelData = exportStudents.map((student, index) => ({
      "S.No": index + 1,
      "Name": student.name,
      "Age": student.age,
      "Class": student.studentClass || "N/A",
      "Section": student.section || "N/A",
      "Father's Name": student.fatherName || "N/A",
      "Mother's Name": student.motherName || "N/A",
      "Father's Occupation": student.fatherOccupation || "N/A",
      "Father's Income": student.fatherIncome || "N/A",
      "Address Line 1": student.addressLine1 || "N/A",
      "Address Line 2": student.addressLine2 || "N/A",
      "City": student.city || "N/A",
      "State": student.state || "N/A",
      "Postal Code": student.postalCode || "N/A",
      "Country": student.country || "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 20 },
      { wch: 8 },
      { wch: 10 },
      { wch: 10 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 18 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    const fileName = `Student_Records_${selectedClass ? selectedClass + '_' : ''}${new Date().toLocaleDateString().replace(/\//g, "-")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  const appStyle = {
    minHeight: "100vh",
    background: "white",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    paddingTop: token ? "60px" : "0",
  };

  const navContainerStyle = {
    padding: "0",
    position: "fixed",
    top: "0",
    left: "0",
    right: "0",
    zIndex: "1000",
  };

  const RequireAuth = ({ children }) => {
    return token ? children : <Navigate to="/login" replace />;
  };

  const RequireAdmin = ({ children }) => {
    if (!token) return <Navigate to="/login" replace />;
    if (auth?.user?.role !== 'admin') return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Router>
      <div style={appStyle}>
        {token && (
          <div style={navContainerStyle}>
            <Navigation students={students} onLogout={handleLogout} auth={auth} />
          </div>
        )}
        <Routes>
          <Route path="/login" element={<LoginPage apiBase={apiBase} onLogin={handleLogin} />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <HomePage auth={auth} apiBase={apiBase} authHeaders={authHeaders} />
              </RequireAuth>
            }
          />
          <Route
            path="/add-student"
            element={
              <RequireAdmin>
                <AddStudentPage onAddStudent={addStudent} />
              </RequireAdmin>
            }
          />
          <Route
            path="/students"
            element={
              <RequireAuth>
                <ViewStudentsPage
                  students={students}
                  onDelete={deleteStudent}
                  onUpdate={updateStudent}
                  handlePrint={handlePrint}
                  handleExportExcel={handleExportExcel}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/search"
            element={
              <RequireAuth>
                <SearchResultsPage
                  students={students}
                  onDelete={deleteStudent}
                  onUpdate={updateStudent}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/student/:id"
            element={
              <RequireAuth>
                <StudentProfilePage
                  students={students}
                  onUpdate={updateStudent}
                  exams={exams}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/exams"
            element={
              <RequireAuth>
                <ExamsPage
                  students={students}
                  exams={exams}
                  onAddExam={addExam}
                  onUpdateExamMarks={updateExamMarks}
                  onDeleteExam={deleteExam}
                />
              </RequireAuth>
            }
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <AccountPage apiBase={apiBase} authHeaders={authHeaders} auth={auth} />
              </RequireAuth>
            }
          />
          <Route
            path="/add-user"
            element={
              <RequireAdmin>
                <AddUserPage apiBase={apiBase} authHeaders={authHeaders} auth={auth} />
              </RequireAdmin>
            }
          />
          <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
