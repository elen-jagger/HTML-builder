const fs = require('node:fs');
const path = require('node:path');

const dirPath = path.join(__dirname, 'secret-folder');

async function getList(dirPath) {
  let fileNames = await fs.promises.readdir(dirPath);

  for (let fileName of fileNames) {
    const filePath = path.join(dirPath, fileName);
    const fileStat = await fs.promises.stat(filePath);

    if (fileStat.isFile()) {
      const parsedPath = path.parse(filePath);
      const size = fileStat.size;

      console.log(`${parsedPath.name} - ${parsedPath.ext.slice(1)} - ${size} b`);
    }
  }
}

getList(dirPath);
