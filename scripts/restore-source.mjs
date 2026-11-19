import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { gunzipSync } from 'node:zlib';

// Restore editable source snapshots only when the files are absent.
const files = [
  ['source/App.jsx.gz', 'src/App.jsx'],
  ['source/styles.css.gz', 'src/styles.css'],
  ['source/wedding.js.gz', 'src/data/wedding.js'],
];

for (const [compressedPath, outputPath] of files) {
  if (existsSync(outputPath)) continue;
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, gunzipSync(readFileSync(compressedPath)));
  console.log(`Restored ${outputPath}`);
}
