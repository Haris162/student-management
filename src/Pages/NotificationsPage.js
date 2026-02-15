import React, { useState, useEffect } from "react";

function NotificationsPage({ apiBase, authHeaders, auth }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("general");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  const canCreate = auth?.user?.role === 'admin' || auth?.user?.role === 'principal';

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!title.trim() || !message.trim()) {
      setError("Title and message are required");
      return;
    }

    const notificationData = {
      title,
      message,
      type,
      attachmentUrl: attachmentUrl.trim() || undefined,
      attachmentName: attachmentName.trim() || undefined,
    };

    const url = editingId 
      ? `${apiBase}/notifications/${editingId}`
      : `${apiBase}/notifications`;
    const method = editingId ? 'PUT' : 'POST';

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
        if (!res.ok) throw new Error('Failed to save notification');
        return res.json();
      })
      .then(() => {
        setSuccessMessage(editingId ? 'Notification updated successfully!' : 'Notification created successfully!');
        resetForm();
        fetchNotifications();
      })
      .catch(err => setError(err.message || 'Failed to save notification'))
      .finally(() => setIsLoading(false));
  };

  const handleEdit = (notification) => {
    setEditingId(notification._id);
    setTitle(notification.title);
    setMessage(notification.message);
    setType(notification.type);
    setAttachmentUrl(notification.attachmentUrl || "");
    setAttachmentName(notification.attachmentName || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
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
        setSuccessMessage('Notification deleted successfully!');
        fetchNotifications();
      })
      .catch(err => setError(err.message || 'Failed to delete notification'))
      .finally(() => setIsLoading(false));
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("general");
    setAttachmentUrl("");
    setAttachmentName("");
    setEditingId(null);
    setShowForm(false);
  };

  const containerStyle = {
    minHeight: "calc(100vh - 60px)",
    padding: "30px 40px",
    backgroundColor: "#f6f8fb",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  };

  const titleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e3c72",
    margin: 0,
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
    transition: "all 0.3s ease",
  };

  const cardStyle = {
    backgroundColor: "white",
    border: "1px solid rgba(42, 82, 152, 0.12)",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  };

  const formLabelStyle = {
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
    borderRadius: "6px",
    border: "1px solid #7ec8e3",
    fontSize: "14px",
    boxSizing: "border-box",
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    resize: "vertical",
  };

  const selectStyle = {
    ...inputStyle,
  };

  const messageStyle = {
    padding: "12px 16px",
    borderRadius: "6px",
    marginBottom: "20px",
    fontSize: "14px",
    fontWeight: "600",
  };

  const errorStyle = {
    ...messageStyle,
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
  };

  const successStyle = {
    ...messageStyle,
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
  };

  const notificationCardStyle = {
    ...cardStyle,
    position: "relative",
  };

  const notificationHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  };

  const notificationTitleStyle = {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1e3c72",
    margin: "0 0 8px 0",
  };

  const notificationMetaStyle = {
    fontSize: "12px",
    color: "#7f8c8d",
    marginBottom: "12px",
  };

  const notificationMessageStyle = {
    fontSize: "14px",
    color: "#333",
    lineHeight: "1.6",
    marginBottom: "12px",
  };

  const typeBadgeStyle = (notificationType) => ({
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    backgroundColor: 
      notificationType === 'urgent' ? '#e74c3c' :
      notificationType === 'holiday' ? '#27ae60' :
      notificationType === 'event' ? '#f39c12' :
      '#3498db',
    color: "white",
    marginRight: "8px",
  });

  const actionButtonsStyle = {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
  };

  const editButtonStyle = {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#f39c12",
    color: "white",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const deleteButtonStyle = {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "none",
    backgroundColor: "#e74c3c",
    color: "white",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  };

  const attachmentStyle = {
    marginTop: "12px",
    padding: "10px",
    backgroundColor: "#f8f9fa",
    borderRadius: "6px",
    border: "1px solid #dee2e6",
  };

  const attachmentLinkStyle = {
    color: "#2a5298",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "13px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>📢 School Notifications</h1>
        {canCreate && !showForm && (
          <button
            style={buttonStyle}
            onClick={() => setShowForm(true)}
            onMouseOver={(e) => e.target.style.backgroundColor = "#1e3c72"}
            onMouseOut={(e) => e.target.style.backgroundColor = "#2a5298"}
          >
            ➕ Create Notification
          </button>
        )}
      </div>

      {error && <div style={errorStyle}>{error}</div>}
      {successMessage && <div style={successStyle}>{successMessage}</div>}

      {showForm && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: "20px", color: "#1e3c72", marginBottom: "20px" }}>
            {editingId ? "Edit Notification" : "Create New Notification"}
          </h2>
          <form onSubmit={handleSubmit}>
            <label style={formLabelStyle}>Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              placeholder="e.g., School Holiday - Republic Day"
              required
            />

            <label style={formLabelStyle}>Message *</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={textareaStyle}
              placeholder="Enter the notification details..."
              required
            />

            <label style={formLabelStyle}>Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              style={selectStyle}
            >
              <option value="general">General</option>
              <option value="holiday">Holiday</option>
              <option value="urgent">Urgent</option>
              <option value="event">Event</option>
            </select>

            <label style={formLabelStyle}>Attachment URL (Optional)</label>
            <input
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              style={inputStyle}
              placeholder="https://example.com/document.pdf"
            />

            <label style={formLabelStyle}>Attachment Name (Optional)</label>
            <input
              type="text"
              value={attachmentName}
              onChange={(e) => setAttachmentName(e.target.value)}
              style={inputStyle}
              placeholder="Holiday Notice.pdf"
            />

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                type="submit"
                style={buttonStyle}
                disabled={isLoading}
                onMouseOver={(e) => e.target.style.backgroundColor = "#1e3c72"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#2a5298"}
              >
                {isLoading ? "Saving..." : editingId ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{ ...buttonStyle, backgroundColor: "#95a5a6" }}
                onMouseOver={(e) => e.target.style.backgroundColor = "#7f8c8d"}
                onMouseOut={(e) => e.target.style.backgroundColor = "#95a5a6"}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {isLoading && notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#5c6c86" }}>
          Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#5c6c86" }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>📭</div>
          <div style={{ fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>
            No notifications yet
          </div>
          <div style={{ fontSize: "14px" }}>
            {canCreate ? "Create your first notification to inform everyone!" : "Check back later for updates"}
          </div>
        </div>
      ) : (
        <div>
          {notifications.map((notification) => (
            <div key={notification._id} style={notificationCardStyle}>
              <div style={notificationHeaderStyle}>
                <div style={{ flex: 1 }}>
                  <div style={notificationTitleStyle}>
                    <span style={typeBadgeStyle(notification.type)}>{notification.type}</span>
                    {notification.title}
                  </div>
                  <div style={notificationMetaStyle}>
                    Posted by {notification.createdByName} ({notification.createdByRole}) • {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div style={notificationMessageStyle}>
                {notification.message}
              </div>

              {notification.attachmentUrl && (
                <div style={attachmentStyle}>
                  <span style={{ fontSize: "12px", color: "#666", marginRight: "10px" }}>📎 Attachment:</span>
                  <a 
                    href={notification.attachmentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={attachmentLinkStyle}
                  >
                    {notification.attachmentName || notification.attachmentUrl}
                  </a>
                </div>
              )}

              {canCreate && (
                <div style={actionButtonsStyle}>
                  <button
                    onClick={() => handleEdit(notification)}
                    style={editButtonStyle}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(notification._id)}
                    style={deleteButtonStyle}
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
}

export default NotificationsPage;
