/**
 * Dataflow Page Component
 * 
 * Central hub for all data import and export operations.
 * Features a modular design with sidebar navigation and content area.
 * Left: Navigation menu for different dataflow features
 * Right: Feature description and implementation component
 */

import React, { useState } from 'react';
import { CSVUploader } from '../dataflow/addstudentsfromcsv';
import ImportHistory from '../dataflow/ImportHistory';

const DataflowPage = ({ apiBase, authHeaders, onAddStudent }) => {
  const [activeFeature, setActiveFeature] = useState('bulk-students');
  const [searchTerm, setSearchTerm] = useState('');

  // Styling
  const containerStyle = {
    display: 'flex',
    height: 'calc(100vh - 60px)',
    backgroundColor: '#f8f9fa',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const sidebarStyle = {
    width: '280px',
    backgroundColor: '#1e3c72',
    padding: '20px',
    overflowY: 'hidden',
    boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
    flexShrink: 0,
    height: '100%',
  };

  const sidebarTitleStyle = {
    color: 'white',
    fontSize: '16px',
    fontWeight: '700',
    marginBottom: '20px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  const navItemStyle = (isActive) => ({
    padding: '12px 16px',
    marginBottom: '8px',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: isActive ? '#3498db' : 'transparent',
    color: isActive ? 'white' : '#bdc3c7',
    fontWeight: isActive ? '600' : '500',
    border: isActive ? '2px solid #2980b9' : '2px solid transparent',
    transition: 'all 0.3s',
    fontSize: '13px',
  });

  const contentStyle = {
    flex: 1,
    padding: '30px',
    overflowY: 'auto',
    overflowX: 'hidden',
  };

  const searchBoxStyle = {
    width: '100%',
    padding: '10px 12px',
    marginBottom: '15px',
    border: '1px solid #3498db',
    borderRadius: '6px',
    backgroundColor: '#ecf0f1',
    color: '#1e3c72',
    fontSize: '13px',
    fontWeight: '500',
  };

  const featureItemStyle = (isActive) => ({
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: isActive ? '#3498db' : 'rgba(255, 255, 255, 0.1)',
    border: isActive ? '2px solid #2980b9' : '1px solid rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: '12px',
    fontWeight: isActive ? '600' : '500',
    transition: 'all 0.3s',
  });

  const headerStyle = {
    marginBottom: '25px',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1e3c72',
    marginBottom: '10px',
  };

  const descriptionStyle = {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  };

  const featureCardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '25px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0',
  };

  const badgeStyle = {
    display: 'inline-block',
    backgroundColor: '#27ae60',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '15px',
  };

  const statusBadgeStyle = (status) => ({
    display: 'inline-block',
    backgroundColor: status === 'active' ? '#27ae60' : '#95a5a6',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '15px',
  });

  const featureInfoStyle = {
    backgroundColor: '#ecf0f1',
    padding: '15px',
    borderRadius: '6px',
    marginBottom: '20px',
    borderLeft: '4px solid #3498db',
  };

  // Feature definitions
  const features = {
    'bulk-students': {
      title: '📤 Bulk Import Students',
      description: 'Efficiently import multiple students at once using CSV files. The system automatically generates unique roll numbers and validates all data.',
      status: 'active',
      icon: '📤',
      details: [
        'Supports CSV file format',
        'Auto-generates unique roll numbers by department',
        'Validates email uniqueness',
        'Shows real-time validation errors',
        'Preview before import',
        'Creates audit log for tracking',
      ],
      format: [
        { field: 'name', required: true, example: 'John Doe' },
        { field: 'email', required: true, example: 'john@school.com' },
        { field: 'department', required: true, example: 'Computer Science' },
        { field: 'phone', required: false, example: '9876543210' },
        { field: 'address', required: false, example: '123 Main St' },
        { field: 'dateOfBirth', required: false, example: '2008-05-15' },
        { field: 'semester', required: false, example: '1' },
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

  const activeFeatureData = features[activeFeature];

  // Filter features based on search term
  const filteredFeatures = Object.entries(features).filter(([_, f]) =>
    f.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      <style>{`
        .dataflow-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .dataflow-scrollbar::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        .dataflow-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .dataflow-scrollbar::-webkit-scrollbar-thumb {
          background: transparent;
        }
      `}</style>
      {/* Left Sidebar - Navigation */}
      <div style={sidebarStyle}>
        <div style={sidebarTitleStyle}>DATAFLOWS</div>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search dataflows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchBoxStyle}
        />

        {/* Feature List */}
        <div 
          className="dataflow-scrollbar"
          style={{ 
            overflowY: 'scroll',
            maxHeight: 'calc(100vh - 220px)',
            paddingRight: '17px',
            marginRight: '-17px'
          }}>
          {filteredFeatures.length === 0 ? (
            <div
              style={{
                color: '#bdc3c7',
                textAlign: 'center',
                padding: '20px 10px',
                fontSize: '12px',
              }}
            >
              No dataflows found
            </div>
          ) : (
            filteredFeatures.map(([key, feature]) => (
              <div
                key={key}
                style={featureItemStyle(activeFeature === key)}
                onClick={() => setActiveFeature(key)}
                title={feature.title}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{feature.icon}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600' }}>
                      {feature.title.split(' ').slice(1).join(' ')}
                    </div>
                    <div style={{ fontSize: '10px', opacity: 0.8 }}>
                      {feature.status === 'active' ? '✓ Active' : '🔄 Coming Soon'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Content Area */}
      <div style={contentStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={titleStyle}>{activeFeatureData.title}</div>
          <div style={statusBadgeStyle(activeFeatureData.status)}>
            {activeFeatureData.status === 'active' ? '✓ ACTIVE' : '🔄 COMING SOON'}
          </div>
          <div style={descriptionStyle}>{activeFeatureData.description}</div>
        </div>

        {/* Feature Details */}
        {activeFeatureData.status === 'active' && (
          <div style={{ marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {/* Details Panel */}
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#1e3c72', marginBottom: '12px' }}>✨ Features</h3>
                <ul
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                  }}
                >
                  {activeFeatureData.details.map((detail, idx) => (
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
            </div>

            {/* Format Panel */}
            {activeFeatureData.format && (
              <div>
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
                      {activeFeatureData.format.map((row, idx) => (
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

        {/* Component/Content */}
        <div style={featureCardStyle}>{activeFeatureData.component}</div>
      </div>
    </div>
  );
};

export default DataflowPage;
