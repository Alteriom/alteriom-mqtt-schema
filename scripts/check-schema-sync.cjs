#!/usr/bin/env node
/**
 * Schema Diff Guard
 * Ensures source-of-truth schemas in docs/mqtt_schema/ match the copied build inputs in src/schemas/.
 * Fails (exit 1) if any JSON schema file differs or is missing.
 */
const fs = require('fs');
const path = require('path');

const docsDir = path.resolve(__dirname, '../docs/mqtt_schema');
const srcSchemasDir = path.resolve(__dirname, '../src/schemas');

if (!fs.existsSync(docsDir)) {
  console.error('[schema-sync] Source docs directory missing:', docsDir);
  process.exit(1);
}
if (!fs.existsSync(srcSchemasDir)) {
  console.error('[schema-sync] Copied schemas directory missing. Run: npm run prebuild');
  process.exit(1);
}

/** Stable stringify with sorted object keys for deterministic diff output */
function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(v => stableStringify(v)).join(',') + ']';
  return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',') + '}';
}

function readJson(p){
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { return { __read_error: e.message }; }
}

// Collect expected schema JSON files (explicit pattern: *.schema.json + mqtt_v1_bundle.json)
const docFiles = fs.readdirSync(docsDir)
  .filter(f => (f.endsWith('.schema.json') || f === 'mqtt_v1_bundle.json'))
  .sort();

let failures = 0;
const results = [];

for (const file of docFiles) {
  const docPath = path.join(docsDir, file);
  const copiedPath = path.join(srcSchemasDir, file);
  if (!fs.existsSync(copiedPath)) {
    failures++;
    results.push({ file, status: 'missing', message: 'Not found in src/schemas (run npm run prebuild)' });
    continue;
  }
  const docJson = readJson(docPath);
  const copiedJson = readJson(copiedPath);
  if (docJson.__read_error || copiedJson.__read_error) {
    failures++;
    results.push({ file, status: 'error', message: docJson.__read_error || copiedJson.__read_error });
    continue;
  }
  const docStr = stableStringify(docJson);
  const copiedStr = stableStringify(copiedJson);
  if (docStr !== copiedStr) {
    failures++;
    // Try to produce a simple line diff (very small) by JSON.stringify pretty form
    const prettyDoc = JSON.stringify(docJson, null, 2);
    const prettyCopied = JSON.stringify(copiedJson, null, 2);
    results.push({ file, status: 'diff', message: 'Content differs', doc: prettyDoc, copied: prettyCopied });
  } else {
    results.push({ file, status: 'ok' });
  }
}

// Detect extra copied schemas not in docs (likely stale / removed)
const copiedFiles = fs.readdirSync(srcSchemasDir)
  .filter(f => f.endsWith('.schema.json') || f === 'mqtt_v1_bundle.json')
  .sort();
for (const extra of copiedFiles) {
  if (!docFiles.includes(extra)) {
    failures++;
    results.push({ file: extra, status: 'extra', message: 'Exists in src/schemas but not in docs (remove or update copy-schemas list)' });
  }
}

for (const r of results) {
  if (r.status === 'ok') {
    console.log('[schema-sync][OK]', r.file);
  } else if (r.status === 'missing') {
    console.error('[schema-sync][MISSING]', r.file, '-', r.message);
  } else if (r.status === 'extra') {
    console.error('[schema-sync][EXTRA]', r.file, '-', r.message);
  } else if (r.status === 'diff') {
    console.error('[schema-sync][DIFF]', r.file, '-', r.message);
    // Provide a minimal context diff indicator (length only to avoid log flooding) unless small
    if (r.doc.length < 5000 && r.copied.length < 5000) {
      console.error('--- docs version ---');
      console.error(r.doc);
      console.error('--- copied version ---');
      console.error(r.copied);
    } else {
      console.error('Large diff suppressed (size docs/copied):', r.doc.length, r.copied.length);
    }
  } else if (r.status === 'error') {
    console.error('[schema-sync][ERROR]', r.file, '-', r.message);
  }
}

if (failures > 0) {
  console.error(`\n[schema-sync] FAILED: ${failures} issue(s) detected.`);
  console.error('Run: npm run prebuild (or update schemas) then re-run: npm run verify:schemas');
  process.exit(1);
}

console.log(`\n[schema-sync] All ${docFiles.length} schema file(s) in sync.`);
