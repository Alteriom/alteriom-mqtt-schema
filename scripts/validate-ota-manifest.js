#!/usr/bin/env node
/* Validate all OTA manifest fixture files against the OTA manifest schema. */
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const root = process.cwd();
const schemaPath = path.join(root, 'schemas', 'ota', 'ota-manifest.schema.json');
const fixturesDir = path.join(root, 'test', 'artifacts', 'ota');

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function main() {
  if (!fs.existsSync(schemaPath)) {
    console.error('Schema file missing:', schemaPath);
    process.exit(1);
  }
  if (!fs.existsSync(fixturesDir)) {
    console.error('Fixtures directory missing:', fixturesDir);
    process.exit(1);
  }
  const schema = loadJSON(schemaPath);
  const ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const files = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.json'));
  let failures = 0;
  for (const file of files) {
    const data = loadJSON(path.join(fixturesDir, file));
    if (!validate(data)) {
      failures++;
      console.error(`\n❌ ${file}`);
      for (const err of validate.errors) {
        console.error(`  • ${err.instancePath || '(root)'}: ${err.message}`);
      }
    } else {
      console.log(`✅ ${file}`);
    }
  }
  if (failures > 0) {
    console.error(`\n${failures} file(s) failed OTA manifest validation.`);
    process.exit(1);
  }
  console.log(`\nAll ${files.length} OTA manifest fixture(s) passed.`);
}

if (require.main === module) main();
