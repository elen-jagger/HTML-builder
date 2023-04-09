const fs = require('node:fs');
const path = require('node:path');


const templateHtmlPath = path.join(__dirname, 'template.html');
const templateHtml = await fs.promises.readFile(templateHtmlPath, {encoding: 'utf8'}, () => {});

async function getComponentsObj() {
  const componentsPath = path.join(__dirname, 'components');
  const components = await fs.promises.readdir(componentsPath);
  let componentsObj = {};

  components.forEach(async (file) => {
    const filePath = path.join(componentsPath, file);
    let key = file.slice(0, (file.length - 5));
    let value = await fs.promises.readFile(filePath, {encoding: 'utf8'}, () => {});
    componentsObj[key] = value;
  });

  return componentsObj;
}

const htmlComponents = await getComponentsObj();

function getTegsIndexes(str, target) {
  let indexesArr = [];

  let position = 0;
  while (true) {
    let foundPos = str.indexOf(target, position);
    if (foundPos == -1) {break}
    else {
      indexesArr.push(foundPos);
      position = foundPos + 1;
    }
  }

  return indexesArr;
}

const openTegIndexes = getTegsIndexes(templateHtml, '{{');
const closeTegIndexes = getTegsIndexes(templateHtml, '}}');

const projectDirPath = path.join(__dirname, 'project-dist');
await fs.promises.mkdir(projectDirPath, { recursive: true });
const indexHtmlPath = path.join(projectDirPath, 'index.html');

function makeIndexHtml(startIndexes, endIndexes, templStr, comps) {
  let start = 0;

  for (let i = 0; i < startIndexes.length; i ++) {
    let existingHtml = templStr.slice(start, startIndexes[i]);
    fs.writeFile(indexHtmlPath, existingHtml, () => {});

    let teg = templStr.slice((startIndexes[i] + 2), endIndexes[i]);
    fs.writeFile(indexHtmlPath, comps[teg], () => {});

    start = endIndexes[i] + 2;
  }

  let lastExistingHtml = templStr.slice(start, templStr.length);
  if (lastExistingHtml) {
    fs.writeFile(indexHtmlPath, lastExistingHtml, () => {});
  }
}

makeIndexHtml(openTegIndexes, closeTegIndexes, templateHtml, htmlComponents);
