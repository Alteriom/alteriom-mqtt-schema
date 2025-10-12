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
            };
            readonly additionalProperties: true;
        };
    };
    readonly additionalProperties: true;
};
export declare const firmware_status_schema: {
    readonly $schema: "https://json-schema.org/draft/2020-12/schema";
    readonly $id: "https://schemas.alteriom.io/mqtt/v1/firmware_status.schema.json";
    readonly title: "Firmware Update Status v1";
    readonly allOf: readonly [{
        readonly $ref: "envelope.schema.json";
    }];
    readonly type: "object";
    readonly required: readonly ["status"];
    readonly properties: {
        readonly event: {
            readonly type: "string";
        };
        readonly from_version: {
            readonly type: "string";
        };
        readonly to_version: {
            readonly type: "string";
        };
        readonly status: {
            readonly type: "string";
            readonly enum: readonly ["pending", "downloading", "flashing", "verifying", "rebooting", "completed", "failed"];
        };
        readonly progress_pct: {
            readonly type: "number";
            readonly minimum: 0;
            readonly maximum: 100;
        };
        readonly error: {
            readonly type: readonly ["string", "null"];
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
            };
            readonly required: readonly ["file", "size", "sha256", "version", "timestamp"];
            readonly additionalProperties: true;
        };
    };
};
