/**
 * Auto-generated TypeScript types for Alteriom MQTT Schema v1
 * Source: docs/mqtt_schema/*.schema.json
 * Generation Date: 2025-10-23 (v0.7.2)
 * NOTE: This file is maintained in firmware repo for UI alignment. Changes require coordinated review.
 */

// ------------------------------------------------------------
// Message Type Codes (v0.7.2)
// ------------------------------------------------------------

export const MessageTypeCodes = {
  SENSOR_DATA: 200,
  SENSOR_HEARTBEAT: 201,
  SENSOR_STATUS: 202,
  SENSOR_INFO: 203,           // v0.7.2
  SENSOR_METRICS: 204,        // v0.7.2
  GATEWAY_INFO: 300,
  GATEWAY_METRICS: 301,
  GATEWAY_DATA: 302,          // v0.7.2
  GATEWAY_HEARTBEAT: 303,     // v0.7.2
  GATEWAY_STATUS: 304,        // v0.7.2
  COMMAND: 400,
  COMMAND_RESPONSE: 401,
  CONTROL_RESPONSE: 402,      // deprecated
  FIRMWARE_STATUS: 500,
  MESH_NODE_LIST: 600,
  MESH_TOPOLOGY: 601,
  MESH_ALERT: 602,
  MESH_BRIDGE: 603,
  MESH_STATUS: 604,           // v0.7.2
  MESH_METRICS: 605,          // v0.7.2
  DEVICE_CONFIG: 700,
} as const;

export type MessageTypeCode = typeof MessageTypeCodes[keyof typeof MessageTypeCodes];

// ------------------------------------------------------------
// Base / Shared Types
// ------------------------------------------------------------

export interface LocationInfo {
  latitude?: number; // -90 to 90
  longitude?: number; // -180 to 180
  altitude?: number; // meters
  accuracy_m?: number; // position accuracy in meters
  zone?: string; // logical zone identifier (e.g., warehouse_A)
  description?: string; // human-readable location
  [k: string]: unknown;
}

export interface EnvironmentInfo {
  deployment_type?: 'indoor' | 'outdoor' | 'mobile' | 'mixed';
  power_source?: 'battery' | 'mains' | 'solar' | 'mixed' | 'other';
  expected_battery_life_days?: number; // expected battery life in days
  [k: string]: unknown;
}

