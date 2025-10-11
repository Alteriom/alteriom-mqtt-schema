import Ajv, {ValidateFunction} from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
// Schemas embedded via generated schema_data.ts (copy-schemas.cjs) to avoid filesystem dependency
import {
  envelope_schema,
  sensor_data_schema,
  sensor_heartbeat_schema,
  sensor_status_schema,
  gateway_info_schema,
  gateway_metrics_schema,
  firmware_status_schema,
  control_response_schema,
  mesh_node_list_schema,
  mesh_topology_schema,
  mesh_alert_schema
} from './schema_data.js';
// Load JSON schemas via createRequire so it works in both CJS and ESM builds without import assertions.
// Bind embedded schema objects for Ajv consumption
const envelope = envelope_schema as any;
const sensorData = sensor_data_schema as any;
const sensorHeartbeat = sensor_heartbeat_schema as any;
const sensorStatus = sensor_status_schema as any;
const gatewayInfo = gateway_info_schema as any;
const gatewayMetrics = gateway_metrics_schema as any;
const firmwareStatus = firmware_status_schema as any;
const controlResponse = control_response_schema as any;
const meshNodeList = mesh_node_list_schema as any;
const meshTopology = mesh_topology_schema as any;
const meshAlert = mesh_alert_schema as any;

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
    ...opts
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
  return { valid: false, errors: (v.errors || []).map((e: any) => `${e.instancePath || '/'} ${e.message || ''}`.trim()) };
}

// Pre-compile validators (they are small; compilation cost negligible for typical web usage)
const ajv = getAjv();

const sensorDataValidate = ajv.compile(sensorData);
const sensorHeartbeatValidate = ajv.compile(sensorHeartbeat);
const sensorStatusValidate = ajv.compile(sensorStatus);
const gatewayInfoValidate = ajv.compile(gatewayInfo);
const gatewayMetricsValidate = ajv.compile(gatewayMetrics);
const firmwareStatusValidate = ajv.compile(firmwareStatus);
const controlResponseValidate = ajv.compile(controlResponse);
const meshNodeListValidate = ajv.compile(meshNodeList);
const meshTopologyValidate = ajv.compile(meshTopology);
const meshAlertValidate = ajv.compile(meshAlert);

export const validators = {
  sensorData: (d: unknown) => toResult(sensorDataValidate, d),
  sensorHeartbeat: (d: unknown) => toResult(sensorHeartbeatValidate, d),
  sensorStatus: (d: unknown) => toResult(sensorStatusValidate, d),
  gatewayInfo: (d: unknown) => toResult(gatewayInfoValidate, d),
  gatewayMetrics: (d: unknown) => toResult(gatewayMetricsValidate, d),
  firmwareStatus: (d: unknown) => toResult(firmwareStatusValidate, d),
  controlResponse: (d: unknown) => toResult(controlResponseValidate, d),
  meshNodeList: (d: unknown) => toResult(meshNodeListValidate, d),
  meshTopology: (d: unknown) => toResult(meshTopologyValidate, d),
  meshAlert: (d: unknown) => toResult(meshAlertValidate, d)
};

export type ValidatorName = keyof typeof validators;

export function validateMessage(kind: ValidatorName, data: unknown): ValidationResult {
  return validators[kind](data);
}

// Classifier using lightweight heuristics to pick a schema validator.
export function classifyAndValidate(data: any): { kind?: ValidatorName; result: ValidationResult } {
  if (!data || typeof data !== 'object') return { result: { valid: false, errors: ['Not an object'] } };
  if (data.metrics) return { kind: 'gatewayMetrics', result: validators.gatewayMetrics(data) };
  if (data.sensors) return { kind: 'sensorData', result: validators.sensorData(data) };
  if (Array.isArray(data.nodes)) return { kind: 'meshNodeList', result: validators.meshNodeList(data) };
  if (Array.isArray(data.connections)) return { kind: 'meshTopology', result: validators.meshTopology(data) };
  if (Array.isArray(data.alerts)) return { kind: 'meshAlert', result: validators.meshAlert(data) };
  if (data.progress_pct !== undefined || (data.status && ['pending','downloading','flashing','verifying','rebooting','completed','failed'].includes(data.status))) return { kind: 'firmwareStatus', result: validators.firmwareStatus(data) };
  if (data.status && ['online','offline','updating','error'].includes(data.status) && data.device_type === 'sensor') return { kind: 'sensorStatus', result: validators.sensorStatus(data) };
  if (data.status && ['ok','error'].includes(data.status)) return { kind: 'controlResponse', result: validators.controlResponse(data) };
  if (data.device_type === 'gateway') return { kind: 'gatewayInfo', result: validators.gatewayInfo(data) };
  // Fallback treat as heartbeat attempt
  return { kind: 'sensorHeartbeat', result: validators.sensorHeartbeat(data) };
}
