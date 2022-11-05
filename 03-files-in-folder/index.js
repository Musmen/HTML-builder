const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const getFileNameAndExtension = (filePath) => {
  const { name, ext } = path.parse(filePath);
  return { name, extension: ext.slice(1) };
};

const logFileData = (name, extension, size) => {
  console.log(`${name} - ${extension} - ${size}`);
};

const logFolderContent = (folderContent, folderPath) => {
  folderContent.forEach((content) => {
    if (content.isDirectory()) return;

    const innerFileFullPath = path.join(folderPath, content.name);

    fs.stat(innerFileFullPath, (error, fileStats) => {
      if (error) {
        console.log(`Error reading file ${innerFileFullPath}: `, error);
        return;
      }

      const { name, extension } = getFileNameAndExtension(innerFileFullPath);
      const { size } = fileStats;
      logFileData(name, extension, size);
    });
  });
};

const secretFolderPath = path.join(__dirname, './secret-folder');
const folderContentPromise = fsPromises.readdir(secretFolderPath, {
  withFileTypes: true,
});
folderContentPromise.then((folderContent) =>
  logFolderContent(folderContent, secretFolderPath)
);
