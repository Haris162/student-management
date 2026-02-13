import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import StudentList from "../Components/StudentList";

function SearchResultsPage({ students, onDelete, onUpdate }) {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [filteredStudents, setFilteredStudents] = useState([]);

  useEffect(() => {
    const results = students.filter(student =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredStudents(results);
  }, [query, students]);

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
    marginBottom: "10px",
    textAlign: "center",
  };

  const resultInfoStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "30px",
    textAlign: "center",
  };

  const noResultsStyle = {
    padding: "60px 20px",
    textAlign: "center",
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    borderRadius: "15px",
    border: "2px solid rgba(42, 82, 152, 0.2)",
  };

  const noResultsIconStyle = {
    fontSize: "48px",
    marginBottom: "15px",
  };

  const noResultsMessageStyle = {
    fontSize: "18px",
    color: "#666",
    fontWeight: "500",
  };

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        <h1 style={titleStyle}>🔍 Search Results</h1>
        <p style={resultInfoStyle}>
          {query && `Results for "${query}": ${filteredStudents.length} student(s) found`}
        </p>

        {filteredStudents.length === 0 ? (
          <div style={noResultsStyle}>
            <div style={noResultsIconStyle}>📭</div>
            <p style={noResultsMessageStyle}>
              No students found matching "{query}"
            </p>
          </div>
        ) : (
          <StudentList students={filteredStudents} onDelete={onDelete} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
}

export default SearchResultsPage;
