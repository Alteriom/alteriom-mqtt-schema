/**
 * Auto-generated TypeScript types for Alteriom MQTT Schema v1
 * Source: docs/mqtt_schema/*.schema.json
 * Generation Date: 2025-09-20
 * NOTE: This file is maintained in firmware repo for UI alignment. Changes require coordinated review.
 */

// ------------------------------------------------------------
// Base / Shared Types
// ------------------------------------------------------------

export interface BaseEnvelope {
  schema_version: 1;
  device_id: string; // 1-64 chars, [A-Za-z0-9_-]
  device_type: 'sensor' | 'gateway';
  timestamp: string; // RFC3339 / ISO 8601
  firmware_version?: string; // Required everywhere except heartbeat (UI should treat missing only valid on heartbeat)
  hardware_version?: string;
  [k: string]: unknown; // Forward-compatible extension
}

export interface SensorEntry {
  value: number;
  unit?: string;
  raw_value?: number;
  calibrated_value?: number;
  quality_score?: number; // 0-1 inclusive
  name?: string;
  location?: string;
  additional_data?: Record<string, unknown>;
  [k: string]: unknown; // Extensions
}

// ------------------------------------------------------------
// Message Specific Shapes
// ------------------------------------------------------------

export interface SensorDataMessage extends BaseEnvelope {
  device_type: 'sensor';
  firmware_version: string; // Explicit here (cannot be omitted for data topic)
  sensors: Record<string, SensorEntry>; // Non-empty in valid messages
  battery_level?: number; // 0-100
  signal_strength?: number; // dBm (-120..-10 typical)
  additional?: Record<string, unknown>;
}

export interface SensorHeartbeatMessage extends Omit<BaseEnvelope, 'firmware_version'> {
  device_type: 'sensor' | 'gateway';
  // firmware_version intentionally optional (omitted allowed if unchanged)
  firmware_version?: string;
}

export interface SensorStatusMessage extends BaseEnvelope {
  device_type: 'sensor';
  firmware_version: string;
  status: 'online' | 'offline' | 'updating' | 'error';
  battery_level?: number;
  signal_strength?: number;
}

export interface GatewayInfoMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  mac_address?: string; // 00:11:22:33:44:55
  ip_address?: string; // IPv4
  capabilities?: {
    max_nodes?: number;
    supports_mesh?: boolean;
    firmware_update?: boolean;
    [k: string]: unknown;
  };
}

export interface GatewayMetricsMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  metrics: {
    uptime_s: number;
    cpu_usage_pct?: number;
    memory_usage_pct?: number;
    temperature_c?: number;
    connected_devices?: number;
    mesh_nodes?: number;
    packet_loss_pct?: number;
    data_throughput_kbps?: number;
    [k: string]: unknown;
  };
}

export interface FirmwareStatusMessage extends BaseEnvelope {
  status: 'pending' | 'downloading' | 'flashing' | 'verifying' | 'rebooting' | 'completed' | 'failed';
  event?: string;
  from_version?: string;
  to_version?: string;
  progress_pct?: number; // 0-100
  error?: string | null;
}

export interface ControlResponseMessage extends BaseEnvelope {
  status: 'ok' | 'error';
  command?: string;
  message?: string;
  result?: unknown; // Arbitrary result shape
}

// Union of All Known V1 Messages (excluding heartbeat omission nuance)
export type AnyMqttV1Message =
  | SensorDataMessage
  | SensorHeartbeatMessage
  | SensorStatusMessage
  | GatewayInfoMessage
  | GatewayMetricsMessage
  | FirmwareStatusMessage
  | ControlResponseMessage;

// Type Guards ------------------------------------------------

export function isSensorDataMessage(msg: any): msg is SensorDataMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && typeof msg.sensors === 'object';
}

