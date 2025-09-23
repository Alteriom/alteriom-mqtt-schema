// Public export surface for @alteriom/mqtt-schema
// NOTE: This initial iteration re-exports pre-generated types produced in the firmware repo.
// In future, generation could move into this package build, but we intentionally depend on
// the firmware repo as the single source of truth to avoid divergence.

// Use explicit .js extensions so ESM build (with dist/esm/package.json type=module) treats them as ESM.
export * from './validators.js';
export * from './types.js';

