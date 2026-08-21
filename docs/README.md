# Documentation Index

This directory contains comprehensive documentation for the @alteriom/mqtt-schema package.

## Directory Structure

### `/mqtt_schema/` - Schema Definitions
- **JSON Schemas**: Authoritative schema definitions for all message types
- **Type Definitions**: TypeScript interfaces and type definitions
- **Fixtures**: Test message samples demonstrating valid message structures
- **Validation Rules**: Comprehensive validation constraints documentation

See: [mqtt_schema/README.md](mqtt_schema/README.md)

### `/releases/` - Historical Release Documentation
Archive of release summaries from previous versions:
- `V083_RELEASE_SUMMARY.md` - v0.8.3 release candidate notes
- `V081_RELEASE_SUMMARY.md` - v0.8.1 release notes
- `V073_RELEASE_SUMMARY.md` - v0.7.3 release notes
- `V071_RELEASE_SUMMARY.md` - v0.7.1 release notes
- `RELEASE_READY_V073.md` - v0.7.3 release checklist

**Current Release**: See [releases/README.md](releases/README.md) for details

**Breaking Changes**: See [V080_BREAKING_CHANGES.md](../V080_BREAKING_CHANGES.md) in root for v0.8.0 migration

### Root Documentation Files

Essential documentation maintained in the repository root:

#### User-Facing Documentation
- **[README.md](../README.md)** - Main package documentation
- **[CHANGELOG.md](../CHANGELOG.md)** - Complete version history

#### Contributor Documentation
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md)** - Community standards
- **[SECURITY.md](../SECURITY.md)** - Security policy
- **[PUBLISH_CHECKLIST.md](../PUBLISH_CHECKLIST.md)** - Release process

#### Current Release Documentation
- **[V080_BREAKING_CHANGES.md](../V080_BREAKING_CHANGES.md)** - v0.8.0 migration guide

## Quick Links

### Getting Started
- [Main README](../README.md#installation) - Installation and basic usage
- [Message Type Codes](../README.md#message-type-codes) - Complete code reference
- [Validation Examples](../README.md#usage) - Code examples

### Schema Development
- [Schema Directory](mqtt_schema/) - All schema definitions
- [Validation Rules](mqtt_schema/validation_rules.md) - Constraint documentation
- [Test Fixtures](mqtt_schema/fixtures/) - Valid message examples

### Contributing
- [Contributing Guide](../CONTRIBUTING.md) - How to contribute
- [Development Workflow](../README.md#development) - Build and test
- [Release Process](../PUBLISH_CHECKLIST.md) - Publishing steps

### Support
- [GitHub Issues](https://github.com/Alteriom/alteriom-mqtt-schema/issues) - Bug reports and feature requests
- [Security Policy](../SECURITY.md) - Responsible disclosure

## Version History

See [CHANGELOG.md](../CHANGELOG.md) (redirect) or [mqtt_schema/CHANGELOG.md](mqtt_schema/CHANGELOG.md) (detailed) for complete version history.

**Next Release Candidate**: v0.8.3 (August 2026)
- ✅ Shared transport validation for standard, batch, and compressed envelopes
- ✅ LoRa, painlessMesh, serial, and BLE transport identifiers
- ✅ 96 Vitest tests plus 98 CJS/ESM fixture validations

**Latest Repository Release**: v0.8.2 (March 2026)

**Previous Release**: v0.8.0 (November 2025)
- Unified device schemas (101-105)
- HTTP transport support
- Bridge management (610-614)
- Breaking changes: Gateway code realignment (300→305, 301→306)

See [releases/README.md](releases/README.md) for all release notes and [V080_BREAKING_CHANGES.md](../V080_BREAKING_CHANGES.md) for v0.8.0 migration guide.

## Additional Documentation

### Technical Guides
- **[OTA_MANIFEST.md](OTA_MANIFEST.md)** - OTA firmware update manifest reference
- **[PAINLESSMESH_INTEGRATION.md](PAINLESSMESH_INTEGRATION.md)** - PainlessMesh protocol integration guide
- **[SCHEMA_MAP.md](SCHEMA_MAP.md)** - Complete schema reference with type codes
- **[SCHEMA_COVERAGE_AND_EXTENSIBILITY.md](SCHEMA_COVERAGE_AND_EXTENSIBILITY.md)** - Comprehensive schema coverage assessment and extensibility patterns
- **[SCHEMA_EXTENSIBILITY_GUIDE.md](SCHEMA_EXTENSIBILITY_GUIDE.md)** - Detailed guide for extending schemas without breaking changes
- **[HTTP_TRANSPORT_GUIDE.md](HTTP_TRANSPORT_GUIDE.md)** - Complete guide for HTTP/MQTT bridge implementation

### Code Examples
- **[examples/mqtt-to-http-bridge.js](examples/mqtt-to-http-bridge.js)** - Working MQTT-to-HTTP bridge implementation with offline queuing
