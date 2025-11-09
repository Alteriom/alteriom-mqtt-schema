/**
 * Auto-generated TypeScript types for Alteriom MQTT Schema v1
 * Source: docs/mqtt_schema/*.schema.json
 * Generation Date: 2025-11-08 (v0.8.0 BREAKING CHANGES)
 * NOTE: This file is maintained in firmware repo for UI alignment. Changes require coordinated review.
 */
export declare const MessageTypeCodes: {
    readonly DEVICE_DATA: 101;
    readonly DEVICE_HEARTBEAT: 102;
    readonly DEVICE_STATUS: 103;
    readonly DEVICE_INFO: 104;
    readonly DEVICE_METRICS: 105;
    readonly SENSOR_DATA: 200;
    readonly SENSOR_HEARTBEAT: 201;
    readonly SENSOR_STATUS: 202;
    readonly SENSOR_INFO: 203;
    readonly SENSOR_METRICS: 204;
    readonly GATEWAY_DATA: 302;
    readonly GATEWAY_HEARTBEAT: 303;
    readonly GATEWAY_STATUS: 304;
    readonly GATEWAY_INFO: 305;
    readonly GATEWAY_METRICS: 306;
    readonly COMMAND: 400;
    readonly COMMAND_RESPONSE: 401;
    readonly CONTROL_RESPONSE: 402;
    readonly FIRMWARE_STATUS: 500;
    readonly MESH_NODE_LIST: 600;
    readonly MESH_TOPOLOGY: 601;
    readonly MESH_ALERT: 602;
    readonly MESH_BRIDGE: 603;
    readonly MESH_STATUS: 604;
    readonly MESH_METRICS: 605;
    readonly BRIDGE_STATUS: 610;
    readonly BRIDGE_ELECTION: 611;
    readonly BRIDGE_TAKEOVER: 612;
    readonly BRIDGE_COORDINATION: 613;
    readonly TIME_SYNC_NTP: 614;
    readonly DEVICE_CONFIG: 700;
    readonly BATCH_ENVELOPE: 800;
    readonly COMPRESSED_ENVELOPE: 810;
};
export declare const LEGACY_CODE_MAP: {
    readonly 300: 305;
    readonly 301: 306;
};
export type MessageTypeCode = typeof MessageTypeCodes[keyof typeof MessageTypeCodes];
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
export interface TransportMetadata {
    protocol?: 'mqtt' | 'http' | 'https';
    correlation_id?: string;
    http?: {
        method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
        path?: string;
        status_code?: number;
        request_id?: string;
        headers?: Record<string, string>;
        [k: string]: unknown;
    };
    mqtt?: {
        topic?: string;
        qos?: 0 | 1 | 2;
        retained?: boolean;
        message_id?: number;
        [k: string]: unknown;
    };
    [k: string]: unknown;
}
export interface BaseEnvelope {
    schema_version: 1;
    message_type?: MessageTypeCode;
    device_id: string;
    device_type: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    timestamp: string;
    firmware_version?: string;
    hardware_version?: string;
    location?: LocationInfo;
    environment?: EnvironmentInfo;
    transport_metadata?: TransportMetadata;
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
export interface SensorInfoMessage extends BaseEnvelope {
    device_type: 'sensor';
    firmware_version: string;
    hardware_version?: string;
    mac_address?: string;
    chip_id?: string;
    manufacturer?: string;
    model?: string;
    capabilities?: {
        available_sensors?: string[];
        supports_mesh?: boolean;
        supports_ota?: boolean;
        power_source?: 'battery' | 'mains' | 'solar' | 'mixed' | 'other';
        battery_type?: string;
        sampling_rates?: {
            min_interval_ms?: number;
            max_interval_ms?: number;
            [k: string]: unknown;
        };
        communication_protocols?: string[];
        additional_features?: Record<string, unknown>;
        [k: string]: unknown;
    };
    calibration_info?: {
        last_calibration?: string;
        calibration_due?: string;
        factory_calibrated?: boolean;
        calibration_certificate?: string;
        [k: string]: unknown;
    };
    operational_info?: {
        operating_temp_range?: {
            min_celsius?: number;
            max_celsius?: number;
        };
        operating_humidity_range?: {
            min_percent?: number;
            max_percent?: number;
        };
        ip_rating?: string;
        warranty_expires?: string;
        [k: string]: unknown;
    };
}
export interface SensorMetricsMessage extends BaseEnvelope {
    device_type: 'sensor';
    firmware_version: string;
    metrics: {
        uptime_s: number;
        battery_level?: number;
        battery_voltage?: number;
        battery_current_ma?: number;
        battery_health?: 'good' | 'fair' | 'poor' | 'critical' | 'charging' | 'unknown';
        estimated_battery_life_h?: number;
        signal_strength?: number;
        signal_quality?: number;
        rssi?: number;
        snr?: number;
        link_quality?: number;
        cpu_usage_pct?: number;
        memory_usage_pct?: number;
        free_memory_bytes?: number;
        temperature_c?: number;
        sampling_rate_hz?: number;
        samples_collected?: number;
        error_count?: number;
        warning_count?: number;
        transmission_success_rate?: number;
        last_error?: string;
        last_error_timestamp?: string;
        reboot_count?: number;
        last_reboot_reason?: 'power_on' | 'watchdog' | 'software_reset' | 'firmware_update' | 'crash' | 'user_initiated' | 'low_battery' | 'unknown';
        [k: string]: unknown;
    };
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
export interface GatewayDataMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    sensors: Record<string, SensorEntry>;
    signal_strength?: number;
    additional?: Record<string, unknown>;
}
export interface GatewayHeartbeatMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version?: string;
    uptime_s?: number;
    connected_devices?: number;
    mesh_nodes?: number;
    status_summary?: 'healthy' | 'degraded' | 'critical' | 'maintenance';
}
export interface GatewayStatusMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    status: 'online' | 'offline' | 'starting' | 'stopping' | 'updating' | 'maintenance' | 'error' | 'degraded';
    previous_status?: 'online' | 'offline' | 'starting' | 'stopping' | 'updating' | 'maintenance' | 'error' | 'degraded';
    status_reason?: string;
    error_code?: string;
    uptime_s?: number;
    connected_devices?: number;
    signal_strength?: number;
    recovery_action?: 'none' | 'restart_pending' | 'restarting' | 'user_intervention_required' | 'automatic_recovery';
    estimated_recovery_time_s?: number;
}
export interface DeviceDataMessage extends BaseEnvelope {
    message_type?: 101;
    device_type: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    device_role?: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    firmware_version: string;
    sensors: Record<string, SensorEntry>;
    battery_level?: number;
    signal_strength?: number;
    additional?: Record<string, unknown>;
}
export interface DeviceHeartbeatMessage extends BaseEnvelope {
    message_type?: 102;
    device_type: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    device_role?: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    firmware_version?: string;
    uptime_s?: number;
    connected_devices?: number;
    mesh_nodes?: number;
    status_summary?: 'healthy' | 'degraded' | 'critical' | 'maintenance';
    battery_level?: number;
    signal_strength?: number;
}
export interface DeviceStatusMessage extends BaseEnvelope {
    message_type?: 103;
    device_type: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    device_role?: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    firmware_version: string;
    status: 'online' | 'offline' | 'starting' | 'stopping' | 'updating' | 'maintenance' | 'error' | 'degraded';
    previous_status?: 'online' | 'offline' | 'starting' | 'stopping' | 'updating' | 'maintenance' | 'error' | 'degraded';
    status_reason?: string;
    error_code?: string;
    uptime_s?: number;
    connected_devices?: number;
    battery_level?: number;
    signal_strength?: number;
    recovery_action?: 'none' | 'restart_pending' | 'restarting' | 'user_intervention_required' | 'automatic_recovery';
    estimated_recovery_time_s?: number;
}
export interface DeviceInfoMessage extends BaseEnvelope {
    message_type?: 104;
    device_type: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    device_role?: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    firmware_version: string;
    hardware_version?: string;
    mac_address?: string;
    ip_address?: string;
    chip_id?: string;
    manufacturer?: string;
    model?: string;
    capabilities?: {
        available_sensors?: string[];
        max_nodes?: number;
        supports_mesh?: boolean;
        supports_ota?: boolean;
        firmware_update?: boolean;
        power_source?: 'battery' | 'mains' | 'solar' | 'mixed' | 'other';
        battery_type?: string;
        sampling_rates?: {
            min_interval_ms?: number;
            max_interval_ms?: number;
            [k: string]: unknown;
        };
        communication_protocols?: string[];
        additional_features?: Record<string, unknown>;
        [k: string]: unknown;
    };
    calibration_info?: {
        last_calibration?: string;
        calibration_due?: string;
        factory_calibrated?: boolean;
        calibration_certificate?: string;
        [k: string]: unknown;
    };
    operational_info?: {
        operating_temp_range?: {
            min_celsius?: number;
            max_celsius?: number;
        };
        operating_humidity_range?: {
            min_percent?: number;
            max_percent?: number;
        };
        ip_rating?: string;
        warranty_expires?: string;
        [k: string]: unknown;
    };
}
export interface DeviceMetricsMessage extends BaseEnvelope {
    message_type?: 105;
    device_type: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    device_role?: 'sensor' | 'gateway' | 'bridge' | 'hybrid';
    firmware_version: string;
    metrics: {
        uptime_s: number;
        battery_level?: number;
        battery_voltage?: number;
        battery_current_ma?: number;
        battery_health?: 'good' | 'fair' | 'poor' | 'critical' | 'charging' | 'unknown';
        estimated_battery_life_h?: number;
        signal_strength?: number;
        signal_quality?: number;
        rssi?: number;
        snr?: number;
        link_quality?: number;
        cpu_usage_pct?: number;
        memory_usage_pct?: number;
        free_memory_bytes?: number;
        temperature_c?: number;
        connected_devices?: number;
        mesh_nodes?: number;
        sampling_rate_hz?: number;
        samples_collected?: number;
        packet_loss_pct?: number;
        data_throughput_kbps?: number;
        storage_usage_pct?: number;
        storage_total_mb?: number;
        storage_free_mb?: number;
        network_rx_kbps?: number;
        network_tx_kbps?: number;
        active_connections?: number;
        error_count?: number;
        warning_count?: number;
        error_count_24h?: number;
        warning_count_24h?: number;
        transmission_success_rate?: number;
        last_error?: string;
        last_error_timestamp?: string;
        reboot_count?: number;
        restart_count?: number;
        last_reboot_reason?: 'power_on' | 'watchdog' | 'software_reset' | 'firmware_update' | 'crash' | 'user_initiated' | 'low_battery' | 'power_loss' | 'manual' | 'update' | 'unknown';
        last_restart_reason?: string;
        [k: string]: unknown;
    };
}
export interface FirmwareStatusMessage extends BaseEnvelope {
    status: 'idle' | 'pending' | 'scheduled' | 'downloading' | 'download_paused' | 'flashing' | 'verifying' | 'rebooting' | 'completed' | 'failed' | 'cancelled' | 'rolled_back' | 'rollback_pending' | 'rollback_failed';
    event?: string;
    from_version?: string;
    to_version?: string;
    progress_pct?: number;
    error?: string | null;
    error_code?: string;
    retry_count?: number;
    max_retries?: number;
    download_speed_kbps?: number;
    bytes_downloaded?: number;
    bytes_total?: number;
    eta_seconds?: number;
    update_started_at?: string;
    update_completed_at?: string;
    scheduled_at?: string;
    deadline?: string;
    rollback_available?: boolean;
    previous_version?: string;
    update_type?: 'full' | 'delta' | 'patch' | 'configuration';
    update_channel?: 'stable' | 'beta' | 'dev' | 'custom';
    update_priority?: 'low' | 'normal' | 'high' | 'critical';
    signature_verified?: boolean;
    checksum_verified?: boolean;
    checksum_algorithm?: 'md5' | 'sha1' | 'sha256' | 'sha512';
    expected_checksum?: string;
    actual_checksum?: string;
    free_space_kb?: number;
    required_space_kb?: number;
    battery_level_pct?: number;
    min_battery_required_pct?: number;
    force_update?: boolean;
    allow_downgrade?: boolean;
    auto_reboot?: boolean;
    backup_config?: boolean;
    update_source?: string;
    update_manifest_url?: string;
    correlation_id?: string;
    phase?: 'preparation' | 'download' | 'validation' | 'installation' | 'verification' | 'finalization' | 'cleanup';
    cancellable?: boolean;
    pause_reason?: string;
    validation_errors?: string[];
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
export interface MeshBridgeMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    message_type?: 603;
    event: 'mesh_bridge';
    mesh_protocol: 'painlessMesh' | 'esp-now' | 'ble-mesh' | 'thread' | 'zigbee';
    mesh_message: {
        from_node_id: number | string;
        to_node_id: number | string;
        mesh_type?: number;
        mesh_type_name?: string;
        raw_payload?: string;
        payload_decoded?: Record<string, unknown>;
        rssi?: number;
        hop_count?: number;
        mesh_timestamp?: number;
        [k: string]: unknown;
    };
    gateway_node_id?: number | string;
    mesh_network_id?: string;
}
export interface DeviceConfigMessage extends BaseEnvelope {
    firmware_version: string;
    message_type?: 700;
    event: 'config_snapshot' | 'config_update' | 'config_request';
    configuration: {
        sampling_interval_ms?: number;
        reporting_interval_ms?: number;
        sensors_enabled?: string[];
        transmission_mode?: 'wifi' | 'mesh' | 'mixed' | 'cellular';
        power_mode?: 'normal' | 'low_power' | 'ultra_low_power' | 'always_on';
        sleep_duration_ms?: number;
        calibration_offsets?: Record<string, number>;
        alert_thresholds?: Record<string, {
            min?: number;
            max?: number;
            enabled?: boolean;
        }>;
        network_config?: {
            wifi_ssid?: string;
            wifi_password?: string;
            wifi_channel?: number;
            mesh_prefix?: string;
            mesh_password?: string;
            mesh_port?: number;
            mqtt_broker?: string;
            mqtt_port?: number;
            mqtt_topic_prefix?: string;
        };
        bridge_config?: {
            can_be_bridge?: boolean;
            router_ssid?: string;
            router_password?: string;
            router_channel?: number;
            bridge_priority?: number;
            bridge_role?: 'auto' | 'primary' | 'secondary' | 'backup' | 'disabled';
            failover_enabled?: boolean;
            election_timeout_s?: number;
            status_broadcast_interval_s?: number;
            bridge_selection_strategy?: 'priority_based' | 'round_robin' | 'best_signal' | 'load_balanced';
            multi_bridge_enabled?: boolean;
            max_bridges?: number;
            rssi_threshold_dbm?: number;
            prefer_mains_power?: boolean;
            ntp_sync_enabled?: boolean;
            ntp_server?: string;
            ntp_sync_interval_s?: number;
            time_broadcast_interval_s?: number;
            [k: string]: unknown;
        };
        ota_config?: {
            auto_update?: boolean;
            update_channel?: 'stable' | 'beta' | 'dev';
            update_check_interval_h?: number;
            allow_downgrade?: boolean;
        };
        log_level?: 'debug' | 'info' | 'warn' | 'error' | 'none';
        timezone?: string;
        ntp_server?: string;
        [k: string]: unknown;
    };
    config_version?: string;
    last_modified?: string;
    modified_by?: string;
    validation_errors?: Array<{
        field?: string;
        error?: string;
    }>;
}
export interface BridgeStatusMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    message_type?: 610;
    event: 'bridge_status';
    bridge_node_id: number | string;
    internet_connected: boolean;
    router_ssid?: string;
    router_rssi?: number;
    router_channel?: number;
    router_bssid?: string;
    gateway_ip?: string;
    local_ip?: string;
    subnet_mask?: string;
    dns_server?: string;
    uptime_s?: number;
    internet_uptime_s?: number;
    bridge_priority?: number;
    bridge_role?: 'primary' | 'secondary' | 'backup' | 'standby';
    connected_nodes?: number;
    queued_messages?: number;
    messages_relayed_24h?: number;
    total_disconnects?: number;
    last_disconnect_reason?: string;
    battery_level?: number;
    free_memory_bytes?: number;
    cpu_usage_pct?: number;
    temperature_c?: number;
    mesh_network_id?: string;
    failover_enabled?: boolean;
    backup_bridges?: (number | string)[];
    health_status?: 'healthy' | 'degraded' | 'critical' | 'failing';
    last_election_time?: string;
    election_wins?: number;
}
export interface BridgeElectionMessage extends BaseEnvelope {
    device_type: 'sensor' | 'gateway';
    firmware_version: string;
    message_type?: 611;
    event: 'bridge_election';
    candidate_node_id: number | string;
    router_ssid?: string;
    router_rssi: number;
    router_channel?: number;
    uptime_s?: number;
    free_memory_bytes?: number;
    battery_level?: number;
    power_source?: 'battery' | 'mains' | 'solar' | 'mixed' | 'other';
    bridge_priority?: number;
    previous_bridge_role?: boolean;
    can_become_bridge?: boolean;
    router_credentials_set?: boolean;
    election_round?: number;
    triggered_by?: 'bridge_offline' | 'bridge_internet_lost' | 'manual' | 'periodic_check' | 'split_brain';
    previous_bridge_node_id?: number | string;
    mesh_network_id?: string;
    cpu_usage_pct?: number;
    temperature_c?: number;
    election_timeout_s?: number;
}
export interface BridgeTakeoverMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    message_type?: 612;
    event: 'bridge_takeover';
    new_bridge_node_id: number | string;
    previous_bridge_node_id?: number | string;
    takeover_reason: 'election_winner' | 'primary_bridge_offline' | 'internet_connection_lost' | 'manual_promotion' | 'configuration_change' | 'failover_triggered' | 'split_brain_resolution' | 'scheduled_rotation';
    router_ssid?: string;
    router_rssi?: number;
    gateway_ip?: string;
    local_ip?: string;
    internet_connected?: boolean;
    bridge_priority?: number;
    bridge_role?: 'primary' | 'secondary' | 'backup' | 'standby';
    election_round?: number;
    election_participants?: number;
    election_duration_ms?: number;
    winning_rssi?: number;
    mesh_network_id?: string;
    connected_nodes?: number;
    queued_messages?: number;
    failover_enabled?: boolean;
    backup_bridges?: (number | string)[];
    transition_time_ms?: number;
    services_ready?: boolean;
    mqtt_connected?: boolean;
    ntp_synced?: boolean;
}
export interface BridgeCoordinationMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    message_type?: 613;
    event: 'bridge_coordination';
    bridge_node_id: number | string;
    bridge_role: 'primary' | 'secondary' | 'backup' | 'standby';
    bridge_priority?: number;
    internet_connected?: boolean;
    router_rssi?: number;
    peer_bridges?: Array<{
        node_id: number | string;
        role?: 'primary' | 'secondary' | 'backup' | 'standby';
        priority?: number;
        internet_connected?: boolean;
        last_seen?: string;
        rssi?: number;
        load_percentage?: number;
        [k: string]: unknown;
    }>;
    load_percentage?: number;
    connected_nodes?: number;
    messages_relayed_1h?: number;
    queued_messages?: number;
    average_latency_ms?: number;
    packet_loss_pct?: number;
    selection_strategy?: 'priority_based' | 'round_robin' | 'best_signal' | 'traffic_type' | 'load_balanced';
    traffic_routing?: {
        alarm_messages?: number | string;
        sensor_data?: number | string;
        control_commands?: number | string;
        firmware_updates?: number | string;
        [k: string]: unknown;
    };
    mesh_network_id?: string;
    coordination_enabled?: boolean;
    max_bridges?: number;
    failover_threshold_s?: number;
    health_status?: 'healthy' | 'degraded' | 'critical' | 'failing';
    conflict_resolution?: 'priority_wins' | 'rssi_wins' | 'newest_wins' | 'manual_override';
    last_role_change?: string;
    uptime_s?: number;
    cpu_usage_pct?: number;
    free_memory_bytes?: number;
}
export interface TimeSyncNtpMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    message_type?: 614;
    event: 'time_sync_ntp';
    bridge_node_id: number | string;
    ntp_time_unix: number;
    ntp_time_iso?: string;
    ntp_server?: string;
    accuracy_ms?: number;
    stratum?: number;
    last_sync_ago_s?: number;
    sync_interval_s?: number;
    timezone?: string;
    utc_offset_minutes?: number;
    daylight_saving?: boolean;
    mesh_network_id?: string;
    broadcast_interval_s?: number;
    sync_source?: 'ntp_server' | 'gps' | 'rtc_module' | 'cellular' | 'manual' | 'other';
    leap_indicator?: number;
    reference_id?: string;
    root_delay_ms?: number;
    root_dispersion_ms?: number;
    network_latency_ms?: number;
    confidence_level?: number;
    rtc_drift_ppm?: number;
    requires_rtc_update?: boolean;
    critical_timestamp?: boolean;
}
export interface MeshStatusMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    mesh_network_id?: string;
    mesh_status: 'healthy' | 'degraded' | 'partitioned' | 'forming' | 'failed' | 'maintenance';
    node_count?: number;
    online_nodes?: number;
    offline_nodes?: number;
    root_node?: string;
    network_stability?: number;
    topology_changes_24h?: number;
    partition_count?: number;
    average_hop_count?: number;
    max_hop_count?: number;
    network_diameter?: number;
    issues?: Array<{
        issue_type: 'partition' | 'high_latency' | 'packet_loss' | 'node_unreachable' | 'routing_loop' | 'congestion' | 'security' | 'other';
        severity: 'critical' | 'warning' | 'info';
        description: string;
        affected_nodes?: string[];
        detected_at?: string;
        [k: string]: unknown;
    }>;
    last_topology_change?: string;
    mesh_protocol?: 'painlessMesh' | 'esp-now' | 'ble-mesh' | 'thread' | 'zigbee';
    active_bridges?: Array<{
        bridge_node_id: number | string;
        bridge_role?: 'primary' | 'secondary' | 'backup' | 'standby';
        internet_connected?: boolean;
        router_rssi?: number;
        uptime_s?: number;
        connected_nodes?: number;
        priority?: number;
        health_status?: 'healthy' | 'degraded' | 'critical' | 'failing';
        last_seen?: string;
        [k: string]: unknown;
    }>;
    primary_bridge_node_id?: number | string;
    bridge_failover_enabled?: boolean;
    last_bridge_election?: string;
    bridge_election_count_24h?: number;
    bridge_coordination_enabled?: boolean;
    ntp_time_source?: number | string;
    time_sync_status?: 'synced' | 'unsynchronized' | 'degraded' | 'unavailable';
}
export interface MeshMetricsMessage extends BaseEnvelope {
    device_type: 'gateway';
    firmware_version: string;
    mesh_network_id?: string;
    metrics: {
        uptime_s: number;
        total_nodes?: number;
        active_nodes?: number;
        packets_sent?: number;
        packets_received?: number;
        packets_dropped?: number;
        packet_loss_pct?: number;
        average_latency_ms?: number;
        max_latency_ms?: number;
        min_latency_ms?: number;
        throughput_kbps?: number;
        bandwidth_utilization_pct?: number;
        routing_table_size?: number;
        route_updates_24h?: number;
        broadcast_messages?: number;
        unicast_messages?: number;
        multicast_messages?: number;
        retransmission_rate?: number;
        duplicate_packets?: number;
        out_of_order_packets?: number;
        error_count?: number;
        collision_count?: number;
        average_rssi?: number;
        weakest_link_rssi?: number;
        strongest_link_rssi?: number;
        node_join_count_24h?: number;
        node_leave_count_24h?: number;
        mesh_healing_events?: number;
        [k: string]: unknown;
    };
    top_talkers?: Array<{
        node_id: string;
        packets_sent?: number;
        packets_received?: number;
        bytes_sent?: number;
        bytes_received?: number;
        [k: string]: unknown;
    }>;
    problematic_links?: Array<{
        from_node: string;
        to_node: string;
        packet_loss_pct?: number;
        latency_ms?: number;
        rssi?: number;
        issue?: string;
        [k: string]: unknown;
    }>;
}
export type AnyMqttV1Message = DeviceDataMessage | DeviceHeartbeatMessage | DeviceStatusMessage | DeviceInfoMessage | DeviceMetricsMessage | SensorDataMessage | SensorHeartbeatMessage | SensorStatusMessage | SensorInfoMessage | SensorMetricsMessage | GatewayInfoMessage | GatewayMetricsMessage | GatewayDataMessage | GatewayHeartbeatMessage | GatewayStatusMessage | FirmwareStatusMessage | ControlResponseMessage | CommandMessage | CommandResponseMessage | MeshNodeListMessage | MeshTopologyMessage | MeshAlertMessage | MeshBridgeMessage | MeshStatusMessage | MeshMetricsMessage | BridgeStatusMessage | BridgeElectionMessage | BridgeTakeoverMessage | BridgeCoordinationMessage | TimeSyncNtpMessage | DeviceConfigMessage | BatchEnvelopeMessage | CompressedEnvelopeMessage;
export interface BatchEnvelopeMessage extends BaseEnvelope {
    message_type: 800;
    batch_id: string;
    batch_size: number;
    batch_index?: number;
    batch_timestamp?: string;
    compression?: 'none' | 'gzip' | 'zlib';
    messages: AnyMqttV1Message[];
    metadata?: {
        total_batches?: number;
        priority?: number;
        source?: string;
        [k: string]: unknown;
    };
}
export interface CompressedEnvelopeMessage extends BaseEnvelope {
    message_type: 810;
    encoding: 'gzip' | 'zlib' | 'brotli' | 'deflate';
    compressed_payload: string;
    original_size_bytes: number;
    compressed_size_bytes?: number;
    compression_ratio?: number;
    checksum?: string;
    metadata?: {
        original_message_type?: number;
        compression_level?: number;
        timestamp?: string;
        [k: string]: unknown;
    };
}
export declare function isDeviceDataMessage(msg: any): msg is DeviceDataMessage;
export declare function isDeviceHeartbeatMessage(msg: any): msg is DeviceHeartbeatMessage;
export declare function isDeviceStatusMessage(msg: any): msg is DeviceStatusMessage;
export declare function isDeviceInfoMessage(msg: any): msg is DeviceInfoMessage;
export declare function isDeviceMetricsMessage(msg: any): msg is DeviceMetricsMessage;
export declare function isSensorDataMessage(msg: any): msg is SensorDataMessage;
export declare function isSensorHeartbeatMessage(msg: any): msg is SensorHeartbeatMessage;
export declare function isSensorStatusMessage(msg: any): msg is SensorStatusMessage;
export declare function isSensorInfoMessage(msg: any): msg is SensorInfoMessage;
export declare function isSensorMetricsMessage(msg: any): msg is SensorMetricsMessage;
export declare function isGatewayInfoMessage(msg: any): msg is GatewayInfoMessage;
export declare function isGatewayMetricsMessage(msg: any): msg is GatewayMetricsMessage;
export declare function isGatewayDataMessage(msg: any): msg is GatewayDataMessage;
export declare function isGatewayHeartbeatMessage(msg: any): msg is GatewayHeartbeatMessage;
export declare function isGatewayStatusMessage(msg: any): msg is GatewayStatusMessage;
export declare function isFirmwareStatusMessage(msg: any): msg is FirmwareStatusMessage;
export declare function isControlResponseMessage(msg: any): msg is ControlResponseMessage;
export declare function isMeshNodeListMessage(msg: any): msg is MeshNodeListMessage;
export declare function isMeshTopologyMessage(msg: any): msg is MeshTopologyMessage;
export declare function isMeshAlertMessage(msg: any): msg is MeshAlertMessage;
export declare function isCommandMessage(msg: any): msg is CommandMessage;
export declare function isCommandResponseMessage(msg: any): msg is CommandResponseMessage;
export declare function isMeshBridgeMessage(msg: any): msg is MeshBridgeMessage;
export declare function isDeviceConfigMessage(msg: any): msg is DeviceConfigMessage;
export declare function isMeshStatusMessage(msg: any): msg is MeshStatusMessage;
export declare function isMeshMetricsMessage(msg: any): msg is MeshMetricsMessage;
export declare function isBridgeStatusMessage(msg: any): msg is BridgeStatusMessage;
export declare function isBridgeElectionMessage(msg: any): msg is BridgeElectionMessage;
export declare function isBridgeTakeoverMessage(msg: any): msg is BridgeTakeoverMessage;
export declare function isBridgeCoordinationMessage(msg: any): msg is BridgeCoordinationMessage;
export declare function isTimeSyncNtpMessage(msg: any): msg is TimeSyncNtpMessage;
export declare function classifyMessage(msg: any): AnyMqttV1Message | null;
export interface BasicValidationIssue {
    field?: string;
    reason: string;
}
export declare function basicValidate(msg: AnyMqttV1Message): BasicValidationIssue[];
export declare function isBatchEnvelopeMessage(msg: any): msg is BatchEnvelopeMessage;
export declare function isCompressedEnvelopeMessage(msg: any): msg is CompressedEnvelopeMessage;
export declare function parseMessage(json: string): AnyMqttV1Message | null;