export interface BaseEnvelope {
  schema_version: 1;
  message_type?: MessageTypeCode; // Optional message type code for fast classification (v0.7.1+)
  device_id: string; // 1-64 chars, [A-Za-z0-9_-]
  device_type: 'sensor' | 'gateway';
  timestamp: string; // RFC3339 / ISO 8601
  firmware_version?: string; // Required everywhere except heartbeat (UI should treat missing only valid on heartbeat)
  hardware_version?: string;
  location?: LocationInfo; // Optional standardized location
  environment?: EnvironmentInfo; // Optional environmental metadata
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
  timestamp?: string; // Per-sensor reading timestamp
  accuracy?: number; // Sensor accuracy (±value in units)
  last_calibration?: string; // Last calibration date (ISO 8601)
  error_margin_pct?: number; // Error margin percentage (0-100)
  operational_range?: {
    min: number;
    max: number;
  };
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

export interface SensorInfoMessage extends BaseEnvelope {
  device_type: 'sensor';
  firmware_version: string;
  hardware_version?: string;
  mac_address?: string; // 00:11:22:33:44:55
  chip_id?: string;
  manufacturer?: string;
  model?: string;
  capabilities?: {
    available_sensors?: string[];
    supports_mesh?: boolean;
    supports_ota?: boolean;
    power_source?: 'battery' | 'mains' | 'solar' | 'mixed' | 'other';
    battery_type?: string;
    sampling_rates?: {
      min_interval_ms?: number;
      max_interval_ms?: number;
      [k: string]: unknown;
    };
    communication_protocols?: string[];
    additional_features?: Record<string, unknown>;
    [k: string]: unknown;
  };
  calibration_info?: {
    last_calibration?: string;
    calibration_due?: string;
    factory_calibrated?: boolean;
    calibration_certificate?: string;
    [k: string]: unknown;
  };
  operational_info?: {
    operating_temp_range?: { min_celsius?: number; max_celsius?: number; };
    operating_humidity_range?: { min_percent?: number; max_percent?: number; };
    ip_rating?: string; // e.g., 'IP65'
    warranty_expires?: string;
    [k: string]: unknown;
  };
}

export interface SensorMetricsMessage extends BaseEnvelope {
  device_type: 'sensor';
  firmware_version: string;
  metrics: {
    uptime_s: number;
    battery_level?: number; // 0-100
    battery_voltage?: number;
    battery_current_ma?: number;
    battery_health?: 'good' | 'fair' | 'poor' | 'critical' | 'charging' | 'unknown';
    estimated_battery_life_h?: number;
    signal_strength?: number; // dBm (-200..0)
    signal_quality?: number; // 0-100
    rssi?: number;
    snr?: number;
    link_quality?: number; // 0-255
    cpu_usage_pct?: number;
    memory_usage_pct?: number;
    free_memory_bytes?: number;
    temperature_c?: number;
    sampling_rate_hz?: number;
    samples_collected?: number;
    error_count?: number;
    warning_count?: number;
    transmission_success_rate?: number;
    last_error?: string;
    last_error_timestamp?: string;
    reboot_count?: number;
    last_reboot_reason?: 'power_on' | 'watchdog' | 'software_reset' | 'firmware_update' | 'crash' | 'user_initiated' | 'low_battery' | 'unknown';
    [k: string]: unknown;
  };
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
    storage_usage_pct?: number; // Disk/flash usage percentage
    storage_total_mb?: number; // Total storage capacity in MB
    storage_free_mb?: number; // Free storage space in MB
    network_rx_kbps?: number; // Network receive bandwidth
    network_tx_kbps?: number; // Network transmit bandwidth
    active_connections?: number; // Active network connections
    error_count_24h?: number; // Errors in last 24 hours
    warning_count_24h?: number; // Warnings in last 24 hours
    restart_count?: number; // Total restart counter
    last_restart_reason?: string; // Last restart reason
    [k: string]: unknown;
  };
}

export interface GatewayDataMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  sensors: Record<string, SensorEntry>; // Non-empty in valid messages
  signal_strength?: number; // dBm (-200..0)
  additional?: Record<string, unknown>;
}

export interface GatewayHeartbeatMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version?: string;
  uptime_s?: number;
  connected_devices?: number;
  mesh_nodes?: number;
  status_summary?: 'healthy' | 'degraded' | 'critical' | 'maintenance';
}

export interface GatewayStatusMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  status: 'online' | 'offline' | 'starting' | 'stopping' | 'updating' | 'maintenance' | 'error' | 'degraded';
  previous_status?: 'online' | 'offline' | 'starting' | 'stopping' | 'updating' | 'maintenance' | 'error' | 'degraded';
  status_reason?: string;
  error_code?: string;
  uptime_s?: number;
  connected_devices?: number;
  signal_strength?: number;
  recovery_action?: 'none' | 'restart_pending' | 'restarting' | 'user_intervention_required' | 'automatic_recovery';
  estimated_recovery_time_s?: number;
}

