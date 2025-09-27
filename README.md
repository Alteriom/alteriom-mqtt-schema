# @alteriom/mqtt-schema

![Metadata Compliance](https://github.com/Alteriom/alteriom-mqtt-schema/actions/workflows/metadata-compliance.yml/badge.svg)
![npm version](https://img.shields.io/npm/v/@alteriom/mqtt-schema.svg)
![npm downloads](https://img.shields.io/npm/dm/@alteriom/mqtt-schema.svg)
![license](https://img.shields.io/npm/l/@alteriom/mqtt-schema.svg)
![npm total downloads](https://img.shields.io/npm/dt/@alteriom/mqtt-schema.svg)
![node version](https://img.shields.io/node/v/@alteriom/mqtt-schema.svg)
![peer ajv](https://img.shields.io/badge/peer%20ajv-%3E%3D8.0.0-blue.svg)
![latest tag](https://img.shields.io/github/v/tag/Alteriom/alteriom-mqtt-schema?label=tag)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@alteriom/mqtt-schema)](https://bundlephobia.com/package/@alteriom/mqtt-schema)

Alteriom MQTT v1 JSON Schemas, TypeScript types, and production‑ready validation helpers for integrating firmware MQTT payloads into web or backend services.

> NOTE: OTA manifest CI validation workflow file could not be added via automated API due to path constraints; it can be added manually post-merge if still absent.

See also: `docs/SCHEMA_MAP.md` for complete schema listing.

## OTA Firmware Manifest Schema (NEW in 0.3.0)

The package now includes the OTA firmware manifest schema used by build + deployment tooling.

Import the schema JSON directly:
```ts
import otaManifestSchema from '@alteriom/mqtt-schema/schemas/ota/ota-manifest.schema.json';
```

Types:
```ts
import { OtaManifest, isRichManifest } from '@alteriom/mqtt-schema/types/ota-manifest';
```

Shapes supported (oneOf):
- Rich manifest:
```json
{
  "environment": "universal-sensor",
  "branch": "main",
  "manifests": { "dev": { /* richEntry */ }, "prod": { /* richEntry */ } }
}
```
- Minimal environment map:
```json
{
  "universal-sensor": { "dev": { /* minimalChannel */ } }
}
```

Chunk hashing variants (mutually exclusive):
1. Structured objects (offset + size + sha256)
2. Array of lowercase sha256 strings

Validation example:
```ts
import Ajv from 'ajv';
import schema from '@alteriom/mqtt-schema/schemas/ota/ota-manifest.schema.json';
import { OtaManifest } from '@alteriom/mqtt-schema/types/ota-manifest';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile<OtaManifest>(schema as any);
const manifest: OtaManifest = JSON.parse(raw);
if (!validate(manifest)) {
  console.error(validate.errors);
}
```

---

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
| `schemas/ota/ota-manifest.schema.json` | JSON | OTA firmware manifest schema (rich + minimal) |
| `types/ota-manifest` | TS types | OtaManifest union + helpers |

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

Backward-compatible schema additions to OTA manifest WILL use minor bumps.

## TypeScript / Bundler Notes

- Works in TS >= 5, Node >= 16, Vite / Webpack / ESBuild.
- Tree shaking: unused validators pruned when using ESM builds.
- No side effects besides Ajv instance creation.

## Roadmap

- Optional custom Ajv injection hook
- JSON Schema → Zod conversion example
- Runtime metrics helper (count validation categories)
- Signed OTA manifest extension
- Delta / compressed OTA metadata fields

## Contributing

Issues & PRs welcome. Ensure firmware repo schemas remain the authoritative source—do not manually edit generated `schema_data.ts`.

## Security

Schemas are static. No network access. Supply-chain risk minimized by keeping dependencies minimal (Ajv + formats only).

## License

MIT
