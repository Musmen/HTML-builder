const path = require('path');
const fsPromises = require('fs/promises');

const hasCSSExtension = (fileName) => path.parse(fileName).ext === '.css';

const filterCSSFiles = (folderContent) =>
  folderContent.filter(
    (content) => !content.isDirectory() && hasCSSExtension(content.name)
  );

const bundleCSS = async (
  sourcePath = path.join(__dirname, './styles'),
  distPath = path.join(__dirname, './project-dist/bundle.css')
) => {
  const sourceContent = await fsPromises.readdir(sourcePath, {
    withFileTypes: true,
  });

  const cssFiles = filterCSSFiles(sourceContent);

  let textCSS = await Promise.all(
    cssFiles.map((content) =>
      fsPromises.readFile(path.join(sourcePath, content.name))
    )
  );

  textCSS = textCSS.map((cssText) => cssText + '\r\n');

  fsPromises.writeFile(distPath, textCSS);
};

bundleCSS();
