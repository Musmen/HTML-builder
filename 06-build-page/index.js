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

const hasExtension = (extension, fileName) =>
  path.parse(fileName).ext === `.${extension}`;
const hasCSSExtension = (fileName) => hasExtension('css', fileName);
const hasHTMLExtension = (fileName) => hasExtension('html', fileName);

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

const parseComponentsNames = (componentsFiles) =>
  componentsFiles.map((componentFile) => path.parse(componentFile.name).name);

const getComponentsFiles = () => {
  const componentFolderPath = path.join(__dirname, './components');
  const componentsFiles = fsPromises.readdir(componentFolderPath, {
    withFileTypes: true,
  });
  return componentsFiles;
};

const getComponentHTML = (componentPath = './template.html') => {
  const templateHTMLPath = path.join(__dirname, componentPath);
  const templateHTML = fsPromises.readFile(templateHTMLPath, 'utf-8');
  return templateHTML;
};

const generateHTMLBundle = async (
  distFolderPath = path.join(__dirname, './dist')
) => {
  let resultHTML = await getComponentHTML();

  const componentsFiles = await getComponentsFiles();
  const componentsHTMLs = await Promise.all(
    componentsFiles
      .filter((componentFile) => hasHTMLExtension(componentFile.name))
      .map((componentFile) => {
        const componetHTML = getComponentHTML(
          `./components/${componentFile.name}`
        );
        return componetHTML;
      })
  );

  const componentsNames = parseComponentsNames(componentsFiles);
  componentsNames.map((componentName, index) => {
    const regExp = new RegExp(`{{${componentName}}}`, 'ig');
    resultHTML = resultHTML.replace(regExp, componentsHTMLs[index]);
  });

  await fsPromises.rm(distFolderPath, { force: true, recursive: true });
  await fsPromises.mkdir(distFolderPath, { recursive: true });

  const resultHTMLPath = path.join(distFolderPath, './index.html');
  return fsPromises.writeFile(resultHTMLPath, resultHTML);
};

const createPage = async () => {
  const distFolderPath = path.join(__dirname, './project-dist');
  await generateHTMLBundle(distFolderPath);

  const sourceCSSPath = path.join(__dirname, './styles');
  const bundleCSSPath = path.join(__dirname, './project-dist/style.css');
  await bundleCSS(sourceCSSPath, bundleCSSPath);

  const sourceAssetsPath = path.join(__dirname, './assets');
  const distAssetsPath = path.join(__dirname, './project-dist/assets');
  await copyDir(sourceAssetsPath, distAssetsPath);
};

createPage();
