/**
 * Auto-generated TypeScript types for Alteriom MQTT Schema v1
 * Source: docs/mqtt_schema/*.schema.json
 * Generation Date: 2025-10-23 (v0.7.1)
 * NOTE: This file is maintained in firmware repo for UI alignment. Changes require coordinated review.
 */
// ------------------------------------------------------------
// Message Type Codes (v0.7.1+)
// ------------------------------------------------------------
export const MessageTypeCodes = {
    SENSOR_DATA: 200,
    SENSOR_HEARTBEAT: 201,
    SENSOR_STATUS: 202,
    GATEWAY_INFO: 300,
    GATEWAY_METRICS: 301,
    COMMAND: 400,
    COMMAND_RESPONSE: 401,
    CONTROL_RESPONSE: 402, // deprecated
    FIRMWARE_STATUS: 500,
    MESH_NODE_LIST: 600,
    MESH_TOPOLOGY: 601,
    MESH_ALERT: 602,
    MESH_BRIDGE: 603,
    DEVICE_CONFIG: 700,
};
// Type Guards ------------------------------------------------
export function isSensorDataMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && typeof msg.sensors === 'object';
}
export function isSensorHeartbeatMessage(msg) {
    return msg && msg.schema_version === 1 && !!msg.device_type && !!msg.timestamp && !('sensors' in msg) && !('metrics' in msg) && !('status' in msg || (msg.status && ['online', 'offline', 'updating', 'error'].includes(msg.status)));
}
export function isSensorStatusMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'sensor' && typeof msg.status === 'string' && ['online', 'offline', 'updating', 'error'].includes(msg.status);
}
export function isGatewayInfoMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && (!msg.metrics) && (!msg.status) && (!msg.progress_pct);
}
export function isGatewayMetricsMessage(msg) {
    return msg && msg.schema_version === 1 && msg.device_type === 'gateway' && typeof msg.metrics === 'object';
}
export function isFirmwareStatusMessage(msg) {
    return msg && msg.schema_version === 1 && typeof msg.status === 'string' && ['pending', 'downloading', 'flashing', 'verifying', 'rebooting', 'completed', 'failed'].includes(msg.status) && (msg.progress_pct === undefined || (typeof msg.progress_pct === 'number' && msg.progress_pct >= 0 && msg.progress_pct <= 100));
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
export function classifyMessage(msg) {
    // Fast path: use message_type if present (v0.7.1+)
    if (msg.message_type) {
        switch (msg.message_type) {
            case MessageTypeCodes.SENSOR_DATA: return isSensorDataMessage(msg) ? msg : null;
            case MessageTypeCodes.SENSOR_HEARTBEAT: return isSensorHeartbeatMessage(msg) ? msg : null;
            case MessageTypeCodes.SENSOR_STATUS: return isSensorStatusMessage(msg) ? msg : null;
            case MessageTypeCodes.GATEWAY_INFO: return isGatewayInfoMessage(msg) ? msg : null;
            case MessageTypeCodes.GATEWAY_METRICS: return isGatewayMetricsMessage(msg) ? msg : null;
            case MessageTypeCodes.COMMAND: return isCommandMessage(msg) ? msg : null;
            case MessageTypeCodes.COMMAND_RESPONSE: return isCommandResponseMessage(msg) ? msg : null;
            case MessageTypeCodes.CONTROL_RESPONSE: return isControlResponseMessage(msg) ? msg : null;
            case MessageTypeCodes.FIRMWARE_STATUS: return isFirmwareStatusMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_NODE_LIST: return isMeshNodeListMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_TOPOLOGY: return isMeshTopologyMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_ALERT: return isMeshAlertMessage(msg) ? msg : null;
            case MessageTypeCodes.MESH_BRIDGE: return isMeshBridgeMessage(msg) ? msg : null;
            case MessageTypeCodes.DEVICE_CONFIG: return isDeviceConfigMessage(msg) ? msg : null;
            default: return null;
        }
    }
    // Fallback: use heuristic classification for backward compatibility
    if (isSensorDataMessage(msg))
        return msg;
    if (isGatewayMetricsMessage(msg))
        return msg;
    if (isMeshBridgeMessage(msg))
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
