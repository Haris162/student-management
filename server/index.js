/**
 * Student Management System - Backend Server
 * 
 * This is the main Express server file that handles all backend operations for the Student Management System.
 * It provides RESTful API endpoints for:
 * - User authentication and authorization
 * - Student CRUD operations
 * - Exam management and marks entry
 * - Notifications management
 * - User management with role-based access control
 */

// Import required dependencies
const express = require('express'); // Web framework for Node.js
const mongoose = require('mongoose'); // MongoDB object modeling tool
const cors = require('cors'); // Enable Cross-Origin Resource Sharing
const bcrypt = require('bcryptjs'); // Password hashing library
const jwt = require('jsonwebtoken'); // JSON Web Token for authentication

// Initialize Express application
const app = express();

// Middleware configuration
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all routes

/**
 * Async error handler wrapper
 * Wraps async route handlers to catch errors and pass them to Express error handler
 * @param {Function} fn - Async route handler function
 * @returns {Function} Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Connect to MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/student-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MongoDB connection event handlers
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  // Seed default admin user when database connection is established
  ensureAdminSeed().catch((err) => {
    console.error('Failed to seed admin:', err);
  });
});

/**
 * Student Schema Definition
 * Defines the structure for student documents in MongoDB
 * Contains personal information, contact details, and academic information
 */
const studentSchema = new mongoose.Schema({
  name: String, // Student's full name
  age: Number, // Student's age
  studentClass: String, // Class/grade (e.g., "10", "12")
  section: String, // Section within class (e.g., "A", "B")
  rollNumber: String, // Auto-generated roll number (e.g., "10A1", "10A2")
  photo: String, // Base64 encoded photo or URL
  fatherName: String, // Father's full name
  motherName: String, // Mother's full name
  fatherOccupation: String, // Father's occupation
  fatherIncome: String, // Father's income range
  addressLine1: String, // Primary address line
  addressLine2: String, // Secondary address line
  city: String, // City name
  state: String, // State/province name
  postalCode: String, // Postal/ZIP code
  country: String, // Country name
});

const Student = mongoose.model('Student', studentSchema);

/**
 * Exam Schema Definition
 * Stores exam information and marks for all students
 */
const examSchema = new mongoose.Schema({
  examId: Number, // Unique identifier for the exam
  name: String, // Exam name (e.g., "Unit Test-1", "Final Assessment")
  subjects: [String], // Array of subject names
  marks: { type: mongoose.Schema.Types.Mixed, default: {} }, // Marks object: { studentId: { subject: marks } }
});

const Exam = mongoose.model('Exam', examSchema);

/**
 * User Schema Definition
 * Manages user accounts for system access with role-based permissions
 */
const userSchema = new mongoose.Schema({
  name: String, // User's full name
  email: { type: String, unique: true, index: true }, // Login email (unique)
  passwordHash: String, // Bcrypt hashed password
  role: { type: String, default: 'admin' }, // User role: admin, principal, lecturer
  personalEmail: String, // Optional personal email
  phoneNumber: String, // Optional phone number
});

const User = mongoose.model('User', userSchema);

/**
 * User Request Schema Definition
 * Stores pending user creation requests that require principal approval
 */
const userRequestSchema = new mongoose.Schema({
  name: String, // Requested user's name
  email: String, // Requested user's email
  password: String, // Plain password (temporarily stored until approval)
  role: String, // Requested role
  personalEmail: String, // Personal email
  phoneNumber: String, // Phone number
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Admin who created the request
  requestedByName: String, // Name of requesting admin
  requestedByEmail: String, // Email of requesting admin
  status: { type: String, default: 'pending' }, // Status: pending, approved, rejected
  createdAt: { type: Date, default: Date.now }, // Request creation timestamp
});

const UserRequest = mongoose.model('UserRequest', userRequestSchema);

/**
 * Notification Schema Definition
 * Stores system-wide notifications and announcements
 */
