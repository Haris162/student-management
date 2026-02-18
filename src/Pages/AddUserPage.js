/**
 * Add User Page Component
 * 
 * Creates new user accounts (requires principal approval):
 * - Form for user details (name, email, password, role)
 * - Role selection: lecturer, principal, admin
 * - OTP verification for principal role creation
 * - All requests go to principal for approval
 * - Displays success message post-submission
 */

import React, { useState } from "react";

function AddUserPage({ apiBase, authHeaders, auth }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("lecturer");
  const [personalEmail, setPersonalEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [pendingUserData, setPendingUserData] = useState(null);

  const containerStyle = {
    maxWidth: "700px",
    margin: "30px auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const cardStyle = {
    backgroundColor: "white",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
  };

  const titleStyle = {
    margin: "0 0 10px 0",
    fontSize: "24px",
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
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2a5298",
    color: "white",
    fontSize: "14px",
    fontWeight: "700",
    cursor: "pointer",
    marginTop: "20px",
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
    whiteSpace: "pre-line",
  };

  const errorStyle = {
    ...messageStyle,
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
  };

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  };

  const modalStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "30px",
    width: "400px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  };

  const modalTitleStyle = {
    margin: "0 0 15px 0",
    fontSize: "20px",
    color: "#1e3c72",
    fontWeight: "700",
  };

  const modalTextStyle = {
    margin: "0 0 20px 0",
    fontSize: "14px",
    color: "#5c6c86",
    lineHeight: "1.5",
  };

  const handleRequestOtp = () => {
    if (!auth?.user?.phoneNumber) {
      setError("Admin phone number not set. Please update your profile first.");
      return;
    }

    setIsLoading(true);
    fetch(`${apiBase}/auth/request-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text || "Failed to send OTP");
        }
        return text ? JSON.parse(text) : {};
      })
      .then((data) => {
        setGeneratedOtp(data.otp);
        setShowOtpModal(true);
        setMessage(`OTP sent to ${auth.user.phoneNumber}: ${data.otp}`);
      })
      .catch((err) => {
        setError(err.message || "Failed to send OTP");
      })
      .finally(() => setIsLoading(false));
  };

  const handleVerifyOtpAndCreate = () => {
    if (otp !== generatedOtp) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    // Proceed with user creation
    createUser(pendingUserData);
    setShowOtpModal(false);
    setOtp("");
    setGeneratedOtp("");
    setPendingUserData(null);
  };

  const createUser = (userData) => {
    setIsLoading(true);
    fetch(`${apiBase}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify(userData),
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text || "Failed to submit user request");
        }
        return text ? JSON.parse(text) : {};
      })
      .then((data) => {
        let successMsg = `User creation request submitted to principal for approval!\n\nPending user details:\nName: ${userData.name}\nEmail: ${userData.email}\nRole: ${userData.role}`;
        if (userData.role === "lecturer" && userData.subject) {
          successMsg += `\nSubject: ${userData.subject}`;
        }
        successMsg += `\n\nThe user will be able to log in once the principal approves this request.`;
        setMessage(successMsg);
        // Reset form
        setName("");
        setEmail("");
        setPassword("");
        setRole("lecturer");
        setPersonalEmail("");
        setPhoneNumber("");
        setSubject("");
      })
      .catch((err) => {
        setError(err.message || "Failed to submit user request");
      })
      .finally(() => setIsLoading(false));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    // Validate subject for lecturer role
    if (role === "lecturer" && !subject.trim()) {
      setError("Subject is required for lecturers");
      return;
    }

    const userData = {
      name,
      email: email.toLowerCase().trim(),
      password,
      role,
      personalEmail,
      phoneNumber,
    };

    // Add subject only for lecturers
    if (role === "lecturer") {
      userData.subject = subject.trim();
    }

    // If creating a principal, require OTP
    if (role === "principal") {
      setPendingUserData(userData);
      handleRequestOtp();
    } else {
      createUser(userData);
    }
  };

  const handleCancelOtp = () => {
    setShowOtpModal(false);
    setOtp("");
    setGeneratedOtp("");
    setPendingUserData(null);
    setIsLoading(false);
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Add New User</h1>
        <p style={subtitleStyle}>
          Create a new user account with unique login credentials. Each user will use their own email and password to log in.
          <br />
          <strong style={{ color: '#e67e22' }}>Note:</strong> All user creation requests require principal approval before the user can log in.
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
            placeholder="Enter full name"
            required
          />

          <label style={labelStyle}>Login Email (for this user)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            placeholder="user@school.com"
            required
          />
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#5c6c86", fontStyle: "italic" }}>
            This user will log in with this email address
          </p>

          <label style={labelStyle}>Password (for this user)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            placeholder="Minimum 6 characters"
            required
          />
          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#5c6c86", fontStyle: "italic" }}>
            This user will use this password to log in
          </p>

          <label style={labelStyle}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={selectStyle}
            required
          >
            <option value="lecturer">Lecturer</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
            <option value="principal">Principal</option>
          </select>

          {role === "lecturer" && (
            <>
              <label style={labelStyle}>Subject (Required for Lecturers)</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                style={selectStyle}
                required
              >
                <option value="">-- Select a Subject --</option>
                <option value="Telugu">Telugu</option>
                <option value="Hindi">Hindi</option>
                <option value="English">English</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
                <option value="Social">Social</option>
              </select>
              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#5c6c86", fontStyle: "italic" }}>
                Select the subject this lecturer will teach
              </p>
            </>
          )}

          <label style={labelStyle}>Personal Email (Optional)</label>
          <input
            type="email"
            value={personalEmail}
            onChange={(e) => setPersonalEmail(e.target.value)}
            style={inputStyle}
            placeholder="personal@email.com"
          />

          <label style={labelStyle}>Phone Number (Optional)</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            style={inputStyle}
            placeholder="+1234567890"
          />

          <button type="submit" style={buttonStyle} disabled={isLoading}>
            {isLoading ? "Creating..." : role === "principal" ? "Create Principal (OTP Required)" : "Create User"}
          </button>
        </form>

        {message && <div style={successStyle}>{message}</div>}
        {error && <div style={errorStyle}>{error}</div>}
      </div>

      {showOtpModal && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <h2 style={modalTitleStyle}>OTP Verification</h2>
            <p style={modalTextStyle}>
              An OTP has been sent to your phone number ({auth?.user?.phoneNumber}).
              <br /><br />
              <strong>For testing: {generatedOtp}</strong>
            </p>

            <label style={labelStyle}>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={inputStyle}
              placeholder="Enter 6-digit OTP"
              maxLength="6"
              autoFocus
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                type="button"
                style={buttonStyle}
                onClick={handleVerifyOtpAndCreate}
                disabled={otp.length !== 6}
              >
                Verify & Create
              </button>
              <button
                type="button"
                style={{ ...buttonStyle, backgroundColor: "#666" }}
                onClick={handleCancelOtp}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddUserPage;
