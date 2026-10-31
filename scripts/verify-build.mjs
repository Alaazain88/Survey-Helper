
import fs from 'node:fs';
import path from 'node:path';

const requiredFiles = [
  'www/index.html',
  'www/proj4.js',
  'www/js/coordinate-converter.js',
  'www/js/app.js'
];

let failed = false;

for (const file of requiredFiles) {
  const filePath = path.resolve(file);

  if (!fs.existsSync(filePath)) {
    console.error(`Missing file: ${file}`);
    failed = true;
    continue;
  }

  const stats = fs.statSync(filePath);

  if (!stats.isFile() || stats.size === 0) {
    console.error(`Invalid or empty file: ${file}`);
    failed = true;
  } else {
    console.log(`OK: ${file}`);
  }
}

if (failed) {
  console.error('Build verification failed.');
  process.exit(1);
}

console.log('Build verification successful.');
