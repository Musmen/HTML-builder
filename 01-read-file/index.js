const path = require('path');
const fs = require('fs');

const textFilePath = path.join(__dirname, './text.txt');

const readStream = fs.createReadStream(textFilePath);
readStream.pipe(process.stdout);
