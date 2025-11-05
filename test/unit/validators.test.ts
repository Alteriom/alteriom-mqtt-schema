import { describe, it, expect } from 'vitest';
import { validators } from '../../src/validators';

describe('Validators', () => {
  describe('sensorData validator', () => {
    it('should validate a valid sensor data message', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: {
            value: 22.5,
            unit: 'C',
          },
        },
      };

      const result = validators.sensorData(validMessage);
      expect(result.valid).toBe(true);
      expect(result.errors).toBeUndefined();
    });

    it('should reject sensor data without required fields', () => {
      const invalidMessage = {
        schema_version: 1,
        device_id: 'SN001',
        // Missing device_type, timestamp, firmware_version, sensors
      };

      const result = validators.sensorData(invalidMessage);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should reject sensor data with invalid sensor value', () => {
      const invalidMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: {
            value: 'invalid', // Should be number
            unit: 'C',
          },
        },
      };

      const result = validators.sensorData(invalidMessage);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should accept sensor data with optional message_type', () => {
      const validMessage = {
        schema_version: 1,
        message_type: 200,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: {
            value: 22.5,
            unit: 'C',
          },
        },
      };

      const result = validators.sensorData(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should accept sensor data with multiple sensors', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
          humidity: { value: 45.2, unit: '%' },
          pressure: { value: 1013.25, unit: 'hPa' },
        },
      };

      const result = validators.sensorData(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should accept sensor data with optional location', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
        },
        location: {
          latitude: 43.6532,
          longitude: -79.3832,
        },
      };

      const result = validators.sensorData(validMessage);
      expect(result.valid).toBe(true);
    });
  });

  describe('sensorHeartbeat validator', () => {
    it('should validate a valid sensor heartbeat', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        uptime_s: 86400,
      };

      const result = validators.sensorHeartbeat(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should allow heartbeat without firmware_version', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        uptime_s: 86400,
      };

      const result = validators.sensorHeartbeat(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should reject heartbeat without required fields', () => {
      const invalidMessage = {
        schema_version: 1,
        device_id: 'SN001',
        // Missing device_type, timestamp
      };

      const result = validators.sensorHeartbeat(invalidMessage);
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });

  describe('gatewayMetrics validator', () => {
    it('should validate valid gateway metrics', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        metrics: {
          uptime_s: 86400,
          cpu_usage_pct: 15.3,
        },
      };

      const result = validators.gatewayMetrics(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should reject gateway metrics with invalid percentage', () => {
      const invalidMessage = {
        schema_version: 1,
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        metrics: {
          uptime_s: 86400,
          cpu_usage_pct: 150, // Invalid: > 100
        },
      };

      const result = validators.gatewayMetrics(invalidMessage);
      expect(result.valid).toBe(false);
    });
  });

  describe('command validator', () => {
    it('should validate a valid command message', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'WEB 1.0.0',
        event: 'command',
        command: 'read_sensors',
        correlation_id: 'cmd-123',
      };

      const result = validators.command(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should reject command without required fields', () => {
      const invalidMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'WEB 1.0.0',
        event: 'command',
        // Missing command and correlation_id
      };

      const result = validators.command(invalidMessage);
      expect(result.valid).toBe(false);
    });
  });

  describe('firmwareStatus validator', () => {
    it('should validate firmware status with progress', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: '2.0.0',
        status: 'downloading',
        progress_pct: 42,
      };

      const result = validators.firmwareStatus(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should reject firmware status with invalid progress percentage', () => {
      const invalidMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: '2.0.0',
        status: 'downloading',
        progress_pct: 150, // Invalid: > 100
      };

      const result = validators.firmwareStatus(invalidMessage);
      expect(result.valid).toBe(false);
    });
  });

  describe('meshBridge validator', () => {
    it('should validate a valid mesh bridge message', () => {
      const validMessage = {
        schema_version: 1,
        message_type: 603,
        device_id: 'GW-MESH-01',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 3.2.0',
        event: 'mesh_bridge',
        mesh_protocol: 'painlessMesh',
        mesh_message: {
          from_node_id: 123456789,
          to_node_id: 987654321,
        },
      };

      const result = validators.meshBridge(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should reject mesh bridge without required mesh_message', () => {
      const invalidMessage = {
        schema_version: 1,
        message_type: 603,
        device_id: 'GW-MESH-01',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 3.2.0',
        event: 'mesh_bridge',
        mesh_protocol: 'painlessMesh',
        // Missing mesh_message
      };

      const result = validators.meshBridge(invalidMessage);
      expect(result.valid).toBe(false);
    });
  });

  describe('deviceConfig validator', () => {
    it('should validate a valid device config message', () => {
      const validMessage = {
        schema_version: 1,
        message_type: 700,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'WEB 1.0.0',
        event: 'config_snapshot',
        configuration: {
          sampling_interval_ms: 60000,
        },
      };

      const result = validators.deviceConfig(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should reject device config without configuration', () => {
      const invalidMessage = {
        schema_version: 1,
        message_type: 700,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'WEB 1.0.0',
        event: 'config_snapshot',
        // Missing configuration
      };

      const result = validators.deviceConfig(invalidMessage);
      expect(result.valid).toBe(false);
    });
  });

  describe('batchEnvelope validator', () => {
    it('should validate a valid batch envelope message', () => {
      const validMessage = {
        schema_version: 1,
        message_type: 800,
        batch_id: 'batch-123',
        batch_size: 2,
        messages: [
          {
            schema_version: 1,
            device_id: 'SN001',
            device_type: 'sensor',
            timestamp: '2025-11-04T22:00:00.000Z',
            firmware_version: 'SN 2.1.0',
            sensors: { temp: { value: 22.5, unit: 'C' } },
          },
          {
            schema_version: 1,
            device_id: 'SN002',
            device_type: 'sensor',
            timestamp: '2025-11-04T22:00:01.000Z',
            firmware_version: 'SN 2.1.0',
            sensors: { temp: { value: 23.0, unit: 'C' } },
          },
        ],
      };

      const result = validators.batchEnvelope(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should reject batch envelope with invalid batch_size', () => {
      const invalidMessage = {
        schema_version: 1,
        message_type: 800,
        batch_id: 'batch-123',
        batch_size: 0, // Invalid: should be >= 1
        messages: [],
      };

      const result = validators.batchEnvelope(invalidMessage);
      expect(result.valid).toBe(false);
    });
  });

  describe('compressedEnvelope validator', () => {
    it('should validate a valid compressed envelope message', () => {
      const validMessage = {
        schema_version: 1,
        message_type: 810,
        encoding: 'gzip',
        compressed_payload: 'H4sIAAAAAAAAA+3BMQEAAADCoPVPbQwfoAAAAAAAAAAAAAAAAAAAAIC3AYbSVKsAQAAA',
        original_size_bytes: 245,
      };

      const result = validators.compressedEnvelope(validMessage);
      expect(result.valid).toBe(true);
    });

    it('should reject compressed envelope with invalid encoding', () => {
      const invalidMessage = {
        schema_version: 1,
        message_type: 810,
        encoding: 'invalid', // Not a valid encoding
        compressed_payload: 'base64data',
        original_size_bytes: 100,
      };

      const result = validators.compressedEnvelope(invalidMessage);
      expect(result.valid).toBe(false);
    });
  });

  describe('meshMetrics validator', () => {
    it('should validate a valid mesh metrics message', () => {
      const validMessage = {
        schema_version: 1,
        message_type: 605,
        device_id: 'GW-MAIN',
        device_type: 'gateway',
        timestamp: '2025-10-23T20:30:00Z',
        firmware_version: 'GW 2.0.0',
        mesh_network_id: 'MESH-NET-001',
        metrics: {
          uptime_s: 172800,
          total_nodes: 12,
          active_nodes: 11,
          packets_sent: 125000,
          packets_received: 123500,
        },
      };

      const result = validators.meshMetrics(validMessage);
      expect(result.valid).toBe(true);
    });
  });

  describe('meshNodeList validator', () => {
    it('should validate a valid mesh node list message', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'gateway-001',
        device_type: 'gateway',
        timestamp: '2024-10-11T18:00:00Z',
        firmware_version: '2.1.0',
        nodes: [
          { node_id: '123456', status: 'online', last_seen: '2024-10-11T18:00:00Z', signal_strength: -45 },
          { node_id: '789012', status: 'online', last_seen: '2024-10-11T17:59:58Z', signal_strength: -62 },
        ],
        node_count: 2,
        mesh_id: 'AlteriomMesh',
      };

      const result = validators.meshNodeList(validMessage);
      expect(result.valid).toBe(true);
    });
  });

  describe('meshTopology validator', () => {
    it('should validate a valid mesh topology message', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'gateway-001',
        device_type: 'gateway',
        timestamp: '2024-10-11T18:00:00Z',
        firmware_version: '2.1.0',
        connections: [
          { from_node: '123456', to_node: 'gateway-001', link_quality: 0.95, latency_ms: 12, hop_count: 1 },
          { from_node: '789012', to_node: '123456', link_quality: 0.82, latency_ms: 25, hop_count: 2 },
        ],
        root_node: 'gateway-001',
        total_connections: 2,
      };

      const result = validators.meshTopology(validMessage);
      expect(result.valid).toBe(true);
    });
  });

  describe('meshAlert validator', () => {
    it('should validate a valid mesh alert message', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'gateway-001',
        device_type: 'gateway',
        timestamp: '2024-10-11T18:00:00Z',
        firmware_version: '2.1.0',
        alerts: [
          {
            alert_type: 'low_memory',
            severity: 'warning',
            message: 'Node 123456 has low free memory',
            node_id: '123456',
            metric_value: 15.2,
            threshold: 20.0,
            alert_id: 'alert-001',
          },
        ],
        alert_count: 1,
      };

      const result = validators.meshAlert(validMessage);
      expect(result.valid).toBe(true);
    });
  });

  describe('controlResponse validator', () => {
    it('should validate a valid control response message', () => {
      const validMessage = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        command_id: 'cmd-123',
        status: 'ok',
      };

      const result = validators.controlResponse(validMessage);
      expect(result.valid).toBe(true);
    });
  });
});
