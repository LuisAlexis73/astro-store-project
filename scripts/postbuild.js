import fs from 'fs';
import path from 'path';

const entryPath = path.resolve('./.netlify/build/entry.mjs');

let content = fs.readFileSync(entryPath, 'utf-8');
content = content.replace(
  /serverEntryPointModule\[_start\]\(_manifest, _args\);/,
  'serverEntryPointModule(_manifest, _args);'
);
fs.writeFileSync(entryPath, content);
console.log('OK: entry.mjs patch for Netlify');
