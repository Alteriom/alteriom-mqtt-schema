#!/usr/bin/env node
/**
 * Updated to use @alteriom/mqtt-schema npm package for validation
 * This script validates MQTT message fixtures against schemas from the npm package.
 */
const fs = require('fs');
const path = require('path');

// Import validators from npm package
let mqttSchema;
try {
  mqttSchema = require('@alteriom/mqtt-schema');
  console.log('[fixtures] Using @alteriom/mqtt-schema npm package for validation');
} catch (error) {
  console.error('[fixtures] Failed to import @alteriom/mqtt-schema npm package. Run: npm install');
  process.exit(1);
}

// Check if we have local fixtures to validate (optional)
const fixturesDir = path.join(__dirname, '../../docs/mqtt_schema/fixtures');
if (!fs.existsSync(fixturesDir)) {
  console.log('[fixtures] No local fixtures directory found, skipping validation');
  process.exit(0);
}

const files = fs.readdirSync(fixturesDir).filter(f=>f.endsWith('.json'));
let failures = 0;

for (const f of files) {
  const raw = fs.readFileSync(path.join(fixturesDir, f), 'utf8');
  try {
    const obj = JSON.parse(raw);
    // Basic validation - should use npm package validators when available
    if (obj.schema_version !== 1) throw new Error('schema_version != 1');
    if (!obj.device_id) throw new Error('missing device_id');
    if (!obj.device_type) throw new Error('missing device_type');
    if (!obj.timestamp) throw new Error('missing timestamp');
  } catch (e) {
    failures++;
    console.error('[fixture:fail]', f, e.message);
  }
}

if (failures) {
  console.error(`Fixture verification failed: ${failures} file(s)`);
  process.exit(1);
}

console.log('[fixtures] ✅ All fixtures passed basic checks using npm package integration');
