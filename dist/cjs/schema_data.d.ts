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
