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
- **NEW in v0.6.0**: Enhanced location/geolocation support for asset tracking
- **NEW in v0.6.0**: Extended sensor metadata (accuracy, calibration, operational range)
- **NEW in v0.6.0**: Comprehensive gateway health metrics (storage, network, errors)

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

## Command & Control (v0.5.0+)

Send commands to devices and receive responses with correlation tracking:

```ts
import { validators, isCommandMessage, isCommandResponseMessage } from '@alteriom/mqtt-schema';

// Create a command message
const command = {
  schema_version: 1,
  device_id: 'ALT-441D64F804A0',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'WEB 1.0.0',
  event: 'command',
  command: 'read_sensors',
  correlation_id: `cmd-${Date.now()}-001`,
  parameters: {
    immediate: true,
    sensors: ['temperature', 'humidity']
  },
  priority: 'high'
};

// Validate before sending
const cmdResult = validators.command(command);
if (cmdResult.valid) {
  // Publish to MQTT topic: alteriom/nodes/{device_id}/commands
  mqttClient.publish(`alteriom/nodes/${command.device_id}/commands`, JSON.stringify(command));
}

// Handle response from device
mqttClient.subscribe(`alteriom/nodes/${command.device_id}/responses`, (message) => {
  const response = JSON.parse(message);
  const respResult = validators.commandResponse(response);
  
  if (respResult.valid && isCommandResponseMessage(response)) {
    if (response.correlation_id === command.correlation_id) {
      if (response.success) {
        console.log('Command succeeded:', response.result);
        console.log(`Latency: ${response.latency_ms}ms`);
      } else {
        console.error(`Command failed: ${response.error_code} - ${response.message}`);
      }
    }
  }
});
```

**Command Pattern Features:**
- Event-based discrimination (`event: "command"` and `event: "command_response"`)
- Correlation IDs for request/response tracking
- Command name validation (lowercase snake_case)
- Flexible parameters object for command-specific data
- Priority field for queue management
- Success boolean and error codes in responses
- Latency tracking for performance monitoring

## Enhanced Location & Environment Tracking (v0.6.0+)

Track device location and deployment context for asset management and map-based visualization:

```ts
import { validators, isSensorDataMessage } from '@alteriom/mqtt-schema';

const sensorData = {
  schema_version: 1,
  device_id: 'SN456',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'SN 2.1.0',
  // Standardized location for map visualization
  location: {
    latitude: 43.6532,
    longitude: -79.3832,
    altitude: 76.5,
    accuracy_m: 10.0,
    zone: 'warehouse_A',
    description: 'Shelf 3, Row B'
  },
  // Deployment context
  environment: {
    deployment_type: 'indoor',
    power_source: 'battery',
    expected_battery_life_days: 365
  },
  sensors: {
    temperature: {
      value: 22.3,
      unit: 'C',
      // Enhanced sensor metadata
      timestamp: '2025-10-19T20:59:58.000Z',
      accuracy: 0.5,
      last_calibration: '2025-01-15',
      error_margin_pct: 2.0,
      operational_range: { min: -40, max: 85 },
      quality_score: 0.95
    }
  },
  battery_level: 78,
  signal_strength: -65
};

const result = validators.sensorData(sensorData);
if (result.valid && isSensorDataMessage(sensorData)) {
  // Display on map using location data
  displayOnMap(sensorData.location.latitude, sensorData.location.longitude);
  
  // Show sensor health based on metadata
  if (sensorData.sensors.temperature.accuracy) {
    console.log(`Temperature accuracy: ±${sensorData.sensors.temperature.accuracy}${sensorData.sensors.temperature.unit}`);
  }
  
  // Check calibration status
  const lastCal = new Date(sensorData.sensors.temperature.last_calibration);
  const daysSinceCalibration = (Date.now() - lastCal.getTime()) / (1000 * 60 * 60 * 24);
  if (daysSinceCalibration > 365) {
    console.warn('Sensor calibration overdue');
  }
}
```

