# @alteriom/mqtt-schema

![Metadata Compliance](https://github.com/Alteriom/alteriom-mqtt-schema/actions/workflows/metadata-compliance.yml/badge.svg)
![OTA Manifest Validation](https://github.com/Alteriom/alteriom-mqtt-schema/actions/workflows/validate-ota-manifest.yml/badge.svg)
![Schema Verify](https://github.com/Alteriom/alteriom-mqtt-schema/actions/workflows/schema-verify.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/@alteriom/mqtt-schema.svg)
![npm downloads](https://img.shields.io/npm/dm/@alteriom/mqtt-schema.svg)
![license](https://img.shields.io/npm/l/@alteriom/mqtt-schema.svg)
![npm total downloads](https://img.shields.io/npm/dt/@alteriom/mqtt-schema.svg)
![node version](https://img.shields.io/node/v/@alteriom/mqtt-schema.svg)
![peer ajv](https://img.shields.io/badge/peer%20ajv-%3E%3D8.0.0-blue.svg)
![latest tag](https://img.shields.io/github/v/tag/Alteriom/alteriom-mqtt-schema?label=tag)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@alteriom/mqtt-schema)](https://bundlephobia.com/package/@alteriom/mqtt-schema)


Alteriom MQTT v1 JSON Schemas, TypeScript types, and production‑ready validation helpers for integrating firmware MQTT payloads into web or backend services.

 
## Why this exists
Firmware emits structured MQTT payloads that must remain tightly aligned with web, analytics, and gateway logic. This package is the single source of truth for:

- Canonical, versioned JSON Schemas (`schema_version: 1` series)
- Embedded (tree‑shakeable) schema objects — no runtime file I/O
- Precompiled Ajv validators (fast + consistent across CJS / ESM)
- TypeScript interfaces & type guards generated from the same source schema set
- Message classification helper that infers the schema kind heuristically
- Forward‑compatible design: unknown extra properties are ignored unless explicitly constrained

## Features

- Dual build: CommonJS + ESM (Node 16+ / bundlers)
- Zero configuration: just import and validate
- Helpful error paths (JSON Pointer style)
- Lightweight (Ajv peer dependency, schemas embedded)
- Ships original schema JSON files (optional consumption)

## Installation

```bash
npm install @alteriom/mqtt-schema ajv ajv-formats
```

**Support & Compatibility**: Node 18+ tested; Node 20 primary. Dual CJS/ESM builds.

## Quick Start

Validate a JSON payload (object already parsed):

```ts
import { validators } from '@alteriom/mqtt-schema';

const payload = JSON.parse(rawMqttString);
const result = validators.sensorData(payload);
if (!result.valid) {
  console.error('Invalid sensor data', result.errors);
}
```

Classify and validate automatically:

```ts
import { classifyAndValidate } from '@alteriom/mqtt-schema';

const { kind, result } = classifyAndValidate(payload);
if (result.valid) {
  console.log('Message kind:', kind);
} else {
  console.warn('Validation errors', result.errors);
}
```

Use strong TypeScript types after classification:

```ts
import { classifyAndValidate, isSensorDataMessage, SensorDataMessage } from '@alteriom/mqtt-schema';

const { result } = classifyAndValidate(payload);
if (result.valid && isSensorDataMessage(payload)) {
  const data: SensorDataMessage = payload;
  Object.entries(data.sensors).forEach(([name, s]) => {
    console.log(name, s.value, s.unit);
  });
}
```

Access raw schema JSON (if you need to introspect or power form generation):

```ts
import envelopeSchema from '@alteriom/mqtt-schema/schemas/envelope.schema.json';
```

## OTA Firmware Manifest Schema (v0.3.1+)

The package includes OTA firmware manifest schema with both rich and minimal formats.

**Preferred: Stable alias import** (v0.3.1+):
```ts
import otaManifestSchema from '@alteriom/mqtt-schema/ota-manifest';
import { OtaManifest, isRichManifest } from '@alteriom/mqtt-schema/types/ota-manifest';
```

**Legacy: Deep path import** (still supported):
```ts
import otaManifestSchema from '@alteriom/mqtt-schema/schemas/ota/ota-manifest.schema.json';
```

**Usage example:**
```ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import otaManifestSchema from '@alteriom/mqtt-schema/ota-manifest';
import { OtaManifest } from '@alteriom/mqtt-schema/types/ota-manifest';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile<OtaManifest>(otaManifestSchema as any);

const manifest: OtaManifest = JSON.parse(manifestJson);
if (!validate(manifest)) {
  console.error('Invalid OTA manifest:', validate.errors);
}
```

Supported formats:
- **Rich manifest**: environment + branch + manifests object
- **Minimal environment map**: environment → channels mapping  
- **Chunk variants**: structured objects or SHA256 array

## API Surface

```ts
import { validators, validateMessage, classifyAndValidate } from '@alteriom/mqtt-schema';

// 1. Direct validator by message kind
validators.sensorData(payload); // => { valid: boolean; errors?: string[] }

// 2. Generic function
validateMessage('sensorData', payload);

// 3. Classify unknown payload then validate
const { kind, result } = classifyAndValidate(payload);

// 4. Type guards (when available)
// if (isSensorDataMessage(payload)) { ... }
```

Validation result format:

```ts
interface ValidationResult {
  valid: boolean;
  errors?: string[]; // Each item contains instancePath + message
}
```

### Performance Notes

All Ajv validator functions are compiled once at module load. For typical web usage (tens to hundreds of validations per page/session) this is faster and simpler than on‑demand compilation. If you need custom Ajv options (e.g., different formats), open an issue—an override hook can be added without breaking changes.

### Embedded Schemas

`schema_data.ts` is auto‑generated during build. This avoids dynamic `require()` / `import` of JSON and works cleanly in both Node ESM and bundlers without JSON import assertions. The original JSON files are still published under `schemas/` for tooling or documentation pipelines.

## Provided Schemas (v1)

| File | Purpose |
|------|---------|
| envelope.schema.json | Base required envelope fields |
| sensor_data.schema.json | Telemetry payload with sensors map |
| sensor_heartbeat.schema.json | Lightweight heartbeat (firmware_version may be omitted) |
| sensor_status.schema.json | Sensor status / presence updates |
| gateway_info.schema.json | Gateway identity & capabilities |
| gateway_metrics.schema.json | Gateway performance metrics |
| firmware_status.schema.json | Firmware update lifecycle events |
| control_response.schema.json | Command/control response messages |

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `validators` | object | Precompiled validators per message type |
| `validateMessage(kind,data)` | fn | Run a specific validator by key |
| `classifyAndValidate(data)` | fn | Heuristic classification + validation |
| `SensorDataMessage` etc. | TS interfaces | Strongly typed shapes |
| `isSensorDataMessage` etc. | type guards | Runtime narrowing helpers |
| `schemas/*.json` | JSON | Original schema assets (optional) |

### Validator Keys

`sensorData`, `sensorHeartbeat`, `sensorStatus`, `gatewayInfo`, `gatewayMetrics`, `firmwareStatus`, `controlResponse`

### Classification Heuristics (Simplified)

- `metrics` → `gatewayMetrics`
- `sensors` → `sensorData`
- `progress_pct` or OTA status keywords → `firmwareStatus`
- `status` + `device_type: sensor` → `sensorStatus`
- `status: ok|error` (no other match) → `controlResponse`
- `device_type: gateway` → `gatewayInfo`
- fallback → `sensorHeartbeat`

## Versioning Policy

Schema stability is paramount. We track two related versions:

| Concept | Meaning |
|---------|---------|
| `schema_version` (in payload) | Wire format major. Only increments for breaking changes. |
| npm package version | Follows semver; patch/minor may add optional properties or tooling, major aligns with `schema_version` bump. |

Backward‑compatible additions: new optional properties or enums, documented in CHANGELOG. Breaking: new required fields, structural changes, or removed properties (triggers parallel `v2` schema path & coordinated firmware rollout).

## TypeScript / Bundler Notes

- Works in TS >= 5, Node >= 16, Vite / Webpack / ESBuild.
- Tree shaking: unused validators pruned when using ESM builds.
- No side effects besides Ajv instance creation.

## Roadmap

- Optional custom Ajv injection hook
- JSON Schema → Zod conversion example
- Runtime metrics helper (count validation categories)

## Contributing

Issues & PRs welcome. Ensure firmware repo schemas remain the authoritative source—do not manually edit generated `schema_data.ts`.

### Development Workflow

**Before opening a PR:** Run the comprehensive validation suite:

```bash
npm run verify        # Schema sync + changelog + fixtures
npm run verify:all    # Additional schema compilation + OTA manifest validation  
npm test              # Enhanced fixture validation with detailed reporting
```

**Available validation scripts:**
- `npm run test` - Cross-platform fixture validation (CJS/ESM) with enhanced error reporting
- `npm run test:ota` - OTA manifest fixture validation
- `npm run verify:schemas` - Ensure schemas are synced from source directory
- `npm run verify:release` - Check changelog contains current version
- `npm run verify:all` - Comprehensive schema compilation and fixture validation

### Script Organization

Scripts are organized by category in `package.json`:
- **Build Scripts**: `build`, `build:cjs`, `build:esm`, `clean`, etc.
- **Testing & Validation**: `test`, `verify:*`, etc.  
- **Release Management**: `release:prepare`, `wiki:generate`
- **Repository Metadata**: `metadata:*` (organization compliance)

### Release Process

See `PUBLISH_CHECKLIST.md` for detailed release procedures. Quick summary:
1. Update schemas in `docs/mqtt_schema/`
2. Run `npm run verify` to ensure everything is valid
3. Use `npm run release:prepare -- patch|minor|major` for version bumping
4. Follow checklist for tagging and publishing

## Security

Schemas are static. No network access. Supply-chain risk minimized by keeping dependencies minimal (Ajv + formats only).

## License

MIT

## Registry Mirrors

This package is published to BOTH:

- Public npm registry: `https://registry.npmjs.org` (primary)
- GitHub Packages registry: `https://npm.pkg.github.com` (mirror for visibility in repo Packages tab)

### Installing from GitHub Packages (optional)

Create or update an `.npmrc` with a scoped registry override (auth token with `read:packages` required):

```bash
@alteriom:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Then install normally:

```bash
npm install @alteriom/mqtt-schema ajv ajv-formats
```

If you omit the override, npmjs.org is used (recommended for most consumers).

### Why dual publish?

- GitHub Packages listing provides provenance + quick visibility in the repo UI.
- npm remains the canonical public distribution source (faster, anonymous installs allowed).

### Operational Notes

| Aspect | Behavior |
|--------|----------|
| Build artifact | Built once, same tarball published to both registries. |
| Version uniqueness | Same version must not be republished; bump if any change needed. |
| Auth (GitHub) | Always required for install from GitHub Packages, even for public repos. |
| Tarball parity | Do not rebuild between publishes; workflows ensure single build. |
| Fallback strategy | If mirror publish fails (e.g., transient), primary npm publish still stands. |
| Provenance flag | Applied for npm (GitHub ignores currently). |

### Verifying a Release

```bash
npm view @alteriom/mqtt-schema version
npm view @alteriom/mqtt-schema version --registry=https://npm.pkg.github.com
```

Both should return the same version.

## Repository Metadata Compliance

This repository integrates the `@alteriom/repository-metadata-manager` tooling to continuously validate and report on repository metadata health (description, topics, documentation signals, etc.) within the Alteriom organization standards.

### Local Usage

Run a validation (non‑destructive):

```bash
npm run metadata:validate
```

Generate a detailed report:

```bash
npm run metadata:report
```

Configuration lives in `metadata-config.json` (organizationTag `alteriom`). Default detection is auto; adjust if repository classification needs overriding.

### CI Workflow

Workflow file: `.github/workflows/metadata-compliance.yml`

On each push / PR against `main` it will:

1. Install dependencies
2. Run `metadata:validate` (fails job on hard non‑compliance)
3. Always attempt a best‑effort report (`metadata:report`) for visibility

### Tokens / Permissions

The workflow relies only on the default `GITHUB_TOKEN` for read operations. If future auto‑apply operations are desired, a token with elevated repo scope would be needed and the `metadata:apply` script could be wired (currently omitted to keep CI read‑only).

### Extending

If you add new categories of tooling or documentation, re‑run the report to see updated recommendations. For cross‑repo analytics or policy generation, use the original project directly.

### Applying Metadata (Manual Workflow)

For authorized maintainers you can run adjustments via GitHub Actions:

1. Open the "Repository Metadata Apply" workflow under the Actions tab.
2. Choose whether to keep `dryRun` (default) or set to `false` to apply.
3. Run the workflow; the log will show proposed or applied changes.

Local dry‑run vs apply:

```bash
npm run metadata:apply:dry  # show what would change
npm run metadata:apply      # apply changes (requires proper permissions via GITHUB_TOKEN)
```

Note: Applying metadata modifies repository settings (description, topics) through the GitHub API; ensure the default token has the necessary repo scopes (in public repositories the workflow GITHUB_TOKEN normally suffices for these fields).
