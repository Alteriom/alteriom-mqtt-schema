# Classification

Automatic heuristic classification picks a validator in priority order.

- `event: command` → `command`
- `event: command_response` → `commandResponse`
- `metrics` → `gatewayMetrics`
- `sensors` → `sensorData`
- `nodes` array → `meshNodeList`
- `connections` array → `meshTopology`
- `alerts` array → `meshAlert`
- `progress_pct` or OTA status keywords → `firmwareStatus`
- `status` + `device_type: sensor` → `sensorStatus`
- `status: ok|error` (no other match) → `controlResponse`
- `device_type: gateway` → `gatewayInfo`
- fallback → `sensorHeartbeat`

Excerpt of implementation (see `src/validators.ts`):

```ts
export function classifyAndValidate(data: any): { kind?: ValidatorName; result: ValidationResult } {
  if (!data || typeof data !== 'object') return { result: { valid: false, errors: ['Not an object'] } };
  // Check for event discriminators first (new command-based messages)
  if (data.event === 'command') return { kind: 'command', result: validators.command(data) };
  if (data.event === 'command_response') return { kind: 'commandResponse', result: validators.commandResponse(data) };
  // Existing classification heuristics
  if (data.metrics) return { kind: 'gatewayMetrics', result: validators.gatewayMetrics(data) };
  if (data.sensors) return { kind: 'sensorData', result: validators.sensorData(data) };
  if (Array.isArray(data.nodes)) return { kind: 'meshNodeList', result: validators.meshNodeList(data) };
// (truncated for brevity)
```
