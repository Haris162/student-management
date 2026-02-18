// Test the actual CSV parser
import { parseCSV, validateAllStudents } from './src/dataflow/addstudentsfromcsv/csvParser.js';

const csvText = `name,age,studentClass,section,fatherName,motherName,fatherOccupation,fatherIncome,addressLine1,addressLine2,city,state,postalCode,country
John Doe,15,10,A,Robert Doe,Jane Doe,Engineer,50000,123 Main St,Apt 4B,New York,NY,10001,United States
Jane Smith,14,9,B,William Smith,Mary Smith,Doctor,75000,456 Oak Ave,Suite 200,Los Angeles,CA,90001,United States
Michael Johnson,15,8,B,David Johnson,Patricia Johnson,Teacher,40000,789 Pine Rd,,Chicago,IL,60601,United States
Sarah Williams,14,8,A,James Williams,Jennifer Williams,Business Owner,100000,321 Elm St,Floor 3,Houston,TX,77001,United States
Robert Brown,15,9,B,Charles Brown,Anna Brown,Accountant,60000,654 Maple Dr,,Phoenix,AZ,85001,United States
Emily Davis,14,9,A,George Davis,Elizabeth Davis,Nurse,55000,987 Cedar Ln,,Philadelphia,PA,19101,United States`;

console.log('📋 TESTING CSV PARSER\n');

const { data, errors: parseErrors } = parseCSV(csvText);

if (parseErrors.length > 0) {
  console.log('❌ PARSING ERRORS:');
  parseErrors.forEach(err => console.log(`  • ${err}`));
} else {
  console.log('✅ CSV parsed successfully\n');
  console.log(`Parsed ${data.length} students:\n`);
  
  const { valid, invalid } = validateAllStudents(data);
  
  if (valid.length > 0) {
    console.log(`✅ VALID RECORDS (${valid.length}):`);
    valid.forEach((student, i) => {
      console.log(`   ${i + 1}. ${student.name} (${student.age} years old, Class ${student.studentclass}, Section ${student.section})`);
    });
  }
  
  if (invalid.length > 0) {
    console.log(`\n❌ INVALID RECORDS (${invalid.length}):`);
    invalid.forEach(({ rowNumber, student, errors: validationErrors }) => {
      console.log(`   Row ${rowNumber} - ${student.name}:`);
      validationErrors.forEach(err => console.log(`     • ${err}`));
    });
  }
  
  console.log(`\n📊 RESULTS: ${valid.length} valid, ${invalid.length} invalid`);
}