const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Notification title
  message: { type: String, required: true }, // Notification content
  type: { type: String, default: 'general' }, // Type: general, holiday, urgent, event
  notificationDate: { type: Date }, // Optional date for calendar display
  attachmentUrl: String, // Optional attachment URL
  attachmentName: String, // Optional attachment filename
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User who created notification
  createdByName: String, // Name of creator
  createdByRole: String, // Role of creator
  createdAt: { type: Date, default: Date.now }, // Creation timestamp
  isActive: { type: Boolean, default: true }, // Soft delete flag
});

const Notification = mongoose.model('Notification', notificationSchema);

/**
 * Notification Read Schema Definition
 * Tracks which users have read which notifications
 */
const notificationReadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notificationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', required: true },
  readAt: { type: Date, default: Date.now },
});

notificationReadSchema.index({ userId: 1, notificationId: 1 }, { unique: true });

const NotificationRead = mongoose.model('NotificationRead', notificationReadSchema);

// JWT secret key for signing tokens (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'sms_dev_secret';

/**
 * Create JWT token for authenticated user
 * @param {Object} user - User document from database
 * @returns {String} Signed JWT token
 */
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '12h' } // Token expires in 12 hours
  );
};

/**
 * Authentication middleware
 * Verifies JWT token and attaches user info to request object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requireAuth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).send('Unauthorized');

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (err) {
    return res.status(401).send('Invalid token');
  }
};

/**
 * Seeds default admin user if none exists
 * Creates admin@school.com with password Admin123
 */
const ensureAdminSeed = async () => {
  const existing = await User.findOne({ role: 'admin' });
  if (existing) return;

  const passwordHash = await bcrypt.hash('Admin123', 10);
  await User.create({
    name: 'Administrator',
    email: 'admin@school.com',
    passwordHash,
    role: 'admin',
  });
  console.log('Seeded admin user: admin@school.com / Admin123');
};

/**
 * =========================================
 * AUTHENTICATION ENDPOINTS
 * =========================================
 */

/**
 * POST /auth/login
 * Authenticates user and returns JWT token
 * Body: { email, password }
 * Returns: { token, user: { id, name, email, role, personalEmail, phoneNumber } }
 */
app.post('/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).send('Email and password required');

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(401).send('Invalid credentials');

  // Verify password
  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).send('Invalid credentials');

  // Generate JWT token
  const token = createToken(user);
  res.send({
    token,
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      personalEmail: user.personalEmail,
      phoneNumber: user.phoneNumber,
    },
  });
}));

/**
 * GET /auth/me
 * Returns current authenticated user information
 * Requires: Authorization header with JWT token
 */
app.get('/auth/me', requireAuth, asyncHandler(async (req, res) => {
  res.send({ user: req.user });
}));

/**
 * POST /auth/change-password
 * Changes password for authenticated user
 * Body: { currentPassword, newPassword }
 * Requires: Authentication
 */
app.post('/auth/change-password', requireAuth, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) {
    return res.status(400).send('Current password and new password required');
  }

  if (newPassword.length < 6) {
    return res.status(400).send('New password must be at least 6 characters');
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send('User not found');

  // Verify current password
  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) return res.status(401).send('Current password is incorrect');

  // Hash and save new password
  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = newPasswordHash;
  await user.save();

  res.send({ message: 'Password changed successfully' });
}));

/**
 * PUT /auth/profile
 * Updates current user's profile information
 * Body: { name, personalEmail, phoneNumber }
 * Requires: Authentication
 */
app.put('/auth/profile', requireAuth, asyncHandler(async (req, res) => {
  const { name, personalEmail, phoneNumber } = req.body || {};
  
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send('User not found');

  // Update fields if provided
  if (name) user.name = name;
  if (personalEmail !== undefined) user.personalEmail = personalEmail;
  if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
  
  await user.save();

  res.send({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      personalEmail: user.personalEmail,
      phoneNumber: user.phoneNumber,
    },
  });
}));

/**
 * POST /auth/request-otp
 * Generates OTP for principal user creation (admin only)
 * Returns: { otp, message }
 * Note: In production, this should send SMS via Twilio or similar service
 */
