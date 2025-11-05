# MQTT Schema Examples

This directory contains real-world examples of MQTT messages following the Alteriom MQTT v1 schema specification.

## Directory Structure

### `/basic/`
Simple, straightforward examples demonstrating common use cases:
- **sensor_data_simple.json** - Single temperature sensor reading
- **sensor_data_multi_sensor.json** - Multiple sensors with quality scores
- **gateway_metrics_basic.json** - Gateway system metrics

### `/advanced/`
Advanced patterns leveraging performance and efficiency features:
- **batch_processing.json** - Batch envelope with multiple messages (50-90% overhead reduction)
- **compressed_message.json** - Compressed payload (60-80% bandwidth reduction)

### `/edge_cases/`
Edge cases and boundary conditions:
- **minimal_required_fields.json** - Minimum valid message (heartbeat)
- **max_sensors.json** - Maximum reasonable sensor count

### `/anti_patterns/`
Examples of what **NOT** to do (for educational purposes):
- **deprecated_fields.json** - Using forbidden field aliases
- **missing_message_type.json** - Omitting message_type (slower classification)

## Using These Examples

### For Development
Copy and adapt these examples as templates for your messages:
```javascript
// Node.js example
const template = require('./examples/basic/sensor_data_simple.json');
const message = {
  ...template,
  device_id: 'YOUR_DEVICE_ID',
  timestamp: new Date().toISOString(),
  sensors: {
    temperature: { value: 25.0, unit: 'C' }
  }
};
```

### For Testing
Use these examples to validate your implementation:
```bash
# Validate against schema
npm run test:fixtures
```

### For Documentation
Reference these examples in your documentation to show correct usage patterns.

## Performance Recommendations

Based on our benchmarks (1-2.6M ops/sec):

1. **Always include message_type** - Fast path classification is 10% faster
2. **Use batching for high volumes** - Reduces overhead by 50-90%
3. **Compress for bandwidth-constrained networks** - Saves 60-80% bandwidth
4. **Include quality_score** - Enables data quality monitoring

## Best Practices

### DO ✅
- Use `message_type` code for fast classification
- Include `firmware_version` for all message types (except sensor_heartbeat)
- Use standard units (C, %, hPa, etc.)
- Add `quality_score` when available
- Batch messages when possible
- Compress for cellular/satellite links

### DON'T ❌
- Use deprecated field aliases (f, fw, ver, u, up)
- Omit `schema_version`
- Use non-standard units without documentation
- Send individual messages when batching is possible
- Skip compression on high-latency links

## Schema Versions

All examples use `schema_version: 1` which is compatible with:
- @alteriom/mqtt-schema v0.7.0+
- Alteriom firmware v2.0.0+
- Alteriom gateway v1.0.0+

## Contributing Examples

To add new examples:

1. Place in appropriate category directory
2. Include `_comment` field explaining the example
3. Use realistic values
4. Follow the schema specification
5. Test with `npm run test:fixtures`
6. Submit PR with clear description

## Related Documentation

- [Main README](../../../README.md) - Package documentation
- [Schema Specification](../) - All schema files
- [Fixtures](../fixtures/) - Test fixtures
- [Integration Guide](../PAINLESSMESH_INTEGRATION.md) - PainlessMesh integration

## Support

For questions or issues:
- GitHub Issues: https://github.com/Alteriom/alteriom-mqtt-schema/issues
- Documentation: https://github.com/Alteriom/alteriom-mqtt-schema#readme