export interface FirmwareStatusMessage extends BaseEnvelope {
  status: 'idle' | 'pending' | 'scheduled' | 'downloading' | 'download_paused' | 'flashing' | 'verifying' | 'rebooting' | 'completed' | 'failed' | 'cancelled' | 'rolled_back' | 'rollback_pending' | 'rollback_failed';
  event?: string;
  from_version?: string;
  to_version?: string;
  progress_pct?: number; // 0-100
  error?: string | null;
  error_code?: string;
  retry_count?: number;
  max_retries?: number;
  download_speed_kbps?: number;
  bytes_downloaded?: number;
  bytes_total?: number;
  eta_seconds?: number;
  update_started_at?: string;
  update_completed_at?: string;
  scheduled_at?: string;
  deadline?: string;
  rollback_available?: boolean;
  previous_version?: string;
  update_type?: 'full' | 'delta' | 'patch' | 'configuration';
  update_channel?: 'stable' | 'beta' | 'dev' | 'custom';
  update_priority?: 'low' | 'normal' | 'high' | 'critical';
  signature_verified?: boolean;
  checksum_verified?: boolean;
  checksum_algorithm?: 'md5' | 'sha1' | 'sha256' | 'sha512';
  expected_checksum?: string;
  actual_checksum?: string;
  free_space_kb?: number;
  required_space_kb?: number;
  battery_level_pct?: number;
  min_battery_required_pct?: number;
  force_update?: boolean;
  allow_downgrade?: boolean;
  auto_reboot?: boolean;
  backup_config?: boolean;
  update_source?: string;
  update_manifest_url?: string;
  correlation_id?: string;
  phase?: 'preparation' | 'download' | 'validation' | 'installation' | 'verification' | 'finalization' | 'cleanup';
  cancellable?: boolean;
  pause_reason?: string;
  validation_errors?: string[];
}

export interface ControlResponseMessage extends BaseEnvelope {
  status: 'ok' | 'error';
  command?: string;
  message?: string;
  result?: unknown; // Arbitrary result shape
}

export interface CommandMessage extends BaseEnvelope {
  firmware_version: string;
  event: 'command';
  command: string; // snake_case pattern (1-64 chars)
  correlation_id?: string; // Unique tracking ID (1-128 chars)
  parameters?: Record<string, unknown>; // Command-specific parameters
  timeout_ms?: number; // 1000-300000 ms
  priority?: 'low' | 'normal' | 'high' | 'urgent';
}

export interface CommandResponseMessage extends BaseEnvelope {
  firmware_version: string;
  event: 'command_response';
  command?: string; // Original command name
  correlation_id?: string; // Links to original command
  success: boolean; // Execution success/failure
  result?: unknown; // Command result data
  message?: string; // Human-readable message (max 256 chars)
  error_code?: string; // Machine-readable error code (max 64 chars)
  latency_ms?: number; // Execution time in ms
}

export interface MeshNodeListMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  nodes: Array<{
    node_id: string;
    status?: 'online' | 'offline' | 'unreachable';
    last_seen?: string; // ISO 8601
    signal_strength?: number; // dBm (-200..0)
    [k: string]: unknown;
  }>;
  node_count?: number;
  mesh_id?: string;
}

export interface MeshTopologyMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  connections: Array<{
    from_node: string;
    to_node: string;
    link_quality?: number; // 0-1
    latency_ms?: number;
    hop_count?: number; // >= 1
    [k: string]: unknown;
  }>;
  root_node?: string;
  total_connections?: number;
}

export interface MeshAlertMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  alerts: Array<{
    alert_type: 'low_memory' | 'node_offline' | 'connection_lost' | 'high_latency' | 'packet_loss' | 'firmware_mismatch' | 'configuration_error' | 'security_warning' | 'other';
    severity: 'critical' | 'warning' | 'info';
    message: string;
    node_id?: string;
    metric_value?: number;
    threshold?: number;
    alert_id?: string;
    [k: string]: unknown;
  }>;
  alert_count?: number;
}

export interface MeshBridgeMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  message_type?: 603;
  event: 'mesh_bridge';
  mesh_protocol: 'painlessMesh' | 'esp-now' | 'ble-mesh' | 'thread' | 'zigbee';
  mesh_message: {
    from_node_id: number | string;
    to_node_id: number | string;
    mesh_type?: number;
    mesh_type_name?: string;
    raw_payload?: string;
    payload_decoded?: Record<string, unknown>;
    rssi?: number;
    hop_count?: number;
    mesh_timestamp?: number;
    [k: string]: unknown;
  };
  gateway_node_id?: number | string;
  mesh_network_id?: string;
}

