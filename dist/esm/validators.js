import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
// Schemas embedded via generated schema_data.ts (copy-schemas.cjs) to avoid filesystem dependency
import { envelope_schema, 
// Unified Device Schemas (v0.8.0)
device_data_schema, device_heartbeat_schema, device_status_schema, device_info_schema, device_metrics_schema, 
// Sensor-Specific Schemas
sensor_data_schema, sensor_heartbeat_schema, sensor_status_schema, sensor_info_schema, sensor_metrics_schema, 
// Gateway-Specific Schemas
gateway_info_schema, gateway_metrics_schema, gateway_data_schema, gateway_heartbeat_schema, gateway_status_schema, 
// Firmware & Control
firmware_status_schema, control_response_schema, command_schema, command_response_schema, 
// Mesh Network
mesh_node_list_schema, mesh_topology_schema, mesh_alert_schema, mesh_bridge_schema, mesh_status_schema, mesh_metrics_schema, 
// Bridge Management
bridge_status_schema, bridge_election_schema, bridge_takeover_schema, bridge_coordination_schema, time_sync_ntp_schema, 
// Configuration & Batching
device_config_schema, batch_envelope_schema, compressed_envelope_schema, } from './schema_data.js';
// Load JSON schemas via createRequire so it works in both CJS and ESM builds without import assertions.
// Bind embedded schema objects for Ajv consumption
const envelope = envelope_schema;
// Unified Device Schemas (v0.8.0)
const deviceData = device_data_schema;
const deviceHeartbeat = device_heartbeat_schema;
const deviceStatus = device_status_schema;
const deviceInfo = device_info_schema;
const deviceMetrics = device_metrics_schema;
// Sensor-Specific Schemas
const sensorData = sensor_data_schema;
const sensorHeartbeat = sensor_heartbeat_schema;
const sensorStatus = sensor_status_schema;
const sensorInfo = sensor_info_schema;
const sensorMetrics = sensor_metrics_schema;
// Gateway-Specific Schemas
const gatewayInfo = gateway_info_schema;
const gatewayMetrics = gateway_metrics_schema;
const gatewayData = gateway_data_schema;
const gatewayHeartbeat = gateway_heartbeat_schema;
const gatewayStatus = gateway_status_schema;
// Firmware & Control
const firmwareStatus = firmware_status_schema;
const controlResponse = control_response_schema;
const command = command_schema;
const commandResponse = command_response_schema;
// Mesh Network
const meshNodeList = mesh_node_list_schema;
const meshTopology = mesh_topology_schema;
const meshAlert = mesh_alert_schema;
const meshBridge = mesh_bridge_schema;
const meshStatus = mesh_status_schema;
const meshMetrics = mesh_metrics_schema;
// Bridge Management
const bridgeStatus = bridge_status_schema;
const bridgeElection = bridge_election_schema;
const bridgeTakeover = bridge_takeover_schema;
const bridgeCoordination = bridge_coordination_schema;
const timeSyncNtp = time_sync_ntp_schema;
// Configuration & Batching
const deviceConfig = device_config_schema;
const batchEnvelope = batch_envelope_schema;
const compressedEnvelope = compressed_envelope_schema;
// Lazy singleton Ajv instance so consumers can optionally supply their own if needed.
let _ajv = null;
function getAjv(opts) {
    if (_ajv)
        return _ajv;
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
export const validators = {
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
export function validateMessage(kind, data) {
    return validators[kind](data);
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
export function classifyAndValidate(data) {
    if (!data || typeof data !== 'object')
        return { result: { valid: false, errors: ['Not an object'] } };
    // Fast path: use message_type code if present (v0.7.2+)
    if (typeof data.message_type === 'number') {
        // Apply legacy code translation for v0.8.0 breaking changes
        const translatedType = LEGACY_CODE_MAP[data.message_type] || data.message_type;
        if (translatedType in MESSAGE_TYPE_MAP) {
            const kind = MESSAGE_TYPE_MAP[translatedType];
            return { kind, result: validators[kind](data) };
        }
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
    // Bridge management events (v0.8.0)
    if (data.event === 'bridge_status')
        return { kind: 'bridgeStatus', result: validators.bridgeStatus(data) };
    if (data.event === 'bridge_election')
        return { kind: 'bridgeElection', result: validators.bridgeElection(data) };
    if (data.event === 'bridge_takeover')
        return { kind: 'bridgeTakeover', result: validators.bridgeTakeover(data) };
    if (data.event === 'bridge_coordination')
        return { kind: 'bridgeCoordination', result: validators.bridgeCoordination(data) };
    if (data.event === 'time_sync_ntp')
        return { kind: 'timeSyncNtp', result: validators.timeSyncNtp(data) };
    // Check for mesh status and metrics (new in v0.7.2)
    if (data.mesh_status && typeof data.mesh_status === 'string')
        return { kind: 'meshStatus', result: validators.meshStatus(data) };
    if (data.mesh_network_id && data.metrics && typeof data.metrics.uptime_s === 'number')
        return { kind: 'meshMetrics', result: validators.meshMetrics(data) };
    // Unified device heuristics (v0.8.0+) - prioritize if device_role is present
    if (data.device_role && ['sensor', 'gateway', 'bridge', 'hybrid'].includes(data.device_type)) {
        if (data.metrics && typeof data.metrics.uptime_s === 'number')
            return { kind: 'deviceMetrics', result: validators.deviceMetrics(data) };
        if (data.capabilities || data.calibration_info || data.operational_info)
            return { kind: 'deviceInfo', result: validators.deviceInfo(data) };
        if (data.sensors)
            return { kind: 'deviceData', result: validators.deviceData(data) };
        if (data.status &&
            ['online', 'offline', 'starting', 'stopping', 'updating', 'maintenance', 'error', 'degraded'].includes(data.status))
            return { kind: 'deviceStatus', result: validators.deviceStatus(data) };
        if (data.status_summary || data.uptime_s !== undefined)
            return { kind: 'deviceHeartbeat', result: validators.deviceHeartbeat(data) };
    }
    // Sensor and gateway specific heuristics
    if (data.device_type === 'sensor') {
        if (data.metrics && typeof data.metrics.uptime_s === 'number')
            return { kind: 'sensorMetrics', result: validators.sensorMetrics(data) };
        if (data.capabilities || data.calibration_info || data.operational_info)
            return { kind: 'sensorInfo', result: validators.sensorInfo(data) };
        if (data.sensors)
            return { kind: 'sensorData', result: validators.sensorData(data) };
        if (data.status && ['online', 'offline', 'updating', 'error'].includes(data.status))
            return { kind: 'sensorStatus', result: validators.sensorStatus(data) };
    }
    if (data.device_type === 'gateway') {
        if (data.sensors)
            return { kind: 'gatewayData', result: validators.gatewayData(data) };
        if (data.metrics)
            return { kind: 'gatewayMetrics', result: validators.gatewayMetrics(data) };
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
            return { kind: 'gatewayStatus', result: validators.gatewayStatus(data) };
        if (data.status_summary)
            return { kind: 'gatewayHeartbeat', result: validators.gatewayHeartbeat(data) };
    }
    // Generic classification heuristics
    if (Array.isArray(data.nodes))
        return { kind: 'meshNodeList', result: validators.meshNodeList(data) };
    if (Array.isArray(data.connections))
        return { kind: 'meshTopology', result: validators.meshTopology(data) };
    if (Array.isArray(data.alerts))
        return { kind: 'meshAlert', result: validators.meshAlert(data) };
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
        return { kind: 'firmwareStatus', result: validators.firmwareStatus(data) };
    if (data.status && ['ok', 'error'].includes(data.status))
        return { kind: 'controlResponse', result: validators.controlResponse(data) };
    if (data.device_type === 'gateway')
        return { kind: 'gatewayInfo', result: validators.gatewayInfo(data) };
    // Fallback treat as heartbeat attempt
    return { kind: 'sensorHeartbeat', result: validators.sensorHeartbeat(data) };
}
