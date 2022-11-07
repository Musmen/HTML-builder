const path = require('path');
const fsPromises = require('fs/promises');

const copyDir = async (sourceFolderPath, copyFolderPath) => {
  if (!sourceFolderPath || !copyFolderPath) return;

  const folderContent = await fsPromises.readdir(sourceFolderPath, {
    withFileTypes: true,
  });

  await fsPromises.rm(copyFolderPath, { force: true, recursive: true });
  await fsPromises.mkdir(copyFolderPath, { recursive: true });

  folderContent.forEach(async (content) => {
    const sourceContentPath = path.join(sourceFolderPath, content.name);
    const copyContentPath = path.join(copyFolderPath, content.name);

    if (content.isDirectory()) {
      copyDir(sourceContentPath, copyContentPath);
    } else fsPromises.copyFile(sourceContentPath, copyContentPath);
  });
};

const folderPath = path.join(__dirname, './files');
const copyFolderPath = path.join(__dirname, './files-copy');

copyDir(folderPath, copyFolderPath);
