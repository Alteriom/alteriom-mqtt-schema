/**
 * HTTP Transport Integration Tests
 * 
 * Tests demonstrate and validate HTTP transport metadata functionality
 * introduced in v0.8.0 for REST API integration.
 */

import { describe, it, expect } from 'vitest';
import { 
  validators, 
  classifyAndValidate,
  MessageTypeCodes,
  type SensorDataMessage,
  type DeviceDataMessage,
  type CommandMessage,
  type CommandResponseMessage
} from '../../src/index.js';

describe('HTTP Transport Integration', () => {
  
  describe('MQTT-to-HTTP Bridge Scenarios', () => {
    it('should preserve MQTT context when bridging to HTTP', () => {
      // Scenario: Device sends via MQTT, gateway forwards to HTTP API
      const mqttPayload = {
        schema_version: 1,
        message_type: MessageTypeCodes.SENSOR_DATA,
        device_id: 'SN001',
        device_type: 'sensor' as const,
        timestamp: new Date().toISOString(),
        firmware_version: 'SN 2.1.5',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
          humidity: { value: 55, unit: '%' }
        }
      };
      
      // Gateway adds transport metadata for HTTP delivery
      const httpPayload = {
        ...mqttPayload,
        transport_metadata: {
          protocol: 'https' as const,
          correlation_id: `mqtt-bridge-${Date.now()}`,
          
          // Preserve original MQTT context
          mqtt: {
            topic: 'alteriom/nodes/SN001/data',
            qos: 1 as const,
            retained: false,
            message_id: 12345
          },
          
          // HTTP delivery target
          http: {
            method: 'POST' as const,
            path: '/api/v1/devices/SN001/telemetry',
            status_code: 201,
            request_id: 'uuid-12345-67890'
          }
        }
      };
      
      // Validate bridged message
      const { kind, result } = classifyAndValidate(httpPayload);
      expect(result.valid).toBe(true);
      expect(kind).toBe('sensorData');
      
      // Verify transport metadata structure
      expect(httpPayload.transport_metadata.protocol).toBe('https');
      expect(httpPayload.transport_metadata.mqtt?.topic).toBe('alteriom/nodes/SN001/data');
      expect(httpPayload.transport_metadata.http?.status_code).toBe(201);
    });
    
    it('should validate batch HTTP upload from MQTT messages', () => {
      // Scenario: Gateway buffers MQTT messages and sends as HTTP batch
      const messages = [
        {
          schema_version: 1,
          message_type: MessageTypeCodes.SENSOR_DATA,
          device_id: 'SN001',
          device_type: 'sensor' as const,
          timestamp: new Date().toISOString(),
          firmware_version: 'SN 2.1.5',
          sensors: { temperature: { value: 22.5, unit: 'C' } }
        },
        {
          schema_version: 1,
          message_type: MessageTypeCodes.SENSOR_DATA,
          device_id: 'SN002',
          device_type: 'sensor' as const,
          timestamp: new Date().toISOString(),
          firmware_version: 'SN 2.1.5',
          sensors: { humidity: { value: 55, unit: '%' } }
        }
      ];
      
      const batchPayload = {
        schema_version: 1,
        message_type: MessageTypeCodes.BATCH_ENVELOPE,
        batch_id: `batch-${Date.now()}`,
        batch_size: messages.length,
        batch_timestamp: new Date().toISOString(),
        compression: 'none' as const,
        messages: messages,
        transport_metadata: {
          protocol: 'https' as const,
          http: {
            method: 'POST' as const,
            path: '/api/v1/telemetry/batch',
            status_code: 201
          }
        }
      };
      
      const result = validators.batchEnvelope(batchPayload);
      expect(result.valid).toBe(true);
    });
  });
  
  describe('HTTP-to-MQTT Bridge Scenarios', () => {
    it('should validate command sent via HTTP for MQTT delivery', () => {
      // Scenario: Web dashboard sends command via HTTP, gateway forwards via MQTT
      const httpCommand: CommandMessage = {
        schema_version: 1,
        message_type: MessageTypeCodes.COMMAND,
        device_id: 'SN001',
        device_type: 'sensor' as const,
        timestamp: new Date().toISOString(),
        firmware_version: 'WEB 1.0.0',
        event: 'command',
        command: 'read_sensors',
        correlation_id: `http-cmd-${Date.now()}`,
        parameters: {
          immediate: true,
          sensors: ['temperature', 'humidity']
        },
        priority: 'high',
        
        // Transport metadata for HTTP→MQTT bridge
        transport_metadata: {
          protocol: 'https' as const,
          correlation_id: `http-${Date.now()}`,
          
          // Original HTTP request
          http: {
            method: 'POST' as const,
            path: '/api/v1/devices/SN001/commands',
            request_id: 'req-uuid-12345'
          },
          
          // Target MQTT delivery
          mqtt: {
            topic: 'alteriom/nodes/SN001/commands',
            qos: 1 as const,
            retained: false
          }
        }
      };
      
      const result = validators.command(httpCommand);
      expect(result.valid).toBe(true);
      expect(httpCommand.transport_metadata?.protocol).toBe('https');
      expect(httpCommand.transport_metadata?.mqtt?.topic).toBe('alteriom/nodes/SN001/commands');
    });
    
    it('should track correlation across HTTP request and MQTT response', () => {
      const correlationId = `corr-${Date.now()}-12345`;
      
      // HTTP command request
      const command: CommandMessage = {
        schema_version: 1,
        message_type: MessageTypeCodes.COMMAND,
        device_id: 'SN001',
        device_type: 'sensor' as const,
        timestamp: new Date().toISOString(),
        firmware_version: 'WEB 1.0.0',
        event: 'command',
        command: 'read_sensors',
        correlation_id: correlationId,
        transport_metadata: {
          protocol: 'https' as const,
          correlation_id: correlationId
        }
      };
      
      // MQTT response from device
      const response: CommandResponseMessage = {
        schema_version: 1,
        message_type: MessageTypeCodes.COMMAND_RESPONSE,
        device_id: 'SN001',
        device_type: 'sensor' as const,
        timestamp: new Date().toISOString(),
        firmware_version: 'SN 2.1.5',
        event: 'command_response',
        command: 'read_sensors',
        correlation_id: correlationId,
        success: true,
        latency_ms: 150,
        result: {
          temperature: 22.5,
          humidity: 55
        },
        transport_metadata: {
          protocol: 'mqtt' as const,
          mqtt: {
            topic: 'alteriom/nodes/SN001/responses',
            qos: 1 as const,
            retained: false
          }
        }
      };
      
      // Validate both messages
      expect(validators.command(command).valid).toBe(true);
      expect(validators.commandResponse(response).valid).toBe(true);
      
      // Verify correlation IDs match
      expect(command.correlation_id).toBe(response.correlation_id);
      expect(command.transport_metadata?.correlation_id).toBe(correlationId);
    });
  });
  
  describe('Pure HTTP Scenarios (No MQTT)', () => {
    it('should validate device data sent purely via HTTP', () => {
      // Scenario: Device has direct HTTP connectivity, no MQTT involved
      const httpOnlyPayload: DeviceDataMessage = {
        schema_version: 1,
        message_type: MessageTypeCodes.DEVICE_DATA,
        device_id: 'HTTP-SN-001',
        device_type: 'sensor' as const,
        device_role: 'sensor',
        timestamp: new Date().toISOString(),
        firmware_version: 'HTTP 2.0.0',
        sensors: {
          temperature: { value: 24.3, unit: 'C' },
          humidity: { value: 58, unit: '%' }
        },
        battery_level: 85,
        signal_strength: -45,
        
        transport_metadata: {
          protocol: 'https' as const,
          correlation_id: `http-direct-${Date.now()}`,
          
          http: {
            method: 'POST' as const,
            path: '/api/v1/devices/HTTP-SN-001/telemetry',
            status_code: 201,
            request_id: 'uuid-67890',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'AlteriomDevice/2.0'
            }
          }
        }
      };
      
      const { kind, result } = classifyAndValidate(httpOnlyPayload);
      expect(result.valid).toBe(true);
      expect(kind).toBe('deviceData');
      expect(httpOnlyPayload.transport_metadata?.protocol).toBe('https');
    });
    
    it('should validate configuration update via HTTP REST API', () => {
      const configUpdate = {
        schema_version: 1,
        message_type: MessageTypeCodes.DEVICE_CONFIG,
        device_id: 'SN001',
        device_type: 'sensor' as const,
        timestamp: new Date().toISOString(),
        firmware_version: 'WEB 1.0.0',
        event: 'config_update',
        configuration: {
          sampling_interval_ms: 60000,
          power_mode: 'low_power' as const,
          ota_config: {
            auto_update: true,
            update_channel: 'stable' as const,
            update_check_interval_h: 24
          }
        },
        modified_by: 'admin@example.com',
        
        transport_metadata: {
          protocol: 'https' as const,
          http: {
            method: 'PUT' as const,
            path: '/api/v1/devices/SN001/config',
            status_code: 200,
            request_id: 'config-update-123'
          }
        }
      };
      
      const result = validators.deviceConfig(configUpdate);
      expect(result.valid).toBe(true);
    });
  });
  
  describe('Hybrid MQTT + HTTP Scenarios', () => {
    it('should support message with both MQTT and HTTP transport history', () => {
      // Scenario: Device sends via MQTT, gateway bridges to HTTP, 
      // then another service re-processes
      const hybridPayload = {
        schema_version: 1,
        message_type: MessageTypeCodes.SENSOR_DATA,
        device_id: 'SN001',
        device_type: 'sensor' as const,
        timestamp: new Date().toISOString(),
        firmware_version: 'SN 2.1.5',
        sensors: {
          temperature: { value: 22.5, unit: 'C' }
        },
        
        transport_metadata: {
          protocol: 'https' as const,
          correlation_id: 'hybrid-flow-12345',
          
          // Original MQTT delivery
          mqtt: {
            topic: 'alteriom/nodes/SN001/data',
            qos: 1 as const,
            retained: false,
            message_id: 54321
          },
          
          // Subsequent HTTP delivery
          http: {
            method: 'POST' as const,
            path: '/api/v1/telemetry',
            status_code: 201,
            request_id: 'hybrid-req-123'
          }
        }
      };
      
      const { kind, result } = classifyAndValidate(hybridPayload);
      expect(result.valid).toBe(true);
      expect(kind).toBe('sensorData');
      
      // Verify both transport contexts preserved
      expect(hybridPayload.transport_metadata.mqtt).toBeDefined();
      expect(hybridPayload.transport_metadata.http).toBeDefined();
    });
  });
  
  describe('HTTP Header Sanitization', () => {
    it('should allow headers in transport_metadata', () => {
      const payload = {
        schema_version: 1,
        message_type: MessageTypeCodes.SENSOR_DATA,
        device_id: 'SN001',
        device_type: 'sensor' as const,
        timestamp: new Date().toISOString(),
        firmware_version: 'SN 2.1.5',
        sensors: {
          temperature: { value: 22.5, unit: 'C' }
        },
        
        transport_metadata: {
          protocol: 'https' as const,
          http: {
            method: 'POST' as const,
            path: '/api/v1/telemetry',
            status_code: 201,
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'AlteriomDevice/2.0',
              'X-Device-Auth': 'Bearer ...'  // Should be sanitized before storage
            }
          }
        }
      };
      
      const result = validators.sensorData(payload);
      expect(result.valid).toBe(true);
      
      // Note: Schema validation allows headers, but application layer
      // should sanitize auth tokens before storage
    });
  });
  
  describe('Protocol-Specific Validation', () => {
    it('should validate HTTP method enum', () => {
      const validMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      
      for (const method of validMethods) {
        const payload = {
          schema_version: 1,
          device_id: 'SN001',
          device_type: 'sensor' as const,
          timestamp: new Date().toISOString(),
          firmware_version: 'SN 2.1.5',
          sensors: { temperature: { value: 22.5, unit: 'C' } },
          transport_metadata: {
            protocol: 'https' as const,
            http: {
              method: method as any,
              path: '/api/v1/telemetry',
              status_code: 200
            }
          }
        };
        
        const result = validators.sensorData(payload);
        expect(result.valid).toBe(true);
      }
    });
    
    it('should reject invalid HTTP method', () => {
      const payload = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor' as const,
        timestamp: new Date().toISOString(),
        firmware_version: 'SN 2.1.5',
        sensors: { temperature: { value: 22.5, unit: 'C' } },
        transport_metadata: {
          protocol: 'https' as const,
          http: {
            method: 'INVALID' as any,
            path: '/api/v1/telemetry',
            status_code: 200
          }
        }
      };
      
      const result = validators.sensorData(payload);
      expect(result.valid).toBe(false);
    });
    
    it('should validate HTTP status code range', () => {
      const validCodes = [200, 201, 400, 404, 500];
      
      for (const code of validCodes) {
        const payload = {
          schema_version: 1,
          device_id: 'SN001',
          device_type: 'sensor' as const,
          timestamp: new Date().toISOString(),
          firmware_version: 'SN 2.1.5',
          sensors: { temperature: { value: 22.5, unit: 'C' } },
          transport_metadata: {
            protocol: 'https' as const,
            http: {
              method: 'POST' as const,
              path: '/api/v1/telemetry',
              status_code: code
            }
          }
        };
        
        const result = validators.sensorData(payload);
        expect(result.valid).toBe(true);
      }
    });
    
    it('should validate MQTT QoS enum', () => {
      const validQoS = [0, 1, 2];
      
      for (const qos of validQoS) {
        const payload = {
          schema_version: 1,
          device_id: 'SN001',
          device_type: 'sensor' as const,
          timestamp: new Date().toISOString(),
          firmware_version: 'SN 2.1.5',
          sensors: { temperature: { value: 22.5, unit: 'C' } },
          transport_metadata: {
            protocol: 'mqtt' as const,
            mqtt: {
              topic: 'alteriom/nodes/SN001/data',
              qos: qos as any,
              retained: false
            }
          }
        };
        
        const result = validators.sensorData(payload);
        expect(result.valid).toBe(true);
      }
    });
  });
  
  describe('Backward Compatibility', () => {
    it('should validate messages without transport_metadata (legacy)', () => {
      // Existing MQTT-only messages should continue to work
      const legacyPayload = {
        schema_version: 1,
        message_type: MessageTypeCodes.SENSOR_DATA,
        device_id: 'SN001',
        device_type: 'sensor' as const,
        timestamp: new Date().toISOString(),
        firmware_version: 'SN 2.1.5',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
          humidity: { value: 55, unit: '%' }
        },
        battery_level: 85
        // No transport_metadata - should still validate
      };
      
      const { kind, result } = classifyAndValidate(legacyPayload);
      expect(result.valid).toBe(true);
      expect(kind).toBe('sensorData');
    });
  });
});
