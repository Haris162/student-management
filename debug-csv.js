// Debug version - see what values are being extracted
const csvText = `name,age,studentClass,section,fatherName,motherName,fatherOccupation,fatherIncome,addressLine1,addressLine2,city,state,postalCode,country
John Doe,15,10,A,Robert Doe,Jane Doe,Engineer,50000,123 Main St,Apt 4B,New York,NY,10001,United States`;

const REQUIRED_VALUE_FIELDS = ['name', 'age', 'studentclass', 'section', 'fathername', 'mothername'];
const OPTIONAL_FIELDS = ['fatheroccupation', 'fatherincome', 'addressline1', 'addressline2', 'city', 'state', 'postalcode', 'country'];
const EXPECTED_HEADERS = [...REQUIRED_VALUE_FIELDS, ...OPTIONAL_FIELDS];

const lines = csvText.trim().split('\n');
const headerLine = lines[0];
const headers = headerLine.split(',').map(h => h.trim().toLowerCase());

console.log('🔍 DEBUGDATA\n');
console.log('Header Line:', headerLine);
console.log('Headers Array:', headers);
console.log('Expected Headers:', EXPECTED_HEADERS);
console.log('Match?', headers.every((h, i) => h === EXPECTED_HEADERS[i]));

// Get column indices
const columnIndices = {};
EXPECTED_HEADERS.forEach(field => {
  const idx = headers.indexOf(field);
  columnIndices[field] = idx;
  console.log(`  columnIndices['${field}'] = ${idx}`);
});

console.log('\n---\n');

// Test row 1
const dataLine = lines[1];
console.log('Data Line:', dataLine);

const values = dataLine.split(',').map(v => v.trim());
console.log('Split Values:', values);
console.log('Values length:', values.length);
console.log('\nValue extraction:');

REQUIRED_VALUE_FIELDS.forEach(field => {
  const idx = columnIndices[field];
  const value = values[idx];
  console.log(`  ${field} (idx=${idx}): "${value}"`);
});
