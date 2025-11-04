# Development

```bash
npm install @alteriom/mqtt-schema ajv ajv-formats
```

**Support & Compatibility**: Node 18+ tested; Node 20 primary. Dual CJS/ESM builds.

### Fast Classification with Type Codes (v0.7.1+)

For optimal performance, include the optional `message_type` field:

```ts
import { classifyAndValidate, MessageTypeCodes } from '@alteriom/mqtt-schema';

const payload = {
  schema_version: 1,
  message_type: MessageTypeCodes.SENSOR_DATA, // 200 - enables 90% faster classification
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: new Date().toISOString(),
  firmware_version: 'SN 2.1.5',
  sensors: {
    temperature: { value: 22.5, unit: 'C' }
  }
};

const { kind, result } = classifyAndValidate(payload);
// Fast path: O(1) lookup vs O(n) heuristics
```

### Validate a JSON payload (object already parsed):

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

`schema_data.ts` is auto‑generated during build. This avoids dynamic `require()` / `import` of JSON and works cleanly in both Node ESM and bundlers without JSON import assertions. The original JSON files are still published under `schemas/` for tooling or documentation pipelines.

Schema stability is paramount. We track two related versions:

| Concept | Meaning |
|---------|---------|
| `schema_version` (in payload) | Wire format major. Only increments for breaking changes. |
| npm package version | Follows semver; patch/minor may add optional properties or tooling, major aligns with `schema_version` bump. |

Backward‑compatible additions: new optional properties or enums, documented in CHANGELOG. Breaking: new required fields, structural changes, or removed properties (triggers parallel `v2` schema path & coordinated firmware rollout).