export interface DeviceConfigMessage extends BaseEnvelope {
  firmware_version: string;
  message_type?: 700;
  event: 'config_snapshot' | 'config_update' | 'config_request';
  configuration: {
    sampling_interval_ms?: number;
    reporting_interval_ms?: number;
    sensors_enabled?: string[];
    transmission_mode?: 'wifi' | 'mesh' | 'mixed' | 'cellular';
    power_mode?: 'normal' | 'low_power' | 'ultra_low_power' | 'always_on';
    sleep_duration_ms?: number;
    calibration_offsets?: Record<string, number>;
    alert_thresholds?: Record<string, {
      min?: number;
      max?: number;
      enabled?: boolean;
    }>;
    network_config?: {
      wifi_ssid?: string;
      wifi_channel?: number;
      mesh_prefix?: string;
      mesh_password?: string;
      mesh_port?: number;
      mqtt_broker?: string;
      mqtt_port?: number;
      mqtt_topic_prefix?: string;
    };
    ota_config?: {
      auto_update?: boolean;
      update_channel?: 'stable' | 'beta' | 'dev';
      update_check_interval_h?: number;
      allow_downgrade?: boolean;
    };
    log_level?: 'debug' | 'info' | 'warn' | 'error' | 'none';
    timezone?: string;
    ntp_server?: string;
    [k: string]: unknown;
  };
  config_version?: string;
  last_modified?: string;
  modified_by?: string;
  validation_errors?: Array<{
    field?: string;
    error?: string;
  }>;
}

export interface MeshStatusMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  mesh_network_id?: string;
  mesh_status: 'healthy' | 'degraded' | 'partitioned' | 'forming' | 'failed' | 'maintenance';
  node_count?: number;
  online_nodes?: number;
  offline_nodes?: number;
  root_node?: string;
  network_stability?: number; // 0-100
  topology_changes_24h?: number;
  partition_count?: number;
  average_hop_count?: number;
  max_hop_count?: number;
  network_diameter?: number;
  issues?: Array<{
    issue_type: 'partition' | 'high_latency' | 'packet_loss' | 'node_unreachable' | 'routing_loop' | 'congestion' | 'security' | 'other';
    severity: 'critical' | 'warning' | 'info';
    description: string;
    affected_nodes?: string[];
    detected_at?: string;
    [k: string]: unknown;
  }>;
  last_topology_change?: string;
  mesh_protocol?: 'painlessMesh' | 'esp-now' | 'ble-mesh' | 'thread' | 'zigbee';
}

export interface MeshMetricsMessage extends BaseEnvelope {
  device_type: 'gateway';
  firmware_version: string;
  mesh_network_id?: string;
  metrics: {
    uptime_s: number;
    total_nodes?: number;
    active_nodes?: number;
    packets_sent?: number;
    packets_received?: number;
    packets_dropped?: number;
    packet_loss_pct?: number;
    average_latency_ms?: number;
    max_latency_ms?: number;
    min_latency_ms?: number;
    throughput_kbps?: number;
    bandwidth_utilization_pct?: number;
    routing_table_size?: number;
    route_updates_24h?: number;
    broadcast_messages?: number;
    unicast_messages?: number;
    multicast_messages?: number;
    retransmission_rate?: number;
    duplicate_packets?: number;
    out_of_order_packets?: number;
    error_count?: number;
    collision_count?: number;
    average_rssi?: number;
    weakest_link_rssi?: number;
    strongest_link_rssi?: number;
    node_join_count_24h?: number;
    node_leave_count_24h?: number;
    mesh_healing_events?: number;
    [k: string]: unknown;
  };
  top_talkers?: Array<{
    node_id: string;
    packets_sent?: number;
    packets_received?: number;
    bytes_sent?: number;
    bytes_received?: number;
    [k: string]: unknown;
  }>;
  problematic_links?: Array<{
    from_node: string;
    to_node: string;
    packet_loss_pct?: number;
    latency_ms?: number;
    rssi?: number;
    issue?: string;
    [k: string]: unknown;
  }>;
}

