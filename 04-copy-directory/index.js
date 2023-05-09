const fs = require('node:fs');
const path = require('node:path');

const sourseDir = path.join(__dirname, 'files');
const destDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  const dirStat = await fs.promises.stat(destDir);
  if (dirStat) {
    await fs.promises.rm(destDir, { recursive: true });
  }

  await fs.promises.mkdir(destDir, { recursive: true });
  const sourseFiles = await fs.promises.readdir(sourseDir);

  for (let file of sourseFiles) {
    const soursePath = path.join(sourseDir, file);
    const destPath = path.join(destDir, file);

    fs.copyFile(soursePath, destPath, () => {});
  }
}

copyDir();
