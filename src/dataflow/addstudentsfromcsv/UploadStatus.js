import React from 'react';

const UploadStatus = ({ status }) => {
  const getStatusStyle = () => {
    const baseStyle = {
      padding: '12px',
      borderRadius: '4px',
      marginTop: '15px',
      marginBottom: '15px',
    };

    switch (status.type) {
      case 'success':
        return {
          ...baseStyle,
          backgroundColor: '#d4edda',
          border: '1px solid #28a745',
          color: '#155724',
        };
      case 'error':
        return {
          ...baseStyle,
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          color: '#721c24',
        };
      case 'warning':
        return {
          ...baseStyle,
          backgroundColor: '#fff3cd',
          border: '1px solid #ffeaa7',
          color: '#856404',
        };
      case 'info':
        return {
          ...baseStyle,
          backgroundColor: '#d1ecf1',
          border: '1px solid #bee5eb',
          color: '#0c5460',
        };
      default:
        return baseStyle;
    }
  };

  const messageIconStyle = {
    fontSize: '16px',
    marginRight: '8px',
  };

  const detailsStyle = {
    marginTop: '10px',
    paddingLeft: '10px',
    maxHeight: '200px',
    overflowY: 'auto',
    fontSize: '13px',
    lineHeight: '1.5',
  };

  const detailItemStyle = {
    padding: '4px 0',
    borderLeft: '2px solid currentColor',
    paddingLeft: '8px',
    margin: '4px 0',
  };

  const getIcon = () => {
    switch (status.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ⓘ';
      default:
        return '';
    }
  };

  return (
    <div style={getStatusStyle()}>
      <div>
        <span style={messageIconStyle}>{getIcon()}</span>
        <strong>{status.message}</strong>
      </div>
      {status.details && status.details.length > 0 && (
        <div style={detailsStyle}>
          {status.details.map((detail, index) => (
            <div key={index} style={detailItemStyle}>
              • {detail}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadStatus;
