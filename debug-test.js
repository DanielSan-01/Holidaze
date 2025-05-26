// Test what happens with HTML5 time input and invalid values
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<body>
  <input type="time" id="timeInput" value="11:00">
</body>
</html>
`);

global.document = dom.window.document;
global.window = dom.window;

const timeInput = document.getElementById('timeInput');

console.log('🕐 Testing HTML5 time input behavior:');
console.log('====================================');

console.log(`Initial value: "${timeInput.value}"`);

// Try to set invalid time
timeInput.value = '25:00';
console.log(`After setting 25:00: "${timeInput.value}"`);
console.log(`Is valid: ${timeInput.validity.valid}`);
console.log(`Validity state:`, timeInput.validity);

// Try another invalid time
timeInput.value = '12:60';
console.log(`After setting 12:60: "${timeInput.value}"`);
console.log(`Is valid: ${timeInput.validity.valid}`);

// Set a valid time
timeInput.value = '14:30';
console.log(`After setting 14:30: "${timeInput.value}"`);
console.log(`Is valid: ${timeInput.validity.valid}`); 