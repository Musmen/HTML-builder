const path = require('path');
const fsPromises = require('fs/promises');

const getFileNameAndExtension = (filePath) => {
  const { name, ext } = path.parse(filePath);
  return { name, extension: ext.slice(1) };
};

const logFile = (name, extension, size) => {
  console.log(`${name} - ${extension} - ${size}`);
};

const logFolderFile = async (fileName, folderPath) => {
  const innerFileFullPath = path.join(folderPath, fileName);
  const { name, extension } = getFileNameAndExtension(innerFileFullPath);

  const fileStats = await fsPromises.stat(innerFileFullPath);
  const { size } = fileStats;

  logFile(name, extension, size);
};

const logFilesInFolder = async (folderPath) => {
  const folderContent = await fsPromises.readdir(folderPath, {
    withFileTypes: true,
  });

  folderContent.forEach((content) => {
    if (content.isDirectory()) return;
    logFolderFile(content.name, folderPath);
  });
};

const secretFolderPath = path.join(__dirname, './secret-folder');
logFilesInFolder(secretFolderPath);
