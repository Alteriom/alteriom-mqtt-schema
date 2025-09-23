/**
 * Auto-generated TypeScript types for Alteriom MQTT Schema v1
 * Source: docs/mqtt_schema/*.schema.json
 * Generation Date: 2025-09-20
 * NOTE: This file is maintained in firmware repo for UI alignment. Changes require coordinated review.
 */
export interface BaseEnvelope {
    schema_version: 1;
    device_id: string;
    device_type: 'sensor' | 'gateway';
    timestamp: string;
    firmware_version?: string;
    hardware_version?: string;
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
export type AnyMqttV1Message = SensorDataMessage | SensorHeartbeatMessage | SensorStatusMessage | GatewayInfoMessage | GatewayMetricsMessage | FirmwareStatusMessage | ControlResponseMessage;
export declare function isSensorDataMessage(msg: any): msg is SensorDataMessage;
export declare function isSensorHeartbeatMessage(msg: any): msg is SensorHeartbeatMessage;
export declare function isSensorStatusMessage(msg: any): msg is SensorStatusMessage;
export declare function isGatewayInfoMessage(msg: any): msg is GatewayInfoMessage;
export declare function isGatewayMetricsMessage(msg: any): msg is GatewayMetricsMessage;
export declare function isFirmwareStatusMessage(msg: any): msg is FirmwareStatusMessage;
export declare function isControlResponseMessage(msg: any): msg is ControlResponseMessage;
export declare function classifyMessage(msg: any): AnyMqttV1Message | null;
export interface BasicValidationIssue {
    field?: string;
    reason: string;
}
export declare function basicValidate(msg: AnyMqttV1Message): BasicValidationIssue[];
export declare function parseMessage(json: string): AnyMqttV1Message | null;
