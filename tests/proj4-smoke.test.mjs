import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const htmlPath = path.join(projectRoot, 'www', 'index.html');
const proj4Path = path.join(projectRoot, 'www', 'proj4.js');

test('index.html references the proj4 bundle', () => {
  assert.ok(fs.existsSync(htmlPath), 'www/index.html is missing.');
  const html = fs.readFileSync(htmlPath, 'utf8');
  assert.match(html, /<script src="\.\/proj4\.js"><\/script>/, 'The app must load proj4.js from the web root.');
});

test('proj4 bundle exists and is non-empty after build', () => {
  assert.ok(fs.existsSync(proj4Path), 'www/proj4.js is missing; run npm run build first.');
  const stats = fs.statSync(proj4Path);
  assert.ok(stats.size > 1000, 'www/proj4.js is unexpectedly empty or incomplete.');
});
