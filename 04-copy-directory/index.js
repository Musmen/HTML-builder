const path = require('path');
const fs = require('fs');

const copyFile = (sourceContentPath, copyContentPath) => {
  fs.copyFile(sourceContentPath, copyContentPath, (error) => {
    if (error) console.log('File copy error: ', error);
  });
};

const copyDir = (sourceFolderPath, copyFolderPath) => {
  if (!sourceFolderPath || !copyFolderPath) return;

  fs.readdir(
    sourceFolderPath,
    { withFileTypes: true },
    (readDirError, folderContent) => {
      if (readDirError) {
        console.log('Read directory error: ', readDirError);
        return;
      }

      fs.rm(
        copyFolderPath,
        { force: true, recursive: true },
        (clearCopyFolderError) => {
          if (clearCopyFolderError)
            console.log('Clear copy folder error: ', clearCopyFolderError);

          fs.mkdir(copyFolderPath, { recursive: true }, (createDirError) => {
            if (createDirError) {
              console.log('Create directory error: ', createDirError);
              return;
            }

            folderContent.forEach((content) => {
              const sourceContentPath = path.join(
                sourceFolderPath,
                content.name
              );
              const copyContentPath = path.join(copyFolderPath, content.name);

              if (content.isDirectory()) {
                copyDir(sourceContentPath, copyContentPath);
                return;
              }

              copyFile(sourceContentPath, copyContentPath);
            });
          });
        }
      );
    }
  );
};

const folderPath = path.join(__dirname, './files');
const copyFolderPath = path.join(__dirname, './files-copy');

copyDir(folderPath, copyFolderPath);
