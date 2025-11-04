# Classification

Automatic heuristic classification picks a validator in priority order.



Excerpt of implementation (see `src/validators.ts`):

```ts
export function classifyAndValidate(data: any): { kind?: ValidatorName; result: ValidationResult } {
    if (data.metrics && typeof data.metrics.uptime_s === 'number') return { kind: 'sensorMetrics', result: validators.sensorMetrics(data) };
    if (data.metrics) return { kind: 'gatewayMetrics', result: validators.gatewayMetrics(data) };
  if (data.progress_pct !== undefined || (data.status && ['idle','pending','scheduled','downloading','download_paused','flashing','verifying','rebooting','completed','failed','cancelled','rolled_back','rollback_pending','rollback_failed'].includes(data.status))) return { kind: 'firmwareStatus', result: validators.firmwareStatus(data) };
// (truncated for brevity)
```
