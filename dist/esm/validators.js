import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
// Schemas embedded via generated schema_data.ts (copy-schemas.cjs) to avoid filesystem dependency
import { envelope_schema, sensor_data_schema, sensor_heartbeat_schema, sensor_status_schema, gateway_info_schema, gateway_metrics_schema, firmware_status_schema, control_response_schema, command_schema, command_response_schema, mesh_node_list_schema, mesh_topology_schema, mesh_alert_schema, mesh_bridge_schema, device_config_schema } from './schema_data.js';
// Load JSON schemas via createRequire so it works in both CJS and ESM builds without import assertions.
// Bind embedded schema objects for Ajv consumption
const envelope = envelope_schema;
const sensorData = sensor_data_schema;
const sensorHeartbeat = sensor_heartbeat_schema;
const sensorStatus = sensor_status_schema;
const gatewayInfo = gateway_info_schema;
const gatewayMetrics = gateway_metrics_schema;
const firmwareStatus = firmware_status_schema;
const controlResponse = control_response_schema;
const command = command_schema;
const commandResponse = command_response_schema;
const meshNodeList = mesh_node_list_schema;
const meshTopology = mesh_topology_schema;
const meshAlert = mesh_alert_schema;
const meshBridge = mesh_bridge_schema;
const deviceConfig = device_config_schema;
// Lazy singleton Ajv instance so consumers can optionally supply their own if needed.
let _ajv = null;
function getAjv(opts) {
    if (_ajv)
        return _ajv;
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
function toResult(v, data) {
    const valid = v(data);
    if (valid)
        return { valid: true };
    return { valid: false, errors: (v.errors || []).map((e) => `${e.instancePath || '/'} ${e.message || ''}`.trim()) };
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
const commandValidate = ajv.compile(command);
const commandResponseValidate = ajv.compile(commandResponse);
const meshNodeListValidate = ajv.compile(meshNodeList);
const meshTopologyValidate = ajv.compile(meshTopology);
const meshAlertValidate = ajv.compile(meshAlert);
const meshBridgeValidate = ajv.compile(meshBridge);
const deviceConfigValidate = ajv.compile(deviceConfig);
export const validators = {
    sensorData: (d) => toResult(sensorDataValidate, d),
    sensorHeartbeat: (d) => toResult(sensorHeartbeatValidate, d),
    sensorStatus: (d) => toResult(sensorStatusValidate, d),
    gatewayInfo: (d) => toResult(gatewayInfoValidate, d),
    gatewayMetrics: (d) => toResult(gatewayMetricsValidate, d),
    firmwareStatus: (d) => toResult(firmwareStatusValidate, d),
    controlResponse: (d) => toResult(controlResponseValidate, d),
    command: (d) => toResult(commandValidate, d),
    commandResponse: (d) => toResult(commandResponseValidate, d),
    meshNodeList: (d) => toResult(meshNodeListValidate, d),
    meshTopology: (d) => toResult(meshTopologyValidate, d),
    meshAlert: (d) => toResult(meshAlertValidate, d),
    meshBridge: (d) => toResult(meshBridgeValidate, d),
    deviceConfig: (d) => toResult(deviceConfigValidate, d)
};
export function validateMessage(kind, data) {
    return validators[kind](data);
}
// Message Type Code to Validator mapping (v0.7.1+)
const MESSAGE_TYPE_MAP = {
    200: 'sensorData',
    201: 'sensorHeartbeat',
    202: 'sensorStatus',
    300: 'gatewayInfo',
    301: 'gatewayMetrics',
    400: 'command',
    401: 'commandResponse',
    402: 'controlResponse',
    500: 'firmwareStatus',
    600: 'meshNodeList',
    601: 'meshTopology',
    602: 'meshAlert',
    603: 'meshBridge',
    700: 'deviceConfig'
};
// Classifier using lightweight heuristics to pick a schema validator.
// v0.7.1+: Fast path using message_type code when present
export function classifyAndValidate(data) {
    if (!data || typeof data !== 'object')
        return { result: { valid: false, errors: ['Not an object'] } };
    // Fast path: use message_type code if present (v0.7.1+)
    if (typeof data.message_type === 'number' && data.message_type in MESSAGE_TYPE_MAP) {
        const kind = MESSAGE_TYPE_MAP[data.message_type];
        return { kind, result: validators[kind](data) };
    }
    // Fallback: heuristic classification for backward compatibility
    // Check for event discriminators first (command-based messages)
    if (data.event === 'command')
        return { kind: 'command', result: validators.command(data) };
    if (data.event === 'command_response')
        return { kind: 'commandResponse', result: validators.commandResponse(data) };
    if (data.event === 'mesh_bridge')
        return { kind: 'meshBridge', result: validators.meshBridge(data) };
    if (data.event && ['config_snapshot', 'config_update', 'config_request'].includes(data.event))
        return { kind: 'deviceConfig', result: validators.deviceConfig(data) };
    // Existing classification heuristics
    if (data.metrics)
        return { kind: 'gatewayMetrics', result: validators.gatewayMetrics(data) };
    if (data.sensors)
        return { kind: 'sensorData', result: validators.sensorData(data) };
    if (Array.isArray(data.nodes))
        return { kind: 'meshNodeList', result: validators.meshNodeList(data) };
    if (Array.isArray(data.connections))
        return { kind: 'meshTopology', result: validators.meshTopology(data) };
    if (Array.isArray(data.alerts))
        return { kind: 'meshAlert', result: validators.meshAlert(data) };
    if (data.progress_pct !== undefined || (data.status && ['pending', 'downloading', 'flashing', 'verifying', 'rebooting', 'completed', 'failed', 'rolled_back', 'rollback_pending', 'rollback_failed'].includes(data.status)))
        return { kind: 'firmwareStatus', result: validators.firmwareStatus(data) };
    if (data.status && ['online', 'offline', 'updating', 'error'].includes(data.status) && data.device_type === 'sensor')
        return { kind: 'sensorStatus', result: validators.sensorStatus(data) };
    if (data.status && ['ok', 'error'].includes(data.status))
        return { kind: 'controlResponse', result: validators.controlResponse(data) };
    if (data.device_type === 'gateway')
        return { kind: 'gatewayInfo', result: validators.gatewayInfo(data) };
    // Fallback treat as heartbeat attempt
    return { kind: 'sensorHeartbeat', result: validators.sensorHeartbeat(data) };
}
