const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://127.0.0.1:27017/student-management', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  studentClass: String,
  section: String,
  rollNumber: String,
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

// Create student
app.post('/students', async (req, res) => {
  // Find the highest roll number for the class
  const classStudents = await Student.find({ studentClass: req.body.studentClass });
  let maxNumber = 0;
  classStudents.forEach(s => {
    if (s.rollNumber && s.rollNumber.startsWith(req.body.studentClass)) {
      const num = parseInt(s.rollNumber.replace(req.body.studentClass, ''));
      if (!isNaN(num) && num > maxNumber) maxNumber = num;
    }
  });
  const newRollNumber = req.body.studentClass + (maxNumber + 1);
  const student = new Student({ ...req.body, rollNumber: newRollNumber });
  await student.save();
  res.status(201).send(student);
});

// Get all students
app.get('/students', async (req, res) => {
  const students = await Student.find();
  res.send(students);
});

// Get student by ID
app.get('/students/:id', async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) return res.status(404).send('Student not found');
  res.send(student);
});

// Update student
app.put('/students/:id', async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!student) return res.status(404).send('Student not found');
  res.send(student);
});

// Delete student
app.delete('/students/:id', async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) return res.status(404).send('Student not found');
  res.send(student);
});

const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
