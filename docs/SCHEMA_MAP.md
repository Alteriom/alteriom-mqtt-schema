# Schema Map

| Schema | Path | Purpose |
|--------|------|---------|
| Envelope | `schemas/envelope.schema.json` | Common envelope metadata |
| Sensor Data | `schemas/sensor_data.schema.json` | Telemetry sensor readings |
| Sensor Heartbeat | `schemas/sensor_heartbeat.schema.json` | Lightweight periodic heartbeat |
| Sensor Status | `schemas/sensor_status.schema.json` | Status / presence updates |
| Gateway Info | `schemas/gateway_info.schema.json` | Gateway identity & capabilities |
| Gateway Metrics | `schemas/gateway_metrics.schema.json` | Performance and resource metrics |
| Firmware Status | `schemas/firmware_status.schema.json` | OTA lifecycle progress events |
| Control Response | `schemas/control_response.schema.json` | Command/control acknowledgements |
| OTA Manifest | `schemas/ota/ota-manifest.schema.json` | Firmware distribution metadata (rich + minimal) |

See `docs/OTA_MANIFEST.md` for detailed OTA manifest semantics.
