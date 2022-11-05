const path = require('path');
const fs = require('fs');

const outputFilePath = path.join(__dirname, './output.txt');
const writeStream = fs.createWriteStream(outputFilePath);
const readStream = process.stdin;

console.log('Hello! Please, input your message');

readStream.on('data', (input) => {
  if (input.includes('exit')) process.exit();
});

process.addListener('exit', () => {
  writeStream.end();
  readStream.end();
  console.log(
    'Your message/messages is/are in the output.txt file. Thank you!'
  );
});

readStream.pipe(writeStream);
