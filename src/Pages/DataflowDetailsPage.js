/**
 * Dataflow Details Page
 *
 * Shows guidelines and the active dataflow component for a selected dataflow.
 */

import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CSVUploader } from '../dataflow/addstudentsfromcsv';
import ImportHistory from '../dataflow/ImportHistory';

const DataflowDetailsPage = ({ apiBase, authHeaders, onAddStudent }) => {
  const { dataflowId } = useParams();
  const navigate = useNavigate();

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
    width: '240px',
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
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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

  const statusBadgeStyle = (status) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '700',
    color: status === 'active' ? '#166534' : '#92400e',
    backgroundColor: status === 'active' ? '#dcfce7' : '#fef3c7',
  });

  const featureInfoStyle = {
    backgroundColor: '#ecf0f1',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    borderLeft: '4px solid #3498db',
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

  const features = {
    'bulk-students': {
      title: '📤 Bulk Import Students',
      description: 'Efficiently import multiple students at once using CSV files. The system automatically generates unique roll numbers and validates all data.',
      status: 'active',
      icon: '📤',
      historyType: 'students',
      details: [
        'Supports CSV file format',
        'Auto-generates unique roll numbers by class',
        'Validates all required student information',
        'Shows real-time validation errors',
        'Preview before import',
        'Creates audit log for tracking',
      ],
      format: [
        { field: 'name', required: true, example: 'John Doe' },
        { field: 'studentClass', required: true, example: '10' },
        { field: 'section', required: true, example: 'A' },
        { field: 'age', required: false, example: '15' },
        { field: 'fatherName', required: false, example: 'Robert Doe' },
        { field: 'motherName', required: false, example: 'Jane Doe' },
        { field: 'fatherOccupation', required: false, example: 'Engineer' },
        { field: 'fatherIncome', required: false, example: '50000' },
        { field: 'addressLine1', required: false, example: '123 Main St' },
        { field: 'addressLine2', required: false, example: 'Apt 4B' },
        { field: 'city', required: false, example: 'New York' },
        { field: 'state', required: false, example: 'NY' },
        { field: 'postalCode', required: false, example: '10001' },
        { field: 'country', required: false, example: 'United States' },
      ],
      component: (
        <CSVUploader
          apiBase={apiBase}
          authHeaders={authHeaders}
          onUploadSuccess={onAddStudent}
        />
      ),
    },
    'import-history': {
      title: '📊 Import History & Tracking',
      description: 'View all import operations with detailed audit trails. Track who imported what and when, with complete error logs.',
      status: 'active',
      icon: '📊',
      details: [
        'Complete audit trail of all imports',
        'Filter by import type',
        'View per-user import history',
        'Error breakdown for each import',
        'Summary statistics',
        'Timestamp and metadata tracking',
      ],
      component: (
        <ImportHistory apiBase={apiBase} authHeaders={authHeaders} />
      ),
    },
    'bulk-exams': {
      title: '📚 Bulk Import Exams (Coming Soon)',
      description: 'Import multiple exams with subjects and details at once.',
      status: 'coming-soon',
      icon: '📚',
      historyType: 'exams',
      details: [
        'Planned for future release',
        'Will support exam structure with subjects',
        'Auto-generate exam IDs',
        'Batch validation',
      ],
      component: (
        <div style={featureInfoStyle}>
          <strong>🔄 Coming Soon</strong>
          <p>This feature is currently being developed. Check back soon!</p>
        </div>
      ),
    },
    'bulk-marks': {
      title: '📈 Bulk Import Marks (Coming Soon)',
      description: 'Import student marks for exams in bulk using CSV format.',
      status: 'coming-soon',
      icon: '📈',
      historyType: 'marks',
      details: [
        'Planned for future release',
        'Support multiple subjects per exam',
        'Automatic validation against existing exams',
        'Error reporting for invalid records',
      ],
      component: (
        <div style={featureInfoStyle}>
          <strong>🔄 Coming Soon</strong>
          <p>This feature is currently being developed. Check back soon!</p>
        </div>
      ),
    },
  };

  const navItems = ['import-history'];

  const feature = features[dataflowId];

  if (!feature) {
    return (
      <div style={pageStyle}>
        <div style={cardStyle}>
          <div style={headerStyle}>
            <div>
              <div style={titleStyle}>Dataflow not found</div>
              <div style={descriptionStyle}>The selected dataflow does not exist.</div>
            </div>
            <button type="button" style={backButtonStyle} onClick={() => navigate('/dataflow')}>
              Back to Dataflows
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <div style={layoutStyle}>
        <aside style={sidebarStyle}>
          <div style={sidebarTitleStyle}>History</div>
          {navItems.map((key) => (
            <div
              key={key}
              style={navItemStyle(key === dataflowId)}
              onClick={() => navigate(`/dataflow/${key}`)}
            >
              <span>{features[key].icon}</span>
              <span>{features[key].title.replace(/^\S+\s*/, '')}</span>
            </div>
          ))}
        </aside>

        <main style={contentStyle}>
          <div style={headerStyle}>
            <div>
              <div style={titleStyle}>{feature.title}</div>
              <div style={statusBadgeStyle(feature.status)}>
                {feature.status === 'active' ? 'Activated' : 'Coming Soon'}
              </div>
            </div>
            <button type="button" style={backButtonStyle} onClick={() => navigate('/dataflow')}>
              Back to Dataflows
            </button>
          </div>

          <div style={{ ...cardStyle, marginBottom: '20px' }}>
            <div style={descriptionStyle}>{feature.description}</div>
          </div>

          {feature.details && (
            <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: feature.format ? '1fr 1fr' : '1fr', gap: '20px' }}>
              <div style={cardStyle}>
                <h3 style={{ color: '#1e3c72', marginBottom: '12px' }}>✨ Features</h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {feature.details.map((detail, idx) => (
                    <li
                      key={idx}
                      style={{
                        padding: '8px 0',
                        borderBottom: '1px solid #e0e0e0',
                        fontSize: '13px',
                        color: '#555',
                      }}
                    >
                      ✓ {detail}
                    </li>
                  ))}
                </ul>
              </div>

              {feature.format && (
                <div style={cardStyle}>
                  <h3 style={{ color: '#1e3c72', marginBottom: '12px' }}>📋 CSV Format</h3>
                  <div
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      overflow: 'hidden',
                    }}
                  >
                    <table
                      style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        fontSize: '12px',
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                          <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>Field</th>
                          <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>Required</th>
                          <th style={{ padding: '8px', textAlign: 'left', fontWeight: '600' }}>Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        {feature.format.map((row, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                            <td style={{ padding: '8px' }}>
                              <strong>{row.field}</strong>
                            </td>
                            <td style={{ padding: '8px' }}>
                              <span
                                style={{
                                  display: 'inline-block',
                                  padding: '2px 6px',
                                  borderRadius: '3px',
                                  fontSize: '11px',
                                  backgroundColor: row.required ? '#ffe0e0' : '#e0f0e0',
                                  color: row.required ? '#c00' : '#080',
                                }}
                              >
                                {row.required ? 'Required' : 'Optional'}
                              </span>
                            </td>
                            <td style={{ padding: '8px', color: '#666', fontSize: '12px' }}>
                              {row.example}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={cardStyle}>{feature.component}</div>
        </main>
      </div>
    </div>
  );
};

export default DataflowDetailsPage;
