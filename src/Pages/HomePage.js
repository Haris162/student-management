/**
 * Home Page / Dashboard Component
 * 
 * Main dashboard featuring:
 * - Interactive calendar with notification dates
 * - Color-coded notifications by type
 * - Quick action cards for navigation
 * - Feature list and welcome message
 * - Month navigation controls
 */

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HomePage({ auth, apiBase, authHeaders }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (authHeaders?.Authorization) {
      fetchNotifications();
    }
  }, [authHeaders]);

  const fetchNotifications = () => {
    fetch(`${apiBase}/notifications`, { headers: { ...authHeaders } })
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        console.log('Fetched notifications:', data);
        setNotifications(data);
      })
      .catch(err => console.error('Error fetching notifications:', err));
  };

  const getNotificationsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const matches = notifications.filter(notif => {
      if (!notif.notificationDate) {
        console.log('Notification has no date:', notif.title);
        return false;
      }
      try {
        const notifDate = new Date(notif.notificationDate).toISOString().split('T')[0];
        const isMatch = notifDate === dateStr;
        if (isMatch) {
          console.log(`Match found: ${notifDate} === ${dateStr} for ${notif.title}`);
        }
        return isMatch;
      } catch (err) {
        console.error('Error parsing notification date:', notif.notificationDate, err);
        return false;
      }
    });
    return matches;
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days = [];
    // Add empty cells for days before the 1st
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} style={emptyDayStyle}></div>);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayNotifications = getNotificationsForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      
      days.push(
        <div
          key={day}
          style={{
            ...dayStyle,
            backgroundColor: isToday ? 'rgba(42, 82, 152, 0.1)' : dayNotifications.length > 0 ? 'rgba(255, 255, 255, 0.9)' : 'white',
            border: isToday ? '2px solid #2a5298' : dayNotifications.length > 0 ? '2px solid #2a5298' : '1px solid #ddd',
            boxShadow: dayNotifications.length > 0 ? '0 2px 8px rgba(42, 82, 152, 0.15)' : 'none',
            overflow: 'hidden',
          }}
          onClick={() => setSelectedDate(date)}
          title={dayNotifications.length > 0 ? dayNotifications.map(n => n.title).join(', ') : ''}
        >
          <div style={{ fontWeight: isToday || dayNotifications.length > 0 ? '700' : '600', color: isToday || dayNotifications.length > 0 ? '#2a5298' : '#333', marginBottom: '4px' }}>
            {day}
          </div>
          {dayNotifications.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '10px' }}>
              {dayNotifications.slice(0, 2).map((notif, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '2px 4px',
                    borderRadius: '3px',
                    backgroundColor: 
                      notif.type === 'urgent' ? '#e74c3c' :
                      notif.type === 'holiday' ? '#f39c12' :
                      notif.type === 'event' ? '#9b59b6' :
                      '#3498db',
                    color: 'white',
                    fontWeight: '600',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '100%',
                    cursor: 'pointer',
                  }}
                  title={notif.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDate(date);
                  }}
                >
                  {notif.title}
                </div>
              ))}
              {dayNotifications.length > 2 && (
                <div style={{
                  padding: '2px 4px',
                  fontSize: '9px',
                  color: '#2a5298',
                  fontWeight: '700',
                  textAlign: 'center',
                }}>
                  +{dayNotifications.length - 2} more
                </div>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  const emptyDayStyle = {
    padding: '10px',
    minHeight: '80px',
  };

  const dayStyle = {
    padding: '10px',
    minHeight: '80px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
  };
  const containerStyle = {
    minHeight: "calc(100vh - 120px)",
    background: "white",
    padding: "40px 20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const centerStyle = {
    maxWidth: "1000px",
    margin: "0 auto",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "42px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "15px",
    letterSpacing: "1px",
  };

  const subtitleStyle = {
    fontSize: "18px",
    color: "#666",
    marginBottom: "50px",
    fontWeight: "300",
  };

  const cardsContainerStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "30px",
    marginTop: "50px",
  };

  const cardStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    border: "2px solid rgba(42, 82, 152, 0.2)",
    borderRadius: "15px",
    padding: "40px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    textDecoration: "none",
  };

  const cardHoverStyle = {
    backgroundColor: "rgba(126, 200, 227, 0.25)",
    boxShadow: "0 10px 30px rgba(42, 82, 152, 0.2)",
    transform: "translateY(-5px)",
  };

  const cardIconStyle = {
    fontSize: "48px",
    marginBottom: "15px",
  };

  const cardTitleStyle = {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "10px",
  };

  const cardDescriptionStyle = {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
  };

  const featureListStyle = {
    marginTop: "60px",
    padding: "30px",
    backgroundColor: "rgba(126, 200, 227, 0.15)",
    borderRadius: "15px",
    border: "2px solid rgba(42, 82, 152, 0.2)",
  };

  const featureListTitleStyle = {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1e3c72",
    marginBottom: "20px",
  };

  const featuresStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  };

  const featureItemStyle = {
    fontSize: "14px",
    color: "#333",
    padding: "15px",
    backgroundColor: "white",
    borderRadius: "8px",
    textAlign: "left",
  };

  return (
    <div style={containerStyle}>
      <div style={centerStyle}>
        <h1 style={titleStyle}>📚 Welcome to Student Management System</h1>
        <p style={subtitleStyle}>Efficiently manage, track, and organize student information all in one place</p>

        {/* Calendar Section */}
        {showCalendar && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            marginTop: '30px',
            marginBottom: '30px',
            border: '2px solid rgba(42, 82, 152, 0.2)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
            }}>
              <button
                onClick={() => changeMonth(-1)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: '#2a5298',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                }}
              >
                ← Prev
              </button>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e3c72', margin: 0 }}>
                📅 {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => changeMonth(1)}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#2a5298',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                  }}
                >
                  Next →
                </button>
                <button
                  onClick={() => {
                    setShowCalendar(false);
                    setSelectedDate(null);
                  }}
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                  }}
                >
                  ✕ Close
                </button>
              </div>
            </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '5px',
            marginBottom: '10px',
          }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} style={{
                padding: '10px',
                textAlign: 'center',
                fontWeight: '700',
                color: '#2a5298',
                fontSize: '14px',
              }}>
                {day}
              </div>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '5px',
          }}>
            {generateCalendar()}
          </div>

          {/* Legend */}
          <div style={{
            marginTop: '20px',
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            fontSize: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3498db' }}></div>
              <span>General</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f39c12' }}></div>
              <span>Holiday</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#e74c3c' }}></div>
              <span>Urgent</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#9b59b6' }}></div>
              <span>Event</span>
            </div>
          </div>

          {/* Selected Date Notifications */}
          {selectedDate && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              backgroundColor: 'rgba(126, 200, 227, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(42, 82, 152, 0.2)',
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
              }}>
                <h3 style={{ margin: 0, color: '#1e3c72', fontSize: '18px' }}>
                  Notifications for {selectedDate.toLocaleDateString()}
                </h3>
                <button
                  onClick={() => setSelectedDate(null)}
                  style={{
                    padding: '5px 15px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                  }}
                >
                  Close
                </button>
              </div>
              {getNotificationsForDate(selectedDate).length === 0 ? (
                <p style={{ color: '#666', margin: 0 }}>No notifications for this date.</p>
              ) : (
                getNotificationsForDate(selectedDate).map((notif, idx) => (
                  <div key={idx} style={{
                    padding: '15px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    border: '1px solid #ddd',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      marginBottom: '8px',
                    }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        backgroundColor:
                          notif.type === 'urgent' ? '#fee' :
                          notif.type === 'holiday' ? '#fef5e7' :
                          notif.type === 'event' ? '#f4ecf7' :
                          '#e3f2fd',
                        color:
                          notif.type === 'urgent' ? '#e74c3c' :
                          notif.type === 'holiday' ? '#f39c12' :
                          notif.type === 'event' ? '#9b59b6' :
                          '#3498db',
                      }}>
                        {notif.type}
                      </span>
                      <h4 style={{ margin: 0, color: '#1e3c72', fontSize: '16px' }}>{notif.title}</h4>
                    </div>
                    <p style={{ margin: '8px 0 0 0', color: '#555', fontSize: '14px' }}>{notif.message}</p>
                    {notif.attachmentUrl && (
                      <a
                        href={notif.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block',
                          marginTop: '10px',
                          color: '#2a5298',
                          textDecoration: 'none',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        📎 {notif.attachmentName || 'View Attachment'}
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          </div>
        )}

        <div style={cardsContainerStyle}>
          <div
            style={cardStyle}
            onClick={() => {
              setShowCalendar(true);
              if (authHeaders?.Authorization) {
                fetchNotifications();
              }
            }}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(126, 200, 227, 0.15)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={cardIconStyle}>📅</div>
            <h2 style={cardTitleStyle}>School Calendar</h2>
            <p style={cardDescriptionStyle}>View notifications and events scheduled on the calendar</p>
          </div>

          {auth?.user?.role === 'admin' && (
            <Link
              to="/add-student"
              style={cardStyle}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(126, 200, 227, 0.15)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={cardIconStyle}>➕</div>
              <h2 style={cardTitleStyle}>Add Student</h2>
              <p style={cardDescriptionStyle}>Create a new student record with name, age, and marks information</p>
            </Link>
          )}

          <Link
            to="/students"
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(126, 200, 227, 0.15)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={cardIconStyle}>📋</div>
            <h2 style={cardTitleStyle}>View Students</h2>
            <p style={cardDescriptionStyle}>Browse, search, filter, edit, and delete student records</p>
          </Link>

          <Link
            to="/students"
            style={cardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHoverStyle)}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(126, 200, 227, 0.15)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={cardIconStyle}>📊</div>
            <h2 style={cardTitleStyle}>Export Data</h2>
            <p style={cardDescriptionStyle}>Export student records to Excel or PDF format for reporting</p>
          </Link>
        </div>

        <div style={featureListStyle}>
          <h2 style={featureListTitleStyle}>✨ Key Features</h2>
          <div style={featuresStyle}>
            <div style={featureItemStyle}>
              ✅ Add & manage student records
            </div>
            <div style={featureItemStyle}>
              🔍 Search students by name
            </div>
            <div style={featureItemStyle}>
              📊 Filter by marks performance
            </div>
            <div style={featureItemStyle}>
              ✏️ Edit student information
            </div>
            <div style={featureItemStyle}>
              🗑️ Delete student records
            </div>
            <div style={featureItemStyle}>
              🖨️ Print to PDF
            </div>
            <div style={featureItemStyle}>
              📥 Export to Excel
            </div>
            <div style={featureItemStyle}>
              🎨 Clean & modern UI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
