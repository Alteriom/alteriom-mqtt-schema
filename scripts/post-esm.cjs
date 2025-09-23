#!/usr/bin/env node
// Mark dist/esm as an ES module scope by writing a package.json with type: module
// This allows keeping root package type commonjs while enabling ESM .js files inside dist/esm
const fs = require('fs');
const path = require('path');
const esmDir = path.join(__dirname, '..', 'dist', 'esm');
if (fs.existsSync(esmDir)) {
  const pkgPath = path.join(esmDir, 'package.json');
  const pkg = { type: 'module' };
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log('Created dist/esm/package.json with type=module');
} else {
  console.warn('dist/esm directory not found');
}
