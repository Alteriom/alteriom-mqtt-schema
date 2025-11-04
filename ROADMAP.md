# @alteriom/mqtt-schema Roadmap

This document outlines the planned features, improvements, and long-term vision for the Alteriom MQTT Schema package.

## Version History

- **v0.7.2** (Current) - Message type codes, expanded schemas, PainlessMesh integration
- **v0.7.1** - Device configuration management, mesh bridge schema
- **v0.7.0** - OTA enhancement with security features
- **v0.6.0** - Location tracking, sensor metadata, gateway metrics
- **v0.5.0** - Command and control messaging

## Short Term (v0.7.3 - Q4 2025)

### Code Quality & Developer Experience
- [x] ESLint configuration
- [x] Prettier code formatting
- [x] Contributing guidelines
- [x] Code of conduct
- [x] Security policy
- [x] GitHub issue templates
- [x] Pre-commit hooks (Husky) ✅ **Phase 2 Complete**
- [x] Automated dependency updates (Dependabot) ✅ **Phase 2 Complete**

### Testing & Quality Assurance
- [x] Unit tests for validators ✅ **Phase 2 Complete (19 tests)**
- [x] Unit tests for classification logic ✅ **Phase 2 Complete (26 tests)**
- [x] Test coverage reporting ✅ **Phase 2 Complete (84% coverage)**
- [x] Continuous integration improvements ✅ **Phase 2 Complete (PR validation)**
- [x] Integration tests for dual builds ✅ **Phase 3 Complete (12 tests)**
- [x] Performance benchmarks ✅ **Phase 3 Complete (classification + validation)**

### Documentation
- [ ] More code examples
- [ ] Migration guides between versions
- [ ] Architecture diagrams
- [ ] Video tutorials
- [ ] Interactive schema explorer

## Medium Term (v0.8.0 - Q1 2026)

### Feature Enhancements

#### Message Queuing & Retry Policies
- Schema support for message queuing metadata
- Retry policy configuration in device_config
- Dead letter queue support
- Message priority queuing

#### Advanced Mesh Routing Metrics
- Detailed hop-by-hop routing information
- Network partition detection
- Mesh healing metrics
- Bandwidth utilization tracking

#### Configuration Management
- Configuration templates
- Bulk configuration deployment
- Configuration inheritance (fleet → device)
- Configuration diff and rollback
- Role-based configuration access

#### Data Quality Metadata
- Data quality scores per sensor
- Anomaly detection flags
- Confidence intervals
- Data freshness indicators

### Performance Optimizations
- Lazy validator compilation option
- Schema caching improvements
- Bundle size optimization
- Tree-shaking enhancements

### Developer Tools
- VS Code extension for schema validation
- CLI tool for schema testing
- Schema documentation generator
- Mock data generator
- Validation playground (web-based)

## Long Term (v1.0.0 - Q2-Q3 2026)

### Breaking Changes (Major Version)

#### Required message_type Field
**Motivation**: Eliminate heuristic classification overhead
**Impact**: All messages must include message_type code
**Migration**: Automatic migration tool provided

```typescript
// Before (v0.7.x - optional)
const message = {
  schema_version: 1,
  // message_type optional, uses heuristics
  device_id: 'SN001',
  ...
};

// After (v1.0.0 - required)
const message = {
  schema_version: 1,
  message_type: 200, // REQUIRED
  device_id: 'SN001',
  ...
};
```

#### Schema Version 2 Envelope
**Motivation**: Modernize base envelope structure
**Changes**:
- Simplified required fields
- Built-in compression support
- Native binary payload support
- Enhanced timestamp format (microsecond precision)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "MQTT v2 Envelope",
  "type": "object",
  "required": ["schema_version", "message_type", "device_id", "timestamp"],
  "properties": {
    "schema_version": {
      "const": 2
    },
    "message_type": {
      "type": "integer",
      "minimum": 100,
      "maximum": 999
    },
    "device_id": {
      "type": "string",
      "pattern": "^[A-Z0-9-]+$"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 with microseconds"
    },
    "compression": {
      "enum": ["none", "gzip", "brotli", "lz4"]
    }
  }
}
```

#### Streamlined API
Remove deprecated functions and consolidate API surface:

```typescript
// Deprecated (removed in v1.0)
classifyAndValidate(); // Use validateMessage with type code
validateMessage('sensorData', payload); // Use direct validators

