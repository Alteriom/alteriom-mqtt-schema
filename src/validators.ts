import Ajv, { ValidateFunction } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
// Schemas embedded via generated schema_data.ts (copy-schemas.cjs) to avoid filesystem dependency
import {
  envelope_schema,
  sensor_data_schema,
  sensor_heartbeat_schema,
  sensor_status_schema,
  sensor_info_schema,
  sensor_metrics_schema,
  gateway_info_schema,
  gateway_metrics_schema,
  gateway_data_schema,
  gateway_heartbeat_schema,
  gateway_status_schema,
  firmware_status_schema,
  control_response_schema,
  command_schema,
  command_response_schema,
  mesh_node_list_schema,
  mesh_topology_schema,
  mesh_alert_schema,
  mesh_bridge_schema,
  mesh_status_schema,
  mesh_metrics_schema,
  device_config_schema,
} from './schema_data.js';
// Load JSON schemas via createRequire so it works in both CJS and ESM builds without import assertions.
// Bind embedded schema objects for Ajv consumption
const envelope = envelope_schema as any;
const sensorData = sensor_data_schema as any;
const sensorHeartbeat = sensor_heartbeat_schema as any;
const sensorStatus = sensor_status_schema as any;
const sensorInfo = sensor_info_schema as any;
const sensorMetrics = sensor_metrics_schema as any;
const gatewayInfo = gateway_info_schema as any;
const gatewayMetrics = gateway_metrics_schema as any;
const gatewayData = gateway_data_schema as any;
const gatewayHeartbeat = gateway_heartbeat_schema as any;
const gatewayStatus = gateway_status_schema as any;
const firmwareStatus = firmware_status_schema as any;
const controlResponse = control_response_schema as any;
const command = command_schema as any;
const commandResponse = command_response_schema as any;
const meshNodeList = mesh_node_list_schema as any;
const meshTopology = mesh_topology_schema as any;
const meshAlert = mesh_alert_schema as any;
const meshBridge = mesh_bridge_schema as any;
const meshStatus = mesh_status_schema as any;
const meshMetrics = mesh_metrics_schema as any;
const deviceConfig = device_config_schema as any;

// Lazy singleton Ajv instance so consumers can optionally supply their own if needed.
let _ajv: Ajv | null = null;

export interface CompileOptions {
  allErrors?: boolean;
  strict?: boolean;
}

function getAjv(opts?: CompileOptions): Ajv {
  if (_ajv) return _ajv;
  _ajv = new Ajv({
    strict: false,
    allErrors: true,
    allowUnionTypes: true,
    ...opts,
  });
  addFormats(_ajv);
  // Add base schema so $ref works for those referencing envelope
  _ajv.addSchema(envelope, 'envelope.schema.json');
  return _ajv;
}

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

function toResult(v: ValidateFunction, data: unknown): ValidationResult {
  const valid = v(data) as boolean;
  if (valid) return { valid: true };
  return {
    valid: false,
    errors: (v.errors || []).map((e: any) => `${e.instancePath || '/'} ${e.message || ''}`.trim()),
  };
}

// Pre-compile validators (they are small; compilation cost negligible for typical web usage)
const ajv = getAjv();

const sensorDataValidate = ajv.compile(sensorData);
const sensorHeartbeatValidate = ajv.compile(sensorHeartbeat);
const sensorStatusValidate = ajv.compile(sensorStatus);
const sensorInfoValidate = ajv.compile(sensorInfo);
const sensorMetricsValidate = ajv.compile(sensorMetrics);
const gatewayInfoValidate = ajv.compile(gatewayInfo);
const gatewayMetricsValidate = ajv.compile(gatewayMetrics);
const gatewayDataValidate = ajv.compile(gatewayData);
const gatewayHeartbeatValidate = ajv.compile(gatewayHeartbeat);
const gatewayStatusValidate = ajv.compile(gatewayStatus);
const firmwareStatusValidate = ajv.compile(firmwareStatus);
const controlResponseValidate = ajv.compile(controlResponse);
const commandValidate = ajv.compile(command);
const commandResponseValidate = ajv.compile(commandResponse);
const meshNodeListValidate = ajv.compile(meshNodeList);
const meshTopologyValidate = ajv.compile(meshTopology);
const meshAlertValidate = ajv.compile(meshAlert);
const meshBridgeValidate = ajv.compile(meshBridge);
const meshStatusValidate = ajv.compile(meshStatus);
const meshMetricsValidate = ajv.compile(meshMetrics);
const deviceConfigValidate = ajv.compile(deviceConfig);

export const validators = {
  sensorData: (d: unknown) => toResult(sensorDataValidate, d),
  sensorHeartbeat: (d: unknown) => toResult(sensorHeartbeatValidate, d),
  sensorStatus: (d: unknown) => toResult(sensorStatusValidate, d),
  sensorInfo: (d: unknown) => toResult(sensorInfoValidate, d),
  sensorMetrics: (d: unknown) => toResult(sensorMetricsValidate, d),
  gatewayInfo: (d: unknown) => toResult(gatewayInfoValidate, d),
  gatewayMetrics: (d: unknown) => toResult(gatewayMetricsValidate, d),
  gatewayData: (d: unknown) => toResult(gatewayDataValidate, d),
  gatewayHeartbeat: (d: unknown) => toResult(gatewayHeartbeatValidate, d),
  gatewayStatus: (d: unknown) => toResult(gatewayStatusValidate, d),
  firmwareStatus: (d: unknown) => toResult(firmwareStatusValidate, d),
  controlResponse: (d: unknown) => toResult(controlResponseValidate, d),
  command: (d: unknown) => toResult(commandValidate, d),
  commandResponse: (d: unknown) => toResult(commandResponseValidate, d),
  meshNodeList: (d: unknown) => toResult(meshNodeListValidate, d),
  meshTopology: (d: unknown) => toResult(meshTopologyValidate, d),
  meshAlert: (d: unknown) => toResult(meshAlertValidate, d),
  meshBridge: (d: unknown) => toResult(meshBridgeValidate, d),
  meshStatus: (d: unknown) => toResult(meshStatusValidate, d),
  meshMetrics: (d: unknown) => toResult(meshMetricsValidate, d),
  deviceConfig: (d: unknown) => toResult(deviceConfigValidate, d),
};

