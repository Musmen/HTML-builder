const path = require('path');
const fs = require('fs');

const outputFilePath = path.join(__dirname, './output.txt');
const writeStream = fs.createWriteStream(outputFilePath);
const readStream = process.stdin;

const onExitHandler = () => {
  console.log(
    'Your message/messages is/are in the output.txt file. Thank you!'
  );
  writeStream.end();
  readStream.end();
  process.exit();
};

console.log('Hello! Please, input your message');

readStream.on('data', (input) => {
  if (input.includes('exit')) process.emit('SIGINT');
});

process.on('SIGINT', onExitHandler);

readStream.pipe(writeStream);
