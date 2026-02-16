# Student Management System - Code Documentation

This guide provides detailed comments and explanations for all code files in the project.

## Server-Side  (server/index.js)

### Main Components

The server file has been fully commented with:
- **Authentication system**: JWT-based login, password management
- **User management**: Role-based access control (admin, principal, lecturer)
- **Student CRUD operations**: Create, read, update, delete students with auto-generated roll numbers
- **Exam management**: Create exams, manage marks, track student performance
- **Notifications**: System-wide announcements with calendar integration
- **User request workflow**: Principal approval system for new user creation

### Key Features
- MongoDB integration with Mongoose
- Bcrypt password hashing
- JWT token authentication
- Role-based middleware protection
- Auto-generated student roll numbers (format: ClassSection#)

## Client-Side

### src/index.js
Entry point that renders the React app with StrictMode and web vitals monitoring.

### src/App.js - Main Application Component

**Purpose**: Root component managing routing, state, and authentication.

**Key Features**:
- React Router for navigation
- Global state for students and exams
- Authentication with localStorage persistence
- Protected routes with role-based access
- Excel export functionality using XLSX library

**State Management**:
- `students`: Array of all student records
- `exams`: Array of exam data with marks
- `auth`: User authentication token and profile

**Main Functions**:
- `handleLogin`: Saves JWT token and user data
- `handleLogout`: Clears authentication
- `refreshStudents`: Fetches updated student list from API
- `addStudent`: Creates new student record
- `deleteStudent`: Removes student from database
- `updateStudent`: Updates student information
- `updateExamMarks`: Saves exam marks for students
- `handleExportExcel`: Exports student data to Excel file

### src/Components/Navigation.js - Navigation Component

**Purpose**: Fixed top navigation bar with search, user profile, and menus.

**Features**:
- Real-time student search with autocomplete suggestions
- Profile dropdown with account management
- Responsive design with gradient styling
- Role-based menu items (admin gets extra options)

**Key Functions**:
- `handleSearch`: Navigates to search results page
- Search suggestions filter students by name as user types

### src/Components/StudentForm.js - Student Form Component

**Purpose**: Form for adding new students with validation.

**Features**:
- Multi-section form with personal, family, and address information
- Real-time validation with error messages
- Styled inputs with hover/focus effects
- Auto-generates roll number on backend

**Validation Rules**:
- Name, age, class, father name, mother name are required
- Age must be between 1-100
- All errors displayed inline below fields

### src/Components/StudentList.js - Student List Component

**Purpose**: Displays all students in a filterable, searchable table.

**Features**:
- Search by name functionality
- Filter by class dropdown
- Bulk select and delete operations
- Row hover effects
- View and delete buttons for each student

**Key Functions**:
- `handleSelectAll`: Toggles all checkboxes
- `handleSelectStudent`: Toggle individual student selection
- `handleBulkDelete`: Deletes multiple selected students
- Filtering combines search term and class filter

### src/Pages/HomePage.js - Home/Dashboard Page

**Purpose**: Main dashboard with calendar, notifications, and quick links.

**Features**:
- Interactive calendar showing notification dates
- Color-coded notification types (urgent=red, holiday=orange, event=purple, general=blue)
- Quick action cards for navigation
- Feature list showcase

**Calendar Features**:
- Displays notifications on specific dates
- Highlights today's date
- Month navigation controls
- Click to view notifications for specific date

### src/Pages/LoginPage.js - Login Page

**Purpose**: User authentication interface with split-screen design.

**Features**:
- Left panel: School background image
- Right panel: Login form
- Email/password authentication
- Loading state during login
- Error message display

**Flow**:
1. User enters credentials
2. Sends POST to /auth/login
3. On success, stores token and redirects to home
4. On failure, displays error message

### src/Pages/AddStudentPage.js - Add Student Page

**Purpose**: Wrapper page for StudentForm component.

Simply renders the StudentForm with centered layout and title.

### src/Pages/ViewStudentsPage.js - View Students Page

**Purpose**: Main student records page with export functionality.

**Features**:
- Print button (triggers browser print dialog)
- Export to Excel button (with class filter modal)
- Renders StudentList component
- Supports filtering by class before export

### src/Pages/StudentProfilePage.js - Student Profile Page

**Purpose**: Detailed individual student view with edit capability and exam reports.

**Features**:
- Left sidebar: Student photo and basic info
- Tabbed interface: Profile, Exam Results
- Edit mode for updating student information  
- Photo upload functionality
- PDF exam report generation with charts (line, bar, pie)
- Subject-wise marks display
- Progress tracking across all exams

**Key Functions**:
- `handleSaveEdit`: Updates student data via API
- `handlePhotoChange`: Converts image to base64
- `buildExamSummaries`: Calculates totals and percentages
- `handleDownloadExamReport`: Generates PDF with charts using jsPDF and Chart.js

###  src/Pages/ExamsPage.js - Exams Management Page

**Purpose**: Interface for entering and managing exam marks.

**Features**:
- Grid view of all exams
- Select exam to enter marks
- Table with all students and subjects
- Auto-calculates totals
- Pass/Fail indicator (35% passing threshold)
- Different max marks: 25 for unit tests, 100 for assessments
- Color-coded failed subjects in red

**Grading Logic**:
- Student must pass ALL subjects to get "P" grade
- Failing any subject results in "F" grade

### src/Pages/AccountPage.js - Account Management Page

**Purpose**: User profile, settings, and admin functions.

**Features**:
- Sidebar navigation with tabs
- Personal information display
- Change password functionality
- Update profile (name, personal email, phone)
- User request management (principal only)
- Notification management (admin/principal only)

**Tabs**:
1. **Personal Info**: View/edit user profile
2. **Change Password**: Secure password update
3. **Requests** (Principal only): Approve/reject user creation requests
4. **Notifications**: Create, edit, delete notifications with calendar dates

### src/Pages/AddUserPage.js - Add User Page

**Purpose**: Create new user accounts (requires principal approval).

**Features**:
- Form for user details: name, email, password, role
- Role selection: lecturer, principal, admin
- Principal creation requires OTP verification
- All requests go to principal for approval

**Flow**:
1. Admin fills user form
2. If principal role: OTP sent to admin's phone
3. Admin verifies OTP
4. Request created in pending state
5. Principal reviews and approves/rejects

### src/Pages/ChangePasswordPage.js - Change Password Page

**Purpose**: Standalone password change interface.

**Features**:
- Current password verification
- New password with confirmation
- Minimum 6 characters validation
- Match validation for new password fields
- Success/error message display

### src/Pages/SearchResultsPage.js - Search Results Page

**Purpose**: Displays filtered student search results.

**Features**:
- Gets query from URL parameters
- Searches across: name, class, section, roll number
- Shows result count
- Displays "no results" message if empty
- Reuses StudentList component for results display

### src/Pages/NotificationsPage.js - Notifications Page

**Purpose**: Public-facing notifications display and management.

**Features**:
- List all active notifications sorted by date
- Create/Edit/Delete notifications (admin/principal only)
- Type-based color coding (urgent, holiday, event, general)
- Optional attachments with URLs
- Calendar date assignment for events/holidays
- Rich metadata: creator name, role, timestamp

**Notification Types**:
- **General** (blue): Regular announcements
- **Holiday** (green): Holiday notifications
- **Event** (orange): Special events
- **Urgent** (red): Important/urgent notices

### CSS Files

#### src/index.css
**Purpose**: Global styles and print media queries.

**Features**:
- Font stack with Segoe UI
- Print styles that hide buttons and clean layout
- Print optimized table formatting
- A4 page margin settings

#### src/App.css
**Purpose**: Basic App component styles and animation.

**Features**:
- Centered layout styles
- Logo spin animation
- React default header styling

## Database Schema (MongoDB)

### Student Collection
- name, age, studentClass, section, rollNumber (auto-generated)
- family info: fatherName, motherName, occupation, income
- address: addressLine1, addressLine2, city, state, postalCode, country
- photo: base64 string or URL

### Exam Collection
- examId: Unique number
- name: Exam name
- subjects: Array of subject names
- marks: Object with structure `{ studentId: { subject: marks } }`

### User Collection
- name, email (unique), passwordHash
- role: 'admin' | 'principal' | 'lecturer'
- personalEmail, phoneNumber (optional)

### UserRequest Collection
- User details from request
- requestedBy: Reference to admin user
- status: 'pending' | 'approved' | 'rejected'
- createdAt: Timestamp

### Notification Collection
- title, message, type
- notificationDate: Optional date for calendar
- attachmentUrl, attachmentName: Optional files
- createdBy, createdByName, createdByRole
- isActive: Boolean for soft delete

## API Endpoints

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user
- `POST /auth/change-password` - Change password
- `PUT /auth/profile` - Update profile
- `POST /auth/request-otp` - Request OTP for principal creation

### Students
- `GET /students` - Get all students
- `GET /students/:id` - Get student by ID
- `POST /students` - Create student (auto-generates roll number)
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

### Exams
- `GET /exams` - Get all exams
- `POST /exams` - Create exam
- `PUT /exams/:examId/marks` - Update exam marks

### Users
- `POST /users` - Create user request (admin only)
- `GET /user-requests` - Get pending requests (principal only)
- `POST /user-requests/:id/approve` - Approve request (principal only)
- `POST /user-requests/:id/reject` - Reject request (principal only)

### Notifications
- `GET /notifications` - Get all active notifications
- `POST /notifications` - Create notification (admin/principal)
- `PUT /notifications/:id` - Update notification (admin/principal)
- `DELETE /notifications/:id` - Soft delete notification (admin/principal)

## Security Features

- **JWT Authentication**: 12-hour token expiry
- **Password Hashing**: Bcrypt with salt rounds
- **Role-Based Access**: Middleware checks user roles
- **Protected Routes**: Frontend route guards using RequireAuth
- **Input Validation**: Server-side validation on all endpoints
- **OTP Verification**: For sensitive operations like principal creation

## Key Technologies

- **Frontend**: React 18, React Router, XLSX.js, jsPDF, Chart.js
- **Backend**: Express.js, MongoDB, Mongoose
- **Authentication**: JWT, Bcrypt
- **Styling**: Inline React styles with gradient themes

## Default Credentials

- **Email**: admin@school.com
- **Password**: Admin123
- **Role**: Admin

---

For more information, see individual file comments or consult the development team.
