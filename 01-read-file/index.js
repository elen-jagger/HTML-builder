const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath, 'utf-8');
let data = '';
readStream.on('data', (chunk) => data += chunk );
readStream.on('end', () => console.log(data));
