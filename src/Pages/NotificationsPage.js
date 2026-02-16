/**
 * Notifications Page Component
 * 
 * Public-facing notifications display and management:
 * - List all active notifications sorted by date
 * - Create/Edit/Delete (admin/principal only)
 * - Type-based color coding (urgent, holiday, event, general)
 * - Optional attachments with URLs
 * - Calendar date assignment for events/holidays
 * - Rich metadata: creator name, role, timestamp
 */

import React, { useState, useEffect, useRef } from "react";

function NotificationsPage({ apiBase, authHeaders, auth, unreadCount = 0, refreshUnreadCount }) {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("general");
  const [notificationDate, setNotificationDate] = useState(""); // Add date state
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const justOpenedRef = useRef(false);
  const dateInputRef = useRef(null);

  const canCreate = auth?.user?.role === 'admin' || auth?.user?.role === 'principal';

  useEffect(() => {
    if (authHeaders?.Authorization) {
      fetchNotifications();
    }
  }, [authHeaders]);

  const fetchNotifications = () => {
    if (!authHeaders?.Authorization) return;
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
      notificationDate: notificationDate ? new Date(notificationDate).toISOString() : null, // Send date in ISO format
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
      .then(async res => {
        if (!res.ok) {
          const message = await res.text();
          const statusInfo = `${res.status} ${res.statusText}`.trim();
          throw new Error(message || statusInfo || 'Failed to save notification');
        }
        return res.json();
      })
      .then(() => {
        setSuccessMessage(editingId ? 'Notification updated successfully!' : 'Notification created successfully!');
        resetForm();
        fetchNotifications();
        if (refreshUnreadCount) refreshUnreadCount();
      })
      .catch(err => setError(err.message || 'Failed to save notification'))
      .finally(() => setIsLoading(false));
  };

  const handleEdit = (notification) => {
    setEditingId(notification._id);
    setTitle(notification.title);
    setMessage(notification.message);
    setType(notification.type);
    // Format date for input field if it exists
    if (notification.notificationDate) {
      const date = new Date(notification.notificationDate);
      setNotificationDate(date.toISOString().split('T')[0]); // YYYY-MM-DD format
    } else {
      setNotificationDate("");
    }
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
        if (refreshUnreadCount) refreshUnreadCount();
      })
      .catch(err => setError(err.message || 'Failed to delete notification'))
      .finally(() => setIsLoading(false));
  };

  const markNotificationRead = (notificationId) => {
    if (!authHeaders?.Authorization) return;
    fetch(`${apiBase}/notifications/${notificationId}/read`, {
      method: 'POST',
      headers: { ...authHeaders },
    })
      .then(() => refreshUnreadCount && refreshUnreadCount())
      .catch(() => {});
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setType("general");
    setNotificationDate(""); // Reset date
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

  const countBadgeStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "22px",
    height: "22px",
    padding: "0 6px",
    marginLeft: "10px",
    borderRadius: "11px",
    backgroundColor: "#e74c3c",
    color: "white",
    fontSize: "12px",
    fontWeight: "700",
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

  const dateInputStyle = {
    ...inputStyle,
    paddingRight: "64px",
  };

  const dateInputWrapperStyle = {
    position: "relative",
    width: "100%",
    cursor: "pointer",
  };

  const datePickerButtonStyle = {
    position: "absolute",
    top: "50%",
    right: "10px",
    transform: "translateY(-50%)",
    padding: "4px 8px",
    borderRadius: "6px",
    border: "1px solid #7ec8e3",
    backgroundColor: "white",
    color: "#2a5298",
    fontSize: "11px",
    fontWeight: "700",
    cursor: "pointer",
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

  const unreadBorderStyle = {
    borderRight: "4px solid #e74c3c",
  };

  const notificationMetaStyle = {
    fontSize: "12px",
    color: "#7f8c8d",
    marginBottom: "12px",
  };

  const notificationDateStyle = {
    fontSize: "12px",
    color: "#2a5298",
    fontWeight: "600",
    marginTop: "4px",
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

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  };

  const modalContentStyle = {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "24px",
    width: "90%",
    maxWidth: "620px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  };

  const modalHeaderStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "12px",
  };

  const modalTitleStyle = {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1e3c72",
    margin: 0,
  };

  const closeButtonStyle = {
    border: "none",
    backgroundColor: "#95a5a6",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "700",
  };

  const formatNotificationDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    return date.toLocaleDateString();
  };

  const openNotification = (notification) => {
    setSelectedNotification(notification);
    justOpenedRef.current = true;
    setTimeout(() => {
      justOpenedRef.current = false;
    }, 0);
  };

  const closeNotification = () => {
    if (selectedNotification?._id) {
      markNotificationRead(selectedNotification._id);
    }
    setSelectedNotification(null);
  };

  const handleNotificationCardClick = (event, notification) => {
    const tagName = event.target?.tagName;
    if (tagName === "A" || tagName === "BUTTON") return;
    event.preventDefault();
    event.stopPropagation();
    openNotification(notification);
  };


  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          📢 School Notifications
          {unreadCount > 0 && (
            <span style={countBadgeStyle}>
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </h1>
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

            <label style={formLabelStyle}>Notification Date *</label>
            <div
              style={dateInputWrapperStyle}
              onClick={() => {
                if (!dateInputRef.current) return;
                dateInputRef.current.focus();
                try {
                  if (dateInputRef.current.showPicker) {
                    dateInputRef.current.showPicker();
                  }
                } catch (err) {
                  // Ignore browsers that block programmatic picker calls.
                }
              }}
            >
              <input
                ref={dateInputRef}
                type="date"
                value={notificationDate}
                onChange={(e) => setNotificationDate(e.target.value)}
                style={dateInputStyle}
                aria-label="Notification date"
                required
              />
              <button
                type="button"
                style={datePickerButtonStyle}
                onClick={() => dateInputRef.current && dateInputRef.current.focus()}
              >
                CAL
              </button>
            </div>

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

      {selectedNotification && (
        <div
          style={modalOverlayStyle}
          onClick={() => {
            if (justOpenedRef.current) return;
            closeNotification();
          }}
        >
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={modalHeaderStyle}>
              <h3 style={modalTitleStyle}>{selectedNotification.title}</h3>
              <button
                type="button"
                style={closeButtonStyle}
                onClick={closeNotification}
              >
                Close
              </button>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={typeBadgeStyle(selectedNotification.type)}>
                {selectedNotification.type}
              </span>
            </div>
            <div style={notificationMetaStyle}>
              Posted by {selectedNotification.createdByName} ({selectedNotification.createdByRole}) • {new Date(selectedNotification.createdAt).toLocaleDateString()} at {new Date(selectedNotification.createdAt).toLocaleTimeString()}
            </div>
            {formatNotificationDate(selectedNotification.notificationDate) && (
              <div style={notificationDateStyle}>
                Event Date: {formatNotificationDate(selectedNotification.notificationDate)}
              </div>
            )}
            <div style={{ marginTop: "12px", color: "#333", lineHeight: "1.6" }}>
              {selectedNotification.message}
            </div>
            {selectedNotification.attachmentUrl && (
              <div style={attachmentStyle}>
                <span style={{ fontSize: "12px", color: "#666", marginRight: "10px" }}>📎 Attachment:</span>
                <a
                  href={selectedNotification.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={attachmentLinkStyle}
                >
                  {selectedNotification.attachmentName || selectedNotification.attachmentUrl}
                </a>
              </div>
            )}
          </div>
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
            <div
              key={notification._id}
              style={{
                ...notificationCardStyle,
                ...(notification.isRead ? {} : unreadBorderStyle),
              }}
              onClick={(e) => handleNotificationCardClick(e, notification)}
            >
              <div style={notificationHeaderStyle}>
                <div style={{ flex: 1 }}>
                  <div style={notificationTitleStyle}>
                    <span style={typeBadgeStyle(notification.type)}>{notification.type}</span>
                    {notification.title}
                  </div>
                  <div style={notificationMetaStyle}>
                    Posted by {notification.createdByName} ({notification.createdByRole}) • {new Date(notification.createdAt).toLocaleDateString()} at {new Date(notification.createdAt).toLocaleTimeString()}
                  </div>
                  {formatNotificationDate(notification.notificationDate) && (
                    <div style={notificationDateStyle}>
                      Event Date: {formatNotificationDate(notification.notificationDate)}
                    </div>
                  )}
                </div>
              </div>

              <div style={notificationMessageStyle}>
                {notification.message.length > 140
                  ? `${notification.message.slice(0, 140)}...`
                  : notification.message}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(notification);
                    }}
                    style={editButtonStyle}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification._id);
                    }}
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