**Location & Environment Features:**
- GPS coordinates (latitude, longitude, altitude) with accuracy tracking
- Zone-based organization (warehouses, floors, rooms)
- Human-readable location descriptions
- Deployment type tracking (indoor/outdoor/mobile)
- Power source information for battery management
- Per-sensor timestamps for async polling scenarios
- Sensor accuracy and calibration tracking
- Operational range validation support

## Enhanced Gateway Metrics (v0.6.0+)

Comprehensive system health monitoring for gateways:

```ts
import { validators, isGatewayMetricsMessage } from '@alteriom/mqtt-schema';

const metrics = {
  schema_version: 1,
  device_id: 'GW002',
  device_type: 'gateway',
  timestamp: new Date().toISOString(),
  firmware_version: 'GW 1.4.0',
  metrics: {
    uptime_s: 86400,
    cpu_usage_pct: 15.3,
    memory_usage_pct: 42.7,
    temperature_c: 45.2,
    // Enhanced storage metrics
    storage_usage_pct: 45.2,
    storage_total_mb: 512,
    storage_free_mb: 280.5,
    // Network bandwidth tracking
    network_rx_kbps: 125.4,
    network_tx_kbps: 89.3,
    active_connections: 5,
    // System health indicators
    error_count_24h: 3,
    warning_count_24h: 12,
    restart_count: 2,
    last_restart_reason: 'firmware_update',
    // Mesh network metrics
    connected_devices: 12,
    mesh_nodes: 8,
    packet_loss_pct: 0.5
  }
};

const result = validators.gatewayMetrics(metrics);
if (result.valid && isGatewayMetricsMessage(metrics)) {
  // Storage monitoring
  if (metrics.metrics.storage_usage_pct > 80) {
    console.warn('Storage usage critical:', metrics.metrics.storage_usage_pct);
  }
  
  // Network health
  const totalBandwidth = metrics.metrics.network_rx_kbps + metrics.metrics.network_tx_kbps;
  console.log(`Total bandwidth: ${totalBandwidth.toFixed(1)} kbps`);
  
  // Error trend analysis
  if (metrics.metrics.error_count_24h > 10) {
    console.error('High error rate detected:', metrics.metrics.error_count_24h);
  }
  
  // Restart tracking
  console.log(`Last restart: ${metrics.metrics.last_restart_reason}`);
  console.log(`Total restarts: ${metrics.metrics.restart_count}`);
}
```

**Enhanced Gateway Metrics Features:**
- Storage usage tracking (percentage, total, free space)
- Network bandwidth monitoring (RX/TX rates)
- Active connection counting
- Error and warning counters (24-hour rolling window)
- Restart tracking with reason codes
- All metrics are optional for gradual firmware adoption

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
| control_response.schema.json | Command/control response messages (deprecated, use command_response) |
| **command.schema.json** | **Device control commands (v0.5.0+)** |
| **command_response.schema.json** | **Command execution responses with correlation (v0.5.0+)** |
| mesh_node_list.schema.json | Mesh network node list with status |
| mesh_topology.schema.json | Mesh network topology and connections |
| mesh_alert.schema.json | Mesh network alerts and warnings |

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

`sensorData`, `sensorHeartbeat`, `sensorStatus`, `gatewayInfo`, `gatewayMetrics`, `firmwareStatus`, `controlResponse`, `command`, `commandResponse`, `meshNodeList`, `meshTopology`, `meshAlert`

### Classification Heuristics (Simplified)

- `event: "command"` → `command` (v0.5.0+)
- `event: "command_response"` → `commandResponse` (v0.5.0+)
- `metrics` → `gatewayMetrics`
- `sensors` → `sensorData`
- `nodes` array → `meshNodeList`
- `connections` array → `meshTopology`
- `alerts` array → `meshAlert`
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
