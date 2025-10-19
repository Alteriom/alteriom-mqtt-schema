# Alteriom MQTT Schema Artifacts (For Web/UI Integration)

Purpose: Provide stable, machine-consumable schema references and concise human guidance for the web application and shared services. This directory is the SINGLE SOURCE for UI-side expectations. Firmware spec (`API_FIRMWARE_MQTT_SPEC.md`) may include narrative details; ONLY content here is guaranteed backward-compatible within the same schema_version.

## Files

| File | Purpose |
|------|---------|
| `envelope.schema.json` | Base envelope fields, reused via `$ref`. |
| `sensor_data.schema.json` | Sensor data message (`alteriom/nodes/{device_id}/data`). |
| `sensor_heartbeat.schema.json` | Heartbeat message (firmware_version omission allowed). |
| `sensor_status.schema.json` | Sensor status message (`.../status`). |
| `gateway_info.schema.json` | Gateway identity/info snapshot. |
| `gateway_metrics.schema.json` | Gateway periodic metrics. |
| `firmware_status.schema.json` | Firmware update status / progress events. |
| `control_response.schema.json` | Command/control response payload (deprecated, use command_response). |
| `command.schema.json` | Device control commands (v0.5.0+). |
| `command_response.schema.json` | Command execution responses with correlation tracking (v0.5.0+). |
| `mesh_node_list.schema.json` | Mesh network node list with status. |
| `mesh_topology.schema.json` | Mesh network topology and connections. |
| `mesh_alert.schema.json` | Mesh network alerts and warnings. |
| `validation_rules.md` | Non-JSON structural rules (timing, ranges, drop reasons). |
| `CHANGELOG.md` | Versioned changes to these schema artifacts. |

## Versioning Strategy

- Current `schema_version`: 1
- Patch-level adjustments that do NOT break existing valid payloads: increment `x-minor` in this directory's CHANGELOG only (no schema_version bump).
- Breaking changes (field requiredness, semantic shifts): bump `schema_version` and add parallel schema set (e.g., `v2/`).
- Deprecations must remain optional until next major schema bundle.

## Consumption Guidance

- UI should validate only fields it uses; backend performs authoritative validation.
- Use `additional` & sensor `additional_data` objects for forward-compatible extensions.
- Treat unknown top-level keys as ignorable metadata (unless they collide with a forbidden list published by backend release notes).

## Contact
Platform: platform@alteriom.ca  •  Firmware: firmware@alteriom.ca
