/**
 * CSV Parser for Student Bulk Upload
 * Validates and parses CSV data
 */

const REQUIRED_FIELDS = ['name', 'email', 'department'];

/**
 * Parse CSV text content into array of objects
 * @param {string} csvText - Raw CSV text content
 * @returns {Object} { data: Array, errors: Array }
 */
export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  const errors = [];
  const data = [];

  if (lines.length < 2) {
    errors.push('CSV file must have headers and at least one data row');
    return { data: [], errors };
  }

  // Parse headers
  const headerLine = lines[0];
  const headers = headerLine.split(',').map(h => h.trim().toLowerCase());

  // Validate required fields
  const missingFields = REQUIRED_FIELDS.filter(
    field => !headers.includes(field.toLowerCase())
  );
  if (missingFields.length > 0) {
    errors.push(`Missing required columns: ${missingFields.join(', ')}`);
    return { data: [], errors };
  }

  // Get column indices
  const columnIndices = {};
  REQUIRED_FIELDS.forEach(field => {
    columnIndices[field] = headers.indexOf(field.toLowerCase());
  });

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(',').map(v => v.trim());
    const rowNumber = i + 1;

    // Extract required fields
    const student = {};
    let hasError = false;

    REQUIRED_FIELDS.forEach(field => {
      const value = values[columnIndices[field]];
      if (!value) {
        errors.push(`Row ${rowNumber}: Missing value for "${field}"`);
        hasError = true;
      } else {
        student[field] = value;
      }
    });

    // Add optional fields if present
    const optionalFields = ['phone', 'address', 'dateOfBirth', 'semester'];
    optionalFields.forEach(field => {
      const index = headers.indexOf(field.toLowerCase());
      if (index !== -1 && values[index]) {
        student[field] = values[index];
      }
    });

    if (!hasError) {
      data.push(student);
    }
  }

  return { data, errors };
};

/**
 * Validate individual student data
 * @param {Object} student - Student object
 * @returns {Array} Array of validation errors
 */
export const validateStudent = (student) => {
  const errors = [];

  // Name validation
  if (!student.name || student.name.length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!student.email || !emailRegex.test(student.email)) {
    errors.push('Invalid email format');
  }

  // Department validation
  if (!student.department || student.department.length < 2) {
    errors.push('Department must be at least 2 characters');
  }

  return errors;
};

/**
 * Validate all students and return detailed report
 * @param {Array} students - Array of student objects
 * @returns {Object} { valid: Array, invalid: Array }
 */
export const validateAllStudents = (students) => {
  const valid = [];
  const invalid = [];

  students.forEach((student, index) => {
    const errors = validateStudent(student);
    if (errors.length === 0) {
      valid.push(student);
    } else {
      invalid.push({
        rowNumber: index + 2, // +2 because row 1 is header, index starts at 0
        student,
        errors,
      });
    }
  });

  return { valid, invalid };
};
