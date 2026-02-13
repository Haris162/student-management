import React, { useState } from "react";

function StudentForm({ onAddStudent }) {
  const apiBase = `http://${window.location.hostname}:5000`;
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [section, setSection] = useState("A");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [fatherIncome, setFatherIncome] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!age || age <= 0 || age > 100) newErrors.age = "Age must be between 1-100";
    if (!studentClass.trim()) newErrors.studentClass = "Class is required";
    if (!fatherName.trim()) newErrors.fatherName = "Father's name is required";
    if (!motherName.trim()) newErrors.motherName = "Mother's name is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    const studentData = {
      name,
      age,
      studentClass,
      section,
      fatherName,
      motherName,
      fatherOccupation,
      fatherIncome,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    };
    await fetch(`${apiBase}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });
    setName("");
    setAge("");
    setStudentClass("");
    setSection("A");
    setFatherName("");
    setMotherName("");
    setFatherOccupation("");
    setFatherIncome("");
    setAddressLine1("");
    setAddressLine2("");
    setCity("");
    setState("");
    setPostalCode("");
    setCountry("");
  };

  const formContainerStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    padding: "30px",
    borderRadius: "15px",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    marginBottom: "40px",
    boxShadow: "0 5px 20px rgba(42, 82, 152, 0.1)",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#333",
    marginBottom: "25px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  };

  const fieldContainerStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
    color: "#333",
    fontSize: "14px",
    letterSpacing: "0.5px",
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    border: "2px solid #e0e0e0",
    borderRadius: "8px",
    fontSize: "14px",
    fontFamily: "'Segoe UI', sans-serif",
    transition: "all 0.3s ease",
    boxSizing: "border-box",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  };

  const errorStyle = {
    color: "#ff6b6b",
    fontSize: "12px",
    marginTop: "5px",
    fontWeight: "500",
  };

  const buttonStyle = {
    width: "100%",
    padding: "13px 30px",
    marginTop: "25px",
    background: isHovered ? "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)" : "linear-gradient(135deg, #2a5298 0%, #7ec8e3 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "1px",
    transition: "all 0.3s ease",
    boxShadow: isHovered ? "0 10px 25px rgba(42, 82, 152, 0.4)" : "0 5px 15px rgba(42, 82, 152, 0.2)",
    transform: isHovered ? "translateY(-2px)" : "translateY(0)",
  };

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  };

  return (
    <div style={formContainerStyle}>
      <h3 style={titleStyle}>✏️ Add New Student</h3>
      <form onSubmit={handleSubmit}>
        <div style={rowStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>👤 Full Name</label>
            <input
              type="text"
              placeholder="e.g., John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = errors.name ? "#ff6b6b" : "#e0e0e0"}
            />
            {errors.name && <div style={errorStyle}>{errors.name}</div>}
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>🎂 Age</label>
            <input
              type="number"
              placeholder="e.g., 18"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = errors.age ? "#ff6b6b" : "#e0e0e0"}
            />
            {errors.age && <div style={errorStyle}>{errors.age}</div>}
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}> Class</label>
            <input
              type="text"
              placeholder="e.g., 10A"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = errors.studentClass ? "#ff6b6b" : "#e0e0e0"}
            />
            {errors.studentClass && <div style={errorStyle}>{errors.studentClass}</div>}
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>📋 Section</label>
            <select
              value={section}
              onChange={(e) => setSection(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            >
              <option value="A">Section A</option>
              <option value="B">Section B</option>
            </select>
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>👨 Father's Name</label>
            <input
              type="text"
              placeholder="e.g., Robert Doe"
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = errors.fatherName ? "#ff6b6b" : "#e0e0e0"}
            />
            {errors.fatherName && <div style={errorStyle}>{errors.fatherName}</div>}
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>👩 Mother's Name</label>
            <input
              type="text"
              placeholder="e.g., Jane Doe"
              value={motherName}
              onChange={(e) => setMotherName(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = errors.motherName ? "#ff6b6b" : "#e0e0e0"}
            />
            {errors.motherName && <div style={errorStyle}>{errors.motherName}</div>}
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>💼 Father's Occupation</label>
            <input
              type="text"
              placeholder="e.g., Engineer"
              value={fatherOccupation}
              onChange={(e) => setFatherOccupation(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>
        </div>

        <div style={fieldContainerStyle}>
          <label style={labelStyle}>💰 Father's Income</label>
          <input
            type="text"
            placeholder="e.g., 50,000"
            value={fatherIncome}
            onChange={(e) => setFatherIncome(e.target.value)}
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = "#2a5298"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />
        </div>

        <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#333", marginTop: "30px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "8px" }}>
          📍 Address Information
        </h3>

        <div style={rowStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Address Line 1</label>
            <input
              type="text"
              placeholder="e.g., 123 Main Street"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Address Line 2</label>
            <input
              type="text"
              placeholder="e.g., Apt 4B (Optional)"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>City</label>
            <input
              type="text"
              placeholder="e.g., New York"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>State</label>
            <input
              type="text"
              placeholder="e.g., New York"
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>
        </div>

        <div style={rowStyle}>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Postal Code</label>
            <input
              type="text"
              placeholder="e.g., 10001"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>
          <div style={fieldContainerStyle}>
            <label style={labelStyle}>Country</label>
            <input
              type="text"
              placeholder="e.g., United States"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = "#2a5298"}
              onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
            />
          </div>
        </div>

        <button
          type="submit"
          style={buttonStyle}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
        >
          ✅ Add Student
        </button>
      </form>
    </div>
  );
}

export default StudentForm;
