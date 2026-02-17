# Dataflow Module - Upload Features

This folder contains all upload and bulk import features for the Student Management System.

## Structure

```
dataflow/
├── addstudentsfromcsv/          # CSV bulk import feature for students
│   ├── CSVUploader.js           # Main upload component with UI
│   ├── UploadStatus.js          # Status display (success/error/warning)
│   ├── csvParser.js             # CSV parsing and validation logic
│   └── index.js                 # Export file for easy importing
└── README.md                    # This file
```

## Features

### addstudentsfromcsv/

**Purpose:** Bulk import students from CSV files

**Components:**
- **CSVUploader.js** - Main component handling file upload UI and orchestration
- **UploadStatus.js** - Reusable status display component for errors, warnings, and success messages
- **csvParser.js** - Core parsing and validation logic for CSV data

**Usage:**
```javascript
import { CSVUploader } from '../dataflow/addstudentsfromcsv';

<CSVUploader
  apiBase="http://localhost:5000"
  authHeaders={{ Authorization: 'Bearer token' }}
  onUploadSuccess={(result) => console.log(result)}
/>
```

## How to Add New Upload Features

1. **Create a new folder** under `dataflow/` with a descriptive name (e.g., `addexamsfromcsv/`)

2. **Create the component structure:**
   - `YourUploader.js` - Main upload component
   - `UploadStatus.js` - (reuse from addstudentsfromcsv if possible)
   - `yourParser.js` - Parsing logic for your data format
   - `index.js` - Export file

3. **Implement your uploader:**
   - Follow the same pattern as CSVUploader.js
   - Implement file selection and parsing
   - Show validation status to user
   - Call your backend endpoint on upload

4. **Add backend endpoint:**
   - Add POST endpoint like `/exams/bulk-upload` in `server/index.js`
   - Implement validation and error handling
   - Return detailed success/failure report

5. **Integrate into the UI:**
   - Add tab or page to use your new uploader
   - Pass required props (apiBase, authHeaders, etc.)
   - Handle success/failure callbacks

## CSV Format Requirements

### Students (addstudentsfromcsv/)

**Required Columns:**
- `name` - Student's full name
- `email` - Student's email address (must be unique)
- `department` - Department name

**Optional Columns:**
- `phone` - Phone number
- `address` - Address
- `dateOfBirth` - Date of birth (YYYY-MM-DD format)
- `semester` - Semester number (default: 1)

**Auto-Generated Fields:**
- `rollNumber` - System automatically generates unique roll numbers based on department abbreviation + counter (e.g., CS001, MATH002)

**Example:**
```csv
name,email,department,phone,address
John Doe,john@school.com,Computer Science,9876543210,123 Main St
Jane Smith,jane@school.com,Computer Science,9876543211,456 Oak Ave
```

## Error Handling

All upload features show:
- ✓ **Success** - Green status with count
- ⚠ **Warning** - Yellow status with details
- ✕ **Error** - Red status with issue descriptions

Users can see:
1. Parsing errors (format issues)
2. Validation errors (missing/invalid fields)
3. Duplicate detection (email, roll number already exists)
4. Row-by-row failure reasons

## Frontend Flow

1. User selects file → CSV is parsed
2. Validation runs → Error/Warning shown with details
3. Valid data preview displayed
4. User clicks "Upload" → API call made
5. Backend response shown with success/failure breakdown
6. Tab resets after 2 seconds on success

## Backend Response Format

```javascript
{
  message: "Successfully imported X of Y student(s)",
  successCount: 5,
  failedCount: 1,
  successful: [
    { _id, name, rollNumber, email, department }  // rollNumber is auto-generated
  ],
  failed: [
    { index, name, reason }  // reason explains why import failed
  ],
  details: [
    "Row 3: Jane Smith - Email already exists"
  ]
}
```

## Future Enhancements

- [ ] Drag-and-drop file upload
- [ ] Excel (.xlsx) file support
- [ ] Real-time validation preview
- [ ] Duplicate handling options (skip/overwrite)
- [ ] Scheduled bulk imports from URLs
- [ ] Import history and audit logs
- [ ] Template generation for other entities (exams, marks, etc.)
