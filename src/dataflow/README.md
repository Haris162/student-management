# Dataflow Module - Upload Features & Tracking

This folder contains all upload, bulk import, and dataflow tracking features for the Student Management System.

## Structure

```
dataflow/
├── addstudentsfromcsv/          # CSV bulk import feature for students
│   ├── CSVUploader.js           # Main upload component with UI
│   ├── UploadStatus.js          # Status display (success/error/warning)
│   ├── csvParser.js             # CSV parsing and validation logic
│   └── index.js                 # Export file for easy importing
├── ImportHistory.js             # Import history tracking and viewing component
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

### ImportHistory/

**Purpose:** Track and display all import operations with detailed audit trails

**Features:**
- View all imports with pagination
- Filter by import type (students, exams, marks, etc.)
- Summary statistics (total, successful, partial, failed)
- Detailed view of each import with error breakdown
- User tracking (who performed the import)
- Timestamp tracking (when import occurred)

**Usage:**
```javascript
import ImportHistory from '../dataflow/ImportHistory';

<ImportHistory
  apiBase="http://localhost:5000"
  authHeaders={{ Authorization: 'Bearer token' }}
/>
```

**Data Tracked:**
- Import type and timestamp
- User who performed import (name, email)
- Total records, success count, failed count
- Individual record details
- Error reasons for failed records
- IP address and user agent (metadata)

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
  importLogId: "507f1f77bcf86cd799439011",  // Reference to ImportLog document
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

## Backend API Endpoints

### Import Operations
- **POST `/students/bulk-upload`** - Bulk import students from CSV
  - Body: `{ students: [{name, email, department, ...}] }`
  - Returns: Success count, failed count, and importLogId for tracking
  - Automatically saves import log with timestamp and user info

### Import History Retrieval
- **GET `/import-logs`** - Get all import logs (paginated)
  - Query params: `page` (default 1), `limit` (default 20), `type` (filter)
  - Returns: Array of import logs with pagination info

- **GET `/import-logs/:id`** - Get specific import log details
  - Returns: Full import log with all records and error details

- **GET `/import-logs/type/:importType`** - Get logs for specific import type
  - Query params: `page`, `limit`
  - Example: `/import-logs/type/students`
  - Returns: Filtered logs with pagination

- **GET `/import-logs/summary/count`** - Get import statistics
  - Returns: Summary counts (total, successful, partial, failed) and breakdown by type

## Data Structure: ImportLog

```javascript
{
  _id: ObjectId,
  importType: "students",              // Type of import
  totalRecords: 10,                     // Total records in import
  successCount: 9,                      // Successfully imported
  failedCount: 1,                       // Failed records
  status: "partial",                    // 'completed', 'partial', or 'failed'
  importedBy: ObjectId,                 // Reference to User
  importedByName: "Admin User",         // User name
  importedByEmail: "admin@school.com",  // User email
  successfulRecords: [                  // Array of successful imports
    {
      _id: ObjectId,
      name: "John Doe",
      email: "john@school.com",
      rollNumber: "CS001",
      department: "Computer Science"
    }
  ],
  failedRecords: [                     // Array of failures with reasons
    {
      index: 3,
      name: "Jane Smith",
      reason: "Email already exists"
    }
  ],
  errorSummary: [                      // Summary of all errors
    "Row 4: Jane Smith - Email already exists"
  ],
  createdAt: ISODate,                  // Import timestamp
  completedAt: ISODate,                // Completion timestamp
  metadata: {
    ipAddress: "192.168.1.1",          // User IP
    userAgent: "Mozilla/5.0...",       // Browser info
    source: "csv"                       // Import source
  }
}
```

## Future Enhancements

- [ ] Drag-and-drop file upload
- [ ] Excel (.xlsx) file support
- [ ] Real-time validation preview
- [ ] Duplicate handling options (skip/overwrite)
- [ ] Scheduled bulk imports from URLs
- [ ] Import history export/audit report
- [ ] Rollback capability for failed imports
- [ ] Template generation for other entities (exams, marks, etc.)
- [ ] Webhook notifications on import completion
- [ ] Import statistics dashboard
- [ ] Differential sync (only import changed records)
