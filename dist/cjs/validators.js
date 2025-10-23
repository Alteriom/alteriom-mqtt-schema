"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validators = void 0;
exports.validateMessage = validateMessage;
exports.classifyAndValidate = classifyAndValidate;
const _2020_js_1 = __importDefault(require("ajv/dist/2020.js"));
const ajv_formats_1 = __importDefault(require("ajv-formats"));
// Schemas embedded via generated schema_data.ts (copy-schemas.cjs) to avoid filesystem dependency
const schema_data_js_1 = require("./schema_data.js");
// Load JSON schemas via createRequire so it works in both CJS and ESM builds without import assertions.
// Bind embedded schema objects for Ajv consumption
const envelope = schema_data_js_1.envelope_schema;
const sensorData = schema_data_js_1.sensor_data_schema;
const sensorHeartbeat = schema_data_js_1.sensor_heartbeat_schema;
const sensorStatus = schema_data_js_1.sensor_status_schema;
const sensorInfo = schema_data_js_1.sensor_info_schema;
const sensorMetrics = schema_data_js_1.sensor_metrics_schema;
const gatewayInfo = schema_data_js_1.gateway_info_schema;
const gatewayMetrics = schema_data_js_1.gateway_metrics_schema;
const gatewayData = schema_data_js_1.gateway_data_schema;
const gatewayHeartbeat = schema_data_js_1.gateway_heartbeat_schema;
const gatewayStatus = schema_data_js_1.gateway_status_schema;
const firmwareStatus = schema_data_js_1.firmware_status_schema;
const controlResponse = schema_data_js_1.control_response_schema;
const command = schema_data_js_1.command_schema;
const commandResponse = schema_data_js_1.command_response_schema;
const meshNodeList = schema_data_js_1.mesh_node_list_schema;
const meshTopology = schema_data_js_1.mesh_topology_schema;
const meshAlert = schema_data_js_1.mesh_alert_schema;
const meshBridge = schema_data_js_1.mesh_bridge_schema;
const meshStatus = schema_data_js_1.mesh_status_schema;
const meshMetrics = schema_data_js_1.mesh_metrics_schema;
const deviceConfig = schema_data_js_1.device_config_schema;
// Lazy singleton Ajv instance so consumers can optionally supply their own if needed.
let _ajv = null;
function getAjv(opts) {
    if (_ajv)
        return _ajv;
    _ajv = new _2020_js_1.default({
        strict: false,
        allErrors: true,
        allowUnionTypes: true,
        ...opts
    });
    (0, ajv_formats_1.default)(_ajv);
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
exports.validators = {
    sensorData: (d) => toResult(sensorDataValidate, d),
    sensorHeartbeat: (d) => toResult(sensorHeartbeatValidate, d),
    sensorStatus: (d) => toResult(sensorStatusValidate, d),
    sensorInfo: (d) => toResult(sensorInfoValidate, d),
    sensorMetrics: (d) => toResult(sensorMetricsValidate, d),
    gatewayInfo: (d) => toResult(gatewayInfoValidate, d),
    gatewayMetrics: (d) => toResult(gatewayMetricsValidate, d),
    gatewayData: (d) => toResult(gatewayDataValidate, d),
    gatewayHeartbeat: (d) => toResult(gatewayHeartbeatValidate, d),
    gatewayStatus: (d) => toResult(gatewayStatusValidate, d),
    firmwareStatus: (d) => toResult(firmwareStatusValidate, d),
    controlResponse: (d) => toResult(controlResponseValidate, d),
    command: (d) => toResult(commandValidate, d),
    commandResponse: (d) => toResult(commandResponseValidate, d),
    meshNodeList: (d) => toResult(meshNodeListValidate, d),
    meshTopology: (d) => toResult(meshTopologyValidate, d),
    meshAlert: (d) => toResult(meshAlertValidate, d),
    meshBridge: (d) => toResult(meshBridgeValidate, d),
    meshStatus: (d) => toResult(meshStatusValidate, d),
    meshMetrics: (d) => toResult(meshMetricsValidate, d),
    deviceConfig: (d) => toResult(deviceConfigValidate, d)
};
function validateMessage(kind, data) {
    return exports.validators[kind](data);
}
// Message Type Code to Validator mapping (v0.7.2)
const MESSAGE_TYPE_MAP = {
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
    700: 'deviceConfig'
};
// Classifier using lightweight heuristics to pick a schema validator.
// v0.7.2: Fast path using message_type code when present
function classifyAndValidate(data) {
    if (!data || typeof data !== 'object')
        return { result: { valid: false, errors: ['Not an object'] } };
    // Fast path: use message_type code if present (v0.7.2)
    if (typeof data.message_type === 'number' && data.message_type in MESSAGE_TYPE_MAP) {
        const kind = MESSAGE_TYPE_MAP[data.message_type];
        return { kind, result: exports.validators[kind](data) };
    }
    // Fallback: heuristic classification for backward compatibility
    // Check for event discriminators first (command-based messages)
    if (data.event === 'command')
        return { kind: 'command', result: exports.validators.command(data) };
    if (data.event === 'command_response')
        return { kind: 'commandResponse', result: exports.validators.commandResponse(data) };
    if (data.event === 'mesh_bridge')
        return { kind: 'meshBridge', result: exports.validators.meshBridge(data) };
    if (data.event && ['config_snapshot', 'config_update', 'config_request'].includes(data.event))
        return { kind: 'deviceConfig', result: exports.validators.deviceConfig(data) };
    // Check for mesh status and metrics (new in v0.7.2)
    if (data.mesh_status && typeof data.mesh_status === 'string')
        return { kind: 'meshStatus', result: exports.validators.meshStatus(data) };
    if (data.mesh_network_id && data.metrics && typeof data.metrics.uptime_s === 'number')
        return { kind: 'meshMetrics', result: exports.validators.meshMetrics(data) };
    // Sensor and gateway specific heuristics
    if (data.device_type === 'sensor') {
        if (data.metrics && typeof data.metrics.uptime_s === 'number')
            return { kind: 'sensorMetrics', result: exports.validators.sensorMetrics(data) };
        if (data.capabilities || data.calibration_info || data.operational_info)
            return { kind: 'sensorInfo', result: exports.validators.sensorInfo(data) };
        if (data.sensors)
            return { kind: 'sensorData', result: exports.validators.sensorData(data) };
        if (data.status && ['online', 'offline', 'updating', 'error'].includes(data.status))
            return { kind: 'sensorStatus', result: exports.validators.sensorStatus(data) };
    }
    if (data.device_type === 'gateway') {
        if (data.sensors)
            return { kind: 'gatewayData', result: exports.validators.gatewayData(data) };
        if (data.metrics)
            return { kind: 'gatewayMetrics', result: exports.validators.gatewayMetrics(data) };
        if (data.status && ['online', 'offline', 'starting', 'stopping', 'updating', 'maintenance', 'error', 'degraded'].includes(data.status))
            return { kind: 'gatewayStatus', result: exports.validators.gatewayStatus(data) };
        if (data.status_summary)
            return { kind: 'gatewayHeartbeat', result: exports.validators.gatewayHeartbeat(data) };
    }
    // Generic classification heuristics
    if (Array.isArray(data.nodes))
        return { kind: 'meshNodeList', result: exports.validators.meshNodeList(data) };
    if (Array.isArray(data.connections))
        return { kind: 'meshTopology', result: exports.validators.meshTopology(data) };
    if (Array.isArray(data.alerts))
        return { kind: 'meshAlert', result: exports.validators.meshAlert(data) };
    if (data.progress_pct !== undefined || (data.status && ['idle', 'pending', 'scheduled', 'downloading', 'download_paused', 'flashing', 'verifying', 'rebooting', 'completed', 'failed', 'cancelled', 'rolled_back', 'rollback_pending', 'rollback_failed'].includes(data.status)))
        return { kind: 'firmwareStatus', result: exports.validators.firmwareStatus(data) };
    if (data.status && ['ok', 'error'].includes(data.status))
        return { kind: 'controlResponse', result: exports.validators.controlResponse(data) };
    if (data.device_type === 'gateway')
        return { kind: 'gatewayInfo', result: exports.validators.gatewayInfo(data) };
    // Fallback treat as heartbeat attempt
    return { kind: 'sensorHeartbeat', result: exports.validators.sensorHeartbeat(data) };
}
