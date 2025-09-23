# Copilot Instructions for @alteriom/mqtt-schema

## Project Architecture

This is a **schema-first validation library** for Alteriom MQTT v1 messages. The repository contains both the authoritative schemas AND the validation package that consumes them.

**Source of Truth**: The `docs/mqtt_schema/` directory contains the canonical JSON schemas and TypeScript types. The package build process copies these into the distributable package structure.

## Key Concepts

### Dual-Build ESM/CJS Pattern
- `tsconfig.json` → `dist/cjs/` (CommonJS with declarations)
- `tsconfig.esm.json` → `dist/esm/` (ES modules, no declarations)
- `scripts/post-esm.cjs` creates `dist/esm/package.json` with `type: "module"`
- All imports use `.js` extensions for ESM compatibility

### Schema Embedding Strategy
- `scripts/copy-schemas.cjs` copies schemas from `docs/mqtt_schema/` into `src/schemas/`
- Auto-generates `src/schema_data.ts` with embedded schema constants
- No runtime file I/O - schemas are bundled as JavaScript objects
- Supports tree-shaking when only specific validators are imported

### Message Classification
8 message types with heuristic classifier in `src/validators.ts`:
```typescript
// Classification priority order:
// 1. data.metrics → gatewayMetrics
// 2. data.sensors → sensorData  
// 3. data.progress_pct or OTA status → firmwareStatus
// 4. data.status + device_type=sensor → sensorStatus
// 5. data.status='ok'|'error' → controlResponse
// 6. device_type=gateway → gatewayInfo
// 7. fallback → sensorHeartbeat
```

## Development Workflows

### Build Process
```bash
npm run build  # Full dual build: CJS + ESM + schema copy
npm run build:cjs  # CommonJS only
npm run build:esm  # ESM only + post-processing
```

**Critical**: `npm run prebuild` must run before any build to copy schemas from local `docs/mqtt_schema/` directory.

### Testing
```bash
npm test  # Validates against fixtures from docs/mqtt_schema/fixtures/
# Tests both CJS and ESM entrypoints with real message samples
```

### Schema Updates
1. Update schemas in `docs/mqtt_schema/` directory
2. Run `npm run prebuild` to sync schemas into `src/`
3. Rebuild with `npm run build`

**Never edit `src/schema_data.ts` manually** - it's auto-generated.

## GitHub Workflows

The repository includes automated CI/CD workflows in `.github/workflow/`:

### Auto Release (`mqtt-schema-release.yml`)
- Triggers on main branch pushes affecting package.json or schema files
- Auto-creates tags for version bumps: `mqtt-schema-v{version}`
- Publishes to npm when commit message starts with `release:`
- Uses provenance for supply chain security

### Manual Publish (`mqtt-schema-publish-manual.yml`)
- Allows manual publishing with workflow dispatch
- Useful for hotfixes or manual release control

## Code Patterns

### Validation Result Interface
```typescript
interface ValidationResult {
  valid: boolean;
  errors?: string[]; // JSON Pointer style: "/sensors/temp value is required"
}
```

### Type Guards Usage
When classifier succeeds, use type guards for strong typing:
```typescript
const { kind, result } = classifyAndValidate(payload);
if (result.valid && isSensorDataMessage(payload)) {
  // payload is now strongly typed as SensorDataMessage
  payload.sensors.temp.value; // TypeScript knows this structure
}
```

### Ajv Singleton Pattern
- Single Ajv instance with pre-compiled validators
- `strict: false, allErrors: true, allowUnionTypes: true`
- Includes `ajv-formats` for date-time validation
- Base `envelope.schema.json` registered for `$ref` resolution

## Schema Constraints

### Heartbeat Exception
Only `sensor_heartbeat.schema.json` allows omitted `firmware_version`. All other message types require it.

### Forward Compatibility
- `additionalProperties: true` on all schemas
- Unknown fields are preserved (for future schema evolution)
- Forbidden deprecated aliases: `f`, `fw`, `ver`, `version`, `u`, `up`, `rssi`

### Numeric Ranges
- `quality_score`: 0.0-1.0 inclusive
- `battery_level`: 0-100 integer
- `signal_strength`: -200 to 0 dBm
- `progress_pct`: 0-100

## Package Structure

```
docs/mqtt_schema/           # Source of truth schemas & types
├── *.schema.json          # JSON Schema definitions
├── types.ts               # TypeScript type definitions
├── fixtures/              # Test message samples
└── validation_rules.md    # Validation constraints

src/
├── index.ts              # Main export surface
├── validators.ts         # Ajv validators + classification
├── types.ts             # Re-exports from generated/types.ts
├── schema_data.ts       # Auto-generated embedded schemas
└── generated/
    └── types.ts         # Copied from docs/mqtt_schema/

scripts/
├── copy-schemas.cjs     # Syncs schemas from docs/ to src/
├── post-esm.cjs        # ESM build post-processing
└── release-prepare.cjs  # Release automation
```

## Common Tasks

### Adding New Message Type
1. Add schema in `docs/mqtt_schema/`
2. Update `copy-schemas.cjs` copyList
3. Add validator in `validators.ts`
4. Add classification heuristic
5. Update TypeScript types in `docs/mqtt_schema/types.ts`

### Debugging Validation
Use `result.errors` array - each error includes JSON Pointer path:
```typescript
// Error: "/sensors/temp value is required"
// Means: payload.sensors.temp.value is missing
```

### Performance Notes
- Validators are pre-compiled at module load (not per-validation)
- Tree-shakeable: unused validators are eliminated in ESM builds
- No dynamic schema compilation needed for typical web usage

## Dependencies

- **Peer**: `ajv@>=8.0.0` (consumer must install)
- **Dev**: `ajv-formats` for date-time validation
- **Build**: `rimraf`, `typescript`

Keep dependencies minimal - this is a foundational library consumed by many services.