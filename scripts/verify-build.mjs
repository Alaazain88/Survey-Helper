import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'www', 'index.html');
const proj4Path = path.join(projectRoot, 'www', 'proj4.js');

if (!fs.existsSync(indexPath(htmlPath))) {
  throw new Error('Missing generated web entry file: www/index.html');
}

if (!fs.existsSync(proj4Path)) {
  throw new Error('Missing generated proj4 bundle: www/proj4.js');
}

const html = fs.readFileSync(htmlPath, 'utf8');
if (!html.includes('./proj4.js')) {
  throw new Error('The HTML app does not reference ./proj4.js.');
}

const fileStats = fs.statSync(proj4Path);
if (fileStats.size <= 1000) {
  throw new Error('The generated proj4 bundle is unexpectedly small or empty.');
}

console.log('Build verification passed: index.html loads ./proj4.js and the proj4 bundle is present.');

function indexPath(target) {
  return target;
}