export function isSensorHeartbeatMessage(msg: any): msg is SensorHeartbeatMessage {
  return msg && msg.schema_version === 1 && !!msg.device_type && !!msg.timestamp && !('sensors' in msg) && !('metrics' in msg) && !('status' in msg || (msg.status && ['online','offline','updating','error'].includes(msg.status)));
}

export function isSensorStatusMessage(msg: any): msg is SensorStatusMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && typeof msg.status === 'string' && ['online','offline','updating','error'].includes(msg.status);
}

export function isGatewayInfoMessage(msg: any): msg is GatewayInfoMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && (!msg.metrics) && (!msg.status) && (!msg.progress_pct);
}

export function isGatewayMetricsMessage(msg: any): msg is GatewayMetricsMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.metrics === 'object';
}

export function isFirmwareStatusMessage(msg: any): msg is FirmwareStatusMessage {
  return msg && msg.schema_version === 1 && typeof msg.status === 'string' && ['pending','downloading','flashing','verifying','rebooting','completed','failed'].includes(msg.status) && (msg.progress_pct === undefined || (typeof msg.progress_pct === 'number' && msg.progress_pct >=0 && msg.progress_pct <= 100));
}

export function isControlResponseMessage(msg: any): msg is ControlResponseMessage {
  return msg && msg.schema_version === 1 && (msg.status === 'ok' || msg.status === 'error') && 'timestamp' in msg;
}

export function classifyMessage(msg: any): AnyMqttV1Message | null {
  if (isSensorDataMessage(msg)) return msg;
  if (isGatewayMetricsMessage(msg)) return msg;
  if (isSensorStatusMessage(msg)) return msg;
  if (isGatewayInfoMessage(msg)) return msg;
  if (isFirmwareStatusMessage(msg)) return msg;
  if (isControlResponseMessage(msg)) return msg;
  if (isSensorHeartbeatMessage(msg)) return msg;
  return null;
}

// Validation helpers (lightweight; backend remains authoritative)
export interface BasicValidationIssue { field?: string; reason: string; }

export function basicValidate(msg: AnyMqttV1Message): BasicValidationIssue[] {
  const issues: BasicValidationIssue[] = [];
  if (msg.schema_version !== 1) issues.push({reason: 'unsupported_schema'});
  if (!msg.device_id) issues.push({field: 'device_id', reason: 'missing'});
  if (!msg.device_type) issues.push({field: 'device_type', reason: 'missing'});
  if (!msg.timestamp) issues.push({field: 'timestamp', reason: 'missing'});
  if ('firmware_version' in msg) {
    if ((msg as any).firmware_version === '') issues.push({field: 'firmware_version', reason: 'empty'});
  } else if (!isSensorHeartbeatMessage(msg)) {
    issues.push({field: 'firmware_version', reason: 'missing'});
  }
  if (isSensorDataMessage(msg)) {
    if (!Object.keys(msg.sensors).length) issues.push({field: 'sensors', reason: 'empty'});
    for (const [k, v] of Object.entries(msg.sensors)) {
      if (typeof (v as any).value !== 'number') issues.push({field: `sensors.${k}.value`, reason: 'invalid'});
      if (v.quality_score !== undefined && (v.quality_score < 0 || v.quality_score > 1)) issues.push({field: `sensors.${k}.quality_score`, reason: 'out_of_range'});
    }
  }
  if (isGatewayMetricsMessage(msg)) {
    if (typeof msg.metrics.uptime_s !== 'number') issues.push({field: 'metrics.uptime_s', reason: 'missing'});
  }
  if (isFirmwareStatusMessage(msg)) {
    if (msg.progress_pct !== undefined && (msg.progress_pct < 0 || msg.progress_pct > 100)) issues.push({field: 'progress_pct', reason: 'out_of_range'});
  }
  return issues;
}

// Example parse wrapper
export function parseMessage(json: string): AnyMqttV1Message | null {
  try { const obj = JSON.parse(json); return classifyMessage(obj); } catch { return null; }
}
