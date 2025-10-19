/**
 * Auto-generated TypeScript types for Alteriom MQTT Schema v1
 * Source: docs/mqtt_schema/*.schema.json
 * Generation Date: 2025-10-19
 * NOTE: This file is maintained in firmware repo for UI alignment. Changes require coordinated review.
 */
export interface LocationInfo {
    latitude?: number;
    longitude?: number;
    altitude?: number;
    accuracy_m?: number;
    zone?: string;
    description?: string;
    [k: string]: unknown;
}
export interface EnvironmentInfo {
    deployment_type?: 'indoor' | 'outdoor' | 'mobile' | 'mixed';
    power_source?: 'battery' | 'mains' | 'solar' | 'mixed' | 'other';
    expected_battery_life_days?: number;
    [k: string]: unknown;
}
export interface BaseEnvelope {
    schema_version: 1;
    device_id: string;
    device_type: 'sensor' | 'gateway';
    timestamp: string;
    firmware_version?: string;
    hardware_version?: string;
    location?: LocationInfo;
    environment?: EnvironmentInfo;
    [k: string]: unknown;
}
export interface SensorEntry {
    value: number;
    unit?: string;
    raw_value?: number;
    calibrated_value?: number;
    quality_score?: number;
    name?: string;
    location?: string;
    additional_data?: Record<string, unknown>;
    timestamp?: string;
    accuracy?: number;
    last_calibration?: string;
    error_margin_pct?: number;
    operational_range?: {
        min: number;
        max: number;
    };
    [k: string]: unknown;
}
export interface SensorDataMessage extends BaseEnvelope {
    device_type: 'sensor';
    firmware_version: string;
    sensors: Record<string, SensorEntry>;
    battery_level?: number;
    signal_strength?: number;
    additional?: Record<string, unknown>;
}
export interface SensorHeartbeatMessage extends Omit<BaseEnvelope, 'firmware_version'> {
    device_type: 'sensor' | 'gateway';
    firmware_version?: string;
}
export interface SensorStatusMessage extends BaseEnvelope {
    device_type: 'sensor';
    firmware_version: string;
    status: 'online' | 'offline' | 'updating' | 'error';
    battery_level?: number;
    signal_strength?: number;
}
export interface GatewayInfoMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    mac_address?: string;
    ip_address?: string;
    capabilities?: {
        max_nodes?: number;
        supports_mesh?: boolean;
        firmware_update?: boolean;
        [k: string]: unknown;
    };
}
export interface GatewayMetricsMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    metrics: {
        uptime_s: number;
        cpu_usage_pct?: number;
        memory_usage_pct?: number;
        temperature_c?: number;
        connected_devices?: number;
        mesh_nodes?: number;
        packet_loss_pct?: number;
        data_throughput_kbps?: number;
        storage_usage_pct?: number;
        storage_total_mb?: number;
        storage_free_mb?: number;
        network_rx_kbps?: number;
        network_tx_kbps?: number;
        active_connections?: number;
        error_count_24h?: number;
        warning_count_24h?: number;
        restart_count?: number;
        last_restart_reason?: string;
        [k: string]: unknown;
    };
}
export interface FirmwareStatusMessage extends BaseEnvelope {
    status: 'pending' | 'downloading' | 'flashing' | 'verifying' | 'rebooting' | 'completed' | 'failed';
    event?: string;
    from_version?: string;
    to_version?: string;
    progress_pct?: number;
    error?: string | null;
}
export interface ControlResponseMessage extends BaseEnvelope {
    status: 'ok' | 'error';
    command?: string;
    message?: string;
    result?: unknown;
}
export interface CommandMessage extends BaseEnvelope {
    firmware_version: string;
    event: 'command';
    command: string;
    correlation_id?: string;
    parameters?: Record<string, unknown>;
    timeout_ms?: number;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
}
export interface CommandResponseMessage extends BaseEnvelope {
    firmware_version: string;
    event: 'command_response';
    command?: string;
    correlation_id?: string;
    success: boolean;
    result?: unknown;
    message?: string;
    error_code?: string;
    latency_ms?: number;
}
export interface MeshNodeListMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    nodes: Array<{
        node_id: string;
        status?: 'online' | 'offline' | 'unreachable';
        last_seen?: string;
        signal_strength?: number;
        [k: string]: unknown;
    }>;
    node_count?: number;
    mesh_id?: string;
}
export interface MeshTopologyMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    connections: Array<{
        from_node: string;
        to_node: string;
        link_quality?: number;
        latency_ms?: number;
        hop_count?: number;
        [k: string]: unknown;
    }>;
    root_node?: string;
    total_connections?: number;
}
export interface MeshAlertMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    alerts: Array<{
        alert_type: 'low_memory' | 'node_offline' | 'connection_lost' | 'high_latency' | 'packet_loss' | 'firmware_mismatch' | 'configuration_error' | 'security_warning' | 'other';
        severity: 'critical' | 'warning' | 'info';
        message: string;
        node_id?: string;
        metric_value?: number;
        threshold?: number;
        alert_id?: string;
        [k: string]: unknown;
    }>;
    alert_count?: number;
}
export type AnyMqttV1Message = SensorDataMessage | SensorHeartbeatMessage | SensorStatusMessage | GatewayInfoMessage | GatewayMetricsMessage | FirmwareStatusMessage | ControlResponseMessage | CommandMessage | CommandResponseMessage | MeshNodeListMessage | MeshTopologyMessage | MeshAlertMessage;
export declare function isSensorDataMessage(msg: any): msg is SensorDataMessage;
export declare function isSensorHeartbeatMessage(msg: any): msg is SensorHeartbeatMessage;
export declare function isSensorStatusMessage(msg: any): msg is SensorStatusMessage;
export declare function isGatewayInfoMessage(msg: any): msg is GatewayInfoMessage;
export declare function isGatewayMetricsMessage(msg: any): msg is GatewayMetricsMessage;
export declare function isFirmwareStatusMessage(msg: any): msg is FirmwareStatusMessage;
export declare function isControlResponseMessage(msg: any): msg is ControlResponseMessage;
export declare function isMeshNodeListMessage(msg: any): msg is MeshNodeListMessage;
export declare function isMeshTopologyMessage(msg: any): msg is MeshTopologyMessage;
export declare function isMeshAlertMessage(msg: any): msg is MeshAlertMessage;
export declare function isCommandMessage(msg: any): msg is CommandMessage;
export declare function isCommandResponseMessage(msg: any): msg is CommandResponseMessage;
export declare function classifyMessage(msg: any): AnyMqttV1Message | null;
export interface BasicValidationIssue {
    field?: string;
    reason: string;
}
export declare function basicValidate(msg: AnyMqttV1Message): BasicValidationIssue[];
export declare function parseMessage(json: string): AnyMqttV1Message | null;