// Union of All Known V1 Messages (excluding heartbeat omission nuance)
export type AnyMqttV1Message =
  | SensorDataMessage
  | SensorHeartbeatMessage
  | SensorStatusMessage
  | SensorInfoMessage
  | SensorMetricsMessage
  | GatewayInfoMessage
  | GatewayMetricsMessage
  | GatewayDataMessage
  | GatewayHeartbeatMessage
  | GatewayStatusMessage
  | FirmwareStatusMessage
  | ControlResponseMessage
  | CommandMessage
  | CommandResponseMessage
  | MeshNodeListMessage
  | MeshTopologyMessage
  | MeshAlertMessage
  | MeshBridgeMessage
  | MeshStatusMessage
  | MeshMetricsMessage
  | DeviceConfigMessage;

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

export function isSensorInfoMessage(msg: any): msg is SensorInfoMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && !!msg.firmware_version && (msg.message_type === 203 || (msg.capabilities || msg.calibration_info || msg.operational_info));
}

export function isSensorMetricsMessage(msg: any): msg is SensorMetricsMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && typeof msg.metrics === 'object' && typeof msg.metrics.uptime_s === 'number';
}

export function isGatewayInfoMessage(msg: any): msg is GatewayInfoMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && (!msg.metrics) && (!msg.status) && (!msg.progress_pct);
}

export function isGatewayMetricsMessage(msg: any): msg is GatewayMetricsMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.metrics === 'object' && msg.message_type !== 302;
}

export function isGatewayDataMessage(msg: any): msg is GatewayDataMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.sensors === 'object';
}

export function isGatewayHeartbeatMessage(msg: any): msg is GatewayHeartbeatMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && (msg.message_type === 303 || (msg.status_summary && !msg.status && !msg.metrics && !msg.sensors));
}

export function isGatewayStatusMessage(msg: any): msg is GatewayStatusMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.status === 'string' && ['online','offline','starting','stopping','updating','maintenance','error','degraded'].includes(msg.status);
}

export function isFirmwareStatusMessage(msg: any): msg is FirmwareStatusMessage {
  return msg && msg.schema_version === 1 && typeof msg.status === 'string' && ['idle','pending','scheduled','downloading','download_paused','flashing','verifying','rebooting','completed','failed','cancelled','rolled_back','rollback_pending','rollback_failed'].includes(msg.status) && (msg.progress_pct === undefined || (typeof msg.progress_pct === 'number' && msg.progress_pct >=0 && msg.progress_pct <= 100));
}

export function isControlResponseMessage(msg: any): msg is ControlResponseMessage {
  return msg && msg.schema_version === 1 && (msg.status === 'ok' || msg.status === 'error') && 'timestamp' in msg;
}

export function isMeshNodeListMessage(msg: any): msg is MeshNodeListMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && Array.isArray(msg.nodes);
}

export function isMeshTopologyMessage(msg: any): msg is MeshTopologyMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && Array.isArray(msg.connections);
}

export function isMeshAlertMessage(msg: any): msg is MeshAlertMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && Array.isArray(msg.alerts);
}

export function isCommandMessage(msg: any): msg is CommandMessage {
  return msg && msg.schema_version === 1 && msg.event === 'command' && typeof msg.command === 'string';
}

export function isCommandResponseMessage(msg: any): msg is CommandResponseMessage {
  return msg && msg.schema_version === 1 && msg.event === 'command_response' && typeof msg.success === 'boolean';
}

export function isMeshBridgeMessage(msg: any): msg is MeshBridgeMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && msg.event === 'mesh_bridge' && typeof msg.mesh_protocol === 'string' && typeof msg.mesh_message === 'object';
}

export function isDeviceConfigMessage(msg: any): msg is DeviceConfigMessage {
  return msg && msg.schema_version === 1 && typeof msg.event === 'string' && ['config_snapshot', 'config_update', 'config_request'].includes(msg.event) && typeof msg.configuration === 'object';
}

export function isMeshStatusMessage(msg: any): msg is MeshStatusMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.mesh_status === 'string' && ['healthy','degraded','partitioned','forming','failed','maintenance'].includes(msg.mesh_status);
}

