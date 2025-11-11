# Release Summaries

Historical release documentation for @alteriom/mqtt-schema.

## Available Releases

### v0.8.1 (Current Release)
- **[V081_RELEASE_SUMMARY.md](./V081_RELEASE_SUMMARY.md)** - Release notes and compatibility verification

**Highlights**: PainlessMesh v1.8.2 compatibility, 161 tests passing, 6 new bridge fixtures

### v0.7.3
- **[V073_RELEASE_SUMMARY.md](./V073_RELEASE_SUMMARY.md)** - Release notes and feature highlights
- **[RELEASE_READY_V073.md](./RELEASE_READY_V073.md)** - Pre-release checklist and verification

**Highlights**: Message batching, compression support, comprehensive examples, 87% test coverage

### v0.7.1
- **[V071_RELEASE_SUMMARY.md](./V071_RELEASE_SUMMARY.md)** - Release notes and feature highlights

**Highlights**: Message type codes, PainlessMesh bridge schema, fast classification

## Current Release

📍 **v0.8.1** (November 2025)

See root documentation for current release:
- **[CHANGELOG.md](../../CHANGELOG.md)** - Complete version history (redirect file)
- **[docs/mqtt_schema/CHANGELOG.md](../mqtt_schema/CHANGELOG.md)** - Detailed changelog

**v0.8.1 Highlights**:
- ✅ PainlessMesh v1.8.2 compatibility verification
- ✅ Multi-bridge coordination support
- ✅ Message queue for offline mode
- ✅ 161 total tests passing (69 unit + 92 fixtures)
- ✅ 6 new bridge management fixtures

**v0.8.0 Highlights**:
- ⚠️ Breaking changes: Gateway code realignment (300→305, 301→306)
- Unified device schemas (101-105) for sensor/gateway/bridge/hybrid
- HTTP transport support via `transport_metadata`
- Bridge management schemas (610-614) for painlessMesh v1.8.0+
- Automatic legacy code translation with 6-month migration window

**Migration**: See [V080_BREAKING_CHANGES.md](../../V080_BREAKING_CHANGES.md)

## Release Process

For maintainers, see [PUBLISH_CHECKLIST.md](../../PUBLISH_CHECKLIST.md) for the release workflow.
