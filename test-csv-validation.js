// Quick validation test for the provided CSV
const csvText = `name,age,studentClass,section,fatherName,motherName,fatherOccupation,fatherIncome,addressLine1,addressLine2,city,state,postalCode,country
John Doe,15,10,A,Robert Doe,Jane Doe,Engineer,50000,123 Main St,Apt 4B,New York,NY,10001,United States
Jane Smith,14,9,B,William Smith,Mary Smith,Doctor,75000,456 Oak Ave,Suite 200,Los Angeles,CA,90001,United States
Michael Johnson,15,8,B,David Johnson,Patricia Johnson,Teacher,40000,789 Pine Rd,,Chicago,IL,60601,United States
Sarah Williams,14,8,A,James Williams,Jennifer Williams,Business Owner,100000,321 Elm St,Floor 3,Houston,TX,77001,United States
Robert Brown,15,9,B,Charles Brown,Anna Brown,Accountant,60000,654 Maple Dr,,Phoenix,AZ,85001,United States
Emily Davis,14,9,A,George Davis,Elizabeth Davis,Nurse,55000,987 Cedar Ln,,Philadelphia,PA,19101,United States`;

const REQUIRED_VALUE_FIELDS = ['name', 'age', 'studentClass', 'section', 'fatherName', 'motherName'];
const OPTIONAL_FIELDS = ['fatherOccupation', 'fatherIncome', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'];
const EXPECTED_HEADERS = [...REQUIRED_VALUE_FIELDS, ...OPTIONAL_FIELDS].map(h => h.toLowerCase());

console.log('📋 CSV VALIDATION TEST');
console.log('='.repeat(60));
console.log(`Expected Headers: ${EXPECTED_HEADERS.join(', ')}`);
console.log(`Total Fields Expected: ${EXPECTED_HEADERS.length}\n`);

const lines = csvText.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

console.log(`Actual Headers: ${headers.join(', ')}`);
console.log(`Total Fields Found: ${headers.length}\n`);

// Check header match
if (headers.length !== EXPECTED_HEADERS.length) {
  console.log(`❌ HEADER ERROR: Expected ${EXPECTED_HEADERS.length} columns, got ${headers.length}`);
} else if (headers.every((h, i) => h === EXPECTED_HEADERS[i])) {
  console.log('✅ Header structure is CORRECT\n');
} else {
  console.log('❌ Header order mismatch');
}

// Get column indices
const columnIndices = {};
EXPECTED_HEADERS.forEach(field => {
  columnIndices[field] = headers.indexOf(field.toLowerCase());
});

// Parse and validate each row
console.log('📊 ROW VALIDATION:\n');
let allRowsValid = true;

for (let i = 1; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;

  const values = line.split(',').map(v => v.trim());
  const rowNumber = i + 1;
  const rowErrors = [];

  // Check column count
  if (values.length !== EXPECTED_HEADERS.length) {
    console.log(`Row ${rowNumber}: ❌ Column count mismatch - Expected ${EXPECTED_HEADERS.length}, got ${values.length}`);
    allRowsValid = false;
    continue;
  }

  // Extract required fields and validate
  const student = {};
  REQUIRED_VALUE_FIELDS.forEach(field => {
    const value = values[columnIndices[field]];
    student[field] = value;
  });

  // Validate required fields
  if (!student.name || student.name.trim().length < 2) {
    rowErrors.push('Name must be at least 2 characters');
  }

  const age = parseInt(student.age);
  if (!student.age || isNaN(age) || age <= 0 || age > 100) {
    rowErrors.push(`Age must be a number 1-100 (got: "${student.age}")`);
  }

  if (!student.studentClass || student.studentClass.trim().length < 1) {
    rowErrors.push('Class is required');
  }

  if (!student.section || !['A', 'B'].includes(student.section.trim().toUpperCase())) {
    rowErrors.push(`Section must be A or B (got: "${student.section}")`);
  }

  if (!student.fatherName || student.fatherName.trim().length < 2) {
    rowErrors.push('Father\'s name must be at least 2 characters');
  }

  if (!student.motherName || student.motherName.trim().length < 2) {
    rowErrors.push('Mother\'s name must be at least 2 characters');
  }

  if (rowErrors.length === 0) {
    console.log(`Row ${rowNumber}: ✅ ${student.name} - VALID`);
  } else {
    console.log(`Row ${rowNumber}: ❌ ${student.name} - ERRORS:`);
    rowErrors.forEach(err => console.log(`         • ${err}`));
    allRowsValid = false;
  }
}

console.log('\n' + '='.repeat(60));
if (allRowsValid) {
  console.log('✅ ALL ROWS ARE VALID - CSV is ready to upload!');
} else {
  console.log('❌ SOME ROWS HAVE VALIDATION ERRORS - Fix above issues');
}
