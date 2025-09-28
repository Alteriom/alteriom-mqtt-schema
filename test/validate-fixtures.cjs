#!/usr/bin/env node
/* Enhanced cross-entrypoint validation test for @alteriom/mqtt-schema */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.resolve(__dirname, '../');
const fixturesDir = path.join(root, 'docs/mqtt_schema/fixtures');

function loadJSON(p){
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (err) {
    console.error(`❌ Failed to parse JSON file ${p}:`, err.message);
    throw err;
  }
}

if (!fs.existsSync(fixturesDir)) {
  console.error(`❌ Fixtures directory not found: ${fixturesDir}`);
  process.exit(1);
}

const fixtures = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.json'));
if (fixtures.length === 0) {
  console.warn('⚠️  No fixture files found in', fixturesDir);
  process.exit(0);
}

// CJS entrypoint
const cjs = require('../dist/cjs');

function runSet(label, api){
  console.log(`\n[${label}] Validating ${fixtures.length} fixture${fixtures.length === 1 ? '' : 's'}:`);
  let passed = 0;
  let failed = 0;
  
  for (const file of fixtures) {
    const full = path.join(fixturesDir, file);
    const payload = loadJSON(full);
    const { kind, result } = api.classifyAndValidate(payload);
    
    if (!result.valid) {
      console.error(`❌ ${file} (${kind || 'unknown'})`);
      if (result.errors && result.errors.length > 0) {
        result.errors.forEach(err => console.error(`   • ${err}`));
      }
      failed++;
    } else {
      console.log(`✅ ${file} (${kind})`);
      passed++;
    }
    
    assert(kind, `Expected classification kind for ${file}`);
  }
  
  console.log(`\n[${label}] Results: ${passed} passed, ${failed} failed`);
  if (failed > 0) {
    throw new Error(`${failed} fixture(s) failed validation under ${label}`);
  }
}

runSet('CJS', cjs);

// ESM dynamic import test (Node >=14 with experimental or >=16 stable)
(async () => {
  try {
    const esm = await import('../dist/esm/index.js');
    runSet('ESM', esm);
    console.log('\n🎉 All validations completed successfully!');
  } catch (err) {
    console.error('\n❌ ESM validation failed:', err.message);
    process.exit(1);
  }
})().catch(err => {
  console.error('\n❌ Unexpected error during ESM testing:', err.message);
  process.exit(1);
});
