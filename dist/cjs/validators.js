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
// Unified Device Schemas (v0.8.0)
const deviceData = schema_data_js_1.device_data_schema;
const deviceHeartbeat = schema_data_js_1.device_heartbeat_schema;
const deviceStatus = schema_data_js_1.device_status_schema;
const deviceInfo = schema_data_js_1.device_info_schema;
const deviceMetrics = schema_data_js_1.device_metrics_schema;
// Sensor-Specific Schemas
const sensorData = schema_data_js_1.sensor_data_schema;
const sensorHeartbeat = schema_data_js_1.sensor_heartbeat_schema;
const sensorStatus = schema_data_js_1.sensor_status_schema;
const sensorInfo = schema_data_js_1.sensor_info_schema;
const sensorMetrics = schema_data_js_1.sensor_metrics_schema;
// Gateway-Specific Schemas
const gatewayInfo = schema_data_js_1.gateway_info_schema;
const gatewayMetrics = schema_data_js_1.gateway_metrics_schema;
const gatewayData = schema_data_js_1.gateway_data_schema;
const gatewayHeartbeat = schema_data_js_1.gateway_heartbeat_schema;
const gatewayStatus = schema_data_js_1.gateway_status_schema;
// Firmware & Control
const firmwareStatus = schema_data_js_1.firmware_status_schema;
const controlResponse = schema_data_js_1.control_response_schema;
const command = schema_data_js_1.command_schema;
const commandResponse = schema_data_js_1.command_response_schema;
// Mesh Network
const meshNodeList = schema_data_js_1.mesh_node_list_schema;
const meshTopology = schema_data_js_1.mesh_topology_schema;
const meshAlert = schema_data_js_1.mesh_alert_schema;
const meshBridge = schema_data_js_1.mesh_bridge_schema;
const meshStatus = schema_data_js_1.mesh_status_schema;
const meshMetrics = schema_data_js_1.mesh_metrics_schema;
// Bridge Management
const bridgeStatus = schema_data_js_1.bridge_status_schema;
const bridgeElection = schema_data_js_1.bridge_election_schema;
const bridgeTakeover = schema_data_js_1.bridge_takeover_schema;
const bridgeCoordination = schema_data_js_1.bridge_coordination_schema;
const timeSyncNtp = schema_data_js_1.time_sync_ntp_schema;
// Configuration & Batching
const deviceConfig = schema_data_js_1.device_config_schema;
const batchEnvelope = schema_data_js_1.batch_envelope_schema;
const compressedEnvelope = schema_data_js_1.compressed_envelope_schema;
// Lazy singleton Ajv instance so consumers can optionally supply their own if needed.
let _ajv = null;
function getAjv(opts) {
    if (_ajv)
        return _ajv;
    _ajv = new _2020_js_1.default({
        strict: false,
        allErrors: true,
        allowUnionTypes: true,
        ...opts,
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
    return {
        valid: false,
        errors: (v.errors || []).map((e) => `${e.instancePath || '/'} ${e.message || ''}`.trim()),
    };
}
// Pre-compile validators (they are small; compilation cost negligible for typical web usage)
const ajv = getAjv();
// Unified Device Validators (v0.8.0)
const deviceDataValidate = ajv.compile(deviceData);
const deviceHeartbeatValidate = ajv.compile(deviceHeartbeat);
const deviceStatusValidate = ajv.compile(deviceStatus);
const deviceInfoValidate = ajv.compile(deviceInfo);
const deviceMetricsValidate = ajv.compile(deviceMetrics);
// Sensor-Specific Validators
const sensorDataValidate = ajv.compile(sensorData);
const sensorHeartbeatValidate = ajv.compile(sensorHeartbeat);
const sensorStatusValidate = ajv.compile(sensorStatus);
const sensorInfoValidate = ajv.compile(sensorInfo);
const sensorMetricsValidate = ajv.compile(sensorMetrics);
// Gateway-Specific Validators
const gatewayInfoValidate = ajv.compile(gatewayInfo);
const gatewayMetricsValidate = ajv.compile(gatewayMetrics);
const gatewayDataValidate = ajv.compile(gatewayData);
const gatewayHeartbeatValidate = ajv.compile(gatewayHeartbeat);
const gatewayStatusValidate = ajv.compile(gatewayStatus);
// Firmware & Control Validators
const firmwareStatusValidate = ajv.compile(firmwareStatus);
const controlResponseValidate = ajv.compile(controlResponse);
const commandValidate = ajv.compile(command);
const commandResponseValidate = ajv.compile(commandResponse);
// Mesh Network Validators
const meshNodeListValidate = ajv.compile(meshNodeList);
const meshTopologyValidate = ajv.compile(meshTopology);
const meshAlertValidate = ajv.compile(meshAlert);
const meshBridgeValidate = ajv.compile(meshBridge);
const meshStatusValidate = ajv.compile(meshStatus);
const meshMetricsValidate = ajv.compile(meshMetrics);
// Bridge Management Validators
const bridgeStatusValidate = ajv.compile(bridgeStatus);
const bridgeElectionValidate = ajv.compile(bridgeElection);
const bridgeTakeoverValidate = ajv.compile(bridgeTakeover);
const bridgeCoordinationValidate = ajv.compile(bridgeCoordination);
const timeSyncNtpValidate = ajv.compile(timeSyncNtp);
// Configuration & Batching Validators
const deviceConfigValidate = ajv.compile(deviceConfig);
const batchEnvelopeValidate = ajv.compile(batchEnvelope);
const compressedEnvelopeValidate = ajv.compile(compressedEnvelope);
exports.validators = {
    // Unified Device Validators (v0.8.0)
    deviceData: (d) => toResult(deviceDataValidate, d),
    deviceHeartbeat: (d) => toResult(deviceHeartbeatValidate, d),
    deviceStatus: (d) => toResult(deviceStatusValidate, d),
    deviceInfo: (d) => toResult(deviceInfoValidate, d),
    deviceMetrics: (d) => toResult(deviceMetricsValidate, d),
    // Sensor-Specific Validators
    sensorData: (d) => toResult(sensorDataValidate, d),
    sensorHeartbeat: (d) => toResult(sensorHeartbeatValidate, d),
    sensorStatus: (d) => toResult(sensorStatusValidate, d),
    sensorInfo: (d) => toResult(sensorInfoValidate, d),
    sensorMetrics: (d) => toResult(sensorMetricsValidate, d),
    // Gateway-Specific Validators
    gatewayInfo: (d) => toResult(gatewayInfoValidate, d),
    gatewayMetrics: (d) => toResult(gatewayMetricsValidate, d),
    gatewayData: (d) => toResult(gatewayDataValidate, d),
    gatewayHeartbeat: (d) => toResult(gatewayHeartbeatValidate, d),
    gatewayStatus: (d) => toResult(gatewayStatusValidate, d),
    // Firmware & Control Validators
    firmwareStatus: (d) => toResult(firmwareStatusValidate, d),
    controlResponse: (d) => toResult(controlResponseValidate, d),
    command: (d) => toResult(commandValidate, d),
    commandResponse: (d) => toResult(commandResponseValidate, d),
    // Mesh Network Validators
    meshNodeList: (d) => toResult(meshNodeListValidate, d),
    meshTopology: (d) => toResult(meshTopologyValidate, d),
    meshAlert: (d) => toResult(meshAlertValidate, d),
    meshBridge: (d) => toResult(meshBridgeValidate, d),
    meshStatus: (d) => toResult(meshStatusValidate, d),
    meshMetrics: (d) => toResult(meshMetricsValidate, d),
    // Bridge Management Validators
    bridgeStatus: (d) => toResult(bridgeStatusValidate, d),
    bridgeElection: (d) => toResult(bridgeElectionValidate, d),
    bridgeTakeover: (d) => toResult(bridgeTakeoverValidate, d),
    bridgeCoordination: (d) => toResult(bridgeCoordinationValidate, d),
    timeSyncNtp: (d) => toResult(timeSyncNtpValidate, d),
    // Configuration & Batching Validators
    deviceConfig: (d) => toResult(deviceConfigValidate, d),
    batchEnvelope: (d) => toResult(batchEnvelopeValidate, d),
    compressedEnvelope: (d) => toResult(compressedEnvelopeValidate, d),
};
function validateMessage(kind, data) {
    return exports.validators[kind](data);
}
// Legacy code mapping for backward compatibility (v0.8.0 BREAKING CHANGES)
const LEGACY_CODE_MAP = {
    300: 305, // gateway_info moved to 305 for alignment
    301: 306, // gateway_metrics moved to 306 for alignment
};
// Message Type Code to Validator mapping (v0.8.0)
const MESSAGE_TYPE_MAP = {
    // Unified Device Codes (v0.8.0+)
    101: 'deviceData',
    102: 'deviceHeartbeat',
    103: 'deviceStatus',
    104: 'deviceInfo',
    105: 'deviceMetrics',
    // Sensor-Specific Codes (20x)
    200: 'sensorData',
    201: 'sensorHeartbeat',
    202: 'sensorStatus',
    203: 'sensorInfo',
    204: 'sensorMetrics',
    // Gateway-Specific Codes (30x) - BREAKING: 300→305, 301→306
    302: 'gatewayData',
    303: 'gatewayHeartbeat',
    304: 'gatewayStatus',
    305: 'gatewayInfo', // v0.8.0 BREAKING - was 300
    306: 'gatewayMetrics', // v0.8.0 BREAKING - was 301
    // Command & Control
    400: 'command',
    401: 'commandResponse',
    402: 'controlResponse',
    // Firmware Updates
    500: 'firmwareStatus',
    // Mesh Network
    600: 'meshNodeList',
    601: 'meshTopology',
    602: 'meshAlert',
    603: 'meshBridge',
    604: 'meshStatus',
    605: 'meshMetrics',
    // Bridge Management
    610: 'bridgeStatus',
    611: 'bridgeElection',
    612: 'bridgeTakeover',
    613: 'bridgeCoordination',
    614: 'timeSyncNtp',
    // Configuration
    700: 'deviceConfig',
    // Batching & Compression
    800: 'batchEnvelope',
    810: 'compressedEnvelope',
};
// Classifier using lightweight heuristics to pick a schema validator.
// v0.7.2: Fast path using message_type code when present
// v0.8.0: Automatic legacy code translation for 300→305, 301→306
function classifyAndValidate(data) {
    if (!data || typeof data !== 'object')
        return { result: { valid: false, errors: ['Not an object'] } };
    // Fast path: use message_type code if present (v0.7.2+)
    if (typeof data.message_type === 'number') {
        // Apply legacy code translation for v0.8.0 breaking changes
        const translatedType = LEGACY_CODE_MAP[data.message_type] || data.message_type;
        if (translatedType in MESSAGE_TYPE_MAP) {
            const kind = MESSAGE_TYPE_MAP[translatedType];
            return { kind, result: exports.validators[kind](data) };
        }
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
    // Bridge management events (v0.8.0)
    if (data.event === 'bridge_status')
        return { kind: 'bridgeStatus', result: exports.validators.bridgeStatus(data) };
    if (data.event === 'bridge_election')
        return { kind: 'bridgeElection', result: exports.validators.bridgeElection(data) };
    if (data.event === 'bridge_takeover')
        return { kind: 'bridgeTakeover', result: exports.validators.bridgeTakeover(data) };
    if (data.event === 'bridge_coordination')
        return { kind: 'bridgeCoordination', result: exports.validators.bridgeCoordination(data) };
    if (data.event === 'time_sync_ntp')
        return { kind: 'timeSyncNtp', result: exports.validators.timeSyncNtp(data) };
    // Check for mesh status and metrics (new in v0.7.2)
    if (data.mesh_status && typeof data.mesh_status === 'string')
        return { kind: 'meshStatus', result: exports.validators.meshStatus(data) };
    if (data.mesh_network_id && data.metrics && typeof data.metrics.uptime_s === 'number')
        return { kind: 'meshMetrics', result: exports.validators.meshMetrics(data) };
    // Unified device heuristics (v0.8.0+) - prioritize if device_role is present
    if (data.device_role && ['sensor', 'gateway', 'bridge', 'hybrid'].includes(data.device_type)) {
        if (data.metrics && typeof data.metrics.uptime_s === 'number')
            return { kind: 'deviceMetrics', result: exports.validators.deviceMetrics(data) };
        if (data.capabilities || data.calibration_info || data.operational_info)
            return { kind: 'deviceInfo', result: exports.validators.deviceInfo(data) };
        if (data.sensors)
            return { kind: 'deviceData', result: exports.validators.deviceData(data) };
        if (data.status &&
            [
                'online',
                'offline',
                'starting',
                'stopping',
                'updating',
                'maintenance',
                'error',
                'degraded',
            ].includes(data.status))
            return { kind: 'deviceStatus', result: exports.validators.deviceStatus(data) };
        if (data.status_summary || data.uptime_s !== undefined)
            return { kind: 'deviceHeartbeat', result: exports.validators.deviceHeartbeat(data) };
    }
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
        if (data.status &&
            [
                'online',
                'offline',
                'starting',
                'stopping',
                'updating',
                'maintenance',
                'error',
                'degraded',
            ].includes(data.status))
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
    if (data.progress_pct !== undefined ||
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
            ].includes(data.status)))
        return { kind: 'firmwareStatus', result: exports.validators.firmwareStatus(data) };
    if (data.status && ['ok', 'error'].includes(data.status))
        return { kind: 'controlResponse', result: exports.validators.controlResponse(data) };
    if (data.device_type === 'gateway')
        return { kind: 'gatewayInfo', result: exports.validators.gatewayInfo(data) };
    // Fallback treat as heartbeat attempt
    return { kind: 'sensorHeartbeat', result: exports.validators.sensorHeartbeat(data) };
}
