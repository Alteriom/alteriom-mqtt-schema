import { describe, it, expect } from 'vitest';
import { classifyAndValidate } from '../../src/validators';

// Message type codes for testing (from validators.ts MESSAGE_TYPE_MAP)
const MessageTypeCodes = {
  SENSOR_DATA: 200,
  SENSOR_HEARTBEAT: 201,
  SENSOR_STATUS: 202,
  SENSOR_INFO: 203,
  SENSOR_METRICS: 204,
  GATEWAY_INFO: 300,
  GATEWAY_METRICS: 301,
  GATEWAY_DATA: 302,
  GATEWAY_HEARTBEAT: 303,
  GATEWAY_STATUS: 304,
  COMMAND: 400,
  COMMAND_RESPONSE: 401,
  FIRMWARE_STATUS: 500,
  MESH_NODE_LIST: 600,
  MESH_TOPOLOGY: 601,
  MESH_ALERT: 602,
  MESH_BRIDGE: 603,
  MESH_STATUS: 604,
  MESH_METRICS: 605,
  DEVICE_CONFIG: 700,
} as const;

// Helper to classify without validation
function classifyMessage(data: any): string | null {
  const { kind } = classifyAndValidate(data);
  return kind || null;
}

describe('Classification', () => {
  describe('Fast path with message_type', () => {
    it('should use fast path for sensor data with message_type 200', () => {
      const message = {
        schema_version: 1,
        message_type: 200,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
        },
      };

      const { kind, result } = classifyAndValidate(message);
      expect(kind).toBe('sensorData');
      expect(result.valid).toBe(true);
    });

    it('should use fast path for gateway metrics with message_type 306', () => {
      const message = {
        schema_version: 1,
        message_type: 306,
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        metrics: {
          uptime_s: 86400,
        },
      };

      const { kind, result } = classifyAndValidate(message);
      expect(kind).toBe('gatewayMetrics');
      expect(result.valid).toBe(true);
    });

    it('should translate legacy gateway metrics code 301 to 306', () => {
      const message = {
        schema_version: 1,
        message_type: 301, // Legacy code
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        metrics: {
          uptime_s: 86400,
        },
      };

      const { kind, result } = classifyAndValidate(message);
      expect(kind).toBe('gatewayMetrics');
      expect(result.valid).toBe(true);
    });

    it('should translate legacy gateway info code 300 to 305', () => {
      const message = {
        schema_version: 1,
        message_type: 300, // Legacy code
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        hardware_version: 'ESP32-S3',
        capabilities: {
          max_connections: 10,
        },
      };

      const { kind, result } = classifyAndValidate(message);
      expect(kind).toBe('gatewayInfo');
      expect(result.valid).toBe(true);
    });

    it('should use fast path for command with message_type 400', () => {
      const message = {
        schema_version: 1,
        message_type: 400,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'WEB 1.0.0',
        event: 'command',
        command: 'read_sensors',
        correlation_id: 'cmd-123',
      };

      const { kind, result } = classifyAndValidate(message);
      expect(kind).toBe('command');
      expect(result.valid).toBe(true);
    });

    it('should use fast path for firmware status with message_type 500', () => {
      const message = {
        schema_version: 1,
        message_type: 500,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: '2.0.0',
        status: 'downloading',
        progress_pct: 42,
      };

      const { kind, result } = classifyAndValidate(message);
      expect(kind).toBe('firmwareStatus');
      expect(result.valid).toBe(true);
    });

    it('should use fast path for mesh bridge with message_type 603', () => {
      const message = {
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

      const { kind, result } = classifyAndValidate(message);
      expect(kind).toBe('meshBridge');
      expect(result.valid).toBe(true);
    });

    it('should use fast path for device config with message_type 700', () => {
      const message = {
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

      const { kind, result } = classifyAndValidate(message);
      expect(kind).toBe('deviceConfig');
      expect(result.valid).toBe(true);
    });
  });

  describe('Heuristic classification (without message_type)', () => {
    it('should classify sensor data by sensors field', () => {
      const message = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
        },
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('sensorData');
    });

    it('should classify gateway metrics by metrics field', () => {
      const message = {
        schema_version: 1,
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        metrics: {
          uptime_s: 86400,
        },
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('gatewayMetrics');
    });

    it('should classify command by event field', () => {
      const message = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'WEB 1.0.0',
        event: 'command',
        command: 'read_sensors',
        correlation_id: 'cmd-123',
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('command');
    });

    it('should classify command response by event field', () => {
      const message = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        event: 'command_response',
        correlation_id: 'cmd-123',
        success: true,
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('commandResponse');
    });

    it('should classify mesh bridge by event field', () => {
      const message = {
        schema_version: 1,
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

      const kind = classifyMessage(message);
      expect(kind).toBe('meshBridge');
    });

    it('should classify device config by event field', () => {
      const message = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'WEB 1.0.0',
        event: 'config_snapshot',
        configuration: {
          sampling_interval_ms: 60000,
        },
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('deviceConfig');
    });

    it('should classify firmware status by progress_pct field', () => {
      const message = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: '2.0.0',
        status: 'downloading',
        progress_pct: 42,
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('firmwareStatus');
    });

    it('should classify mesh node list by nodes array', () => {
      const message = {
        schema_version: 1,
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        nodes: [
          { node_id: 123456, status: 'active' },
        ],
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('meshNodeList');
    });

    it('should classify mesh topology by connections array', () => {
      const message = {
        schema_version: 1,
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        connections: [
          { from_node: 123, to_node: 456 },
        ],
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('meshTopology');
    });

    it('should classify mesh alert by alerts array', () => {
      const message = {
        schema_version: 1,
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T22:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        alerts: [
          { severity: 'warning', message: 'Node offline' },
        ],
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('meshAlert');
    });

    it('should fallback to sensor heartbeat for minimal message', () => {
      const message = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T22:00:00.000Z',
      };

      const kind = classifyMessage(message);
      expect(kind).toBe('sensorHeartbeat');
    });
  });

  describe('MessageTypeCodes constants', () => {
    it('should have correct sensor type codes', () => {
      expect(MessageTypeCodes.SENSOR_DATA).toBe(200);
      expect(MessageTypeCodes.SENSOR_HEARTBEAT).toBe(201);
      expect(MessageTypeCodes.SENSOR_STATUS).toBe(202);
      expect(MessageTypeCodes.SENSOR_INFO).toBe(203);
      expect(MessageTypeCodes.SENSOR_METRICS).toBe(204);
    });

    it('should have correct gateway type codes', () => {
      expect(MessageTypeCodes.GATEWAY_INFO).toBe(300);
      expect(MessageTypeCodes.GATEWAY_METRICS).toBe(301);
      expect(MessageTypeCodes.GATEWAY_DATA).toBe(302);
      expect(MessageTypeCodes.GATEWAY_HEARTBEAT).toBe(303);
      expect(MessageTypeCodes.GATEWAY_STATUS).toBe(304);
    });

    it('should have correct control type codes', () => {
      expect(MessageTypeCodes.COMMAND).toBe(400);
      expect(MessageTypeCodes.COMMAND_RESPONSE).toBe(401);
    });

    it('should have correct firmware type code', () => {
      expect(MessageTypeCodes.FIRMWARE_STATUS).toBe(500);
    });

    it('should have correct mesh type codes', () => {
      expect(MessageTypeCodes.MESH_NODE_LIST).toBe(600);
      expect(MessageTypeCodes.MESH_TOPOLOGY).toBe(601);
      expect(MessageTypeCodes.MESH_ALERT).toBe(602);
      expect(MessageTypeCodes.MESH_BRIDGE).toBe(603);
      expect(MessageTypeCodes.MESH_STATUS).toBe(604);
      expect(MessageTypeCodes.MESH_METRICS).toBe(605);
    });

    it('should have correct config type code', () => {
      expect(MessageTypeCodes.DEVICE_CONFIG).toBe(700);
    });
  });

  describe('Edge cases', () => {
    it('should handle null message gracefully', () => {
      const kind = classifyMessage(null as any);
      expect(kind).toBe(null); // Returns null for invalid input
    });

    it('should handle empty object gracefully', () => {
      const kind = classifyMessage({});
      expect(kind).toBe('sensorHeartbeat'); // Fallback
    });

    it('should validate and catch invalid message with message_type', () => {
      const message = {
        schema_version: 1,
        message_type: 200,
        device_id: 'SN001',
        // Missing required fields for sensor data
      };

      const { kind, result } = classifyAndValidate(message);
      expect(kind).toBe('sensorData');
      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
    });
  });
});
