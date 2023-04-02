const fs = require('node:fs');
const path = require('node:path');

const stylesDirPath = path.join(__dirname, 'styles');
const projectDirPath = path.join(__dirname, 'project-dist');
const bundlePath = path.join(projectDirPath, 'bundle.css');
const writeStream = fs.createWriteStream(bundlePath);

async function readDir(dirPath) {
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

readDir(stylesDirPath);
