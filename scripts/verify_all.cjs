#!/usr/bin/env node
/* Unified verification script for 0.3.1
 * Performs:
 *  1. Load all JSON Schemas under ./schemas (recursive)
 *  2. Ajv compile each schema (detect compilation errors)
 *  3. Collect & verify unique $id values
 *  4. Validate OTA fixtures (delegates to existing validate-ota-manifest.js)
 *  5. Basic $ref target existence check (local refs only)
 *  6. (Future) orphan schema detection placeholder
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const root = process.cwd();
const schemasDir = path.join(root, 'schemas');
const otaValidatorScript = path.join(root, 'scripts', 'validate-ota-manifest.js');

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(p); else yield p;
  }
}

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

function compileAllSchemas() {
  if (!fs.existsSync(schemasDir)) {
    console.error('Schemas directory missing:', schemasDir);
    process.exit(1);
  }
  const ajv = new Ajv({ allErrors: true, strict: false, validateSchema: false });
  addFormats(ajv);
  const schemaFiles = Array.from(walk(schemasDir)).filter(f => f.endsWith('.json'));
  const idSet = new Set();
  let compileFailures = 0;
  let refFailures = 0;

  // First pass: load all schemas and add to AJV for reference resolution
  const schemas = [];
  for (const file of schemaFiles) {
    const schema = loadJSON(file);
    schemas.push({ file, schema });
    if (schema.$id) {
      try {
        ajv.addSchema(schema);
      } catch (e) {
        // Will retry in compilation phase
      }
    }
  }

  // Second pass: check for duplicates and compile
  for (const { file, schema } of schemas) {
    // Track $id uniqueness
    if (schema.$id) {
      if (idSet.has(schema.$id)) {
        console.error(`Duplicate $id detected: ${schema.$id} in ${file}`);
        compileFailures++;
      } else {
        idSet.add(schema.$id);
      }
    }
    try {
      ajv.compile(schema); // compile; errors thrown captured below
    } catch (e) {
      console.error(`\n❌ Compile error in ${file}`);
      console.error(String(e));
      compileFailures++;
    }
    // Simple local $ref existence check ("#/" or internal definitions)
    const text = fs.readFileSync(file, 'utf8');
    const refMatches = text.match(/"\$ref"\s*:\s*"([^"]+)"/g) || [];
    for (const m of refMatches) {
      const ref = m.split(':')[1].trim().replace(/^"|"$/g, '');
      if (ref.startsWith('#/')) {
        // Basic path traversal into schema object
        const parts = ref.substring(2).split('/');
        let cur = schema;
        for (const part of parts) {
          if (cur && Object.prototype.hasOwnProperty.call(cur, part)) {
            cur = cur[part];
          } else {
            console.error(`Broken local $ref ${ref} in ${file}`);
            refFailures++;
            break;
          }
        }
      }
    }
  }

  return { compileFailures, refFailures, total: schemaFiles.length };
}

function runOtaFixtureValidation() {
  if (!fs.existsSync(otaValidatorScript)) {
    console.warn('⚠️  [verify_all] OTA validator script missing, skipping OTA fixtures.');
    return 0;
  }
  const result = require('child_process').spawnSync('node', [otaValidatorScript], { 
    stdio: ['inherit', 'pipe', 'pipe'],
    encoding: 'utf8'
  });
  
  if (result.stdout) {
    // Re-output the OTA validation results with proper formatting
    result.stdout.split('\n').forEach(line => {
      if (line.trim()) console.log(`   ${line}`);
    });
  }
  
  if (result.stderr && result.stderr.trim()) {
    console.error('   OTA validation errors:', result.stderr.trim());
  }
  
  return result.status || 0;
}

function main() {
  console.log('🔍 [verify_all] Starting unified schema verification\n');
  
  const { compileFailures, refFailures, total } = compileAllSchemas();
  if (compileFailures === 0 && refFailures === 0) {
    console.log(`✅ [verify_all] Successfully compiled ${total} schema file(s)`);
  } else {
    console.error(`❌ [verify_all] Schema compilation issues found`);
  }

  console.log('\n🔍 [verify_all] Validating OTA manifest fixtures...');
  const otaStatus = runOtaFixtureValidation();

  let exitCode = 0;
  if (compileFailures) exitCode = 1;
  if (refFailures) exitCode = 1;
  if (otaStatus !== 0) exitCode = 1;

  console.log('\n📊 [verify_all] Summary:');
  console.log(`   Schema files compiled: ${total}`);
  console.log(`   Compilation failures: ${compileFailures}`);
  console.log(`   Reference failures: ${refFailures}`);
  console.log(`   OTA validation status: ${otaStatus === 0 ? 'PASS' : 'FAIL'}`);

  if (exitCode !== 0) {
    console.error(`\n❌ [verify_all] FAILED with errors`);
  } else {
    console.log(`\n🎉 [verify_all] SUCCESS - All validations passed!`);
  }
  process.exit(exitCode);
}

if (require.main === module) main();
