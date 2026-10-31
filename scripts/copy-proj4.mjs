import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const webDir = path.join(projectRoot, 'www');
const sourceCandidates = [
  path.join(projectRoot, 'node_modules', 'proj4', 'dist', 'proj4.js'),
  path.join(projectRoot, 'node_modules', 'proj4', 'dist', 'proj4-src.js'),
  path.join(projectRoot, 'node_modules', 'proj4', 'lib', 'proj4.js'),
  path.join(projectRoot, 'node_modules', 'proj4', 'lib', 'index.js')
];

fs.mkdirSync(webDir, { recursive: true });

const sourcePath = sourceCandidates.find((candidate) => fs.existsSync(candidate));

if (!sourcePath) {
  throw new Error(
    'Unable to locate a proj4 bundle in node_modules. Run npm install before building.'
  );
}

const destinationPath = path.join(webDir, 'proj4.js');
fs.copyFileSync(sourcePath, destinationPath);

console.log(`Copied proj4 bundle from ${sourcePath} to ${destinationPath}`);