app.post('/auth/request-otp', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Only admins can request OTP');
  }

  const admin = await User.findById(req.user.id);
  if (!admin || !admin.phoneNumber) {
    return res.status(400).send('Admin phone number not found');
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // In production, send SMS using service like Twilio
  // For now, just return the OTP (for testing)
  console.log(`OTP for ${admin.phoneNumber}: ${otp}`);
  
  res.send({
    otp,
    message: `OTP sent to ${admin.phoneNumber}`,
  });
}));

/**
 * =========================================
 * USER MANAGEMENT ENDPOINTS
 * =========================================
 */

/**
 * POST /users
 * Creates user creation request (requires principal approval)
 * Body: { name, email, password, role, personalEmail, phoneNumber }
 * Access: Admin only
 */
app.post('/users', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Only admins can create user requests');
  }

  const { name, email, password, role, personalEmail, phoneNumber } = req.body || {};
  
  // Validate required fields
  if (!name || !email || !password || !role) {
    return res.status(400).send('Name, email, password, and role are required');
  }

  if (password.length < 6) {
    return res.status(400).send('Password must be at least 6 characters');
  }

  // Check for existing user with same email
  const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
  if (existingUser) {
    return res.status(409).send('User with this email already exists');
  }

  // Check if there's already a pending request for this email
  const existingRequest = await UserRequest.findOne({ 
    email: email.toLowerCase().trim(),
    status: 'pending'
  });
  if (existingRequest) {
    return res.status(409).send('A pending request already exists for this email');
  }

  // Create a user request instead of directly creating the user
  // This requires principal approval before user is created
  const newRequest = await UserRequest.create({
    name,
    email: email.toLowerCase().trim(),
    password, // Store plain password temporarily for principal approval
    role,
    personalEmail,
    phoneNumber,
    requestedBy: req.user.id,
    requestedByName: req.user.name,
    requestedByEmail: req.user.email,
    status: 'pending',
  });

  res.status(201).send({
    message: 'User creation request submitted to principal for approval',
    requestId: newRequest._id,
  });
}));

/**
 * GET /user-requests
 * Retrieves all pending user creation requests
 * Access: Principal only
 */
app.get('/user-requests', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'principal') {
    return res.status(403).send('Only principals can view user requests');
  }

  // Get all pending requests sorted by newest first
  const requests = await UserRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
  res.send(requests);
}));

/**
 * POST /user-requests/:id/approve
 * Approves a user creation request and creates the user account
 * Access: Principal only
 */
app.post('/user-requests/:id/approve', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'principal') {
    return res.status(403).send('Only principals can approve user requests');
  }

  const request = await UserRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).send('Request not found');
  }

  if (request.status !== 'pending') {
    return res.status(400).send('Request has already been processed');
  }

  // Check if user with this email already exists
  const existingUser = await User.findOne({ email: request.email });
  if (existingUser) {
    return res.status(409).send('User with this email already exists');
  }

  // Create the user account
  const passwordHash = await bcrypt.hash(request.password, 10);
  const newUser = await User.create({
    name: request.name,
    email: request.email,
    passwordHash,
    role: request.role,
    personalEmail: request.personalEmail,
    phoneNumber: request.phoneNumber,
  });

  // Update request status to approved
  request.status = 'approved';
  await request.save();

  res.send({
    message: 'User request approved and user created successfully',
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
}));

/**
 * POST /user-requests/:id/reject
 * Rejects a user creation request
 * Access: Principal only
 */
app.post('/user-requests/:id/reject', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'principal') {
    return res.status(403).send('Only principals can reject user requests');
  }

  const request = await UserRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).send('Request not found');
  }

  if (request.status !== 'pending') {
    return res.status(400).send('Request has already been processed');
  }

  // Update request status to rejected
  request.status = 'rejected';
  await request.save();

  res.send({
    message: 'User request rejected successfully',
  });
}));

/**
 * =========================================
 * NOTIFICATION ENDPOINTS
 * =========================================
 */