export function isMeshMetricsMessage(msg: any): msg is MeshMetricsMessage {
  return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && msg.mesh_network_id && typeof msg.metrics === 'object' && typeof msg.metrics.uptime_s === 'number';
}

export function classifyMessage(msg: any): AnyMqttV1Message | null {
  // Fast path: use message_type if present (v0.7.2)
  if (msg.message_type) {
    switch (msg.message_type) {
      case MessageTypeCodes.SENSOR_DATA: return isSensorDataMessage(msg) ? msg : null;
      case MessageTypeCodes.SENSOR_HEARTBEAT: return isSensorHeartbeatMessage(msg) ? msg : null;
      case MessageTypeCodes.SENSOR_STATUS: return isSensorStatusMessage(msg) ? msg : null;
      case MessageTypeCodes.SENSOR_INFO: return isSensorInfoMessage(msg) ? msg : null;
      case MessageTypeCodes.SENSOR_METRICS: return isSensorMetricsMessage(msg) ? msg : null;
      case MessageTypeCodes.GATEWAY_INFO: return isGatewayInfoMessage(msg) ? msg : null;
      case MessageTypeCodes.GATEWAY_METRICS: return isGatewayMetricsMessage(msg) ? msg : null;
      case MessageTypeCodes.GATEWAY_DATA: return isGatewayDataMessage(msg) ? msg : null;
      case MessageTypeCodes.GATEWAY_HEARTBEAT: return isGatewayHeartbeatMessage(msg) ? msg : null;
      case MessageTypeCodes.GATEWAY_STATUS: return isGatewayStatusMessage(msg) ? msg : null;
      case MessageTypeCodes.COMMAND: return isCommandMessage(msg) ? msg : null;
      case MessageTypeCodes.COMMAND_RESPONSE: return isCommandResponseMessage(msg) ? msg : null;
      case MessageTypeCodes.CONTROL_RESPONSE: return isControlResponseMessage(msg) ? msg : null;
      case MessageTypeCodes.FIRMWARE_STATUS: return isFirmwareStatusMessage(msg) ? msg : null;
      case MessageTypeCodes.MESH_NODE_LIST: return isMeshNodeListMessage(msg) ? msg : null;
      case MessageTypeCodes.MESH_TOPOLOGY: return isMeshTopologyMessage(msg) ? msg : null;
      case MessageTypeCodes.MESH_ALERT: return isMeshAlertMessage(msg) ? msg : null;
      case MessageTypeCodes.MESH_BRIDGE: return isMeshBridgeMessage(msg) ? msg : null;
      case MessageTypeCodes.MESH_STATUS: return isMeshStatusMessage(msg) ? msg : null;
      case MessageTypeCodes.MESH_METRICS: return isMeshMetricsMessage(msg) ? msg : null;
      case MessageTypeCodes.DEVICE_CONFIG: return isDeviceConfigMessage(msg) ? msg : null;
      default: return null;
    }
  }
  
  // Fallback: use heuristic classification for backward compatibility
  if (isSensorDataMessage(msg)) return msg;
  if (isSensorMetricsMessage(msg)) return msg;
  if (isSensorInfoMessage(msg)) return msg;
  if (isGatewayDataMessage(msg)) return msg;
  if (isGatewayMetricsMessage(msg)) return msg;
  if (isGatewayStatusMessage(msg)) return msg;
  if (isGatewayHeartbeatMessage(msg)) return msg;
  if (isMeshBridgeMessage(msg)) return msg;
  if (isMeshStatusMessage(msg)) return msg;
  if (isMeshMetricsMessage(msg)) return msg;
  if (isDeviceConfigMessage(msg)) return msg;
  if (isMeshNodeListMessage(msg)) return msg;
  if (isMeshTopologyMessage(msg)) return msg;
  if (isMeshAlertMessage(msg)) return msg;
  if (isCommandMessage(msg)) return msg;
  if (isCommandResponseMessage(msg)) return msg;
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
