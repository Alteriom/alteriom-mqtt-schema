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

## Metrics Constraints
- Gateway metrics MUST appear under `metrics` (never at top-level).
- Required minimal metric: `uptime_s`.

## Firmware Update Status
- `status` must be one of: pending, downloading, flashing, verifying, rebooting, completed, failed.
- `progress_pct` (if present) must be 0–100.

## Extensibility
- Unknown top-level keys tolerated (future evolution) except if they collide with any deprecated alias or reserved future keys announced in CHANGELOG.

## Versioning
- Current `schema_version`: 1
- Additions remain optional; breaking changes introduce new schema set.
