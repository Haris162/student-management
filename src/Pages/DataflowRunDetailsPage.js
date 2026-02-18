/**
 * Dataflow Run Details Page
 *
 * Shows run metrics, messages, and errors for a specific dataflow run.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const DataflowRunDetailsPage = ({ apiBase, authHeaders }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('summary');

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '80px 24px 40px',
  };

  const layoutStyle = {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start',
  };

  const sidebarStyle = {
    width: '220px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0',
    padding: '16px',
    position: 'sticky',
    top: '80px',
    height: 'fit-content',
  };

  const sidebarTitleStyle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1e3c72',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.6px',
  };

  const navItemStyle = (isActive) => ({
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: isActive ? '#e8f1ff' : 'transparent',
    color: isActive ? '#1e3c72' : '#475569',
    fontWeight: isActive ? '700' : '600',
    fontSize: '12px',
    marginBottom: '6px',
  });

  const contentStyle = {
    flex: 1,
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  };

  const titleStyle = {
    fontSize: '26px',
    fontWeight: '700',
    color: '#1e3c72',
    marginBottom: '6px',
  };

  const descriptionStyle = {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0',
  };

  const backButtonStyle = {
    padding: '8px 12px',
    borderRadius: '4px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    color: '#334155',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  };

  const summaryGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '14px',
  };

  const summaryItemStyle = {
    padding: '14px',
    borderRadius: '6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
  };

  const summaryLabelStyle = {
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase',
  };

  const summaryValueStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e293b',
    marginTop: '6px',
  };

  useEffect(() => {
    const fetchRun = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBase}/dataflow-runs/${id}`, {
          headers: authHeaders,
        });
        if (!response.ok) {
          setRun(null);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setRun(data.run);
      } catch (error) {
        setRun(null);
      } finally {
        setLoading(false);
      }
    };

    fetchRun();
  }, [apiBase, authHeaders, id]);

  const formattedStart = useMemo(() => {
    if (!run?.runStartedAt) return '-';
    return new Date(run.runStartedAt).toLocaleString();
  }, [run]);

  const formattedEnd = useMemo(() => {
    if (!run?.runEndedAt) return '-';
    return new Date(run.runEndedAt).toLocaleString();
  }, [run]);

  const messages = run?.messages || [];
  const errors = run?.errors || [];

  return (
    <div style={pageStyle}>
      <div style={layoutStyle}>
        <aside style={sidebarStyle}>
          <div style={sidebarTitleStyle}>Run Details</div>
          <div style={navItemStyle(activeTab === 'summary')} onClick={() => setActiveTab('summary')}>
            Summary
          </div>
          <div style={navItemStyle(activeTab === 'messages')} onClick={() => setActiveTab('messages')}>
            Messages
          </div>
          <div style={navItemStyle(activeTab === 'errors')} onClick={() => setActiveTab('errors')}>
            Errors
          </div>
        </aside>

        <main style={contentStyle}>
          <div style={headerStyle}>
            <div>
              <div style={titleStyle}>{run?.dataflowName || 'Dataflow Run'}</div>
              <div style={descriptionStyle}>Run ID: {id}</div>
            </div>
            <button type="button" style={backButtonStyle} onClick={() => navigate('/dataflow')}>
              Back to Dataflows
            </button>
          </div>

          {loading && (
            <div style={cardStyle}>Loading run details...</div>
          )}

          {!loading && !run && (
            <div style={cardStyle}>Run not found.</div>
          )}

          {!loading && run && (
            <div style={cardStyle}>
              {activeTab === 'summary' && (
                <div style={summaryGridStyle}>
                  <div style={summaryItemStyle}>
                    <div style={summaryLabelStyle}>Run Start Time</div>
                    <div style={summaryValueStyle}>{formattedStart}</div>
                  </div>
                  <div style={summaryItemStyle}>
                    <div style={summaryLabelStyle}>Run End Time</div>
                    <div style={summaryValueStyle}>{formattedEnd}</div>
                  </div>
                  <div style={summaryItemStyle}>
                    <div style={summaryLabelStyle}>Total Lines Parsed</div>
                    <div style={summaryValueStyle}>{run.totalLinesParsed}</div>
                  </div>
                  <div style={summaryItemStyle}>
                    <div style={summaryLabelStyle}>Total Lines Imported</div>
                    <div style={summaryValueStyle}>{run.totalLinesImported}</div>
                  </div>
                  <div style={summaryItemStyle}>
                    <div style={summaryLabelStyle}>Total Lines Successful</div>
                    <div style={summaryValueStyle}>{run.totalLinesSuccessful}</div>
                  </div>
                  <div style={summaryItemStyle}>
                    <div style={summaryLabelStyle}>Total Errors</div>
                    <div style={summaryValueStyle}>{run.totalErrors}</div>
                  </div>
                </div>
              )}

              {activeTab === 'messages' && (
                <div>
                  {messages.length === 0 ? (
                    <div style={descriptionStyle}>No messages available.</div>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#334155' }}>
                      {messages.map((msg, index) => (
                        <li key={index} style={{ marginBottom: '8px', fontSize: '13px' }}>
                          {msg}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {activeTab === 'errors' && (
                <div>
                  {errors.length === 0 ? (
                    <div style={descriptionStyle}>All lines imported successfully.</div>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: '18px', color: '#b91c1c' }}>
                      {errors.map((err, index) => (
                        <li key={index} style={{ marginBottom: '8px', fontSize: '13px' }}>
                          Line {err.line}: {err.message}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DataflowRunDetailsPage;
