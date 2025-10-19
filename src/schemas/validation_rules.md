# Validation Rules (Operational Layer)

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
- `status` must be one of: pending, downloading, flashing, verifying, rebooting, completed, failed.
- `progress_pct` (if present) must be 0–100.

## Extensibility
- Unknown top-level keys tolerated (future evolution) except if they collide with any deprecated alias or reserved future keys announced in CHANGELOG.

## Versioning
- Current `schema_version`: 1
- Additions remain optional; breaking changes introduce new schema set.
