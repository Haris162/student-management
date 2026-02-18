/**
 * CSV Parser for Student Bulk Upload
 * Validates and parses CSV data
 * Fields match the AddStudent form exactly
 */

const REQUIRED_VALUE_FIELDS = ['name', 'studentclass', 'section'];
const OPTIONAL_FIELDS = ['age', 'fathername', 'mothername', 'fatheroccupation', 'fatherincome', 'addressline1', 'addressline2', 'city', 'state', 'postalcode', 'country'];
const EXPECTED_HEADERS = [...REQUIRED_VALUE_FIELDS, ...OPTIONAL_FIELDS];

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

  // Validate strict header order and required columns
  if (headers.length !== EXPECTED_HEADERS.length) {
    errors.push(
      `Invalid column count. Expected headers: ${EXPECTED_HEADERS.join(', ')}`
    );
    return { data: [], errors };
  }

  const headerMatches = headers.every((header, index) => header === EXPECTED_HEADERS[index]);
  if (!headerMatches) {
    errors.push(
      `Invalid column order. Expected headers: ${EXPECTED_HEADERS.join(', ')}`
    );
    return { data: [], errors };
  }

  // Get column indices
  const columnIndices = {};
  EXPECTED_HEADERS.forEach(field => {
    columnIndices[field] = headers.indexOf(field);
  });

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue; // Skip empty lines

    const values = line.split(',').map(v => v.trim());
    const rowNumber = i + 1;

    // Skip rows where all values are empty
    if (values.every(v => !v)) continue;

    // Extract required fields
    const student = {};
    let hasError = false;

    REQUIRED_VALUE_FIELDS.forEach(field => {
      const value = values[columnIndices[field]];
      if (!value) {
        errors.push(`Row ${rowNumber}: Missing value for "${field}"`);
        hasError = true;
      } else {
        student[field] = value;
      }
    });

    // Only process if no required field errors
    if (hasError) continue;

    // Add optional fields if present
    OPTIONAL_FIELDS.forEach(field => {
      const index = headers.indexOf(field.toLowerCase());
      if (index !== -1 && values[index]) {
        student[field] = values[index];
      }
    });

    data.push(student);
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
  if (!student.name || student.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  // Age validation (optional, but if provided must be valid)
  if (student.age) {
    const age = parseInt(student.age);
    if (isNaN(age) || age <= 0 || age > 100) {
      errors.push('Age must be a number between 1-100');
    }
  }

  // Class validation
  if (!student.studentclass || student.studentclass.trim().length < 1) {
    errors.push('Class is required');
  }

  // Section validation (should be A or B)
  if (!student.section || !['A', 'B'].includes(student.section.trim().toUpperCase())) {
    errors.push('Section must be A or B');
  }

  // Father's name validation (optional, but if provided must be at least 2 chars)
  if (student.fathername && student.fathername.trim().length < 2) {
    errors.push('Father\'s name must be at least 2 characters if provided');
  }

  // Mother's name validation (optional, but if provided must be at least 2 chars)
  if (student.mothername && student.mothername.trim().length < 2) {
    errors.push('Mother\'s name must be at least 2 characters if provided');
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
