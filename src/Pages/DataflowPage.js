/**
 * Dataflow Page Component
 * 
 * Central hub for all data import and export operations.
 * Features a modular design with sidebar navigation and content area.
 * Left: Navigation menu for different dataflow features
 * Right: Feature description and implementation component
 */

import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DataflowPage = ({ apiBase, authHeaders }) => {
  const [dataflowSearch, setDataflowSearch] = useState('');
  const [importStats, setImportStats] = useState({});
  const navigate = useNavigate();

  // Fetch import history on component mount
  useEffect(() => {
    if (authHeaders?.Authorization) {
      fetchImportStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authHeaders?.Authorization, apiBase]);

  const fetchImportStats = async () => {
    try {
      const response = await fetch(`${apiBase}/import-logs/latest/all`, {
        headers: { ...authHeaders }
      });
      if (response.ok) {
        const data = await response.json();
        const latestImports = data.latestImports || {};
        
        // Extract stats from latest imports
        const updatedStats = {};
        
        if (latestImports.students) {
          updatedStats.students = {
            lastCompleted: formatDate(latestImports.students.completedAt || latestImports.students.createdAt),
            lastStarted: formatDate(latestImports.students.createdAt),
            totalErrors: latestImports.students.failedCount || 0,
          };
        }
        
        if (latestImports.exams) {
          updatedStats.exams = {
            lastCompleted: formatDate(latestImports.exams.completedAt || latestImports.exams.createdAt),
            lastStarted: formatDate(latestImports.exams.createdAt),
            totalErrors: latestImports.exams.failedCount || 0,
          };
        }
        
        if (latestImports.marks) {
          updatedStats.marks = {
            lastCompleted: formatDate(latestImports.marks.completedAt || latestImports.marks.createdAt),
            lastStarted: formatDate(latestImports.marks.createdAt),
            totalErrors: latestImports.marks.failedCount || 0,
          };
        }
        
        setImportStats(updatedStats);
      }
    } catch (error) {
      console.error('Error fetching import stats:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const displayHours = date.getHours() % 12 || 12;
    return `${month}/${day}/${year} ${String(displayHours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // Styling
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

  const navItemStyle = {
    padding: '10px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: '#475569',
    fontWeight: '600',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  };

  const contentShellStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    border: '1px solid #e0e0e0',
    overflow: 'hidden',
  };

  const headerBarStyle = {
    padding: '16px 20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
  };

  const headerTitleStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1e3c72',
  };

  const searchRowStyle = {
    padding: '14px 20px',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    flexWrap: 'wrap',
    backgroundColor: '#fdfefe',
  };

  const searchInputStyle = {
    width: '240px',
    padding: '8px 10px',
    border: '1px solid #cbd5e1',
    borderRadius: '4px',
    fontSize: '13px',
    backgroundColor: 'white',
  };

  const searchGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  };

  const searchFieldRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const searchLabelStyle = {
    fontSize: '12px',
    color: '#475569',
    fontWeight: '600',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  };

  const actionButtonStyle = (variant) => ({
    padding: '8px 12px',
    borderRadius: '4px',
    border: variant === 'primary' ? '1px solid #1e3c72' : '1px solid #cbd5e1',
    backgroundColor: variant === 'primary' ? '#1e3c72' : '#f8fafc',
    color: variant === 'primary' ? 'white' : '#334155',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
  });

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px',
  };

  const tableHeaderCellStyle = {
    textAlign: 'left',
    padding: '10px 12px',
    backgroundColor: '#eef6ff',
    color: '#1e3c72',
    fontWeight: '700',
    borderBottom: '1px solid #dbe4ee',
  };

  const tableCellStyle = {
    padding: '10px 12px',
    borderBottom: '1px solid #eef2f6',
    color: '#334155',
  };

  const rowStyle = {
    backgroundColor: 'white',
    cursor: 'pointer',
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

  const pagingStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    fontSize: '12px',
    color: '#475569',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#fafafa',
  };

  // Sidebar navigation items (not shown in main grid)
  const navItems = [
    {
      key: 'import-history',
      icon: '📋',
      label: 'Import History',
    },
  ];

  // Feature definitions (shown in main grid)
  const features = {
    'bulk-students': {
      title: '📤 Bulk Import Students',
      description: 'Efficiently import multiple students at once using CSV files. The system automatically generates unique roll numbers and validates all data.',
      status: 'active',
      icon: '📤',
      lastCompleted: importStats.students?.lastCompleted || '01/27/2026 03:39 AM',
      lastStarted: importStats.students?.lastStarted || '01/27/2026 03:38 AM',
      totalErrors: importStats.students?.totalErrors ?? 0,
    },
    'bulk-exams': {
      title: '📚 Bulk Import Exams (Coming Soon)',
      description: 'Import multiple exams with subjects and details at once.',
      status: 'coming-soon',
      icon: '📚',
      lastCompleted: importStats.exams?.lastCompleted || '-',
      lastStarted: importStats.exams?.lastStarted || '-',
      totalErrors: importStats.exams?.totalErrors ?? '-',
    },
    'bulk-marks': {
      title: '📈 Bulk Import Marks (Coming Soon)',
      description: 'Import student marks for exams in bulk using CSV format.',
      status: 'coming-soon',
      icon: '📈',
      lastCompleted: importStats.marks?.lastCompleted || '-',
      lastStarted: importStats.marks?.lastStarted || '-',
      totalErrors: importStats.marks?.totalErrors ?? '-',
    },
  };

  const filteredFeatures = useMemo(() => {
    const query = dataflowSearch.trim().toLowerCase();
    if (!query) {
      return Object.entries(features);
    }
    return Object.entries(features).filter(([_, f]) =>
      f.title.toLowerCase().includes(query) ||
      f.description.toLowerCase().includes(query)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataflowSearch, features]);

  return (
    <div style={pageStyle}>
      <div style={layoutStyle}>
        <aside style={sidebarStyle}>
          <div style={sidebarTitleStyle}>History</div>
          {navItems.map((item) => (
            <div
              key={item.key}
              style={navItemStyle}
              onClick={() => navigate(`/dataflow/${item.key}`)}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </aside>

        <div style={{ flex: 1 }}>
          <div style={contentShellStyle}>
            <div style={headerBarStyle}>
              <div style={headerTitleStyle}>Dataflows</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {`1 to ${filteredFeatures.length} of ${Object.keys(features).length} Rows`}
              </div>
            </div>

            <div style={searchRowStyle}>
              <div style={searchGroupStyle}>
                <label style={searchLabelStyle}>Find Dataflow</label>
                <div style={searchFieldRowStyle}>
                  <input
                    type="text"
                    placeholder="Find Dataflow"
                    value={dataflowSearch}
                    onChange={(e) => setDataflowSearch(e.target.value)}
                    style={searchInputStyle}
                  />
                  <button type="button" style={actionButtonStyle('primary')}>Search</button>
                </div>
              </div>
              <div style={actionButtonsStyle}>
                <button
                  type="button"
                  style={actionButtonStyle('secondary')}
                  onClick={() => {
                    setDataflowSearch('');
                  }}
                >
                  Clear
                </button>
                <button type="button" style={actionButtonStyle('secondary')}>Manage Search</button>
                <button type="button" style={actionButtonStyle('secondary')}>Save As...</button>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={tableHeaderCellStyle}>Name</th>
                    <th style={tableHeaderCellStyle}>Status</th>
                    <th style={tableHeaderCellStyle}>Last Successfully Completed</th>
                    <th style={tableHeaderCellStyle}>Last Started</th>
                    <th style={tableHeaderCellStyle}>Last Started Total Errors</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFeatures.length === 0 ? (
                    <tr>
                      <td style={tableCellStyle} colSpan={5}>No dataflows found</td>
                    </tr>
                  ) : (
                    filteredFeatures.map(([key, feature]) => {
                      const displayName = feature.title.replace(/^\S+\s*/, '');
                      return (
                        <tr
                          key={key}
                          style={rowStyle}
                          onClick={() => navigate(`/dataflow/${key}`)}
                        >
                          <td style={tableCellStyle}>{displayName}</td>
                          <td style={tableCellStyle}>
                            <span style={statusBadgeStyle(feature.status)}>
                              {feature.status === 'active' ? 'Activated' : 'Coming Soon'}
                            </span>
                          </td>
                          <td style={tableCellStyle}>{feature.lastCompleted}</td>
                          <td style={tableCellStyle}>{feature.lastStarted}</td>
                          <td style={tableCellStyle}>{feature.totalErrors}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div style={pagingStyle}>
              <div>Page Size: 25</div>
              <div>Page: 1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataflowPage;
