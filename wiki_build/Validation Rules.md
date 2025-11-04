# Validation Rules

This file captures dynamic / contextual validation that is OUTSIDE pure structural JSON Schema constraints.

## Timing & Rate
- Future timestamp drift: reject if > 5s ahead of server reference.
- Heartbeat interval recommended 30s; backend may rate-limit <10s.
- Sensor data soft min 30s unless negotiated high-frequency mode.

## Heartbeat Firmware Version Exception
- Only heartbeat topic may omit `firmware_version` when unchanged.
- All other topics require the field.

## Forbidden / Drop Conditions
| Reason | Condition |
|--------|----------|
| missing_fields | Required base fields absent (heartbeat firmware exception applied). |
| invalid_timestamp | Non-ISO 8601 / unparseable timestamp. |
| deprecated_keys | Usage of forbidden alias keys (f, fw, ver, version, u, up, rssi). |
| invalid_sensor_entry | Sensor object missing `value` key. |
| future_drift | Timestamp too far in future (>5s). |
| out_of_range | battery_level not 0-100 OR quality_score not 0-1. |
| invalid_numeric | Non-numeric where numeric expected. |
| spec_violation | Generic fallback after failed internal validation. |

## Sensor Object Semantics
- `value` REQUIRED.
- `unit`, `raw_value`, `calibrated_value`, `quality_score`, `name`, `location`, `additional_data` OPTIONAL.
- If `quality_score` present must be 0.0–1.0 inclusive.
- **NEW (v0.6.0)**: `timestamp`, `accuracy`, `last_calibration`, `error_margin_pct`, `operational_range` OPTIONAL.
- If `error_margin_pct` present must be 0–100.
- If `operational_range` present, must have both `min` and `max` properties.
- Per-sensor `timestamp` allows tracking individual sensor reading times (useful for async multi-sensor polling).

## Location & Environment (v0.6.0)
- `location` object OPTIONAL at envelope level (applies to entire device).
- `latitude` must be -90 to 90, `longitude` must be -180 to 180.
- `accuracy_m` must be >= 0 (position accuracy in meters).
- `zone` is a logical identifier (e.g., warehouse_A, floor_2).
- `environment.deployment_type` must be one of: indoor, outdoor, mobile, mixed.
- `environment.power_source` must be one of: battery, mains, solar, mixed, other.

## Metrics Constraints
- Gateway metrics MUST appear under `metrics` (never at top-level).
- Required minimal metric: `uptime_s`.
- **NEW (v0.6.0)**: Enhanced metrics available: `storage_usage_pct`, `storage_total_mb`, `storage_free_mb`, `network_rx_kbps`, `network_tx_kbps`, `active_connections`, `error_count_24h`, `warning_count_24h`, `restart_count`, `last_restart_reason`.
- All percentage metrics must be 0–100.
- All count metrics must be >= 0.

## Firmware Update Status
- `status` must be one of: pending, downloading, flashing, verifying, rebooting, completed, failed, rolled_back, rollback_pending, rollback_failed.
- `progress_pct` (if present) must be 0–100.
- **NEW (OTA Enhancement)**: 
  - `retry_count` must be >= 0 (tracks update retry attempts).
  - `download_speed_kbps`, `bytes_downloaded`, `bytes_total`, `eta_seconds` must be >= 0.
  - `battery_level_pct` must be 0-100 (critical for battery-powered devices).
  - `error_code` provides machine-readable error classification (e.g., VERIFY_CHECKSUM_MISMATCH).
  - `update_type` must be one of: full, delta, patch.
  - `signature_verified` and `checksum_verified` booleans indicate security verification status.
  - `rollback_available` indicates whether automatic rollback is supported.
  - `previous_version` stores the version to rollback to if update fails.

## Message Type Codes (v0.7.2+)
- `message_type` field is OPTIONAL in all messages.
- When present, must be one of the defined codes: 200, 201, 202, 203, 204, 300, 301, 302, 303, 304, 400, 401, 402, 500, 600, 601, 602, 603, 604, 605, 700.
- **NEW (v0.7.2)**: Added codes 203 (sensor_info), 204 (sensor_metrics), 302 (gateway_data), 303 (gateway_heartbeat), 304 (gateway_status), 604 (mesh_status), 605 (mesh_metrics).
- Message structure must match the declared type code (validation enforced).
- When absent, message classification uses heuristic matching (backward compatible).
- Type code mismatch (e.g., type 200 but structure is gateway) results in validation failure.

## Mesh Bridge Messages (v0.7.1+)
- New message type for MQTT-to-mesh protocol bridging (`event: "mesh_bridge"`).
- Must include `mesh_protocol` (painlessMesh, esp-now, ble-mesh, thread, zigbee).
- Must include `mesh_message` object with at minimum `from_node_id` and `to_node_id`.
- Node IDs can be integer (uint32 for painlessMesh) or string format.
- RSSI must be -200 to 0 dBm if present.
- Hop count must be >= 0 if present.
- `raw_payload` should be base64 or hex encoded if present.
- `payload_decoded` should be valid MQTT v1 message if present.

## Device Configuration Messages (v0.7.1+)
- New message type for device configuration management (`event: "config_snapshot"`, `"config_update"`, or `"config_request"`).
- Must include `configuration` object with device configuration parameters.
- Configuration parameters are all OPTIONAL (device-dependent).
- **Intervals**: `sampling_interval_ms` and `reporting_interval_ms` must be 1000-86400000 (1s to 24h).
- **Power modes**: Must be one of: normal, low_power, ultra_low_power, always_on.
- **Transmission modes**: Must be one of: wifi, mesh, mixed, cellular.
- **Log levels**: Must be one of: debug, info, warn, error, none.
- **OTA update channels**: Must be one of: stable, beta, dev.
- **Network config**: 
  - `wifi_channel` must be 1-14.
  - `mesh_port` and `mqtt_port` must be 1024-65535.
  - `mqtt_broker` and `ntp_server` should be valid hostnames.
- **Alert thresholds**: Each threshold object may have `min`, `max`, and `enabled` properties.
- **Calibration offsets**: Values are numeric offsets per sensor.
- **Metadata**: 
  - `config_version` is a semantic version string.
  - `last_modified` must be ISO 8601 timestamp.
  - `validation_errors` array contains objects with `field` and `error` properties.

## Extensibility
- Unknown top-level keys tolerated (future evolution) except if they collide with any deprecated alias or reserved future keys announced in CHANGELOG.

## Versioning
- Current `schema_version`: 1
- Additions remain optional; breaking changes introduce new schema set.
