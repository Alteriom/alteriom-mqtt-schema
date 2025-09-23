#!/usr/bin/env node
// Rename .js outputs in dist/esm to .mjs for clearer ESM semantics while keeping root package commonjs.
const fs = require('fs');
const path = require('path');
const esmDir = path.resolve(__dirname, '../dist/esm');
if (!fs.existsSync(esmDir)) process.exit(0);
function walk(dir){
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full); else if (entry.endsWith('.js')) {
      const target = full.replace(/\.js$/, '.mjs');
      fs.renameSync(full, target);
    }
  }
}
walk(esmDir);
console.log('Renamed ESM .js -> .mjs in', esmDir);
