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
const gatewayInfo = schema_data_js_1.gateway_info_schema;
const gatewayMetrics = schema_data_js_1.gateway_metrics_schema;
const firmwareStatus = schema_data_js_1.firmware_status_schema;
const controlResponse = schema_data_js_1.control_response_schema;
const meshNodeList = schema_data_js_1.mesh_node_list_schema;
const meshTopology = schema_data_js_1.mesh_topology_schema;
const meshAlert = schema_data_js_1.mesh_alert_schema;
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
const gatewayInfoValidate = ajv.compile(gatewayInfo);
const gatewayMetricsValidate = ajv.compile(gatewayMetrics);
const firmwareStatusValidate = ajv.compile(firmwareStatus);
const controlResponseValidate = ajv.compile(controlResponse);
const meshNodeListValidate = ajv.compile(meshNodeList);
const meshTopologyValidate = ajv.compile(meshTopology);
const meshAlertValidate = ajv.compile(meshAlert);
exports.validators = {
    sensorData: (d) => toResult(sensorDataValidate, d),
    sensorHeartbeat: (d) => toResult(sensorHeartbeatValidate, d),
    sensorStatus: (d) => toResult(sensorStatusValidate, d),
    gatewayInfo: (d) => toResult(gatewayInfoValidate, d),
    gatewayMetrics: (d) => toResult(gatewayMetricsValidate, d),
    firmwareStatus: (d) => toResult(firmwareStatusValidate, d),
    controlResponse: (d) => toResult(controlResponseValidate, d),
    meshNodeList: (d) => toResult(meshNodeListValidate, d),
    meshTopology: (d) => toResult(meshTopologyValidate, d),
    meshAlert: (d) => toResult(meshAlertValidate, d)
};
function validateMessage(kind, data) {
    return exports.validators[kind](data);
}
// Classifier using lightweight heuristics to pick a schema validator.
function classifyAndValidate(data) {
    if (!data || typeof data !== 'object')
        return { result: { valid: false, errors: ['Not an object'] } };
    if (data.metrics)
        return { kind: 'gatewayMetrics', result: exports.validators.gatewayMetrics(data) };
    if (data.sensors)
        return { kind: 'sensorData', result: exports.validators.sensorData(data) };
    if (Array.isArray(data.nodes))
        return { kind: 'meshNodeList', result: exports.validators.meshNodeList(data) };
    if (Array.isArray(data.connections))
        return { kind: 'meshTopology', result: exports.validators.meshTopology(data) };
    if (Array.isArray(data.alerts))
        return { kind: 'meshAlert', result: exports.validators.meshAlert(data) };
    if (data.progress_pct !== undefined || (data.status && ['pending', 'downloading', 'flashing', 'verifying', 'rebooting', 'completed', 'failed'].includes(data.status)))
        return { kind: 'firmwareStatus', result: exports.validators.firmwareStatus(data) };
    if (data.status && ['online', 'offline', 'updating', 'error'].includes(data.status) && data.device_type === 'sensor')
        return { kind: 'sensorStatus', result: exports.validators.sensorStatus(data) };
    if (data.status && ['ok', 'error'].includes(data.status))
        return { kind: 'controlResponse', result: exports.validators.controlResponse(data) };
    if (data.device_type === 'gateway')
        return { kind: 'gatewayInfo', result: exports.validators.gatewayInfo(data) };
    // Fallback treat as heartbeat attempt
    return { kind: 'sensorHeartbeat', result: exports.validators.sensorHeartbeat(data) };
}
