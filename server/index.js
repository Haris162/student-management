const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

mongoose.connect('mongodb://127.0.0.1:27017/student-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.once('open', () => {
  ensureAdminSeed().catch((err) => {
    console.error('Failed to seed admin:', err);
  });
});

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  studentClass: String,
  section: String,
  rollNumber: String,
  photo: String,
  fatherName: String,
  motherName: String,
  fatherOccupation: String,
  fatherIncome: String,
  addressLine1: String,
  addressLine2: String,
  city: String,
  state: String,
  postalCode: String,
  country: String,
});

const Student = mongoose.model('Student', studentSchema);

const examSchema = new mongoose.Schema({
  examId: Number,
  name: String,
  subjects: [String],
  marks: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const Exam = mongoose.model('Exam', examSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, index: true },
  passwordHash: String,
  role: { type: String, default: 'admin' },
  personalEmail: String,
  phoneNumber: String,
});

const User = mongoose.model('User', userSchema);

const userRequestSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  personalEmail: String,
  phoneNumber: String,
  requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  requestedByName: String,
  requestedByEmail: String,
  status: { type: String, default: 'pending' }, // pending, approved, rejected
  createdAt: { type: Date, default: Date.now },
});

const UserRequest = mongoose.model('UserRequest', userRequestSchema);

const JWT_SECRET = process.env.JWT_SECRET || 'sms_dev_secret';

const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    JWT_SECRET,
    { expiresIn: '12h' }
  );
};

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

app.post('/auth/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).send('Email and password required');

  const user = await User.findOne({ email: email.toLowerCase().trim() });
  if (!user) return res.status(401).send('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) return res.status(401).send('Invalid credentials');

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

app.get('/auth/me', requireAuth, asyncHandler(async (req, res) => {
  res.send({ user: req.user });
}));

// Change password
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

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) return res.status(401).send('Current password is incorrect');

  const newPasswordHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = newPasswordHash;
  await user.save();

  res.send({ message: 'Password changed successfully' });
}));

// Update profile
app.put('/auth/profile', requireAuth, asyncHandler(async (req, res) => {
  const { name, personalEmail, phoneNumber } = req.body || {};
  
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send('User not found');

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

// Request OTP for principal creation
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

// Create new user (admin only)
app.post('/users', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Only admins can create user requests');
  }

  const { name, email, password, role, personalEmail, phoneNumber } = req.body || {};
  
  if (!name || !email || !password || !role) {
    return res.status(400).send('Name, email, password, and role are required');
  }

  if (password.length < 6) {
    return res.status(400).send('Password must be at least 6 characters');
  }

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

// Get all user requests (principal only)
app.get('/user-requests', requireAuth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'principal') {
    return res.status(403).send('Only principals can view user requests');
  }

  const requests = await UserRequest.find({ status: 'pending' }).sort({ createdAt: -1 });
  res.send(requests);
}));

// Approve user request (principal only)
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

  // Create the user
  const passwordHash = await bcrypt.hash(request.password, 10);
  const newUser = await User.create({
    name: request.name,
    email: request.email,
    passwordHash,
    role: request.role,
    personalEmail: request.personalEmail,
    phoneNumber: request.phoneNumber,
  });

  // Update request status
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

// Reject user request (principal only)
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

  // Update request status
  request.status = 'rejected';
  await request.save();

  res.send({
    message: 'User request rejected successfully',
  });
}));

// Create student
app.post('/students', requireAuth, asyncHandler(async (req, res) => {
  // Find the highest roll number for the class + section (e.g., 10A, 10B)
  const studentClass = (req.body.studentClass || '').toString().trim();
  const section = (req.body.section || '').toString().trim();
  const rollPrefix = `${studentClass}${section}`;
  const classSectionStudents = await Student.find({ studentClass, section });
  let maxNumber = 0;
  classSectionStudents.forEach(s => {
    if (s.rollNumber && s.rollNumber.startsWith(rollPrefix)) {
      const suffix = s.rollNumber.slice(rollPrefix.length);
      const num = parseInt(suffix, 10);
      if (!isNaN(num) && num > maxNumber) maxNumber = num;
    }
  });
  const newRollNumber = `${rollPrefix}${maxNumber + 1}`;
  const student = new Student({ ...req.body, rollNumber: newRollNumber });
  await student.save();
  res.status(201).send(student);
}));

// Get all students
app.get('/students', requireAuth, asyncHandler(async (req, res) => {
  const students = await Student.find();
  res.send(students);
}));

// Get student by ID
app.get('/students/:id', requireAuth, asyncHandler(async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send('Student not found');
  res.send(student);
}));

// Get all exams
app.get('/exams', requireAuth, asyncHandler(async (req, res) => {
  const exams = await Exam.find().sort({ examId: 1 });
  res.send(exams);
}));

// Create exam
app.post('/exams', requireAuth, asyncHandler(async (req, res) => {
  const examId = Number(req.body.id ?? req.body.examId);
  const existing = await Exam.findOne({ examId });
  if (existing) return res.send(existing);
  const exam = new Exam({
    examId,
    name: req.body.name,
    subjects: req.body.subjects || [],
    marks: req.body.marks || {},
  });
  await exam.save();
  res.status(201).send(exam);
}));

// Update exam marks
app.put('/exams/:examId/marks', requireAuth, asyncHandler(async (req, res) => {
  const examId = Number(req.params.examId);
  const exam = await Exam.findOneAndUpdate(
    { examId },
    { $set: { marks: req.body.marks || {} } },
    { new: true }
  );
  if (!exam) return res.status(404).send('Exam not found');
  res.send(exam);
}));

// Update student
app.put('/students/:id', requireAuth, asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).send('Student not found');
  res.send(student);
}));

// Delete student
app.delete('/students/:id', requireAuth, asyncHandler(async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).send('Student not found');
  res.send(student);
}));

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Server error');
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
