# CSV Upload Field Reference (Quick Guide)

## Required CSV Header Order

When uploading a CSV file for bulk student import, you **MUST** use this exact column order:

```
name,age,studentClass,section,fatherName,motherName,fatherOccupation,fatherIncome,addressLine1,addressLine2,city,state,postalCode,country
```

## Column Details

| Position | Field | Type | Required | Example |
|----------|-------|------|----------|---------|
| 1 | name | Text | ✅ | John Doe |
| 2 | age | Number | ✅ | 15 |
| 3 | studentClass | Text | ✅ | 10 |
| 4 | section | Text (A or B) | ✅ | A |
| 5 | fatherName | Text | ✅ | Robert Doe |
| 6 | motherName | Text | ✅ | Jane Doe |
| 7 | fatherOccupation | Text | ❌ | Engineer |
| 8 | fatherIncome | Text | ❌ | 50000 |
| 9 | addressLine1 | Text | ❌ | 123 Main St |
| 10 | addressLine2 | Text | ❌ | Apt 4B |
| 11 | city | Text | ❌ | New York |
| 12 | state | Text | ❌ | NY |
| 13 | postalCode | Text | ❌ | 10001 |
| 14 | country | Text | ❌ | United States |

## Example Valid CSV

```csv
name,age,studentClass,section,fatherName,motherName,fatherOccupation,fatherIncome,addressLine1,addressLine2,city,state,postalCode,country
John Doe,15,10,A,Robert Doe,Jane Doe,Engineer,50000,123 Main St,Apt 4B,New York,NY,10001,United States
Jane Smith,15,10,A,William Smith,Mary Smith,Doctor,75000,456 Oak Ave,Suite 200,Los Angeles,CA,90001,United States
Michael Johnson,15,10,B,David Johnson,Patricia Johnson,Teacher,40000,789 Pine Rd,,Chicago,IL,60601,United States
Sarah Williams,16,11,A,James Williams,Jennifer Williams,Business Owner,100000,321 Elm St,Floor 3,Houston,TX,77001,United States
```

## Validation Rules

### Required Fields Must Be Valid:
- **name:** Cannot be empty, minimum 2 characters
- **age:** Must be a valid number between 1 and 100
- **studentClass:** Cannot be empty (e.g., "10", "11", "12")
- **section:** Must be exactly "A" or "B"
- **fatherName:** Cannot be empty, minimum 2 characters  
- **motherName:** Cannot be empty, minimum 2 characters

### Optional Fields:
- Can be left empty/blank
- Will be imported as empty strings if not provided

## Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| "Invalid column order" | Columns in wrong sequence | Check header order matches exactly |
| "Invalid column count" | Wrong number of columns | Ensure all 14 columns present |
| "Missing value for X" | Required field empty | Fill in all required fields |
| "Age must be a number" | Age column has non-numeric value | Use only numbers 1-100 |
| "Section must be A or B" | Section not "A" or "B" | Use A or B only |

## Roll Number Generation

After successful import, each student gets an auto-generated roll number based on their class:

- Format: `{ClassCode}{Counter}`
- Examples:
  - Student 1 in class 10: `10001`
  - Student 2 in class 10: `10002`
  - Student 1 in class 11: `11001`
  - Student 1 in class 12: `12001`

## Sample CSV File

A pre-made sample CSV file is available at: `/public/sample-students.csv`

You can download and use it as a template!

---

**Last Updated:** 2024  
**System:** Student Management System
