/**
 * Auto-generated TypeScript types for Alteriom MQTT Schema v1
 * Source: docs/mqtt_schema/*.schema.json
 * Generation Date: 2025-11-08 (v0.8.0 BREAKING CHANGES)
 * NOTE: This file is maintained in firmware repo for UI alignment. Changes require coordinated review.
 */
// ------------------------------------------------------------
// Message Type Codes (v0.8.0 BREAKING CHANGES)
// ------------------------------------------------------------
export const MessageTypeCodes = {
    // Unified Device Codes (v0.8.0+) - Recommended for new deployments
    DEVICE_DATA: 101, // v0.8.0 - Unified telemetry (replaces 200, 302)
    DEVICE_HEARTBEAT: 102, // v0.8.0 - Unified heartbeat (replaces 201, 303)
    DEVICE_STATUS: 103, // v0.8.0 - Unified status (replaces 202, 304)
    DEVICE_INFO: 104, // v0.8.0 - Unified info (replaces 203, 305)
    DEVICE_METRICS: 105, // v0.8.0 - Unified metrics (replaces 204, 306)
    // Sensor-Specific Codes (20x) - No breaking changes
    SENSOR_DATA: 200,
    SENSOR_HEARTBEAT: 201,
    SENSOR_STATUS: 202,
    SENSOR_INFO: 203, // v0.7.2
    SENSOR_METRICS: 204, // v0.7.2
    // Gateway-Specific Codes (30x) - BREAKING: 300→305, 301→306
    GATEWAY_DATA: 302, // v0.7.2 (no change)
    GATEWAY_HEARTBEAT: 303, // v0.7.2 (no change)
    GATEWAY_STATUS: 304, // v0.7.2 (no change)
    GATEWAY_INFO: 305, // v0.8.0 BREAKING - was 300
    GATEWAY_METRICS: 306, // v0.8.0 BREAKING - was 301
    // Command & Control
    COMMAND: 400,
    COMMAND_RESPONSE: 401,
    CONTROL_RESPONSE: 402, // deprecated
    // Firmware Updates
    FIRMWARE_STATUS: 500,
    // Mesh Network
    MESH_NODE_LIST: 600,
    MESH_TOPOLOGY: 601,
    MESH_ALERT: 602,
    MESH_BRIDGE: 603,
    MESH_STATUS: 604, // v0.7.2
    MESH_METRICS: 605, // v0.7.2
    // Bridge Management (painlessMesh v1.8.0)
    BRIDGE_STATUS: 610, // v0.8.0 - painlessMesh v1.8.0 unified firmware
    BRIDGE_ELECTION: 611, // v0.8.0 - RSSI-based failover election
    BRIDGE_TAKEOVER: 612, // v0.8.0 - Bridge role takeover
    BRIDGE_COORDINATION: 613, // v0.8.0 - Multi-bridge coordination
    TIME_SYNC_NTP: 614, // v0.8.0 - Bridge NTP time distribution
    // Configuration
    DEVICE_CONFIG: 700,
    // Batching & Compression
    BATCH_ENVELOPE: 800, // v0.7.3
    COMPRESSED_ENVELOPE: 810, // v0.7.3
};
// Legacy code mapping for backward compatibility (v0.8.0)
export const LEGACY_CODE_MAP = {
    300: 305, // gateway_info moved to 305
    301: 306, // gateway_metrics moved to 306
};
// Type Guards ------------------------------------------------
// Unified Device Type Guards (v0.8.0+)
export function isDeviceDataMessage(msg) {
    return msg && msg.schema_version === 1 && ['sensor', 'gateway', 'bridge', 'hybrid'].includes(msg.device_type) && typeof msg.sensors === 'object' && (msg.message_type === 101 || msg.device_role !== undefined);
}
export function isDeviceHeartbeatMessage(msg) {
    return msg && msg.schema_version === 1 && ['sensor', 'gateway', 'bridge', 'hybrid'].includes(msg.device_type) && msg.message_type === 102;
}
export function isDeviceStatusMessage(msg) {
    return msg && msg.schema_version === 1 && ['sensor', 'gateway', 'bridge', 'hybrid'].includes(msg.device_type) && msg.message_type === 103 && typeof msg.status === 'string';
}
export function isDeviceInfoMessage(msg) {
    return msg && msg.schema_version === 1 && ['sensor', 'gateway', 'bridge', 'hybrid'].includes(msg.device_type) && msg.message_type === 104 && !!msg.firmware_version;
}
export function isDeviceMetricsMessage(msg) {
    return msg && msg.schema_version === 1 && ['sensor', 'gateway', 'bridge', 'hybrid'].includes(msg.device_type) && msg.message_type === 105 && typeof msg.metrics === 'object' && typeof msg.metrics.uptime_s === 'number';
}
// Sensor Type Guards
export function isSensorDataMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && typeof msg.sensors === 'object';
}
export function isSensorHeartbeatMessage(msg) {
    return msg && msg.schema_version === 1 && !!msg.device_type && !!msg.timestamp && !('sensors' in msg) && !('metrics' in msg) && !('status' in msg || (msg.status && ['online', 'offline', 'updating', 'error'].includes(msg.status)));
}
export function isSensorStatusMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && typeof msg.status === 'string' && ['online', 'offline', 'updating', 'error'].includes(msg.status);
}
export function isSensorInfoMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && !!msg.firmware_version && (msg.message_type === 203 || (msg.capabilities || msg.calibration_info || msg.operational_info));
}
export function isSensorMetricsMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && typeof msg.metrics === 'object' && typeof msg.metrics.uptime_s === 'number';
}
export function isGatewayInfoMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && (!msg.metrics) && (!msg.status) && (!msg.progress_pct);
}
export function isGatewayMetricsMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.metrics === 'object' && msg.message_type !== 302;
}
export function isGatewayDataMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.sensors === 'object';
}
export function isGatewayHeartbeatMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && (msg.message_type === 303 || (msg.status_summary && !msg.status && !msg.metrics && !msg.sensors));
}
export function isGatewayStatusMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.status === 'string' && ['online', 'offline', 'starting', 'stopping', 'updating', 'maintenance', 'error', 'degraded'].includes(msg.status);
}
export function isFirmwareStatusMessage(msg) {
    return msg && msg.schema_version === 1 && typeof msg.status === 'string' && ['idle', 'pending', 'scheduled', 'downloading', 'download_paused', 'flashing', 'verifying', 'rebooting', 'completed', 'failed', 'cancelled', 'rolled_back', 'rollback_pending', 'rollback_failed'].includes(msg.status) && (msg.progress_pct === undefined || (typeof msg.progress_pct === 'number' && msg.progress_pct >= 0 && msg.progress_pct <= 100));
}
export function isControlResponseMessage(msg) {
    return msg && msg.schema_version === 1 && (msg.status === 'ok' || msg.status === 'error') && 'timestamp' in msg;
}
export function isMeshNodeListMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && Array.isArray(msg.nodes);
}
export function isMeshTopologyMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && Array.isArray(msg.connections);
}
export function isMeshAlertMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && Array.isArray(msg.alerts);
}
export function isCommandMessage(msg) {
    return msg && msg.schema_version === 1 && msg.event === 'command' && typeof msg.command === 'string';
}
export function isCommandResponseMessage(msg) {
    return msg && msg.schema_version === 1 && msg.event === 'command_response' && typeof msg.success === 'boolean';
}
export function isMeshBridgeMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && msg.event === 'mesh_bridge' && typeof msg.mesh_protocol === 'string' && typeof msg.mesh_message === 'object';
}
export function isDeviceConfigMessage(msg) {
    return msg && msg.schema_version === 1 && typeof msg.event === 'string' && ['config_snapshot', 'config_update', 'config_request'].includes(msg.event) && typeof msg.configuration === 'object';
}
export function isMeshStatusMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.mesh_status === 'string' && ['healthy', 'degraded', 'partitioned', 'forming', 'failed', 'maintenance'].includes(msg.mesh_status);
}
export function isMeshMetricsMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && msg.mesh_network_id && typeof msg.metrics === 'object' && typeof msg.metrics.uptime_s === 'number';
}
export function isBridgeStatusMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && msg.event === 'bridge_status' && typeof msg.bridge_node_id !== 'undefined' && typeof msg.internet_connected === 'boolean';
}
export function isBridgeElectionMessage(msg) {
    return msg && msg.schema_version === 1 && msg.event === 'bridge_election' && typeof msg.candidate_node_id !== 'undefined' && typeof msg.router_rssi === 'number';
}
export function isBridgeTakeoverMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && msg.event === 'bridge_takeover' && typeof msg.new_bridge_node_id !== 'undefined' && typeof msg.takeover_reason === 'string';
}
export function isBridgeCoordinationMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && msg.event === 'bridge_coordination' && typeof msg.bridge_node_id !== 'undefined' && typeof msg.bridge_role === 'string';
}
export function isTimeSyncNtpMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && msg.event === 'time_sync_ntp' && typeof msg.bridge_node_id !== 'undefined' && typeof msg.ntp_time_unix === 'number';
}
export function classifyMessage(msg) {
    // Fast path: use message_type if present (v0.7.2+)
    if (msg.message_type) {
        // Apply legacy code translation for v0.8.0 breaking changes
        const translatedType = LEGACY_CODE_MAP[msg.message_type] || msg.message_type;
        switch (translatedType) {
            // Unified device codes (v0.8.0+)
            case MessageTypeCodes.DEVICE_DATA: return isDeviceDataMessage(msg) ? msg : null;
            case MessageTypeCodes.DEVICE_HEARTBEAT: return isDeviceHeartbeatMessage(msg) ? msg : null;
            case MessageTypeCodes.DEVICE_STATUS: return isDeviceStatusMessage(msg) ? msg : null;
            case MessageTypeCodes.DEVICE_INFO: return isDeviceInfoMessage(msg) ? msg : null;
            case MessageTypeCodes.DEVICE_METRICS: return isDeviceMetricsMessage(msg) ? msg : null;
            // Sensor-specific codes
            case MessageTypeCodes.SENSOR_DATA: return isSensorDataMessage(msg) ? msg : null;
            case MessageTypeCodes.SENSOR_HEARTBEAT: return isSensorHeartbeatMessage(msg) ? msg : null;
            case MessageTypeCodes.SENSOR_STATUS: return isSensorStatusMessage(msg) ? msg : null;
            case MessageTypeCodes.SENSOR_INFO: return isSensorInfoMessage(msg) ? msg : null;
            case MessageTypeCodes.SENSOR_METRICS: return isSensorMetricsMessage(msg) ? msg : null;
            // Gateway-specific codes (with BREAKING changes)
            case MessageTypeCodes.GATEWAY_INFO: return isGatewayInfoMessage(msg) ? msg : null;
            case MessageTypeCodes.GATEWAY_METRICS: return isGatewayMetricsMessage(msg) ? msg : null;
            case MessageTypeCodes.GATEWAY_DATA: return isGatewayDataMessage(msg) ? msg : null;
            case MessageTypeCodes.GATEWAY_HEARTBEAT: return isGatewayHeartbeatMessage(msg) ? msg : null;
            case MessageTypeCodes.GATEWAY_STATUS: return isGatewayStatusMessage(msg) ? msg : null;
            // Command & Control
            case MessageTypeCodes.COMMAND: return isCommandMessage(msg) ? msg : null;
            case MessageTypeCodes.COMMAND_RESPONSE: return isCommandResponseMessage(msg) ? msg : null;
            case MessageTypeCodes.CONTROL_RESPONSE: return isControlResponseMessage(msg) ? msg : null;
            // Firmware & Mesh
            case MessageTypeCodes.FIRMWARE_STATUS: return isFirmwareStatusMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_NODE_LIST: return isMeshNodeListMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_TOPOLOGY: return isMeshTopologyMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_ALERT: return isMeshAlertMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_BRIDGE: return isMeshBridgeMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_STATUS: return isMeshStatusMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_METRICS: return isMeshMetricsMessage(msg) ? msg : null;
            // Bridge Management
            case MessageTypeCodes.BRIDGE_STATUS: return isBridgeStatusMessage(msg) ? msg : null;
            case MessageTypeCodes.BRIDGE_ELECTION: return isBridgeElectionMessage(msg) ? msg : null;
            case MessageTypeCodes.BRIDGE_TAKEOVER: return isBridgeTakeoverMessage(msg) ? msg : null;
            case MessageTypeCodes.BRIDGE_COORDINATION: return isBridgeCoordinationMessage(msg) ? msg : null;
            case MessageTypeCodes.TIME_SYNC_NTP: return isTimeSyncNtpMessage(msg) ? msg : null;
            // Configuration
            case MessageTypeCodes.DEVICE_CONFIG: return isDeviceConfigMessage(msg) ? msg : null;
            default: return null;
        }
    }
    // Fallback: use heuristic classification for backward compatibility
    // Priority: Unified device types → specific types → mesh/bridge → commands
    if (isDeviceDataMessage(msg))
        return msg;
    if (isDeviceMetricsMessage(msg))
        return msg;
    if (isDeviceInfoMessage(msg))
        return msg;
    if (isDeviceStatusMessage(msg))
        return msg;
    if (isDeviceHeartbeatMessage(msg))
        return msg;
    if (isSensorDataMessage(msg))
        return msg;
    if (isSensorMetricsMessage(msg))
        return msg;
    if (isSensorInfoMessage(msg))
        return msg;
    if (isGatewayDataMessage(msg))
        return msg;
    if (isGatewayMetricsMessage(msg))
        return msg;
    if (isGatewayStatusMessage(msg))
        return msg;
    if (isGatewayHeartbeatMessage(msg))
        return msg;
    if (isMeshBridgeMessage(msg))
        return msg;
    if (isMeshStatusMessage(msg))
        return msg;
    if (isMeshMetricsMessage(msg))
        return msg;
    if (isBridgeStatusMessage(msg))
        return msg;
    if (isBridgeElectionMessage(msg))
        return msg;
    if (isBridgeTakeoverMessage(msg))
        return msg;
    if (isBridgeCoordinationMessage(msg))
        return msg;
    if (isTimeSyncNtpMessage(msg))
        return msg;
    if (isDeviceConfigMessage(msg))
        return msg;
    if (isMeshNodeListMessage(msg))
        return msg;
    if (isMeshTopologyMessage(msg))
        return msg;
    if (isMeshAlertMessage(msg))
        return msg;
    if (isCommandMessage(msg))
        return msg;
    if (isCommandResponseMessage(msg))
        return msg;
    if (isSensorStatusMessage(msg))
        return msg;
    if (isGatewayInfoMessage(msg))
        return msg;
    if (isFirmwareStatusMessage(msg))
        return msg;
    if (isControlResponseMessage(msg))
        return msg;
    if (isSensorHeartbeatMessage(msg))
        return msg;
    return null;
}
export function basicValidate(msg) {
    const issues = [];
    if (msg.schema_version !== 1)
        issues.push({ reason: 'unsupported_schema' });
    if (!msg.device_id)
        issues.push({ field: 'device_id', reason: 'missing' });
    if (!msg.device_type)
        issues.push({ field: 'device_type', reason: 'missing' });
    if (!msg.timestamp)
        issues.push({ field: 'timestamp', reason: 'missing' });
    if ('firmware_version' in msg) {
        if (msg.firmware_version === '')
            issues.push({ field: 'firmware_version', reason: 'empty' });
    }
    else if (!isSensorHeartbeatMessage(msg)) {
        issues.push({ field: 'firmware_version', reason: 'missing' });
    }
    if (isSensorDataMessage(msg)) {
        if (!Object.keys(msg.sensors).length)
            issues.push({ field: 'sensors', reason: 'empty' });
        for (const [k, v] of Object.entries(msg.sensors)) {
            if (typeof v.value !== 'number')
                issues.push({ field: `sensors.${k}.value`, reason: 'invalid' });
            if (v.quality_score !== undefined && (v.quality_score < 0 || v.quality_score > 1))
                issues.push({ field: `sensors.${k}.quality_score`, reason: 'out_of_range' });
        }
    }
    if (isGatewayMetricsMessage(msg)) {
        if (typeof msg.metrics.uptime_s !== 'number')
            issues.push({ field: 'metrics.uptime_s', reason: 'missing' });
    }
    if (isFirmwareStatusMessage(msg)) {
        if (msg.progress_pct !== undefined && (msg.progress_pct < 0 || msg.progress_pct > 100))
            issues.push({ field: 'progress_pct', reason: 'out_of_range' });
    }
    return issues;
}
export function isBatchEnvelopeMessage(msg) {
    return msg && msg.schema_version === 1 && msg.message_type === 800 && typeof msg.batch_id === 'string' && Array.isArray(msg.messages);
}
export function isCompressedEnvelopeMessage(msg) {
    return msg && msg.schema_version === 1 && msg.message_type === 810 && typeof msg.encoding === 'string' && typeof msg.compressed_payload === 'string';
}
// Example parse wrapper
export function parseMessage(json) {
    try {
        const obj = JSON.parse(json);
        return classifyMessage(obj);
    }
    catch {
        return null;
    }
}
