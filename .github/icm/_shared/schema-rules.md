---
verified_at: 2026-10-15
verified_commit: e5f0862bf733f7847ce67b653b66ab23468e071b
---

# Schema rules — compatibility, message codes, and what a change touches

## What a change costs in version

- The class of a change: `PUBLISH_CHECKLIST.md` "2. Version Decision" (docs or tooling only is a patch; optional fields, enum values or new message types are a minor; anything that breaks a valid payload is a major, coordinated with the firmware and services), and `CONTRIBUTING.md` "Modifying Existing Schemas". Before 1.0 the history broke in a minor once, with a migration document and a translation layer (`V080_BREAKING_CHANGES.md`, gateway codes 300→305 and 301→306, still translated at `src/validators.ts:219`): the class is the person's decision, made at the spec.
- What breaks a payload that validates today: a field made required, removed or renamed; a narrower type, enum, pattern or range; a moved code. What does not, and how to deprecate: `docs/SCHEMA_EXTENSIBILITY_GUIDE.md` "Extension Mechanisms", "Deprecation Strategy" and "Version Management"; `schema_version` stays `1` (`docs/mqtt_schema/envelope.schema.json`) until a breaking wire change.
- Forward compatibility: unknown properties are allowed (`additionalProperties: true`, or left unset) on every schema; keep it so (`CONTRIBUTING.md` "Schema Guidelines", JSON Schema draft 2020-12).

## Message type codes

- The codes that exist are the envelope's `message_type` enum (`docs/mqtt_schema/envelope.schema.json:88`) and `MESSAGE_TYPE_MAP` (`src/validators.ts:225`), which maps each to a validator; a new code goes in both. Code → schema file and purpose: `docs/SCHEMA_MAP.md`.
- `message_type` is optional; without it the classifier's heuristics decide (`src/validators.ts:274`), in order, so a heuristic placed early can capture payloads that used to classify elsewhere. `test/unit/classification.test.ts` holds both paths.
- A code is a wire contract with the firmware: it is never reused or moved without a major decision and a migration note.

## Field rules the schemas encode

- Base fields: `docs/mqtt_schema/envelope.schema.json` `required`. Apart from the batch and compressed containers, `docs/mqtt_schema/sensor_heartbeat.schema.json` is the only schema that does not include the envelope, so it alone may omit `firmware_version` (`docs/mqtt_schema/validation_rules.md` "Heartbeat Firmware Version Exception").
- Forbidden alias keys, numeric ranges, sensor object rules and drop reasons: `docs/mqtt_schema/validation_rules.md` "Forbidden / Drop Conditions", "Sensor Object Semantics", "Metrics Constraints". Every range is enforced by the schema that carries the field (`battery_level`, `signal_strength` in `docs/mqtt_schema/sensor_data.schema.json`; `progress_pct` in `docs/mqtt_schema/firmware_status.schema.json`). Timing rules there are the backend's, not the schemas'.
- Transports: MQTT, HTTP and the others validate against the same schemas; a transport adds only the optional `transport_metadata` defined once in the envelope and reused by the batch and compressed envelopes (`docs/HTTP_TRANSPORT_GUIDE.md` "Transport Metadata Field", `test/unit/transport-schema-coverage.test.ts`).
- OTA: `docs/mqtt_schema/ota/ota-manifest.schema.json`, `types/ota-manifest.d.ts`, `docs/OTA_MANIFEST.md`, artifacts in `test/artifacts/ota/`.

## What one new message type touches

The procedure is `DEVELOPMENT.md` "Adding a New Message Type" (with `CONTRIBUTING.md` "Adding New Message Types"). The files, so none is missed: the schema in `docs/mqtt_schema/`; its line in `copyList` (`scripts/copy-schemas.cjs:18`); its interface and type guard in `docs/mqtt_schema/types.ts`; its import, validator and `MESSAGE_TYPE_MAP` entry in `src/validators.ts`, and a heuristic only if payloads arrive without a code; its code in the envelope enum; a valid fixture; the regenerated `src/schemas/` copy (`npm run build`); `docs/SCHEMA_MAP.md`; an entry in both changelogs ([release.md](release.md)).
