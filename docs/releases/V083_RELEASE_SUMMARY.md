# v0.8.3 - Shared Transport Validation

**Release target:** August 2026
**Type:** Backward-compatible patch release

## Overview

v0.8.3 makes the existing multi-protocol contract consistent across standard messages and transport containers. It also expands protocol identifiers for shipped Alteriom integrations without changing required fields or invalidating existing payloads.

## Changes

- Batch and compressed envelopes validate optional `transport_metadata` using the envelope's shared `$defs` contract.
- `envelope.schema.json` remains independently compilable for raw-schema consumers.
- Transport identifiers now include `lora`, `painlessmesh`, `serial`, and `ble` in addition to MQTT and HTTP(S).
- LoRa is accepted consistently by mesh bridge and mesh status contracts.
- TypeScript transport and mesh protocol unions match the JSON Schemas.
- The dependency lockfile resolves `fast-uri` 3.1.5 to address known security advisories.

## Compatibility

This release is backward compatible:

- `transport_metadata` remains optional.
- Existing MQTT, HTTP, and HTTPS values are unchanged.
- Batch and compressed containers do not inherit device-level required fields.
- Consumers compiling an individual message schema need only register `envelope.schema.json`, as before.

Malformed transport metadata that container validators previously ignored is now rejected. This is a correctness fix: such payloads never conformed to the documented transport contract.

## Verification Baseline

- 96 Vitest unit/integration tests
- 49 fixtures validated through both CJS and ESM builds (98 validations)
- 37 JSON Schemas compiled successfully
- 7 OTA manifest fixtures validated
- Node.js 18, 20, and 22 CI coverage
- Lint, schema synchronization, release integrity, package build, bundle-size, and CodeQL checks
- Zero known vulnerabilities reported by `npm audit`

## Registry Note

At release preparation time, the public npm `latest` tag still points to v0.8.0 while the repository contains v0.8.1 and v0.8.2 history. Publishing v0.8.3 therefore also delivers the intervening compatibility and CONFIG_SET_RESPONSE updates documented in the changelogs.

## Publish

Follow [PUBLISH_CHECKLIST.md](../../PUBLISH_CHECKLIST.md). The release commit must begin with `release:` for the automated npm and GitHub Packages workflow to publish after the version bump.
