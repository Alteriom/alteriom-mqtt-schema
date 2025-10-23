export declare const envelope_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/envelope.schema.json";
    readonly title: "Alteriom MQTT Base Envelope v1";
    readonly type: "object";
    readonly required: readonly ["schema_version", "device_id", "device_type", "timestamp", "firmware_version"];
    readonly properties: {
        readonly schema_version: {
            readonly type: "integer";
            readonly const: 1;
        };
        readonly message_type: {
            readonly type: "integer";
            readonly description: "Optional message type code for fast classification (v0.7.2)";
            readonly enum: readonly [200, 201, 202, 203, 204, 300, 301, 302, 303, 304, 400, 401, 402, 500, 600, 601, 602, 603, 604, 605, 700];
        };
        readonly device_id: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 64;
            readonly pattern: "^[A-Za-z0-9_-]+$";
        };
        readonly device_type: {
            readonly type: "string";
            readonly enum: readonly ["sensor", "gateway"];
        };
        readonly timestamp: {
            readonly type: "string";
            readonly format: "date-time";
        };
        readonly firmware_version: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 40;
        };
        readonly hardware_version: {
            readonly type: "string";
            readonly maxLength: 80;
        };
        readonly location: {
            readonly type: "object";
            readonly description: "Standardized location information for geospatial tracking";
            readonly properties: {
                readonly latitude: {
                    readonly type: "number";
                    readonly minimum: -90;
                    readonly maximum: 90;
                };
                readonly longitude: {
                    readonly type: "number";
                    readonly minimum: -180;
                    readonly maximum: 180;
                };
                readonly altitude: {
                    readonly type: "number";
                    readonly description: "Altitude in meters";
                };
                readonly accuracy_m: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly description: "Position accuracy in meters";
                };
                readonly zone: {
                    readonly type: "string";
                    readonly maxLength: 64;
                    readonly description: "Logical zone identifier (e.g., warehouse_A, floor_2)";
                };
                readonly description: {
                    readonly type: "string";
                    readonly maxLength: 256;
                    readonly description: "Human-readable location description";
                };
            };
            readonly additionalProperties: true;
        };
        readonly environment: {
            readonly type: "object";
            readonly description: "Environmental and deployment context metadata";
            readonly properties: {
                readonly deployment_type: {
                    readonly type: "string";
                    readonly enum: readonly ["indoor", "outdoor", "mobile", "mixed"];
                    readonly description: "Type of deployment environment";
                };
                readonly power_source: {
                    readonly type: "string";
                    readonly enum: readonly ["battery", "mains", "solar", "mixed", "other"];
                    readonly description: "Primary power source";
                };
                readonly expected_battery_life_days: {
                    readonly type: "integer";
                    readonly minimum: 0;
                    readonly description: "Expected battery life in days (if battery-powered)";
                };
            };
            readonly additionalProperties: true;
        };
    };
    readonly additionalProperties: true;
};
export declare const sensor_data_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/sensor_data.schema.json";
    readonly title: "Sensor Data Message v1";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["sensors"];
    readonly properties: {
        readonly sensors: {
            readonly type: "object";
            readonly minProperties: 1;
            readonly additionalProperties: {
                readonly type: "object";
                readonly required: readonly ["value"];
                readonly properties: {
                    readonly value: {
                        readonly type: readonly ["number", "integer"];
                    };
                    readonly unit: {
                        readonly type: "string";
                    };
                    readonly raw_value: {
                        readonly type: readonly ["number", "integer"];
                    };
                    readonly calibrated_value: {
                        readonly type: readonly ["number", "integer"];
                    };
                    readonly quality_score: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 1;
                    };
                    readonly name: {
                        readonly type: "string";
                    };
                    readonly location: {
                        readonly type: "string";
                    };
                    readonly additional_data: {
                        readonly type: "object";
                    };
                    readonly timestamp: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly description: "Per-sensor reading timestamp (useful for async multi-sensor polling)";
                    };
                    readonly accuracy: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Sensor accuracy (±value in sensor units)";
                    };
                    readonly last_calibration: {
                        readonly type: "string";
                        readonly format: "date";
                        readonly description: "Last calibration date (ISO 8601 date)";
                    };
                    readonly error_margin_pct: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 100;
                        readonly description: "Error margin as percentage";
                    };
                    readonly operational_range: {
                        readonly type: "object";
                        readonly description: "Valid operational range for this sensor";
                        readonly required: readonly ["min", "max"];
                        readonly properties: {
                            readonly min: {
                                readonly type: "number";
                            };
                            readonly max: {
                                readonly type: "number";
                            };
                        };
                        readonly additionalProperties: false;
                    };
                };
                readonly additionalProperties: false;
            };
        };
        readonly battery_level: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly maximum: 100;
        };
        readonly signal_strength: {
            readonly type: "integer";
            readonly minimum: -200;
            readonly maximum: 0;
        };
        readonly additional: {
            readonly type: "object";
        };
    };
    readonly additionalProperties: true;
};
export declare const sensor_heartbeat_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/sensor_heartbeat.schema.json";
    readonly title: "Sensor Heartbeat v1";
    readonly type: "object";
    readonly required: readonly ["schema_version", "device_id", "device_type", "timestamp"];
    readonly properties: {
        readonly schema_version: {
            readonly type: "integer";
            readonly const: 1;
        };
        readonly device_id: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 64;
            readonly pattern: "^[A-Za-z0-9_-]+$";
        };
        readonly device_type: {
            readonly type: "string";
            readonly enum: readonly ["sensor", "gateway"];
        };
        readonly timestamp: {
            readonly type: "string";
            readonly format: "date-time";
        };
    };
    readonly additionalProperties: true;
};
export declare const sensor_status_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/sensor_status.schema.json";
    readonly title: "Sensor Status v1";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["status"];
    readonly properties: {
        readonly status: {
            readonly type: "string";
            readonly enum: readonly ["online", "offline", "updating", "error"];
        };
        readonly battery_level: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly maximum: 100;
        };
        readonly signal_strength: {
            readonly type: "integer";
            readonly minimum: -200;
            readonly maximum: 0;
        };
    };
    readonly additionalProperties: true;
};
export declare const sensor_info_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "sensor_info.schema.json";
    readonly title: "Sensor Info Message";
    readonly description: "Sensor identification and capabilities message (v0.7.2+). Provides detailed information about sensor hardware, capabilities, and configuration.";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }, {
        readonly type: "object";
        readonly properties: {
            readonly device_type: {
                readonly const: "sensor";
                readonly description: "Must be 'sensor' for sensor info messages";
            };
            readonly firmware_version: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Required firmware version for sensor info";
            };
            readonly hardware_version: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Hardware version identifier";
            };
            readonly mac_address: {
                readonly type: "string";
                readonly pattern: "^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$";
                readonly description: "MAC address in format 00:11:22:33:44:55";
            };
            readonly chip_id: {
                readonly type: "string";
                readonly description: "Unique chip/device identifier";
            };
            readonly manufacturer: {
                readonly type: "string";
                readonly description: "Sensor manufacturer name";
            };
            readonly model: {
                readonly type: "string";
                readonly description: "Sensor model identifier";
            };
            readonly capabilities: {
                readonly type: "object";
                readonly description: "Sensor capabilities and features";
                readonly properties: {
                    readonly available_sensors: {
                        readonly type: "array";
                        readonly description: "List of available sensor types";
                        readonly items: {
                            readonly type: "string";
                            readonly examples: readonly ["temperature", "humidity", "pressure", "light", "motion", "co2", "voc", "pm25"];
                        };
                    };
                    readonly supports_mesh: {
                        readonly type: "boolean";
                        readonly description: "Whether sensor can participate in mesh network";
                    };
                    readonly supports_ota: {
                        readonly type: "boolean";
                        readonly description: "Whether sensor supports firmware updates";
                    };
                    readonly power_source: {
                        readonly type: "string";
                        readonly enum: readonly ["battery", "mains", "solar", "mixed", "other"];
                        readonly description: "Primary power source type";
                    };
                    readonly battery_type: {
                        readonly type: "string";
                        readonly description: "Battery type if battery-powered (e.g., 'CR2032', 'LiPo 3.7V')";
                    };
                    readonly sampling_rates: {
                        readonly type: "object";
                        readonly description: "Min/max sampling intervals supported";
                        readonly properties: {
                            readonly min_interval_ms: {
                                readonly type: "number";
                                readonly minimum: 0;
                            };
                            readonly max_interval_ms: {
                                readonly type: "number";
                                readonly minimum: 0;
                            };
                        };
                        readonly additionalProperties: true;
                    };
                    readonly communication_protocols: {
                        readonly type: "array";
                        readonly description: "Supported communication protocols";
                        readonly items: {
                            readonly type: "string";
                            readonly examples: readonly ["wifi", "ble", "zigbee", "lora", "mesh"];
                        };
                    };
                    readonly additional_features: {
                        readonly type: "object";
                        readonly description: "Additional sensor-specific features";
                        readonly additionalProperties: true;
                    };
                };
                readonly additionalProperties: true;
            };
            readonly calibration_info: {
                readonly type: "object";
                readonly description: "Sensor calibration information";
                readonly properties: {
                    readonly last_calibration: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly description: "Last calibration timestamp (ISO 8601)";
                    };
                    readonly calibration_due: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly description: "Next calibration due date (ISO 8601)";
                    };
                    readonly factory_calibrated: {
                        readonly type: "boolean";
                        readonly description: "Whether sensor is factory calibrated";
                    };
                    readonly calibration_certificate: {
                        readonly type: "string";
                        readonly description: "Calibration certificate reference/URL";
                    };
                };
                readonly additionalProperties: true;
            };
            readonly operational_info: {
                readonly type: "object";
                readonly description: "Operational parameters and limits";
                readonly properties: {
                    readonly operating_temp_range: {
                        readonly type: "object";
                        readonly properties: {
                            readonly min_celsius: {
                                readonly type: "number";
                            };
                            readonly max_celsius: {
                                readonly type: "number";
                            };
                        };
                    };
                    readonly operating_humidity_range: {
                        readonly type: "object";
                        readonly properties: {
                            readonly min_percent: {
                                readonly type: "number";
                                readonly minimum: 0;
                                readonly maximum: 100;
                            };
                            readonly max_percent: {
                                readonly type: "number";
                                readonly minimum: 0;
                                readonly maximum: 100;
                            };
                        };
                    };
                    readonly ip_rating: {
                        readonly type: "string";
                        readonly pattern: "^IP[0-9]{2}$";
                        readonly description: "IP rating (e.g., 'IP65')";
                    };
                    readonly warranty_expires: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly description: "Warranty expiration date (ISO 8601)";
                    };
                };
                readonly additionalProperties: true;
            };
        };
        readonly required: readonly ["device_type", "firmware_version"];
        readonly additionalProperties: true;
    }];
};
export declare const sensor_metrics_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "sensor_metrics.schema.json";
    readonly title: "Sensor Metrics Message";
    readonly description: "Sensor health and performance metrics message (v0.7.2+). Reports sensor operational health, battery, signal, uptime, and diagnostic metrics.";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }, {
        readonly type: "object";
        readonly properties: {
            readonly device_type: {
                readonly const: "sensor";
                readonly description: "Must be 'sensor' for sensor metrics messages";
            };
            readonly firmware_version: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Required firmware version for sensor metrics";
            };
            readonly metrics: {
                readonly type: "object";
                readonly description: "Sensor health and performance metrics";
                readonly properties: {
                    readonly uptime_s: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Sensor uptime in seconds since last boot";
                    };
                    readonly battery_level: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly maximum: 100;
                        readonly description: "Battery level percentage (0-100)";
                    };
                    readonly battery_voltage: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Battery voltage in volts";
                    };
                    readonly battery_current_ma: {
                        readonly type: "number";
                        readonly description: "Battery current draw in milliamps";
                    };
                    readonly battery_health: {
                        readonly type: "string";
                        readonly enum: readonly ["good", "fair", "poor", "critical", "charging", "unknown"];
                        readonly description: "Battery health status";
                    };
                    readonly estimated_battery_life_h: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Estimated remaining battery life in hours";
                    };
                    readonly signal_strength: {
                        readonly type: "number";
                        readonly minimum: -200;
                        readonly maximum: 0;
                        readonly description: "Signal strength in dBm (-200 to 0)";
                    };
                    readonly signal_quality: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 100;
                        readonly description: "Signal quality percentage (0-100)";
                    };
                    readonly rssi: {
                        readonly type: "number";
                        readonly minimum: -200;
                        readonly maximum: 0;
                        readonly description: "RSSI (Received Signal Strength Indicator) in dBm";
                    };
                    readonly snr: {
                        readonly type: "number";
                        readonly description: "Signal-to-Noise Ratio in dB";
                    };
                    readonly link_quality: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 255;
                        readonly description: "Link Quality Indicator (LQI) for mesh/zigbee networks";
                    };
                    readonly cpu_usage_pct: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 100;
                        readonly description: "CPU usage percentage";
                    };
                    readonly memory_usage_pct: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 100;
                        readonly description: "Memory usage percentage";
                    };
                    readonly free_memory_bytes: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Free memory in bytes";
                    };
                    readonly temperature_c: {
                        readonly type: "number";
                        readonly description: "Internal/board temperature in Celsius";
                    };
                    readonly sampling_rate_hz: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Current sampling rate in Hz";
                    };
                    readonly samples_collected: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total samples collected since boot";
                    };
                    readonly error_count: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total error count since boot";
                    };
                    readonly warning_count: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total warning count since boot";
                    };
                    readonly transmission_success_rate: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 100;
                        readonly description: "Message transmission success rate percentage";
                    };
                    readonly last_error: {
                        readonly type: "string";
                        readonly maxLength: 256;
                        readonly description: "Last error message";
                    };
                    readonly last_error_timestamp: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly description: "Timestamp of last error (ISO 8601)";
                    };
                    readonly reboot_count: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Number of reboots since deployment";
                    };
                    readonly last_reboot_reason: {
                        readonly type: "string";
                        readonly enum: readonly ["power_on", "watchdog", "software_reset", "firmware_update", "crash", "user_initiated", "low_battery", "unknown"];
                        readonly description: "Reason for last reboot";
                    };
                };
                readonly required: readonly ["uptime_s"];
                readonly additionalProperties: true;
            };
        };
        readonly required: readonly ["device_type", "firmware_version", "metrics"];
        readonly additionalProperties: true;
    }];
};
export declare const gateway_info_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/gateway_info.schema.json";
    readonly title: "Gateway Info v1";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly properties: {
        readonly mac_address: {
            readonly type: "string";
            readonly pattern: "^[0-9A-Fa-f:]{17}$";
        };
        readonly ip_address: {
            readonly type: "string";
            readonly format: "ipv4";
        };
        readonly capabilities: {
            readonly type: "object";
            readonly properties: {
                readonly max_nodes: {
                    readonly type: "integer";
                    readonly minimum: 0;
                };
                readonly supports_mesh: {
                    readonly type: "boolean";
                };
                readonly firmware_update: {
                    readonly type: "boolean";
                };
            };
            readonly additionalProperties: true;
        };
    };
    readonly additionalProperties: true;
};
export declare const gateway_metrics_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/gateway_metrics.schema.json";
    readonly title: "Gateway Metrics v1";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["metrics"];
    readonly properties: {
        readonly metrics: {
            readonly type: "object";
            readonly required: readonly ["uptime_s"];
            readonly properties: {
                readonly uptime_s: {
                    readonly type: "integer";
                    readonly minimum: 0;
                };
                readonly cpu_usage_pct: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly maximum: 100;
                };
                readonly memory_usage_pct: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly maximum: 100;
                };
                readonly temperature_c: {
                    readonly type: "number";
                };
                readonly connected_devices: {
                    readonly type: "integer";
                    readonly minimum: 0;
                };
                readonly mesh_nodes: {
                    readonly type: "integer";
                    readonly minimum: 0;
                };
                readonly packet_loss_pct: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly maximum: 100;
                };
                readonly data_throughput_kbps: {
                    readonly type: "number";
                    readonly minimum: 0;
                };
                readonly storage_usage_pct: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly maximum: 100;
                    readonly description: "Disk/flash storage usage percentage";
                };
                readonly storage_total_mb: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly description: "Total storage capacity in megabytes";
                };
                readonly storage_free_mb: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly description: "Free storage space in megabytes";
                };
                readonly network_rx_kbps: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly description: "Network receive bandwidth in kilobits per second";
                };
                readonly network_tx_kbps: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly description: "Network transmit bandwidth in kilobits per second";
                };
                readonly active_connections: {
                    readonly type: "integer";
                    readonly minimum: 0;
                    readonly description: "Number of active network connections";
                };
                readonly error_count_24h: {
                    readonly type: "integer";
                    readonly minimum: 0;
                    readonly description: "Error count in last 24 hours";
                };
                readonly warning_count_24h: {
                    readonly type: "integer";
                    readonly minimum: 0;
                    readonly description: "Warning count in last 24 hours";
                };
                readonly restart_count: {
                    readonly type: "integer";
                    readonly minimum: 0;
                    readonly description: "Total restart counter since deployment";
                };
                readonly last_restart_reason: {
                    readonly type: "string";
                    readonly maxLength: 128;
                    readonly description: "Reason for last restart (e.g., watchdog, power_loss, update, manual)";
                };
            };
            readonly additionalProperties: true;
        };
    };
    readonly additionalProperties: true;
};
export declare const gateway_data_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "gateway_data.schema.json";
    readonly title: "Gateway Data Message";
    readonly description: "Gateway telemetry data message (v0.7.2+). Similar to sensor_data but for gateway-originated sensor readings (environmental sensors on gateway device).";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }, {
        readonly type: "object";
        readonly properties: {
            readonly device_type: {
                readonly const: "gateway";
                readonly description: "Must be 'gateway' for gateway data messages";
            };
            readonly firmware_version: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Required firmware version for gateway data";
            };
            readonly sensors: {
                readonly type: "object";
                readonly description: "Sensor readings from gateway's onboard sensors";
                readonly patternProperties: {
                    readonly "^[a-z0-9_]+$": {
                        readonly type: "object";
                        readonly properties: {
                            readonly value: {
                                readonly type: "number";
                                readonly description: "Sensor reading value (required)";
                            };
                            readonly unit: {
                                readonly type: "string";
                                readonly description: "Unit of measurement (e.g., 'celsius', 'percent', 'ppm')";
                            };
                            readonly raw_value: {
                                readonly type: "number";
                                readonly description: "Raw ADC or uncalibrated value";
                            };
                            readonly calibrated_value: {
                                readonly type: "number";
                                readonly description: "Calibrated sensor value";
                            };
                            readonly quality_score: {
                                readonly type: "number";
                                readonly minimum: 0;
                                readonly maximum: 1;
                                readonly description: "Data quality score (0-1, 1 = best)";
                            };
                            readonly name: {
                                readonly type: "string";
                                readonly description: "Human-readable sensor name";
                            };
                            readonly location: {
                                readonly type: "string";
                                readonly description: "Physical location of sensor on gateway";
                            };
                            readonly timestamp: {
                                readonly type: "string";
                                readonly format: "date-time";
                                readonly description: "Per-sensor reading timestamp (ISO 8601)";
                            };
                            readonly accuracy: {
                                readonly type: "number";
                                readonly description: "Sensor accuracy (±value in units)";
                            };
                            readonly last_calibration: {
                                readonly type: "string";
                                readonly format: "date-time";
                                readonly description: "Last calibration date (ISO 8601)";
                            };
                            readonly error_margin_pct: {
                                readonly type: "number";
                                readonly minimum: 0;
                                readonly maximum: 100;
                                readonly description: "Error margin percentage (0-100)";
                            };
                            readonly operational_range: {
                                readonly type: "object";
                                readonly properties: {
                                    readonly min: {
                                        readonly type: "number";
                                    };
                                    readonly max: {
                                        readonly type: "number";
                                    };
                                };
                                readonly description: "Operational range limits";
                            };
                            readonly additional_data: {
                                readonly type: "object";
                                readonly description: "Additional sensor-specific metadata";
                                readonly additionalProperties: true;
                            };
                        };
                        readonly required: readonly ["value"];
                        readonly additionalProperties: true;
                    };
                };
                readonly minProperties: 1;
                readonly additionalProperties: false;
            };
            readonly signal_strength: {
                readonly type: "number";
                readonly minimum: -200;
                readonly maximum: 0;
                readonly description: "WiFi/network signal strength in dBm";
            };
            readonly additional: {
                readonly type: "object";
                readonly description: "Additional gateway-specific data";
                readonly additionalProperties: true;
            };
        };
        readonly required: readonly ["device_type", "firmware_version", "sensors"];
        readonly additionalProperties: true;
    }];
};
export declare const gateway_heartbeat_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "gateway_heartbeat.schema.json";
    readonly title: "Gateway Heartbeat Message";
    readonly description: "Gateway presence and health check message (v0.7.2+). Minimal message to indicate gateway is alive and responsive.";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }, {
        readonly type: "object";
        readonly properties: {
            readonly device_type: {
                readonly const: "gateway";
                readonly description: "Must be 'gateway' for gateway heartbeat messages";
            };
            readonly firmware_version: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Firmware version (optional, can be omitted if unchanged since last message)";
            };
            readonly uptime_s: {
                readonly type: "number";
                readonly minimum: 0;
                readonly description: "Gateway uptime in seconds since last boot";
            };
            readonly connected_devices: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly description: "Number of connected devices";
            };
            readonly mesh_nodes: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly description: "Number of mesh nodes in network";
            };
            readonly status_summary: {
                readonly type: "string";
                readonly enum: readonly ["healthy", "degraded", "critical", "maintenance"];
                readonly description: "Overall gateway health status";
            };
        };
        readonly required: readonly ["device_type"];
        readonly additionalProperties: true;
    }];
};
export declare const gateway_status_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "gateway_status.schema.json";
    readonly title: "Gateway Status Message";
    readonly description: "Gateway status change notification (v0.7.2+). Reports gateway operational state changes.";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }, {
        readonly type: "object";
        readonly properties: {
            readonly device_type: {
                readonly const: "gateway";
                readonly description: "Must be 'gateway' for gateway status messages";
            };
            readonly firmware_version: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Required firmware version for gateway status";
            };
            readonly status: {
                readonly type: "string";
                readonly enum: readonly ["online", "offline", "starting", "stopping", "updating", "maintenance", "error", "degraded"];
                readonly description: "Current gateway operational status";
            };
            readonly previous_status: {
                readonly type: "string";
                readonly enum: readonly ["online", "offline", "starting", "stopping", "updating", "maintenance", "error", "degraded"];
                readonly description: "Previous status before this change";
            };
            readonly status_reason: {
                readonly type: "string";
                readonly maxLength: 256;
                readonly description: "Human-readable reason for status change";
            };
            readonly error_code: {
                readonly type: "string";
                readonly maxLength: 64;
                readonly description: "Machine-readable error code if status is 'error'";
            };
            readonly uptime_s: {
                readonly type: "number";
                readonly minimum: 0;
                readonly description: "Gateway uptime in seconds";
            };
            readonly connected_devices: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly description: "Number of connected devices";
            };
            readonly signal_strength: {
                readonly type: "number";
                readonly minimum: -200;
                readonly maximum: 0;
                readonly description: "Network signal strength in dBm";
            };
            readonly recovery_action: {
                readonly type: "string";
                readonly enum: readonly ["none", "restart_pending", "restarting", "user_intervention_required", "automatic_recovery"];
                readonly description: "Planned or ongoing recovery action";
            };
            readonly estimated_recovery_time_s: {
                readonly type: "number";
                readonly minimum: 0;
                readonly description: "Estimated time to recovery in seconds";
            };
        };
        readonly required: readonly ["device_type", "firmware_version", "status"];
        readonly additionalProperties: true;
    }];
};
export declare const firmware_status_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/firmware_status.schema.json";
    readonly title: "Firmware Update Status v1 (Enhanced v0.7.2)";
    readonly description: "Enhanced OTA firmware update status with command support, scheduling, and improved validation";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["status"];
    readonly properties: {
        readonly event: {
            readonly type: "string";
            readonly description: "Event type (e.g., 'ota_command', 'ota_status', 'ota_schedule')";
        };
        readonly from_version: {
            readonly type: "string";
            readonly description: "Current firmware version before update";
        };
        readonly to_version: {
            readonly type: "string";
            readonly description: "Target firmware version after update";
        };
        readonly status: {
            readonly type: "string";
            readonly enum: readonly ["idle", "pending", "scheduled", "downloading", "download_paused", "flashing", "verifying", "rebooting", "completed", "failed", "cancelled", "rolled_back", "rollback_pending", "rollback_failed"];
            readonly description: "Current OTA update status";
        };
        readonly progress_pct: {
            readonly type: "number";
            readonly minimum: 0;
            readonly maximum: 100;
            readonly description: "Update progress percentage (0-100)";
        };
        readonly error: {
            readonly type: readonly ["string", "null"];
            readonly description: "Human-readable error message";
        };
        readonly error_code: {
            readonly type: "string";
            readonly maxLength: 64;
            readonly description: "Machine-readable error code for diagnostics";
        };
        readonly retry_count: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Number of retry attempts for this update";
        };
        readonly max_retries: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Maximum allowed retry attempts";
        };
        readonly download_speed_kbps: {
            readonly type: "number";
            readonly minimum: 0;
            readonly description: "Current download speed in kilobits per second";
        };
        readonly bytes_downloaded: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Number of bytes downloaded so far";
        };
        readonly bytes_total: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Total bytes to download";
        };
        readonly eta_seconds: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Estimated time remaining in seconds";
        };
        readonly update_started_at: {
            readonly type: "string";
            readonly format: "date-time";
            readonly description: "ISO8601 timestamp when update began";
        };
        readonly update_completed_at: {
            readonly type: "string";
            readonly format: "date-time";
            readonly description: "ISO8601 timestamp when update completed or failed";
        };
        readonly scheduled_at: {
            readonly type: "string";
            readonly format: "date-time";
            readonly description: "ISO8601 timestamp when update is scheduled to start";
        };
        readonly deadline: {
            readonly type: "string";
            readonly format: "date-time";
            readonly description: "ISO8601 timestamp deadline for update completion";
        };
        readonly rollback_available: {
            readonly type: "boolean";
            readonly description: "Whether rollback to previous version is available";
        };
        readonly previous_version: {
            readonly type: "string";
            readonly description: "Version to rollback to if update fails";
        };
        readonly update_type: {
            readonly type: "string";
            readonly enum: readonly ["full", "delta", "patch", "configuration"];
            readonly description: "Type of update being applied";
        };
        readonly update_channel: {
            readonly type: "string";
            readonly enum: readonly ["stable", "beta", "dev", "custom"];
            readonly description: "Update channel/track";
        };
        readonly update_priority: {
            readonly type: "string";
            readonly enum: readonly ["low", "normal", "high", "critical"];
            readonly description: "Update priority level";
        };
        readonly signature_verified: {
            readonly type: "boolean";
            readonly description: "Whether firmware signature was successfully verified";
        };
        readonly checksum_verified: {
            readonly type: "boolean";
            readonly description: "Whether firmware checksum was successfully verified";
        };
        readonly checksum_algorithm: {
            readonly type: "string";
            readonly enum: readonly ["md5", "sha1", "sha256", "sha512"];
            readonly description: "Checksum algorithm used";
        };
        readonly expected_checksum: {
            readonly type: "string";
            readonly description: "Expected checksum value";
        };
        readonly actual_checksum: {
            readonly type: "string";
            readonly description: "Actual calculated checksum value";
        };
        readonly free_space_kb: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Available storage space in kilobytes before update";
        };
        readonly required_space_kb: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Required storage space for update in kilobytes";
        };
        readonly battery_level_pct: {
            readonly type: "number";
            readonly minimum: 0;
            readonly maximum: 100;
            readonly description: "Battery level during update (critical for battery-powered devices)";
        };
        readonly min_battery_required_pct: {
            readonly type: "number";
            readonly minimum: 0;
            readonly maximum: 100;
            readonly description: "Minimum battery level required to proceed with update";
        };
        readonly force_update: {
            readonly type: "boolean";
            readonly description: "Whether this is a mandatory forced update";
        };
        readonly allow_downgrade: {
            readonly type: "boolean";
            readonly description: "Whether downgrading to older version is allowed";
        };
        readonly auto_reboot: {
            readonly type: "boolean";
            readonly description: "Whether device will automatically reboot after update";
        };
        readonly backup_config: {
            readonly type: "boolean";
            readonly description: "Whether device configuration was backed up before update";
        };
        readonly update_source: {
            readonly type: "string";
            readonly description: "Source/URL of firmware update";
        };
        readonly update_manifest_url: {
            readonly type: "string";
            readonly format: "uri";
            readonly description: "URL to OTA manifest file";
        };
        readonly correlation_id: {
            readonly type: "string";
            readonly maxLength: 128;
            readonly description: "Correlation ID linking command to status updates";
        };
        readonly phase: {
            readonly type: "string";
            readonly enum: readonly ["preparation", "download", "validation", "installation", "verification", "finalization", "cleanup"];
            readonly description: "Current update phase";
        };
        readonly cancellable: {
            readonly type: "boolean";
            readonly description: "Whether update can be cancelled at this stage";
        };
        readonly pause_reason: {
            readonly type: "string";
            readonly description: "Reason for download pause (if download_paused)";
        };
        readonly validation_errors: {
            readonly type: "array";
            readonly items: {
                readonly type: "string";
            };
            readonly description: "List of validation errors if verification failed";
        };
    };
    readonly additionalProperties: true;
};
export declare const control_response_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/control_response.schema.json";
    readonly title: "Control / Command Response v1";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["status"];
    readonly properties: {
        readonly command: {
            readonly type: "string";
        };
        readonly status: {
            readonly type: "string";
            readonly enum: readonly ["ok", "error"];
        };
        readonly message: {
            readonly type: "string";
        };
        readonly result: {
            readonly type: readonly ["object", "array", "string", "number", "boolean", "null"];
        };
    };
    readonly additionalProperties: true;
};
export declare const command_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/command.schema.json";
    readonly title: "Device Command v1";
    readonly description: "Command message sent from MQTT client to IoT device for control operations";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["event", "command"];
    readonly properties: {
        readonly event: {
            readonly type: "string";
            readonly const: "command";
            readonly description: "Event type discriminator";
        };
        readonly command: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 64;
            readonly pattern: "^[a-z][a-z0-9_]*$";
            readonly description: "Command name in snake_case (e.g., read_sensors, set_interval, restart)";
            readonly examples: readonly ["read_sensors", "set_interval", "enable_sensor", "update_config", "restart", "get_status"];
        };
        readonly correlation_id: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 128;
            readonly pattern: "^[A-Za-z0-9_-]+$";
            readonly description: "Unique identifier for tracking command → response lifecycle";
        };
        readonly parameters: {
            readonly type: "object";
            readonly description: "Command-specific parameters (validated by device)";
            readonly additionalProperties: true;
            readonly examples: readonly [{
                readonly interval: 30000;
            }, {
                readonly sensor: "temperature";
                readonly enabled: true;
            }, {
                readonly immediate: true;
                readonly sensors: readonly ["temperature", "humidity"];
            }];
        };
        readonly timeout_ms: {
            readonly type: "integer";
            readonly minimum: 1000;
            readonly maximum: 300000;
            readonly default: 5000;
            readonly description: "Command execution timeout in milliseconds";
        };
        readonly priority: {
            readonly type: "string";
            readonly enum: readonly ["low", "normal", "high", "urgent"];
            readonly default: "normal";
            readonly description: "Command priority for queue management";
        };
    };
    readonly additionalProperties: true;
};
export declare const command_response_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/command_response.schema.json";
    readonly title: "Command Response v1";
    readonly description: "Response message from IoT device after executing a command";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["event", "success"];
    readonly properties: {
        readonly event: {
            readonly type: "string";
            readonly const: "command_response";
            readonly description: "Event type discriminator";
        };
        readonly command: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 64;
            readonly description: "Original command name that was executed";
        };
        readonly correlation_id: {
            readonly type: "string";
            readonly minLength: 1;
            readonly maxLength: 128;
            readonly pattern: "^[A-Za-z0-9_-]+$";
            readonly description: "Matches correlation_id from original command";
        };
        readonly success: {
            readonly type: "boolean";
            readonly description: "Whether command execution succeeded";
        };
        readonly result: {
            readonly type: readonly ["object", "array", "string", "number", "boolean", "null"];
            readonly description: "Command execution result data";
        };
        readonly message: {
            readonly type: "string";
            readonly maxLength: 256;
            readonly description: "Human-readable status message";
        };
        readonly error_code: {
            readonly type: "string";
            readonly maxLength: 64;
            readonly description: "Machine-readable error code (e.g., TIMEOUT, INVALID_PARAMS)";
        };
        readonly latency_ms: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Time taken to execute command in milliseconds";
        };
    };
    readonly additionalProperties: true;
};
export declare const mesh_node_list_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/mesh_node_list.schema.json";
    readonly title: "Mesh Node List v1";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["nodes"];
    readonly properties: {
        readonly nodes: {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly required: readonly ["node_id"];
                readonly properties: {
                    readonly node_id: {
                        readonly type: "string";
                        readonly description: "Unique node identifier";
                    };
                    readonly status: {
                        readonly type: "string";
                        readonly enum: readonly ["online", "offline", "unreachable"];
                        readonly description: "Current node status";
                    };
                    readonly last_seen: {
                        readonly type: "string";
                        readonly format: "date-time";
                        readonly description: "Last communication timestamp";
                    };
                    readonly signal_strength: {
                        readonly type: "integer";
                        readonly minimum: -200;
                        readonly maximum: 0;
                        readonly description: "Signal strength in dBm";
                    };
                };
                readonly additionalProperties: true;
            };
        };
        readonly node_count: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Total number of nodes";
        };
        readonly mesh_id: {
            readonly type: "string";
            readonly description: "Mesh network identifier";
        };
    };
    readonly additionalProperties: true;
};
export declare const mesh_topology_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/mesh_topology.schema.json";
    readonly title: "Mesh Network Topology v1";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["connections"];
    readonly properties: {
        readonly connections: {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly required: readonly ["from_node", "to_node"];
                readonly properties: {
                    readonly from_node: {
                        readonly type: "string";
                        readonly description: "Source node ID";
                    };
                    readonly to_node: {
                        readonly type: "string";
                        readonly description: "Destination node ID";
                    };
                    readonly link_quality: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 1;
                        readonly description: "Link quality score (0-1)";
                    };
                    readonly latency_ms: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Link latency in milliseconds";
                    };
                    readonly hop_count: {
                        readonly type: "integer";
                        readonly minimum: 1;
                        readonly description: "Number of hops in path";
                    };
                };
                readonly additionalProperties: true;
            };
        };
        readonly root_node: {
            readonly type: "string";
            readonly description: "Root node ID (gateway/bridge)";
        };
        readonly total_connections: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Total number of connections";
        };
    };
    readonly additionalProperties: true;
};
export declare const mesh_alert_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/mesh_alert.schema.json";
    readonly title: "Mesh Network Alert v1";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["alerts"];
    readonly properties: {
        readonly alerts: {
            readonly type: "array";
            readonly items: {
                readonly type: "object";
                readonly required: readonly ["alert_type", "severity", "message"];
                readonly properties: {
                    readonly alert_type: {
                        readonly type: "string";
                        readonly enum: readonly ["low_memory", "node_offline", "connection_lost", "high_latency", "packet_loss", "firmware_mismatch", "configuration_error", "security_warning", "other"];
                        readonly description: "Type of alert";
                    };
                    readonly severity: {
                        readonly type: "string";
                        readonly enum: readonly ["critical", "warning", "info"];
                        readonly description: "Alert severity level";
                    };
                    readonly message: {
                        readonly type: "string";
                        readonly description: "Human-readable alert message";
                    };
                    readonly node_id: {
                        readonly type: "string";
                        readonly description: "Related node ID (if applicable)";
                    };
                    readonly metric_value: {
                        readonly type: "number";
                        readonly description: "Related metric value (if applicable)";
                    };
                    readonly threshold: {
                        readonly type: "number";
                        readonly description: "Threshold that triggered alert";
                    };
                    readonly alert_id: {
                        readonly type: "string";
                        readonly description: "Unique alert identifier";
                    };
                };
                readonly additionalProperties: true;
            };
        };
        readonly alert_count: {
            readonly type: "integer";
            readonly minimum: 0;
            readonly description: "Total number of active alerts";
        };
    };
    readonly additionalProperties: true;
};
export declare const mesh_bridge_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/mesh_bridge.schema.json";
    readonly title: "Mesh Protocol Bridge Message";
    readonly description: "Bridge message for painlessMesh and other mesh protocols";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }, {
        readonly type: "object";
        readonly required: readonly ["event", "mesh_protocol", "mesh_message"];
        readonly properties: {
            readonly device_type: {
                readonly const: "gateway";
                readonly description: "Must be gateway (only gateways bridge mesh protocols)";
            };
            readonly event: {
                readonly const: "mesh_bridge";
                readonly description: "Event identifier for mesh protocol bridge messages";
            };
            readonly message_type: {
                readonly const: 603;
                readonly description: "Message type code for mesh bridge (v0.7.1+)";
            };
            readonly mesh_protocol: {
                readonly type: "string";
                readonly enum: readonly ["painlessMesh", "esp-now", "ble-mesh", "thread", "zigbee"];
                readonly description: "Mesh protocol being bridged";
            };
            readonly mesh_message: {
                readonly type: "object";
                readonly description: "Encapsulated mesh protocol message";
                readonly properties: {
                    readonly from_node_id: {
                        readonly type: readonly ["integer", "string"];
                        readonly description: "Source node identifier (uint32 for painlessMesh)";
                    };
                    readonly to_node_id: {
                        readonly type: readonly ["integer", "string"];
                        readonly description: "Destination node identifier (0 or 'broadcast' for broadcast)";
                    };
                    readonly mesh_type: {
                        readonly type: "integer";
                        readonly description: "Mesh protocol-specific message type code";
                    };
                    readonly mesh_type_name: {
                        readonly type: "string";
                        readonly description: "Human-readable mesh message type (e.g., 'SINGLE', 'BROADCAST')";
                    };
                    readonly raw_payload: {
                        readonly type: "string";
                        readonly description: "Raw mesh message payload (base64 or hex encoded)";
                    };
                    readonly payload_decoded: {
                        readonly type: "object";
                        readonly description: "Decoded payload if it's a valid MQTT v1 message";
                    };
                    readonly rssi: {
                        readonly type: "number";
                        readonly minimum: -200;
                        readonly maximum: 0;
                        readonly description: "Signal strength in dBm";
                    };
                    readonly hop_count: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Number of hops from source to gateway";
                    };
                    readonly mesh_timestamp: {
                        readonly type: "integer";
                        readonly description: "Mesh protocol timestamp (microseconds for painlessMesh)";
                    };
                };
                readonly additionalProperties: true;
            };
            readonly gateway_node_id: {
                readonly type: readonly ["integer", "string"];
                readonly description: "Gateway's node ID in the mesh network";
            };
            readonly mesh_network_id: {
                readonly type: "string";
                readonly description: "Mesh network identifier";
            };
        };
        readonly additionalProperties: true;
    }];
};
export declare const mesh_status_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "mesh_status.schema.json";
    readonly title: "Mesh Network Status Message";
    readonly description: "Mesh network health and status message (v0.7.2+). Reports overall mesh network operational status and health indicators.";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }, {
        readonly type: "object";
        readonly properties: {
            readonly device_type: {
                readonly const: "gateway";
                readonly description: "Must be 'gateway' for mesh status messages";
            };
            readonly firmware_version: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Required firmware version for mesh status";
            };
            readonly mesh_network_id: {
                readonly type: "string";
                readonly description: "Unique mesh network identifier";
            };
            readonly mesh_status: {
                readonly type: "string";
                readonly enum: readonly ["healthy", "degraded", "partitioned", "forming", "failed", "maintenance"];
                readonly description: "Overall mesh network health status";
            };
            readonly node_count: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly description: "Total number of nodes in mesh network";
            };
            readonly online_nodes: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly description: "Number of nodes currently online";
            };
            readonly offline_nodes: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly description: "Number of nodes currently offline";
            };
            readonly root_node: {
                readonly type: "string";
                readonly description: "Current root node identifier";
            };
            readonly network_stability: {
                readonly type: "number";
                readonly minimum: 0;
                readonly maximum: 100;
                readonly description: "Network stability score (0-100, higher is better)";
            };
            readonly topology_changes_24h: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly description: "Number of topology changes in last 24 hours";
            };
            readonly partition_count: {
                readonly type: "integer";
                readonly minimum: 1;
                readonly description: "Number of network partitions (1 = healthy, >1 = partitioned)";
            };
            readonly average_hop_count: {
                readonly type: "number";
                readonly minimum: 0;
                readonly description: "Average hop count across all node pairs";
            };
            readonly max_hop_count: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly description: "Maximum hop count in network";
            };
            readonly network_diameter: {
                readonly type: "integer";
                readonly minimum: 0;
                readonly description: "Network diameter (longest shortest path)";
            };
            readonly issues: {
                readonly type: "array";
                readonly description: "List of current mesh network issues";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly issue_type: {
                            readonly type: "string";
                            readonly enum: readonly ["partition", "high_latency", "packet_loss", "node_unreachable", "routing_loop", "congestion", "security", "other"];
                            readonly description: "Type of network issue";
                        };
                        readonly severity: {
                            readonly type: "string";
                            readonly enum: readonly ["critical", "warning", "info"];
                            readonly description: "Issue severity level";
                        };
                        readonly description: {
                            readonly type: "string";
                            readonly maxLength: 256;
                            readonly description: "Human-readable issue description";
                        };
                        readonly affected_nodes: {
                            readonly type: "array";
                            readonly items: {
                                readonly type: "string";
                            };
                            readonly description: "List of affected node IDs";
                        };
                        readonly detected_at: {
                            readonly type: "string";
                            readonly format: "date-time";
                            readonly description: "Issue detection timestamp (ISO 8601)";
                        };
                    };
                    readonly required: readonly ["issue_type", "severity", "description"];
                    readonly additionalProperties: true;
                };
            };
            readonly last_topology_change: {
                readonly type: "string";
                readonly format: "date-time";
                readonly description: "Timestamp of last topology change (ISO 8601)";
            };
            readonly mesh_protocol: {
                readonly type: "string";
                readonly enum: readonly ["painlessMesh", "esp-now", "ble-mesh", "thread", "zigbee"];
                readonly description: "Mesh protocol being used";
            };
        };
        readonly required: readonly ["device_type", "firmware_version", "mesh_status"];
        readonly additionalProperties: true;
    }];
};
export declare const mesh_metrics_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "mesh_metrics.schema.json";
    readonly title: "Mesh Network Metrics Message";
    readonly description: "Mesh network performance metrics message (v0.7.2+). Detailed performance and traffic metrics for mesh network.";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }, {
        readonly type: "object";
        readonly properties: {
            readonly device_type: {
                readonly const: "gateway";
                readonly description: "Must be 'gateway' for mesh metrics messages";
            };
            readonly firmware_version: {
                readonly type: "string";
                readonly minLength: 1;
                readonly description: "Required firmware version for mesh metrics";
            };
            readonly mesh_network_id: {
                readonly type: "string";
                readonly description: "Unique mesh network identifier";
            };
            readonly metrics: {
                readonly type: "object";
                readonly description: "Mesh network performance metrics";
                readonly properties: {
                    readonly uptime_s: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Mesh network uptime in seconds";
                    };
                    readonly total_nodes: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total nodes in network";
                    };
                    readonly active_nodes: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Currently active nodes";
                    };
                    readonly packets_sent: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total packets sent";
                    };
                    readonly packets_received: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total packets received";
                    };
                    readonly packets_dropped: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total packets dropped";
                    };
                    readonly packet_loss_pct: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 100;
                        readonly description: "Packet loss percentage";
                    };
                    readonly average_latency_ms: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Average network latency in milliseconds";
                    };
                    readonly max_latency_ms: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Maximum observed latency in milliseconds";
                    };
                    readonly min_latency_ms: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Minimum observed latency in milliseconds";
                    };
                    readonly throughput_kbps: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly description: "Network throughput in kbps";
                    };
                    readonly bandwidth_utilization_pct: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 100;
                        readonly description: "Bandwidth utilization percentage";
                    };
                    readonly routing_table_size: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Size of routing table";
                    };
                    readonly route_updates_24h: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Routing table updates in last 24 hours";
                    };
                    readonly broadcast_messages: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total broadcast messages sent";
                    };
                    readonly unicast_messages: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total unicast messages sent";
                    };
                    readonly multicast_messages: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total multicast messages sent";
                    };
                    readonly retransmission_rate: {
                        readonly type: "number";
                        readonly minimum: 0;
                        readonly maximum: 100;
                        readonly description: "Message retransmission rate percentage";
                    };
                    readonly duplicate_packets: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Number of duplicate packets detected";
                    };
                    readonly out_of_order_packets: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Number of out-of-order packets";
                    };
                    readonly error_count: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Total error count";
                    };
                    readonly collision_count: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Number of packet collisions";
                    };
                    readonly average_rssi: {
                        readonly type: "number";
                        readonly minimum: -200;
                        readonly maximum: 0;
                        readonly description: "Average RSSI across all links in dBm";
                    };
                    readonly weakest_link_rssi: {
                        readonly type: "number";
                        readonly minimum: -200;
                        readonly maximum: 0;
                        readonly description: "Weakest link RSSI in dBm";
                    };
                    readonly strongest_link_rssi: {
                        readonly type: "number";
                        readonly minimum: -200;
                        readonly maximum: 0;
                        readonly description: "Strongest link RSSI in dBm";
                    };
                    readonly node_join_count_24h: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Nodes joined in last 24 hours";
                    };
                    readonly node_leave_count_24h: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Nodes left in last 24 hours";
                    };
                    readonly mesh_healing_events: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Number of self-healing events";
                    };
                };
                readonly required: readonly ["uptime_s"];
                readonly additionalProperties: true;
            };
            readonly top_talkers: {
                readonly type: "array";
                readonly description: "Nodes with highest traffic volume";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly node_id: {
                            readonly type: "string";
                        };
                        readonly packets_sent: {
                            readonly type: "integer";
                            readonly minimum: 0;
                        };
                        readonly packets_received: {
                            readonly type: "integer";
                            readonly minimum: 0;
                        };
                        readonly bytes_sent: {
                            readonly type: "integer";
                            readonly minimum: 0;
                        };
                        readonly bytes_received: {
                            readonly type: "integer";
                            readonly minimum: 0;
                        };
                    };
                    readonly additionalProperties: true;
                };
            };
            readonly problematic_links: {
                readonly type: "array";
                readonly description: "Links with performance issues";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly from_node: {
                            readonly type: "string";
                        };
                        readonly to_node: {
                            readonly type: "string";
                        };
                        readonly packet_loss_pct: {
                            readonly type: "number";
                            readonly minimum: 0;
                            readonly maximum: 100;
                        };
                        readonly latency_ms: {
                            readonly type: "number";
                            readonly minimum: 0;
                        };
                        readonly rssi: {
                            readonly type: "number";
                            readonly minimum: -200;
                            readonly maximum: 0;
                        };
                        readonly issue: {
                            readonly type: "string";
                        };
                    };
                    readonly additionalProperties: true;
                };
            };
        };
        readonly required: readonly ["device_type", "firmware_version", "metrics"];
        readonly additionalProperties: true;
    }];
};
export declare const device_config_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/device_config.schema.json";
    readonly title: "Device Configuration Message";
    readonly description: "Configuration snapshot or update for sensor or gateway device";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }, {
        readonly type: "object";
        readonly required: readonly ["event", "configuration"];
        readonly properties: {
            readonly event: {
                readonly type: "string";
                readonly enum: readonly ["config_snapshot", "config_update", "config_request"];
                readonly description: "Configuration event type: snapshot (current state), update (apply changes), request (query current config)";
            };
            readonly message_type: {
                readonly const: 700;
                readonly description: "Message type code for device configuration (v0.7.1+)";
            };
            readonly configuration: {
                readonly type: "object";
                readonly description: "Device configuration parameters";
                readonly properties: {
                    readonly sampling_interval_ms: {
                        readonly type: "integer";
                        readonly minimum: 1000;
                        readonly maximum: 86400000;
                        readonly description: "Sensor sampling interval in milliseconds (1s to 24h)";
                    };
                    readonly reporting_interval_ms: {
                        readonly type: "integer";
                        readonly minimum: 1000;
                        readonly maximum: 86400000;
                        readonly description: "Data reporting interval in milliseconds";
                    };
                    readonly sensors_enabled: {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                        };
                        readonly description: "List of enabled sensor names";
                    };
                    readonly transmission_mode: {
                        readonly type: "string";
                        readonly enum: readonly ["wifi", "mesh", "mixed", "cellular"];
                        readonly description: "Network transmission mode";
                    };
                    readonly power_mode: {
                        readonly type: "string";
                        readonly enum: readonly ["normal", "low_power", "ultra_low_power", "always_on"];
                        readonly description: "Device power management mode";
                    };
                    readonly sleep_duration_ms: {
                        readonly type: "integer";
                        readonly minimum: 0;
                        readonly description: "Deep sleep duration in milliseconds (0 = disabled)";
                    };
                    readonly calibration_offsets: {
                        readonly type: "object";
                        readonly additionalProperties: {
                            readonly type: "number";
                        };
                        readonly description: "Sensor calibration offset values";
                    };
                    readonly alert_thresholds: {
                        readonly type: "object";
                        readonly additionalProperties: {
                            readonly type: "object";
                            readonly properties: {
                                readonly min: {
                                    readonly type: "number";
                                };
                                readonly max: {
                                    readonly type: "number";
                                };
                                readonly enabled: {
                                    readonly type: "boolean";
                                };
                            };
                        };
                        readonly description: "Alert threshold configurations per sensor";
                    };
                    readonly network_config: {
                        readonly type: "object";
                        readonly properties: {
                            readonly wifi_ssid: {
                                readonly type: "string";
                                readonly maxLength: 32;
                            };
                            readonly wifi_channel: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 14;
                            };
                            readonly mesh_prefix: {
                                readonly type: "string";
                                readonly maxLength: 32;
                            };
                            readonly mesh_password: {
                                readonly type: "string";
                                readonly maxLength: 64;
                            };
                            readonly mesh_port: {
                                readonly type: "integer";
                                readonly minimum: 1024;
                                readonly maximum: 65535;
                            };
                            readonly mqtt_broker: {
                                readonly type: "string";
                                readonly format: "hostname";
                            };
                            readonly mqtt_port: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 65535;
                            };
                            readonly mqtt_topic_prefix: {
                                readonly type: "string";
                                readonly maxLength: 128;
                            };
                        };
                        readonly description: "Network and connectivity configuration";
                    };
                    readonly ota_config: {
                        readonly type: "object";
                        readonly properties: {
                            readonly auto_update: {
                                readonly type: "boolean";
                                readonly description: "Enable automatic OTA updates";
                            };
                            readonly update_channel: {
                                readonly type: "string";
                                readonly enum: readonly ["stable", "beta", "dev"];
                                readonly description: "OTA update channel";
                            };
                            readonly update_check_interval_h: {
                                readonly type: "integer";
                                readonly minimum: 1;
                                readonly maximum: 168;
                                readonly description: "Update check interval in hours";
                            };
                            readonly allow_downgrade: {
                                readonly type: "boolean";
                                readonly description: "Allow firmware downgrade";
                            };
                        };
                        readonly description: "OTA update configuration";
                    };
                    readonly log_level: {
                        readonly type: "string";
                        readonly enum: readonly ["debug", "info", "warn", "error", "none"];
                        readonly description: "Device logging level";
                    };
                    readonly timezone: {
                        readonly type: "string";
                        readonly description: "Timezone identifier (e.g., 'America/New_York', 'UTC')";
                    };
                    readonly ntp_server: {
                        readonly type: "string";
                        readonly format: "hostname";
                        readonly description: "NTP server for time synchronization";
                    };
                };
                readonly additionalProperties: true;
            };
            readonly config_version: {
                readonly type: "string";
                readonly description: "Configuration schema version for tracking changes";
            };
            readonly last_modified: {
                readonly type: "string";
                readonly format: "date-time";
                readonly description: "Timestamp when configuration was last modified";
            };
            readonly modified_by: {
                readonly type: "string";
                readonly description: "User or system that modified the configuration";
            };
            readonly validation_errors: {
                readonly type: "array";
                readonly items: {
                    readonly type: "object";
                    readonly properties: {
                        readonly field: {
                            readonly type: "string";
                        };
                        readonly error: {
                            readonly type: "string";
                        };
                    };
                };
                readonly description: "Configuration validation errors (for config_update responses)";
            };
        };
        readonly additionalProperties: true;
    }];
};
export declare const mqtt_v1_bundle_json: {
    readonly $comment: "Convenience bundle referencing all v1 schema artifact filenames for tooling discovery.";
    readonly version: 1;
    readonly schemas: {
        readonly envelope: "envelope.schema.json";
        readonly sensor_data: "sensor_data.schema.json";
        readonly sensor_heartbeat: "sensor_heartbeat.schema.json";
        readonly sensor_status: "sensor_status.schema.json";
        readonly gateway_info: "gateway_info.schema.json";
        readonly gateway_metrics: "gateway_metrics.schema.json";
        readonly firmware_status: "firmware_status.schema.json";
        readonly control_response: "control_response.schema.json";
        readonly command: "command.schema.json";
        readonly command_response: "command_response.schema.json";
        readonly mesh_node_list: "mesh_node_list.schema.json";
        readonly mesh_topology: "mesh_topology.schema.json";
        readonly mesh_alert: "mesh_alert.schema.json";
    };
};
export declare const ota_ota_manifest_schema: {
    readonly $id: "https://schemas.alteriom.com/ota/ota-manifest.schema.json";
    readonly title: "Alteriom OTA Firmware Manifest";
    readonly description: "Schema for Alteriom OTA firmware manifests supporting both rich and minimal variants";
    readonly type: "object";
    readonly oneOf: readonly [{
        readonly title: "Rich Manifest";
        readonly description: "Rich manifest format with environment, branch, and manifests object";
        readonly type: "object";
        readonly properties: {
            readonly environment: {
                readonly type: "string";
                readonly description: "Target environment (e.g., universal-sensor)";
            };
            readonly branch: {
                readonly type: "string";
                readonly description: "Source control branch the build originated from";
            };
            readonly manifests: {
                readonly type: "object";
                readonly description: "Build variants keyed by type (dev, prod, etc.)";
                readonly patternProperties: {
                    readonly "^[a-z][a-z0-9-]*$": {
                        readonly $ref: "#/$defs/richEntry";
                    };
                };
                readonly additionalProperties: false;
                readonly minProperties: 1;
            };
        };
        readonly required: readonly ["environment", "branch", "manifests"];
        readonly additionalProperties: true;
    }, {
        readonly title: "Minimal Environment Map";
        readonly description: "Minimal manifest format as environment -> channels mapping";
        readonly type: "object";
        readonly patternProperties: {
            readonly "^[a-z][a-z0-9-]*$": {
                readonly type: "object";
                readonly description: "Environment entry with channel mappings";
                readonly patternProperties: {
                    readonly "^[a-z][a-z0-9-]*$": {
                        readonly $ref: "#/$defs/minimalChannel";
                    };
                };
                readonly additionalProperties: false;
                readonly minProperties: 1;
            };
        };
        readonly additionalProperties: false;
        readonly minProperties: 1;
    }];
    readonly $defs: {
        readonly richEntry: {
            readonly title: "Rich Build Entry";
            readonly description: "Rich manifest build entry (dev or prod)";
            readonly type: "object";
            readonly properties: {
                readonly build_type: {
                    readonly type: "string";
                    readonly enum: readonly ["dev", "prod"];
                    readonly description: "Build type identifier";
                };
                readonly file: {
                    readonly type: "string";
                    readonly description: "Firmware binary filename";
                };
                readonly size: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly description: "Total firmware size in bytes";
                };
                readonly sha256: {
                    readonly type: "string";
                    readonly pattern: "^[a-f0-9]{64}$";
                    readonly description: "SHA256 hash of the full firmware binary (lowercase hex)";
                };
                readonly firmware_version: {
                    readonly type: "string";
                    readonly description: "Semantic or build version string";
                };
                readonly built: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly description: "ISO8601 timestamp when built";
                };
                readonly ota_url: {
                    readonly type: "string";
                    readonly format: "uri";
                    readonly description: "Absolute or relative URL to fetch the firmware";
                };
                readonly chunk_size: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly description: "Size of each chunk except possibly the last";
                };
                readonly chunks: {
                    readonly description: "Either structured chunk objects or array of SHA256 strings";
                    readonly oneOf: readonly [{
                        readonly type: "array";
                        readonly items: {
                            readonly $ref: "#/$defs/chunkObject";
                        };
                        readonly description: "Array of structured chunk objects with metadata";
                    }, {
                        readonly type: "array";
                        readonly items: {
                            readonly type: "string";
                            readonly pattern: "^[a-f0-9]{64}$";
                            readonly description: "SHA256 hash of chunk (lowercase hex)";
                        };
                        readonly description: "Array of SHA256 strings for chunks";
                    }];
                };
                readonly signature: {
                    readonly type: "string";
                    readonly description: "Digital signature of the firmware for authenticity verification (base64 encoded)";
                };
                readonly signature_algorithm: {
                    readonly type: "string";
                    readonly enum: readonly ["RSA-SHA256", "ECDSA-SHA256", "Ed25519"];
                    readonly description: "Algorithm used for digital signature";
                };
                readonly signing_key_id: {
                    readonly type: "string";
                    readonly description: "Identifier of the signing key for key rotation support";
                };
                readonly release_notes_url: {
                    readonly type: "string";
                    readonly format: "uri";
                    readonly description: "URL to release notes or changelog for this version";
                };
                readonly min_version: {
                    readonly type: "string";
                    readonly description: "Minimum firmware version required to upgrade to this version";
                };
                readonly max_version: {
                    readonly type: "string";
                    readonly description: "Maximum firmware version that can upgrade to this version (for preventing downgrades)";
                };
                readonly criticality: {
                    readonly type: "string";
                    readonly enum: readonly ["low", "medium", "high", "critical"];
                    readonly description: "Update criticality level for prioritization";
                };
                readonly mandatory: {
                    readonly type: "boolean";
                    readonly description: "Whether this update must be installed (cannot be skipped)";
                };
                readonly rollout_percentage: {
                    readonly type: "number";
                    readonly minimum: 0;
                    readonly maximum: 100;
                    readonly description: "Percentage of fleet to receive this update (staged rollout)";
                };
                readonly rollout_target_groups: {
                    readonly type: "array";
                    readonly items: {
                        readonly type: "string";
                    };
                    readonly description: "Specific device groups targeted for this update (A/B testing)";
                };
                readonly delta_from_version: {
                    readonly type: "string";
                    readonly description: "Source version for delta/patch update";
                };
                readonly delta_patch_url: {
                    readonly type: "string";
                    readonly format: "uri";
                    readonly description: "URL to download delta patch instead of full firmware";
                };
                readonly delta_patch_size: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly description: "Size of delta patch in bytes";
                };
                readonly delta_patch_sha256: {
                    readonly type: "string";
                    readonly pattern: "^[a-f0-9]{64}$";
                    readonly description: "SHA256 hash of the delta patch file";
                };
                readonly deprecated: {
                    readonly type: "boolean";
                    readonly description: "Mark this version as deprecated (not recommended for new installs)";
                };
                readonly expiry_date: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly description: "ISO8601 timestamp when this firmware version expires and should no longer be installed";
                };
            };
            readonly required: readonly ["build_type", "file", "size", "sha256", "firmware_version", "built", "ota_url"];
            readonly additionalProperties: true;
        };
        readonly chunkObject: {
            readonly title: "OTA Chunk Object";
            readonly description: "Structured chunk metadata with offset and size";
            readonly type: "object";
            readonly properties: {
                readonly index: {
                    readonly type: "integer";
                    readonly minimum: 0;
                    readonly description: "0-based sequential chunk index";
                };
                readonly offset: {
                    readonly type: "integer";
                    readonly minimum: 0;
                    readonly description: "Byte offset within firmware binary";
                };
                readonly size: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly description: "Chunk size in bytes";
                };
                readonly sha256: {
                    readonly type: "string";
                    readonly pattern: "^[a-f0-9]{64}$";
                    readonly description: "SHA256 hash of the chunk (lowercase hex)";
                };
            };
            readonly required: readonly ["index", "offset", "size", "sha256"];
            readonly additionalProperties: true;
        };
        readonly minimalChannel: {
            readonly title: "Minimal Channel Entry";
            readonly description: "Minimal manifest channel entry";
            readonly type: "object";
            readonly properties: {
                readonly file: {
                    readonly type: "string";
                    readonly description: "Firmware binary filename";
                };
                readonly size: {
                    readonly type: "integer";
                    readonly minimum: 1;
                    readonly description: "Total firmware size in bytes";
                };
                readonly sha256: {
                    readonly type: "string";
                    readonly pattern: "^[a-f0-9]{64}$";
                    readonly description: "SHA256 hash of the firmware binary (lowercase hex)";
                };
                readonly version: {
                    readonly type: "string";
                    readonly description: "Firmware version string";
                };
                readonly timestamp: {
                    readonly type: "string";
                    readonly format: "date-time";
                    readonly description: "ISO8601 timestamp";
                };
                readonly signature: {
                    readonly type: "string";
                    readonly description: "Digital signature of the firmware (base64 encoded)";
                };
                readonly signature_algorithm: {
                    readonly type: "string";
                    readonly enum: readonly ["RSA-SHA256", "ECDSA-SHA256", "Ed25519"];
                    readonly description: "Algorithm used for digital signature";
                };
                readonly min_version: {
                    readonly type: "string";
                    readonly description: "Minimum firmware version required to upgrade";
                };
                readonly criticality: {
                    readonly type: "string";
                    readonly enum: readonly ["low", "medium", "high", "critical"];
                    readonly description: "Update criticality level";
                };
                readonly mandatory: {
                    readonly type: "boolean";
                    readonly description: "Whether this update must be installed";
                };
            };
            readonly required: readonly ["file", "size", "sha256", "version", "timestamp"];
            readonly additionalProperties: true;
        };
    };
};
