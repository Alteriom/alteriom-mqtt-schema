import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
// Schemas embedded via generated schema_data.ts (copy-schemas.cjs) to avoid filesystem dependency
import { envelope_schema, sensor_data_schema, sensor_heartbeat_schema, sensor_status_schema, gateway_info_schema, gateway_metrics_schema, firmware_status_schema, control_response_schema } from './schema_data.js';
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
export const validators = {
    sensorData: (d) => toResult(sensorDataValidate, d),
    sensorHeartbeat: (d) => toResult(sensorHeartbeatValidate, d),
    sensorStatus: (d) => toResult(sensorStatusValidate, d),
    gatewayInfo: (d) => toResult(gatewayInfoValidate, d),
    gatewayMetrics: (d) => toResult(gatewayMetricsValidate, d),
    firmwareStatus: (d) => toResult(firmwareStatusValidate, d),
    controlResponse: (d) => toResult(controlResponseValidate, d)
};
export function validateMessage(kind, data) {
    return validators[kind](data);
}
// Classifier using lightweight heuristics to pick a schema validator.
export function classifyAndValidate(data) {
    if (!data || typeof data !== 'object')
        return { result: { valid: false, errors: ['Not an object'] } };
    if (data.metrics)
        return { kind: 'gatewayMetrics', result: validators.gatewayMetrics(data) };
    if (data.sensors)
        return { kind: 'sensorData', result: validators.sensorData(data) };
    if (data.progress_pct !== undefined || (data.status && ['pending', 'downloading', 'flashing', 'verifying', 'rebooting', 'completed', 'failed'].includes(data.status)))
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
