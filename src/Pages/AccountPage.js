import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function AccountPage({ apiBase, authHeaders, auth }) {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPersonalEmail, setEditPersonalEmail] = useState("");
  const [editPhoneNumber, setEditPhoneNumber] = useState("");
  const [userRequests, setUserRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("general");
  const [notificationDate, setNotificationDate] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [editingNotificationId, setEditingNotificationId] = useState(null);

  const isPrincipal = auth?.user?.role === 'principal';
  const isAdmin = auth?.user?.role === 'admin';
  const canCreateNotification = isAdmin || isPrincipal;

  useEffect(() => {
    if (isPrincipal && activeTab === 'requests') {
      fetchUserRequests();
    }
    if (activeTab === 'notifications') {
      fetchNotifications();
    }
  }, [isPrincipal, activeTab]);

  const fetchUserRequests = () => {
    setLoadingRequests(true);
    fetch(`${apiBase}/user-requests`, { headers: { ...authHeaders } })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch requests');
        return res.json();
      })
      .then(data => setUserRequests(data))
      .catch(err => console.error('Error fetching requests:', err))
      .finally(() => setLoadingRequests(false));
  };

  const handleApproveRequest = (requestId) => {
    if (!window.confirm('Are you sure you want to approve this user creation request?')) return;
    
    setIsLoading(true);
    fetch(`${apiBase}/user-requests/${requestId}/approve`, {
      method: 'POST',
      headers: { ...authHeaders },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to approve request');
        return res.json();
      })
      .then(() => {
        setMessage('User request approved successfully!');
        fetchUserRequests();
      })
      .catch(err => setError(err.message || 'Failed to approve request'))
      .finally(() => setIsLoading(false));
  };

  const handleRejectRequest = (requestId) => {
    if (!window.confirm('Are you sure you want to reject this user creation request?')) return;
    
    setIsLoading(true);
    fetch(`${apiBase}/user-requests/${requestId}/reject`, {
      method: 'POST',
      headers: { ...authHeaders },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to reject request');
        return res.json();
      })
      .then(() => {
        setMessage('User request rejected successfully!');
        fetchUserRequests();
      })
      .catch(err => setError(err.message || 'Failed to reject request'))
      .finally(() => setIsLoading(false));
  };

  const containerStyle = {
    display: "flex",
    minHeight: "calc(100vh - 60px)",
    backgroundColor: "#f6f8fb",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const sidebarStyle = {
    width: "280px",
    backgroundColor: "white",
    borderRight: "2px solid rgba(42, 82, 152, 0.1)",
    padding: "30px 0",
    position: "fixed",
    height: "calc(100vh - 60px)",
    overflowY: "auto",
  };

  const contentStyle = {
    flex: 1,
    marginLeft: "280px",
    padding: "30px 40px",
  };

  const sidebarHeaderStyle = {
    padding: "0 25px 20px",
    borderBottom: "2px solid rgba(42, 82, 152, 0.1)",
    marginBottom: "20px",
  };

  const sidebarTitleStyle = {
    margin: "0",
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e3c72",
  };

  const navItemStyle = (isActive) => ({
    padding: "14px 25px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: isActive ? "700" : "600",
    color: isActive ? "#1e3c72" : "#5c6c86",
    backgroundColor: isActive ? "rgba(42, 82, 152, 0.08)" : "transparent",
    borderLeft: isActive ? "4px solid #2a5298" : "4px solid transparent",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  });

  const cardStyle = {
    backgroundColor: "white",
    border: "1px solid rgba(42, 82, 152, 0.12)",
    borderRadius: "12px",
    padding: "30px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    marginBottom: "20px",
  };

  const titleStyle = {
    margin: "0 0 8px 0",
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

  const buttonStyle = {
    padding: "12px 24px",
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
    padding: "12px",
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

  const infoRowStyle = {
    display: "flex",
    padding: "14px 0",
    borderBottom: "1px solid rgba(42, 82, 152, 0.1)",
  };

  const infoLabelStyle = {
    flex: "0 0 150px",
    fontWeight: "700",
    fontSize: "13px",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  };

  const infoValueStyle = {
    flex: 1,
    fontSize: "14px",
    color: "#1e3c72",
    fontWeight: "600",
  };

  const comingSoonStyle = {
    textAlign: "center",
    padding: "40px",
    color: "#5c6c86",
    fontSize: "16px",
    fontStyle: "italic",
  };

  const handleChangePassword = (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    setIsLoading(true);

    fetch(`${apiBase}/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text || "Failed to change password");
        }
        return text ? JSON.parse(text) : {};
      })
      .then((data) => {
        setMessage(data.message || "Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        setError(err.message || "Failed to change password");
      })
      .finally(() => setIsLoading(false));
  };

  const handleEditProfile = () => {
    setEditName(auth?.user?.name || "");
    setEditPersonalEmail(auth?.user?.personalEmail || "");
    setEditPhoneNumber(auth?.user?.phoneNumber || "");
    setIsEditingProfile(true);
    setMessage("");
    setError("");
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditName("");
    setEditPersonalEmail("");
    setEditPhoneNumber("");
    setMessage("");
    setError("");
  };

  const handleSaveProfile = (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    fetch(`${apiBase}/auth/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      body: JSON.stringify({
        name: editName,
        personalEmail: editPersonalEmail,
        phoneNumber: editPhoneNumber,
      }),
    })
      .then(async (res) => {
        const text = await res.text();
        if (!res.ok) {
          throw new Error(text || "Failed to update profile");
        }
        return text ? JSON.parse(text) : {};
      })
      .then((data) => {
        // Update the auth state with new user data
        const updatedAuth = {
          ...auth,
          user: data.user,
        };
        localStorage.setItem("sms_auth", JSON.stringify(updatedAuth));
        window.location.reload(); // Reload to update auth state
      })
      .catch((err) => {
        setError(err.message || "Failed to update profile");
      })
      .finally(() => setIsLoading(false));
  };

  const fetchNotifications = () => {
    setIsLoading(true);
    fetch(`${apiBase}/notifications`, { headers: { ...authHeaders } })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch notifications');
        return res.json();
      })
      .then(data => setNotifications(data))
      .catch(err => {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications');
      })
      .finally(() => setIsLoading(false));
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted!');
    setError("");
    setMessage("");

    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      setError("Title and message are required");
      console.log('Validation failed: Title or message is empty');
      return;
    }

    const notificationData = {
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType,
      attachmentUrl: attachmentUrl.trim() || undefined,
      attachmentName: attachmentName.trim() || undefined,
    };

    // Only include date if it was selected
    if (notificationDate) {
      notificationData.notificationDate = new Date(notificationDate).toISOString();
      console.log('Date included:', notificationData.notificationDate);
    }

    console.log('Submitting notification:', notificationData);

    const url = editingNotificationId 
      ? `${apiBase}/notifications/${editingNotificationId}`
      : `${apiBase}/notifications`;
    const method = editingNotificationId ? 'PUT' : 'POST';

    setIsLoading(true);
    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(notificationData),
    })
      .then(res => {
        console.log('Response status:', res.status);
        if (!res.ok) throw new Error('Failed to save notification');
        return res.json();
      })
      .then((data) => {
        console.log('Success:', data);
        setMessage(editingNotificationId ? 'Notification updated successfully!' : 'Notification created successfully!');
        resetNotificationForm();
        fetchNotifications();
      })
      .catch(err => {
        console.error('Error saving notification:', err);
        setError(err.message || 'Failed to save notification');
      })
      .finally(() => setIsLoading(false));
  };

  const handleEditNotification = (notification) => {
    setEditingNotificationId(notification._id);
    setNotificationTitle(notification.title);
    setNotificationMessage(notification.message);
    setNotificationType(notification.type);
    setNotificationDate(notification.notificationDate ? new Date(notification.notificationDate).toISOString().split('T')[0] : "");
    setAttachmentUrl(notification.attachmentUrl || "");
    setAttachmentName(notification.attachmentName || "");
    setShowNotificationForm(true);
  };

  const handleDeleteNotification = (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;

    setIsLoading(true);
    fetch(`${apiBase}/notifications/${id}`, {
      method: 'DELETE',
      headers: { ...authHeaders },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to delete notification');
        return res.json();
      })
      .then(() => {
        setMessage('Notification deleted successfully!');
        fetchNotifications();
      })
      .catch(err => setError(err.message || 'Failed to delete notification'))
      .finally(() => setIsLoading(false));
  };

  const resetNotificationForm = () => {
    setNotificationTitle("");
    setNotificationMessage("");
    setNotificationType("general");
    setNotificationDate("");
    setAttachmentUrl("");
    setAttachmentName("");
    setEditingNotificationId(null);
    setShowNotificationForm(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "personal-info":
        return (
          <div style={cardStyle}>
            <h1 style={titleStyle}>Personal Information</h1>
            <p style={subtitleStyle}>
              {isEditingProfile ? "Update your profile information" : "View your account details"}
            </p>
            
            {!isEditingProfile ? (
              <>
                <div>
                  <div style={infoRowStyle}>
                    <div style={infoLabelStyle}>Name</div>
                    <div style={infoValueStyle}>{auth?.user?.name || "Administrator"}</div>
                  </div>
                  <div style={infoRowStyle}>
                    <div style={infoLabelStyle}>Email</div>
                    <div style={infoValueStyle}>{auth?.user?.email || "admin@school.com"}</div>
                  </div>
                  <div style={infoRowStyle}>
                    <div style={infoLabelStyle}>Personal Email</div>
                    <div style={infoValueStyle}>{auth?.user?.personalEmail || "Not set"}</div>
                  </div>
                  <div style={infoRowStyle}>
                    <div style={infoLabelStyle}>Phone Number</div>
                    <div style={infoValueStyle}>{auth?.user?.phoneNumber || "Not set"}</div>
                  </div>
                  <div style={infoRowStyle}>
                    <div style={infoLabelStyle}>Role</div>
                    <div style={infoValueStyle}>{auth?.user?.role || "Admin"}</div>
                  </div>
                  <div style={infoRowStyle}>
                    <div style={infoLabelStyle}>Account ID</div>
                    <div style={infoValueStyle}>{auth?.user?.id || "N/A"}</div>
                  </div>
                </div>
                <button 
                  type="button" 
                  style={buttonStyle} 
                  onClick={handleEditProfile}
                >
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSaveProfile}>
                <label style={labelStyle}>Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter your name"
                  required
                />

                <label style={labelStyle}>Personal Email</label>
                <input
                  type="email"
                  value={editPersonalEmail}
                  onChange={(e) => setEditPersonalEmail(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter your personal email"
                />

                <label style={labelStyle}>Phone Number</label>
                <input
                  type="tel"
                  value={editPhoneNumber}
                  onChange={(e) => setEditPhoneNumber(e.target.value)}
                  style={inputStyle}
                  placeholder="Enter your phone number"
                />

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  <button type="submit" style={buttonStyle} disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button 
                    type="button" 
                    style={{ ...buttonStyle, backgroundColor: "#666" }} 
                    onClick={handleCancelEdit}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {message && <div style={successStyle}>{message}</div>}
            {error && <div style={errorStyle}>{error}</div>}
          </div>
        );

      case "change-password":
        return (
          <div style={cardStyle}>
            <h1 style={titleStyle}>Change Password</h1>
            <p style={subtitleStyle}>Update your account password</p>

            <form onSubmit={handleChangePassword}>
              <label style={labelStyle}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={inputStyle}
                placeholder="Enter current password"
                required
              />

              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={inputStyle}
                placeholder="Enter new password (min 6 characters)"
                required
              />

              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="Re-enter new password"
                required
              />

              <button type="submit" style={buttonStyle} disabled={isLoading}>
                {isLoading ? "Updating..." : "Change Password"}
              </button>
            </form>

            {message && <div style={successStyle}>{message}</div>}
            {error && <div style={errorStyle}>{error}</div>}
          </div>
        );

      case "notifications":
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
              <div>
                <h1 style={titleStyle}>📢 School Notifications</h1>
                <p style={subtitleStyle}>View and manage school-wide announcements</p>
              </div>
              {canCreateNotification && !showNotificationForm && (
                <button
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#2a5298',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  onClick={() => setShowNotificationForm(true)}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#1e3c72'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#2a5298'}
                >
                  ➕ Create Notification
                </button>
              )}
            </div>

            {message && <div style={successStyle}>{message}</div>}
            {error && <div style={errorStyle}>{error}</div>}

            {showNotificationForm && (
              <div style={cardStyle}>
                <h2 style={{ fontSize: '20px', color: '#1e3c72', marginBottom: '20px' }}>
                  {editingNotificationId ? 'Edit Notification' : 'Create New Notification'}
                </h2>
                <form onSubmit={handleNotificationSubmit}>
                  <label style={labelStyle}>Title *</label>
                  <input
                    type="text"
                    value={notificationTitle}
                    onChange={(e) => setNotificationTitle(e.target.value)}
                    style={inputStyle}
                    placeholder="e.g., School Holiday - Republic Day"
                    required
                  />

                  <label style={labelStyle}>Message *</label>
                  <textarea
                    value={notificationMessage}
                    onChange={(e) => setNotificationMessage(e.target.value)}
                    style={{ ...inputStyle, minHeight: '100px', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", resize: 'vertical' }}
                    placeholder="Enter the notification details..."
                    required
                  />

                  <label style={labelStyle}>Type</label>
                  <select
                    value={notificationType}
                    onChange={(e) => setNotificationType(e.target.value)}
                    style={inputStyle}
                  >
                    <option value="general">General</option>
                    <option value="holiday">Holiday</option>
                    <option value="urgent">Urgent</option>
                    <option value="event">Event</option>
                  </select>

                  <label style={labelStyle}>Notification Date</label>
                  <input
                    type="date"
                    value={notificationDate}
                    onChange={(e) => setNotificationDate(e.target.value)}
                    style={inputStyle}
                  />

                  <label style={labelStyle}>Attachment URL (Optional)</label>
                  <input
                    type="url"
                    value={attachmentUrl}
                    onChange={(e) => setAttachmentUrl(e.target.value)}
                    style={inputStyle}
                    placeholder="https://example.com/document.pdf"
                  />

                  <label style={labelStyle}>Attachment Name (Optional)</label>
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    style={inputStyle}
                    placeholder="Holiday Notice.pdf"
                  />

                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                      type="submit"
                      style={buttonStyle}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Saving...' : editingNotificationId ? 'Update' : 'Create'}
                    </button>
                    <button
                      type="button"
                      onClick={resetNotificationForm}
                      style={{ ...buttonStyle, backgroundColor: '#95a5a6' }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {isLoading && notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#5c6c86' }}>
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#5c6c86' }}>
                <div style={{ fontSize: '64px', marginBottom: '20px' }}>📭</div>
                <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                  No notifications yet
                </div>
                <div style={{ fontSize: '14px' }}>
                  {canCreateNotification ? 'Create your first notification to inform everyone!' : 'Check back later for updates'}
                </div>
              </div>
            ) : (
              <div>
                {notifications.map((notification) => (
                  <div key={notification._id} style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '18px', fontWeight: '700', color: '#1e3c72', margin: '0 0 8px 0' }}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            backgroundColor: 
                              notification.type === 'urgent' ? '#e74c3c' :
                              notification.type === 'holiday' ? '#27ae60' :
                              notification.type === 'event' ? '#f39c12' :
                              '#3498db',
                            color: 'white',
                            marginRight: '8px',
                          }}>
                            {notification.type}
                          </span>
                          {notification.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#7f8c8d', marginBottom: '12px' }}>
                          Posted by {notification.createdByName} ({notification.createdByRole}) • {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '14px', color: '#333', lineHeight: '1.6', marginBottom: '12px' }}>
                      {notification.message}
                    </div>

                    {notification.attachmentUrl && (
                      <div style={{
                        marginTop: '12px',
                        padding: '10px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '6px',
                        border: '1px solid #dee2e6',
                      }}>
                        <span style={{ fontSize: '12px', color: '#666', marginRight: '10px' }}>📎 Attachment:</span>
                        <a 
                          href={notification.attachmentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ color: '#2a5298', textDecoration: 'none', fontWeight: '600', fontSize: '13px' }}
                        >
                          {notification.attachmentName || notification.attachmentUrl}
                        </a>
                      </div>
                    )}

                    {canCreateNotification && (
                      <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                        <button
                          onClick={() => handleEditNotification(notification)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#f39c12',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                          }}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNotification(notification._id)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            fontSize: '12px',
                            fontWeight: '700',
                            cursor: 'pointer',
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case "security":
        return (
          <div style={cardStyle}>
            <h1 style={titleStyle}>Security Settings</h1>
            <p style={subtitleStyle}>Manage security and authentication options</p>
            <div style={comingSoonStyle}>Coming Soon...</div>
          </div>
        );

      case "preferences":
        return (
          <div style={cardStyle}>
            <h1 style={titleStyle}>Preferences</h1>
            <p style={subtitleStyle}>Customize your experience</p>
            <div style={comingSoonStyle}>Coming Soon...</div>
          </div>
        );

      case "requests":
        return (
          <div style={cardStyle}>
            <h1 style={titleStyle}>User Creation Requests</h1>
            <p style={subtitleStyle}>Review and approve user creation requests from administrators</p>
            
            {message && <div style={successStyle}>{message}</div>}
            {error && <div style={errorStyle}>{error}</div>}

            {loadingRequests ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#5c6c86' }}>
                Loading requests...
              </div>
            ) : userRequests.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#5c6c86' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
                <div style={{ fontSize: '16px', fontWeight: '600' }}>No pending requests</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>New user creation requests will appear here</div>
              </div>
            ) : (
              <div style={{ marginTop: '20px' }}>
                {userRequests.map((request, idx) => (
                  <div key={request._id} style={{
                    border: '1px solid rgba(42, 82, 152, 0.12)',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '16px',
                    backgroundColor: '#fafbfc',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: '700', color: '#1e3c72', marginBottom: '12px' }}>
                          {request.name}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                          <div>
                            <span style={{ color: '#5c6c86', fontWeight: '600' }}>Email: </span>
                            <span style={{ color: '#2a5298' }}>{request.email}</span>
                          </div>
                          <div>
                            <span style={{ color: '#5c6c86', fontWeight: '600' }}>Role: </span>
                            <span style={{ 
                              color: 'white',
                              backgroundColor: request.role === 'admin' ? '#2a5298' : request.role === 'principal' ? '#e74c3c' : '#27ae60',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                            }}>
                              {request.role}
                            </span>
                          </div>
                          {request.personalEmail && (
                            <div>
                              <span style={{ color: '#5c6c86', fontWeight: '600' }}>Personal Email: </span>
                              <span>{request.personalEmail}</span>
                            </div>
                          )}
                          {request.phoneNumber && (
                            <div>
                              <span style={{ color: '#5c6c86', fontWeight: '600' }}>Phone: </span>
                              <span>{request.phoneNumber}</span>
                            </div>
                          )}
                        </div>
                        <div style={{ marginTop: '12px', fontSize: '12px', color: '#7f8c8d' }}>
                          <span style={{ fontWeight: '600' }}>Requested by: </span>
                          {request.requestedByName} ({request.requestedByEmail})
                        </div>
                        <div style={{ fontSize: '11px', color: '#95a5a6', marginTop: '4px' }}>
                          {new Date(request.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', marginLeft: '20px' }}>
                        <button
                          onClick={() => handleApproveRequest(request._id)}
                          disabled={isLoading}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#27ae60',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.6 : 1,
                          }}
                        >
                          ✓ Approve
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          disabled={isLoading}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: 'none',
                            backgroundColor: '#e74c3c',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: '700',
                            cursor: isLoading ? 'not-allowed' : 'pointer',
                            opacity: isLoading ? 0.6 : 1,
                          }}
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={sidebarStyle}>
        <div style={sidebarHeaderStyle}>
          <h2 style={sidebarTitleStyle}>Account Settings</h2>
        </div>

        <div
          style={navItemStyle(activeTab === "personal-info")}
          onClick={() => setActiveTab("personal-info")}
          onMouseOver={(e) => {
            if (activeTab !== "personal-info") {
              e.currentTarget.style.backgroundColor = "rgba(42, 82, 152, 0.04)";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "personal-info") {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span>👤</span>
          <span>Personal Info</span>
        </div>

        <div
          style={navItemStyle(activeTab === "change-password")}
          onClick={() => setActiveTab("change-password")}
          onMouseOver={(e) => {
            if (activeTab !== "change-password") {
              e.currentTarget.style.backgroundColor = "rgba(42, 82, 152, 0.04)";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "change-password") {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span>🔑</span>
          <span>Change Password</span>
        </div>

        <div
          style={navItemStyle(activeTab === "notifications")}
          onClick={() => setActiveTab("notifications")}
          onMouseOver={(e) => {
            if (activeTab !== "notifications") {
              e.currentTarget.style.backgroundColor = "rgba(42, 82, 152, 0.04)";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "notifications") {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span>🔔</span>
          <span>Notifications</span>
        </div>

        <div
          style={navItemStyle(activeTab === "security")}
          onClick={() => setActiveTab("security")}
          onMouseOver={(e) => {
            if (activeTab !== "security") {
              e.currentTarget.style.backgroundColor = "rgba(42, 82, 152, 0.04)";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "security") {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span>🛡️</span>
          <span>Security</span>
        </div>

        <div
          style={navItemStyle(activeTab === "preferences")}
          onClick={() => setActiveTab("preferences")}
          onMouseOver={(e) => {
            if (activeTab !== "preferences") {
              e.currentTarget.style.backgroundColor = "rgba(42, 82, 152, 0.04)";
            }
          }}
          onMouseOut={(e) => {
            if (activeTab !== "preferences") {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        >
          <span>⚙️</span>
          <span>Preferences</span>
        </div>

        {isAdmin && (
          <>
            <Link
              to="/add-student"
              style={{
                ...navItemStyle(false),
                textDecoration: 'none',
                display: 'flex',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(42, 82, 152, 0.04)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span>➕</span>
              <span>Add Student</span>
            </Link>

            <Link
              to="/add-user"
              style={{
                ...navItemStyle(false),
                textDecoration: 'none',
                display: 'flex',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(42, 82, 152, 0.04)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span>👥</span>
              <span>Add User</span>
            </Link>
          </>
        )}

        {isPrincipal && (
          <div
            style={navItemStyle(activeTab === "requests")}
            onClick={() => setActiveTab("requests")}
            onMouseOver={(e) => {
              if (activeTab !== "requests") {
                e.currentTarget.style.backgroundColor = "rgba(42, 82, 152, 0.04)";
              }
            }}
            onMouseOut={(e) => {
              if (activeTab !== "requests") {
                e.currentTarget.style.backgroundColor = "transparent";
              }
            }}
          >
            <span>📬</span>
            <span>User Requests</span>
            {userRequests.length > 0 && (
              <span style={{
                marginLeft: 'auto',
                backgroundColor: '#e74c3c',
                color: 'white',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '11px',
                fontWeight: '700',
              }}>
                {userRequests.length}
              </span>
            )}
          </div>
        )}
      </div>

      <div style={contentStyle}>
        {renderContent()}
      </div>
    </div>
  );
}

export default AccountPage;