/**
 * GET /notifications
 * Retrieves all active notifications (most recent first)
 * Limit: 50 notifications
 */
app.get('/notifications', requireAuth, asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ isActive: true })
    .sort({ createdAt: -1 }) // Newest first
    .limit(50); // Limit to 50 for performance
  const reads = await NotificationRead.find({ userId: req.user.id }).select('notificationId');
  const readIds = new Set(reads.map(r => String(r.notificationId)));
  const enriched = notifications.map(n => ({
    ...n.toObject(),
    isRead: readIds.has(String(n._id)),
  }));
  res.send(enriched);
}));

/**
 * GET /notifications/unread-count
 * Returns unread notification count for the current user
 */
app.get('/notifications/unread-count', requireAuth, asyncHandler(async (req, res) => {
  const reads = await NotificationRead.find({ userId: req.user.id }).select('notificationId');
  const readIds = reads.map(r => r.notificationId);
  const count = await Notification.countDocuments({
    isActive: true,
    _id: { $nin: readIds },
  });
  res.send({ count });
}));

/**
 * POST /notifications/:id/read
 * Marks a notification as read for the current user
 */
app.post('/notifications/:id/read', requireAuth, asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification || !notification.isActive) {
    return res.status(404).send('Notification not found');
  }

  await NotificationRead.updateOne(
    { userId: req.user.id, notificationId: notification._id },
    { $setOnInsert: { readAt: new Date() } },
    { upsert: true }
  );

  res.send({ message: 'Marked as read' });
}));

/**
 * POST /notifications
 * Creates a new notification
 * Body: { title, message, type, notificationDate, attachmentUrl, attachmentName }
 * Access: Admin and Principal only
 */
app.post('/notifications', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'principal') {
    return res.status(403).send('Only admins and principals can create notifications');
  }

  const { title, message, type, notificationDate, attachmentUrl, attachmentName } = req.body || {};
  
  console.log('Received notification data:', { title, message, type, notificationDate, attachmentUrl, attachmentName });
  
  if (!title || !message) {
    return res.status(400).send('Title and message are required');
  }

  // Build notification object
  const notificationObj = {
    title,
    message,
    type: type || 'general',
    attachmentUrl,
    attachmentName,
    createdBy: req.user.id,
    createdByName: req.user.name,
    createdByRole: req.user.role,
  };

  // Handle notificationDate if provided
  if (notificationDate) {
    notificationObj.notificationDate = new Date(notificationDate);
    console.log('Notification date set to:', notificationObj.notificationDate);
  } else {
    console.log('No notificationDate provided');
  }

  console.log('About to save notification object:', notificationObj);
  const notification = await Notification.create(notificationObj);
  console.log('Saved notification:', notification.toObject());

  res.status(201).send({
    message: 'Notification created successfully',
    notification,
  });
}));

/**
 * PUT /notifications/:id
 * Updates an existing notification
 * Body: { title, message, type, notificationDate, attachmentUrl, attachmentName }
 * Access: Admin and Principal only
 */
app.put('/notifications/:id', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'principal') {
    return res.status(403).send('Only admins and principals can update notifications');
  }

  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return res.status(404).send('Notification not found');
  }

  const { title, message, type, notificationDate, attachmentUrl, attachmentName } = req.body || {};
  
  // Update fields if provided
  if (title) notification.title = title;
  if (message) notification.message = message;
  if (type) notification.type = type;
  if (notificationDate) notification.notificationDate = new Date(notificationDate);
  if (attachmentUrl !== undefined) notification.attachmentUrl = attachmentUrl;
  if (attachmentName !== undefined) notification.attachmentName = attachmentName;

  await notification.save();

  res.send({
    message: 'Notification updated successfully',
    notification,
  });
}));

/**
 * DELETE /notifications/:id
 * Soft deletes a notification (sets isActive to false)
 * Access: Admin and Principal only
 */
