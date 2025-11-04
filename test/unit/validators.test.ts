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
});