export type ValidatorName = keyof typeof validators;

export function validateMessage(kind: ValidatorName, data: unknown): ValidationResult {
  return validators[kind](data);
}

// Message Type Code to Validator mapping (v0.7.2)
const MESSAGE_TYPE_MAP: Record<number, ValidatorName> = {
  200: 'sensorData',
  201: 'sensorHeartbeat',
  202: 'sensorStatus',
  203: 'sensorInfo',
  204: 'sensorMetrics',
  300: 'gatewayInfo',
  301: 'gatewayMetrics',
  302: 'gatewayData',
  303: 'gatewayHeartbeat',
  304: 'gatewayStatus',
  400: 'command',
  401: 'commandResponse',
  402: 'controlResponse',
  500: 'firmwareStatus',
  600: 'meshNodeList',
  601: 'meshTopology',
  602: 'meshAlert',
  603: 'meshBridge',
  604: 'meshStatus',
  605: 'meshMetrics',
  700: 'deviceConfig',
};

// Classifier using lightweight heuristics to pick a schema validator.
// v0.7.2: Fast path using message_type code when present
export function classifyAndValidate(data: any): { kind?: ValidatorName; result: ValidationResult } {
  if (!data || typeof data !== 'object')
    return { result: { valid: false, errors: ['Not an object'] } };

  // Fast path: use message_type code if present (v0.7.2)
  if (typeof data.message_type === 'number' && data.message_type in MESSAGE_TYPE_MAP) {
    const kind = MESSAGE_TYPE_MAP[data.message_type];
    return { kind, result: validators[kind](data) };
  }

  // Fallback: heuristic classification for backward compatibility
  // Check for event discriminators first (command-based messages)
  if (data.event === 'command') return { kind: 'command', result: validators.command(data) };
  if (data.event === 'command_response')
    return { kind: 'commandResponse', result: validators.commandResponse(data) };
  if (data.event === 'mesh_bridge')
    return { kind: 'meshBridge', result: validators.meshBridge(data) };
  if (data.event && ['config_snapshot', 'config_update', 'config_request'].includes(data.event))
    return { kind: 'deviceConfig', result: validators.deviceConfig(data) };

  // Check for mesh status and metrics (new in v0.7.2)
  if (data.mesh_status && typeof data.mesh_status === 'string')
    return { kind: 'meshStatus', result: validators.meshStatus(data) };
  if (data.mesh_network_id && data.metrics && typeof data.metrics.uptime_s === 'number')
    return { kind: 'meshMetrics', result: validators.meshMetrics(data) };

  // Sensor and gateway specific heuristics
  if (data.device_type === 'sensor') {
    if (data.metrics && typeof data.metrics.uptime_s === 'number')
      return { kind: 'sensorMetrics', result: validators.sensorMetrics(data) };
    if (data.capabilities || data.calibration_info || data.operational_info)
      return { kind: 'sensorInfo', result: validators.sensorInfo(data) };
    if (data.sensors) return { kind: 'sensorData', result: validators.sensorData(data) };
    if (data.status && ['online', 'offline', 'updating', 'error'].includes(data.status))
      return { kind: 'sensorStatus', result: validators.sensorStatus(data) };
  }

  if (data.device_type === 'gateway') {
    if (data.sensors) return { kind: 'gatewayData', result: validators.gatewayData(data) };
    if (data.metrics) return { kind: 'gatewayMetrics', result: validators.gatewayMetrics(data) };
    if (
      data.status &&
      [
        'online',
        'offline',
        'starting',
        'stopping',
        'updating',
        'maintenance',
        'error',
        'degraded',
      ].includes(data.status)
    )
      return { kind: 'gatewayStatus', result: validators.gatewayStatus(data) };
    if (data.status_summary)
      return { kind: 'gatewayHeartbeat', result: validators.gatewayHeartbeat(data) };
  }

  // Generic classification heuristics
  if (Array.isArray(data.nodes))
    return { kind: 'meshNodeList', result: validators.meshNodeList(data) };
  if (Array.isArray(data.connections))
    return { kind: 'meshTopology', result: validators.meshTopology(data) };
  if (Array.isArray(data.alerts)) return { kind: 'meshAlert', result: validators.meshAlert(data) };
  if (
    data.progress_pct !== undefined ||
    (data.status &&
      [
        'idle',
        'pending',
        'scheduled',
        'downloading',
        'download_paused',
        'flashing',
        'verifying',
        'rebooting',
        'completed',
        'failed',
        'cancelled',
        'rolled_back',
        'rollback_pending',
        'rollback_failed',
      ].includes(data.status))
  )
    return { kind: 'firmwareStatus', result: validators.firmwareStatus(data) };
  if (data.status && ['ok', 'error'].includes(data.status))
    return { kind: 'controlResponse', result: validators.controlResponse(data) };
  if (data.device_type === 'gateway')
    return { kind: 'gatewayInfo', result: validators.gatewayInfo(data) };

  // Fallback treat as heartbeat attempt
  return { kind: 'sensorHeartbeat', result: validators.sensorHeartbeat(data) };
}