app.delete('/notifications/:id', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'principal') {
    return res.status(403).send('Only admins and principals can delete notifications');
  }

  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return res.status(404).send('Notification not found');
  }

  // Soft delete - set isActive to false instead of actual deletion
  notification.isActive = false;
  await notification.save();

  res.send({
    message: 'Notification deleted successfully',
  });
}));

/**
 * =========================================
 * STUDENT ENDPOINTS
 * =========================================
 */

/**
 * POST /students
 * Creates a new student with auto-generated roll number
 * Roll number format: {class}{section}{number} (e.g., 10A1, 10A2)
 */
app.post('/students', requireAuth, asyncHandler(async (req, res) => {
  // Find the highest roll number for the class + section (e.g., 10A, 10B)
  const studentClass = (req.body.studentClass || '').toString().trim();
  const section = (req.body.section || '').toString().trim();
  const rollPrefix = `${studentClass}${section}`;
  
  // Get all students in same class and section
  const classSectionStudents = await Student.find({ studentClass, section });
  
  // Find the maximum roll number
  let maxNumber = 0;
  classSectionStudents.forEach(s => {
    if (s.rollNumber && s.rollNumber.startsWith(rollPrefix)) {
      const suffix = s.rollNumber.slice(rollPrefix.length);
      const num = parseInt(suffix, 10);
      if (!isNaN(num) && num > maxNumber) maxNumber = num;
    }
  });
  
  // Generate new roll number (e.g., 10A1, 10A2, 10A3...)
  const newRollNumber = `${rollPrefix}${maxNumber + 1}`;
  
  // Create and save student
  const student = new Student({ ...req.body, rollNumber: newRollNumber });
  await student.save();
  res.status(201).send(student);
}));

/**
 * GET /students
 * Retrieves all students
 */
app.get('/students', requireAuth, asyncHandler(async (req, res) => {
  const students = await Student.find();
  res.send(students);
}));

/**
 * GET /students/:id
 * Retrieves a specific student by ID
 */
app.get('/students/:id', requireAuth, asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send('Student not found');
  res.send(student);
}));

/**
 * PUT /students/:id
 * Updates a student's information
 */
app.put('/students/:id', requireAuth, asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).send('Student not found');
  res.send(student);
}));

/**
 * DELETE /students/:id
 * Deletes a student from the database
 */
app.delete('/students/:id', requireAuth, asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).send('Student not found');
  res.send(student);
}));

/**
 * =========================================
 * EXAM ENDPOINTS
 * =========================================
 */

/**
 * GET /exams
 * Retrieves all exams sorted by examId
 */
app.get('/exams', requireAuth, asyncHandler(async (req, res) => {
  const exams = await Exam.find().sort({ examId: 1 });
  res.send(exams);
}));

/**
 * POST /exams
 * Creates a new exam or returns existing exam if ID already exists
 * Body: { id/examId, name, subjects, marks }
 */
app.post('/exams', requireAuth, asyncHandler(async (req, res) => {
  const examId = Number(req.body.id ?? req.body.examId);
  
  // Check if exam already exists
  const existing = await Exam.findOne({ examId });
  if (existing) return res.send(existing);
  
  // Create new exam
  const exam = new Exam({
    examId,
    name: req.body.name,
    subjects: req.body.subjects || [],
    marks: req.body.marks || {},
  });
  await exam.save();
  res.status(201).send(exam);
}));

/**
 * PUT /exams/:examId/marks
 * Updates marks for all students in a specific exam
 * Body: { marks: { studentId: { subject: marks } } }
 */
app.put('/exams/:examId/marks', requireAuth, asyncHandler(async (req, res) => {
  const examId = Number(req.params.examId);
  const exam = await Exam.findOneAndUpdate(
    { examId },
    { $set: { marks: req.body.marks || {} } },
    { new: true } // Return updated document
  );
  if (!exam) return res.status(404).send('Exam not found');
  res.send(exam);
}));

/**
 * =========================================
 * ERROR HANDLING & SERVER STARTUP
 * =========================================
 */

/**
 * Global error handler middleware
 * Catches all errors and sends 500 response
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Server error');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

// Start the server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
