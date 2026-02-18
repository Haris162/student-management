import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseCSV, validateAllStudents } from './csvParser';
import UploadStatus from './UploadStatus';

const CSVUploader = ({ apiBase, authHeaders, onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  const containerStyle = {
    padding: '20px',
    border: '2px dashed #3498db',
    borderRadius: '8px',
    backgroundColor: '#ecf0f1',
    marginBottom: '20px',
  };

  const fileInputStyle = {
    display: 'none',
  };

  const uploadAreaStyle = {
    padding: '30px',
    textAlign: 'center',
    cursor: 'pointer',
    borderRadius: '6px',
    backgroundColor: '#fff',
    border: '1px solid #bdc3c7',
    transition: 'all 0.3s',
  };

  const buttonStyle = {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '10px',
    marginTop: '10px',
  };

  const buttonDangerStyle = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
  };

  const previewTableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '15px',
    fontSize: '13px',
  };

  const thStyle = {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
    fontWeight: 'bold',
  };

  const tdStyle = {
    padding: '8px',
    borderBottom: '1px solid #bdc3c7',
  };

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a valid CSV file',
      });
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const { data, errors } = parseCSV(csvText);

        if (errors.length > 0) {
          setUploadStatus({
            type: 'error',
            message: 'CSV parsing errors:',
            details: errors,
          });
          setPreview(null);
          return;
        }

        // Validate students
        const { valid, invalid } = validateAllStudents(data);

        setPreview({
          valid,
          invalid,
          totalRows: data.length,
        });

        if (invalid.length > 0) {
          setUploadStatus({
            type: 'warning',
            message: `${valid.length} valid student(s), ${invalid.length} invalid. See details below.`,
            details: invalid.map(
              (item) =>
                `Row ${item.rowNumber} (${item.student.name}): ${item.errors.join('; ')}`
            ),
          });
        } else {
          setUploadStatus({
            type: 'success',
            message: `${valid.length} student(s) ready to import. Click "Upload" to complete.`,
          });
        }
      } catch (error) {
        setUploadStatus({
          type: 'error',
          message: 'Error reading CSV file: ' + error.message,
        });
        setPreview(null);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleUpload = async () => {
    if (!preview || preview.valid.length === 0) {
      setUploadStatus({
        type: 'error',
        message: 'No valid students to upload',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/students/bulk-upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          students: preview.valid,
          totalRows: preview.totalRows,
          fileName: file?.name || '',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus({
          type: 'success',
          message: `Successfully imported ${result.successCount} student(s)!`,
          details: result.details || [],
        });
        setFile(null);
        setPreview(null);
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }
        if (result.runId) {
          navigate(`/dataflow/runs/${result.runId}`);
        }
      } else {
        setUploadStatus({
          type: 'error',
          message: result.message || 'Upload failed',
          details: result.details || [],
        });
      }
    } catch (error) {
      setUploadStatus({
        type: 'error',
        message: 'Network error: ' + error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setUploadStatus(null);
  };

  return (
    <div style={containerStyle}>
      <h3 style={{ marginTop: 0 }}>📤 Bulk Import Students from CSV</h3>

      {!preview ? (
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            style={fileInputStyle}
            id="csv-file-input"
          />
          <label htmlFor="csv-file-input">
            <div style={uploadAreaStyle}>
              <p style={{ margin: '0 0 10px 0', fontSize: '16px' }}>
                📁 Click to select or drag CSV file here
              </p>
              <p style={{ margin: 0, fontSize: '12px', color: '#7f8c8d' }}>
                Required columns: name, studentClass, section (All others optional)
              </p>
            </div>
          </label>
          <div style={{ marginTop: '15px', textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#7f8c8d', marginBottom: '10px' }}>
              Need a template? Download the sample CSV file:
            </p>
            <a
              href="/sample-students.csv"
              download="sample-students.csv"
              style={{
                display: 'inline-block',
                backgroundColor: '#95a5a6',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                textDecoration: 'none',
                fontSize: '13px',
                transition: 'background-color 0.3s',
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
            >
              📥 Download Sample CSV
            </a>
          </div>
          {uploadStatus && <UploadStatus status={uploadStatus} />}
        </div>
      ) : (
        <div>
          <div style={{ marginBottom: '15px' }}>
            <strong>Selected File:</strong> {file.name}
          </div>

          {uploadStatus && <UploadStatus status={uploadStatus} />}

          {preview.valid.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <h4 style={{ color: '#27ae60' }}>
                ✓ Valid Students ({preview.valid.length})
              </h4>
              <table style={previewTableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Name</th>
                    <th style={thStyle}>Email</th>
                    <th style={thStyle}>Department</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.valid.slice(0, 5).map((student, idx) => (
                    <tr key={idx}>
                      <td style={tdStyle}>{student.name}</td>
                      <td style={tdStyle}>{student.email}</td>
                      <td style={tdStyle}>{student.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.valid.length > 5 && (
                <p style={{ color: '#7f8c8d', fontSize: '12px' }}>
                  ... and {preview.valid.length - 5} more
                </p>
              )}
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <button
              onClick={handleUpload}
              disabled={loading}
              style={{
                ...buttonStyle,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? '⏳ Uploading...' : '✓ Upload Students'}
            </button>
            <button
              onClick={handleReset}
              disabled={loading}
              style={{
                ...buttonDangerStyle,
                opacity: loading ? 0.6 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              ✕ Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
