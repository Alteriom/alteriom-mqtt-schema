# Classification

Automatic heuristic classification picks a validator in priority order.

- `metrics` → `gatewayMetrics`
- `sensors` → `sensorData`
- `progress_pct` or OTA status keywords → `firmwareStatus`
- `status` + `device_type: sensor` → `sensorStatus`
- `status: ok|error` (no other match) → `controlResponse`
- `device_type: gateway` → `gatewayInfo`
- fallback → `sensorHeartbeat`

Excerpt of implementation (see `src/validators.ts`):

```ts
export function classifyAndValidate(data: any): { kind?: ValidatorName; result: ValidationResult } {
  if (data.metrics) return { kind: 'gatewayMetrics', result: validators.gatewayMetrics(data) };
  if (data.progress_pct !== undefined || (data.status && ['pending','downloading','flashing','verifying','rebooting','completed','failed'].includes(data.status))) return { kind: 'firmwareStatus', result: validators.firmwareStatus(data) };
// (truncated for brevity)
```
