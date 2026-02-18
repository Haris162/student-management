import React, { useState, useEffect } from 'react';

const ImportHistory = ({ apiBase, authHeaders, fixedType = '' }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState(fixedType || '');
  const [selectedLog, setSelectedLog] = useState(null);
  const [summary, setSummary] = useState(null);

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    marginTop: '20px',
  };

  const headerStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1e3c72',
    marginBottom: '20px',
  };

  const summaryCardStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
  };

  const summaryItemStyle = {
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '6px',
    border: '1px solid #e0e0e0',
  };

  const summaryLabelStyle = {
    fontSize: '12px',
    color: '#7f8c8d',
    fontWeight: '600',
    textTransform: 'uppercase',
  };

  const summaryValueStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#2c3e50',
    marginTop: '8px',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '6px',
    overflow: 'hidden',
  };

  const thStyle = {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '12px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '13px',
  };

  const tdStyle = {
    padding: '12px',
    borderBottom: '1px solid #e0e0e0',
    fontSize: '13px',
  };

  const statusBadgeStyle = (status) => {
    let backgroundColor, color;
    switch (status) {
      case 'completed':
        backgroundColor = '#d4edda';
        color = '#155724';
        break;
      case 'partial':
        backgroundColor = '#fff3cd';
        color = '#856404';
        break;
      case 'failed':
        backgroundColor = '#f8d7da';
        color = '#721c24';
        break;
      default:
        backgroundColor = '#e2e3e5';
        color = '#383d41';
    }
    return {
      display: 'inline-block',
      backgroundColor,
      color,
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '500',
    };
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
  };

  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  };

  const modalStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '700px',
    maxHeight: '80vh',
    overflowY: 'auto',
    width: '90%',
  };

  const closeButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
    float: 'right',
  };

  useEffect(() => {
    setFilterType(fixedType || '');
    setPage(1);
  }, [fixedType]);

  useEffect(() => {
    fetchLogs();
    if (!fixedType) {
      fetchSummary();
    }
  }, [page, filterType, fixedType]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const activeType = fixedType || filterType;
      const url = activeType
        ? `${apiBase}/import-logs/type/${activeType}?page=${page}`
        : `${apiBase}/import-logs?page=${page}`;

      const response = await fetch(url, { headers: authHeaders });
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      const response = await fetch(`${apiBase}/import-logs/summary/count`, {
        headers: authHeaders,
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const typeLabelMap = {
    students: 'Students',
    exams: 'Exams',
    marks: 'Marks',
  };

  const typeLabel = fixedType ? typeLabelMap[fixedType] || fixedType : '';

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div style={containerStyle}>
      <h2 style={headerStyle}>
        {fixedType ? `📊 ${typeLabel} Import History` : '📊 Import History & Tracking'}
      </h2>

      {/* Summary Cards */}
      {!fixedType && summary && (
        <div style={summaryCardStyle}>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Total Imports</div>
            <div style={summaryValueStyle}>{summary.totalImports}</div>
          </div>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Successful</div>
            <div style={{ ...summaryValueStyle, color: '#27ae60' }}>
              {summary.successful}
            </div>
          </div>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Partial</div>
            <div style={{ ...summaryValueStyle, color: '#f39c12' }}>
              {summary.partial}
            </div>
          </div>
          <div style={summaryItemStyle}>
            <div style={summaryLabelStyle}>Failed</div>
            <div style={{ ...summaryValueStyle, color: '#e74c3c' }}>
              {summary.failed}
            </div>
          </div>
        </div>
      )}

      {/* Filter */}
      {!fixedType && (
        <div style={{ marginBottom: '15px' }}>
          <label style={{ marginRight: '10px', fontWeight: '600' }}>
            Filter by Type:
          </label>
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #bdc3c7',
              fontSize: '13px',
            }}
          >
            <option value="">All Imports</option>
            <option value="students">Students</option>
            <option value="exams">Exams</option>
            <option value="marks">Marks</option>
          </select>
        </div>
      )}

      {/* Import Logs Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Import Type</th>
              <th style={thStyle}>Date/Time</th>
              <th style={thStyle}>Imported By</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Success</th>
              <th style={thStyle}>Failed</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ ...tdStyle, textAlign: 'center', color: '#7f8c8d' }}>
                  {loading ? '⏳ Loading...' : 'No import logs found'}
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td style={tdStyle}>
                    <span
                      style={{
                        backgroundColor: '#ecf0f1',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {log.importType}
                    </span>
                  </td>
                  <td style={tdStyle}>{formatDate(log.createdAt)}</td>
                  <td style={tdStyle}>{log.importedByEmail}</td>
                  <td style={tdStyle}>
                    <strong>{log.totalRecords}</strong>
                  </td>
                  <td style={{ ...tdStyle, color: '#27ae60', fontWeight: '600' }}>
                    {log.successCount}
                  </td>
                  <td style={{ ...tdStyle, color: '#e74c3c', fontWeight: '600' }}>
                    {log.failedCount}
                  </td>
                  <td style={tdStyle}>
                    <span style={statusBadgeStyle(log.status)}>
                      {log.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => setSelectedLog(log)}
                      style={buttonStyle}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div style={modalOverlayStyle}>
          <div style={modalStyle}>
            <button
              onClick={() => setSelectedLog(null)}
              style={closeButtonStyle}
            >
              ✕ Close
            </button>

            <h3 style={{ marginBottom: '15px', marginTop: 0 }}>
              📋 Import Details - {selectedLog.importType}
            </h3>

            <div style={{ marginBottom: '20px' }}>
              <p>
                <strong>Date:</strong> {formatDate(selectedLog.createdAt)}
              </p>
              <p>
                <strong>Imported By:</strong> {selectedLog.importedByEmail}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span style={statusBadgeStyle(selectedLog.status)}>
                  {selectedLog.status.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Total Records:</strong> {selectedLog.totalRecords}
              </p>
              <p>
                <strong>Successful:</strong>{' '}
                <span style={{ color: '#27ae60', fontWeight: '600' }}>
                  {selectedLog.successCount}
                </span>
              </p>
              <p>
                <strong>Failed:</strong>{' '}
                <span style={{ color: '#e74c3c', fontWeight: '600' }}>
                  {selectedLog.failedCount}
                </span>
              </p>
            </div>

            {selectedLog.errorSummary && selectedLog.errorSummary.length > 0 && (
              <div>
                <h4 style={{ marginBottom: '10px', color: '#e74c3c' }}>
                  ⚠ Errors:
                </h4>
                <ul
                  style={{
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    padding: '12px',
                    borderRadius: '4px',
                    color: '#721c24',
                    fontSize: '12px',
                  }}
                >
                  {selectedLog.errorSummary.map((error, idx) => (
                    <li key={idx} style={{ marginBottom: '5px' }}>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportHistory;
