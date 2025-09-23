#!/usr/bin/env node
/**
 * Updated to use @alteriom/mqtt-schema npm package instead of local docs/mqtt_schema
 * This script now imports schemas from the published npm package.
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '../../');

// Import from npm package instead of local docs
let mqttSchema;
try {
  mqttSchema = require('@alteriom/mqtt-schema');
  console.log('[schema] Using @alteriom/mqtt-schema npm package');
} catch (error) {
  console.error('[schema] Failed to import @alteriom/mqtt-schema npm package. Run: npm install');
  process.exit(1);
}

// The npm package provides schemas and types, so this script is now primarily for
// local development integration and validation
console.log('[schema] Package version:', mqttSchema.version || 'unknown');

// For backwards compatibility, we can still generate local types if needed
// but they should now import from the npm package
const localTypesPath = path.join(root, 'docs', 'mqtt_schema', 'types.ts');
const localTypesDir = path.dirname(localTypesPath);

// Create a wrapper that re-exports from the npm package
const wrapperContent = `// AUTO-GENERATED WRAPPER - Re-exports from @alteriom/mqtt-schema npm package
// This file provides backwards compatibility for local development
// Source: @alteriom/mqtt-schema npm package

export * from '@alteriom/mqtt-schema/types';

// Additional firmware-specific types can be added here if needed
`;

// Ensure directory exists
if (!fs.existsSync(localTypesDir)) {
  fs.mkdirSync(localTypesDir, { recursive: true });
}

fs.writeFileSync(localTypesPath, wrapperContent);
console.log('[schema] Generated local types wrapper -> types.ts (re-exports from npm package)');

console.log('[schema] ✅ Schema integration updated to use npm package');
