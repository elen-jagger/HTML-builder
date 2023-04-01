const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

const { stdin, stdout } = process;
const filePath = path.join(__dirname, 'notes.txt');
const fileout = fs.createWriteStream(filePath, { flags: 'a' });

function exitProg() {
  stdout.write('thanks. bye!\n');
  process.exit();
}

function processingData(data) {
  const exitCmd = data.indexOf('exit');
  if (exitCmd !== -1) {
    exitProg();
  } else {
    fileout.write(data);
    stdout.write('anything else?\n');
  }
}

stdout.write('hi! you can write whatever you want\n');

stdin.on('data', processingData);

process.on('SIGINT', exitProg);
