import XLSX from 'xlsx';

// Read the Excel file
const workbook = XLSX.readFile('attached_assets/disbursements_1758815593894.xlsx');

// Get the first sheet name
const sheetName = workbook.SheetNames[0];
console.log('Sheet name:', sheetName);

// Get the worksheet
const worksheet = workbook.Sheets[sheetName];

// Convert to JSON
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('Data structure:');
console.log(JSON.stringify(data, null, 2));

// Also log the raw sheet range to understand structure
console.log('Sheet range:', worksheet['!ref']);

// Log first few rows to understand headers
console.log('\nFirst 5 rows:');
data.slice(0, 5).forEach((row, index) => {
  console.log(`Row ${index}:`, row);
});