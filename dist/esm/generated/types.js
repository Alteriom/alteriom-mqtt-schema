/**
 * Auto-generated TypeScript types for Alteriom MQTT Schema v1
 * Source: docs/mqtt_schema/*.schema.json
 * Generation Date: 2025-09-20
 * NOTE: This file is maintained in firmware repo for UI alignment. Changes require coordinated review.
 */
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
export function classifyMessage(msg) {
    if (isSensorDataMessage(msg))
        return msg;
    if (isGatewayMetricsMessage(msg))
        return msg;
    if (isMeshNodeListMessage(msg))
        return msg;
    if (isMeshTopologyMessage(msg))
        return msg;
    if (isMeshAlertMessage(msg))
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
