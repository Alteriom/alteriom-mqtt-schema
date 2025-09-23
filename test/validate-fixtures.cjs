#!/usr/bin/env node
/* Simple cross-entrypoint validation test for @alteriom/mqtt-schema */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '../');
const fixturesDir = path.join(root, 'docs/mqtt_schema/fixtures');

function loadJSON(p){
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

const fixtures = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.json'));

// CJS entrypoint
const cjs = require('../dist/cjs');

function runSet(label, api){
  console.log(`\n[${label}] validating ${fixtures.length} fixtures`);
  for (const file of fixtures) {
    const full = path.join(fixturesDir, file);
    const payload = loadJSON(full);
    const { kind, result } = api.classifyAndValidate(payload);
    if (!result.valid) {
      console.error('FAILED', file, result.errors);
      throw new Error(`Fixture failed ${file}`);
    }
    assert(kind, 'Expected kind for ' + file);
    process.stdout.write('.');
  }
  console.log('\nAll fixtures valid under', label);
}

runSet('CJS', cjs);

// ESM dynamic import test (Node >=14 with experimental or >=16 stable)
(async () => {
  const esm = await import('../dist/esm/index.js');
  runSet('ESM', esm);
})();
