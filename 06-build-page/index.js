/* make HTML file */
const fs = require('node:fs');
const path = require('node:path');

async function fileReader(adress) {
  return fs.promises.readFile(adress, {encoding: 'utf8'}, () => {});
}

async function makeKeyValue(componentsPath, file, obj) {
  const filePath = path.join(componentsPath, file);
  let key = file.slice(0, (file.length - 5));
  let value = await fs.promises.readFile(filePath, {encoding: 'utf8'}, () => {});
  obj[key] = value;
}

async function getComponentsObj() {
  const componentsPath = path.join(__dirname, 'components');
  const components = await fs.promises.readdir(componentsPath);
  let componentsObj = {};

  const arrayOfPromises = components.map(async (file) => {
    return await makeKeyValue(componentsPath, file, componentsObj);
  });
  await Promise.all(arrayOfPromises);
  return componentsObj;
}

async function makeIndexHtml() {
  const templateHtmlPath = path.join(__dirname, 'template.html');
  const templateHtml = await fileReader(templateHtmlPath);

  const htmlComponents = await getComponentsObj();

  const projectDirPath = path.join(__dirname, 'project-dist');
  const indexHtmlPath = path.join(projectDirPath, 'index.html');
  await fs.promises.mkdir(projectDirPath, { recursive: true });

  const keysArr = Object.keys(htmlComponents);
  let templateHtmlCopy = templateHtml;

  for (let i = 0; i < keysArr.length; i ++) {
    const regexp = new RegExp(`{{${keysArr[i]}}}`, 'g');
    const replacement = htmlComponents[keysArr[i]];
    templateHtmlCopy = templateHtmlCopy.replace(regexp, (`${replacement}`));
  }

  fs.writeFile(indexHtmlPath, templateHtmlCopy, () => {});

}

/* make CSS file */
const stylesDirPath = path.join(__dirname, 'styles');

async function readDir(dirPath) {
  const projectDirPath = path.join(__dirname, 'project-dist');
  await fs.promises.mkdir(projectDirPath, { recursive: true });
  const bundlePath = path.join(projectDirPath, 'style.css');
  const writeStream = fs.createWriteStream(bundlePath);
  const stylesFiles = await fs.promises.readdir(dirPath);

  for(let file of stylesFiles) {
    const filePath = path.join(dirPath, file);
    const parsedFilePath = path.parse(filePath);
    const fileStat = await fs.promises.stat(filePath);

    if (fileStat.isFile() && (parsedFilePath.ext === '.css')) {
      const readStream = fs.createReadStream(filePath, {encoding: 'UTF-8'});

      readStream.on('data', (chunk) => {
        writeStream.write(chunk);
      });
    }
  }
}

/* copy assets folder */
const sourseDirPath = path.join(__dirname, 'assets');
const destDirPath = path.join(__dirname, 'project-dist', 'assets');

async function copyDir(sourse, dest) {
  await fs.promises.mkdir(dest, { recursive: true });
  const sourseFiles = await fs.promises.readdir(sourse);

  for (let entity of sourseFiles) {
    const soursePath = path.join(sourse, entity);
    const destPath = path.join(dest, entity);
    const fileStat = await fs.promises.stat(soursePath);

    if (fileStat.isFile()) {
      fs.copyFile(soursePath, destPath, () => {});
    } else {
      copyDir(soursePath, destPath);
    }
  }
}

makeIndexHtml();
readDir(stylesDirPath);
copyDir(sourseDirPath, destDirPath);
