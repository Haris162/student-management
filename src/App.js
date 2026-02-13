import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as XLSX from "xlsx";
import Navigation from "./Components/Navigation";
import HomePage from "./Pages/HomePage";
import AddStudentPage from "./Pages/AddStudentPage";
import ViewStudentsPage from "./Pages/ViewStudentsPage";
import SearchResultsPage from "./Pages/SearchResultsPage";
import StudentProfilePage from "./Pages/StudentProfilePage";
import ExamsPage from "./Pages/ExamsPage";

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
  const [exams, setExams] = useState(predefinedExams);

  React.useEffect(() => {
    fetch(`${apiBase}/students`)
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []);

  const addStudent = (student) => {
    fetch(`${apiBase}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student)
    })
      .then(res => res.json())
      .then(newStudent => setStudents(prev => [...prev, newStudent]));
  };

  const deleteStudent = (id) => {
    fetch(`${apiBase}/students/${id}`, {
      method: 'DELETE'
    })
      .then(res => {
        if (res.ok) setStudents(prev => prev.filter(student => student._id !== id));
      });
  };

  const updateStudent = (id, updatedStudent) => {
    fetch(`${apiBase}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedStudent)
    })
      .then(res => res.json())
      .then(updated => setStudents(prev => prev.map(student => student._id === id ? updated : student)));
  };

  const addExam = (exam) => {
    setExams([...exams, { ...exam, id: Date.now(), marks: {} }]);
  };

  const updateExamMarks = (examId, marksData) => {
    setExams(exams.map(exam => exam.id === examId ? { ...exam, marks: marksData } : exam));
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
  };

  const navContainerStyle = {
    padding: "20px 40px",
  };

  return (
    <Router>
      <div style={appStyle}>
        <div style={navContainerStyle}>
          <Navigation />
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/add-student"
            element={<AddStudentPage onAddStudent={addStudent} />}
          />
          <Route
            path="/students"
            element={
              <ViewStudentsPage
                students={students}
                onDelete={deleteStudent}
                onUpdate={updateStudent}
                handlePrint={handlePrint}
                handleExportExcel={handleExportExcel}
              />
            }
          />
          <Route
            path="/search"
            element={
              <SearchResultsPage
                students={students}
                onDelete={deleteStudent}
                onUpdate={updateStudent}
              />
            }
          />
          <Route
            path="/student/:id"
            element={
              <StudentProfilePage
                students={students}
                onUpdate={updateStudent}
                exams={exams}
              />
            }
          />
          <Route
            path="/exams"
            element={
              <ExamsPage
                students={students}
                exams={exams}
                onAddExam={addExam}
                onUpdateExamMarks={updateExamMarks}
                onDeleteExam={deleteExam}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
