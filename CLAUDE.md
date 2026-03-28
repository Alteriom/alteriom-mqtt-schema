# CLAUDE.md — alteriom-mqtt-schema

TypeScript npm package providing MQTT v1 schemas, validators, and TypeScript types for the Alteriom IoT platform.

## Source of Truth

`docs/mqtt_schema/` is the authoritative schema source. Build scripts copy to:
- `src/schemas/` — for TypeScript compilation
- `schemas/` — for published package

## Generated Files (do NOT track in git)

- `src/schema_data.ts` — auto-generated from docs/mqtt_schema/
- `src/generated/types.ts` — auto-generated TypeScript types

## Build & Test

```bash
npm run build        # MUST run before test (generates src/schema_data.ts + types)
npm test             # vitest
npm run verify:schemas    # validate schema integrity
npm run verify:release    # pre-release integrity check
```

## Release Notes

- `check-release-integrity.cjs` reads `docs/mqtt_schema/CHANGELOG.md` (NOT root CHANGELOG.md)
- Version entries must use `v`-prefix format (e.g., `## v0.8.2`)
- HTTP transport is schema-agnostic — same validation applies

## Message Type Codes

| Range | Category |
|-------|----------|
| 100s  | Unified device |
| 200   | Sensor data |
| 300   | Gateway |
| 400   | Command |
| 500   | Firmware OTA |
| 600   | Mesh |
| 610   | Bridge |
| 700   | Config |
| 800   | Batch |
| 810   | Compressed batch |

## Version

Current: **0.8.2**