// Recommended v1.0 API
validators.sensorData(payload);
validators.byTypeCode(200, payload);
```

### Advanced Features

#### Multi-Protocol Support
- CoAP message format
- MQTT-SN optimizations
- LoRaWAN payload templates
- Bluetooth GATT characteristics

#### AI/ML Integration
- Schema for ML model metadata
- Inference result messages
- Model versioning
- Edge AI metrics

#### Time Series Optimizations
- Columnar format option
- Delta encoding support
- Batch message optimization
- Aggregation helpers

## Future Exploration (v2.0+ - 2027+)

### Protocol Evolution
- Schema version 3 with native binary support
- Protocol Buffers alternative
- CBOR encoding option
- MessagePack support

### Cloud Integration
- AWS IoT Core schemas
- Azure IoT Hub integration
- Google Cloud IoT integration
- MQTT 5.0 feature support

### Enhanced Security
- Message encryption schemas
- Zero-knowledge proof support
- Quantum-resistant algorithms
- Blockchain integration

### Standards Compliance
- Matter protocol alignment
- OCF compliance
- OPC UA integration
- ISO standards adherence

## Community Requested Features

Vote for features by adding 👍 to their GitHub issues:

1. **Compression Support** ([#TBD](https://github.com/Alteriom/alteriom-mqtt-schema/issues/TBD))
   - Pre-compressed firmware
   - Message payload compression
   - Automatic compression detection

2. **GraphQL Schema Generation** ([#TBD](https://github.com/Alteriom/alteriom-mqtt-schema/issues/TBD))
   - Auto-generate GraphQL schemas
   - GraphQL subscriptions for real-time data
   - Integration with popular GraphQL servers

3. **Database Schema Generation** ([#TBD](https://github.com/Alteriom/alteriom-mqtt-schema/issues/TBD))
   - PostgreSQL table schemas
   - MongoDB collection schemas
   - InfluxDB measurement schemas
   - TimescaleDB hypertables

4. **Schema Migration Tools** ([#TBD](https://github.com/Alteriom/alteriom-mqtt-schema/issues/TBD))
   - Automated schema migration
   - Version compatibility checker
   - Migration path generator

5. **Performance Monitoring** ([#TBD](https://github.com/Alteriom/alteriom-mqtt-schema/issues/TBD))
   - Built-in validation metrics
   - Performance profiling tools
   - Bottleneck identification

## Deprecation Timeline

### v0.8.0 Deprecations
- `control_response` schema (use `command_response`)
- Heuristic classification without message_type (warning only)

### v1.0.0 Removals
- `control_response` schema completely removed
- Heuristic classification removed (message_type required)
- Support for schema_version < 1

## How to Contribute

We welcome community input on the roadmap:

1. **Vote on Features**: Add 👍 reactions to issues
2. **Propose Features**: Open feature requests
3. **Discuss Ideas**: Join GitHub Discussions
4. **Implement Features**: Submit pull requests

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Versioning Philosophy

We follow Semantic Versioning (semver):

- **Patch (0.7.x)**: Bug fixes, documentation, tooling
- **Minor (0.x.0)**: New features, backward compatible
- **Major (x.0.0)**: Breaking changes, major features

### Stability Guarantees

- **Schema Stability**: Paramount priority
- **TypeScript Types**: Strong typing maintained
- **Backward Compatibility**: Preserved within major versions
- **Migration Support**: Tools and guides for major versions

## Success Metrics

### Quality Metrics
- Test coverage > 80%
- Zero critical vulnerabilities
- Build time < 30 seconds
- Package size < 50KB gzipped

### Adoption Metrics
- npm downloads growth
- GitHub stars
- Community contributions
- Integration examples

### Developer Experience Metrics
- Clear documentation for 100% of public APIs
- Issue response time < 48 hours
- PR review time < 72 hours
- Monthly releases

## Questions & Feedback

Have questions about the roadmap? Want to suggest changes?

- Open a GitHub Discussion
- Comment on roadmap issues
- Join community meetings
- Contact maintainers

---

**Last Updated**: 2025-11-04
**Next Review**: 2026-01-01

This roadmap is a living document and may change based on community feedback and project priorities.
