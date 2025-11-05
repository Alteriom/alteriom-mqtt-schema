import { describe, it, expect } from 'vitest';

describe('Dual Build Integration', () => {
  describe('CJS Export', () => {
    it('should export validators from CJS build', async () => {
      const cjs = await import('../../dist/cjs/index.js');
      
      expect(cjs.validators).toBeDefined();
      expect(typeof cjs.validators.sensorData).toBe('function');
      expect(typeof cjs.validators.gatewayMetrics).toBe('function');
      expect(typeof cjs.classifyAndValidate).toBe('function');
    });

    it('should validate messages in CJS build', async () => {
      const cjs = await import('../../dist/cjs/index.js');
      
      const message = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T23:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
        },
      };

      const result = cjs.validators.sensorData(message);
      expect(result.valid).toBe(true);
    });

    it('should classify and validate in CJS build', async () => {
      const cjs = await import('../../dist/cjs/index.js');
      
      const message = {
        schema_version: 1,
        message_type: 200,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T23:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
        },
      };

      const { kind, result } = cjs.classifyAndValidate(message);
      expect(kind).toBe('sensorData');
      expect(result.valid).toBe(true);
    });
  });

  describe('ESM Export', () => {
    it('should export validators from ESM build', async () => {
      const esm = await import('../../dist/esm/index.js');
      
      expect(esm.validators).toBeDefined();
      expect(typeof esm.validators.sensorData).toBe('function');
      expect(typeof esm.validators.gatewayMetrics).toBe('function');
      expect(typeof esm.classifyAndValidate).toBe('function');
    });

    it('should validate messages in ESM build', async () => {
      const esm = await import('../../dist/esm/index.js');
      
      const message = {
        schema_version: 1,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T23:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
        },
      };

      const result = esm.validators.sensorData(message);
      expect(result.valid).toBe(true);
    });

    it('should classify and validate in ESM build', async () => {
      const esm = await import('../../dist/esm/index.js');
      
      const message = {
        schema_version: 1,
        message_type: 200,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T23:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
        },
      };

      const { kind, result } = esm.classifyAndValidate(message);
      expect(kind).toBe('sensorData');
      expect(result.valid).toBe(true);
    });
  });

  describe('CJS vs ESM Parity', () => {
    it('should produce identical validation results', async () => {
      const cjs = await import('../../dist/cjs/index.js');
      const esm = await import('../../dist/esm/index.js');
      
      const message = {
        schema_version: 1,
        message_type: 200,
        device_id: 'SN001',
        device_type: 'sensor',
        timestamp: '2025-11-04T23:00:00.000Z',
        firmware_version: 'SN 2.1.0',
        sensors: {
          temperature: { value: 22.5, unit: 'C' },
        },
      };

      const cjsResult = cjs.validators.sensorData(message);
      const esmResult = esm.validators.sensorData(message);
      
      expect(cjsResult).toEqual(esmResult);
    });

    it('should produce identical classification results', async () => {
      const cjs = await import('../../dist/cjs/index.js');
      const esm = await import('../../dist/esm/index.js');
      
      const message = {
        schema_version: 1,
        message_type: 301,
        device_id: 'GW001',
        device_type: 'gateway',
        timestamp: '2025-11-04T23:00:00.000Z',
        firmware_version: 'GW 1.0.0',
        metrics: {
          uptime_s: 86400,
        },
      };

      const cjsClassified = cjs.classifyAndValidate(message);
      const esmClassified = esm.classifyAndValidate(message);
      
      expect(cjsClassified.kind).toBe(esmClassified.kind);
      expect(cjsClassified.result).toEqual(esmClassified.result);
    });

    it('should export the same API surface', async () => {
      const cjs = await import('../../dist/cjs/index.js');
      const esm = await import('../../dist/esm/index.js');
      
      const cjsKeys = Object.keys(cjs).sort();
      const esmKeys = Object.keys(esm).sort();
      
      expect(cjsKeys).toEqual(esmKeys);
    });

    it('should have identical validator keys', async () => {
      const cjs = await import('../../dist/cjs/index.js');
      const esm = await import('../../dist/esm/index.js');
      
      const cjsValidatorKeys = Object.keys(cjs.validators).sort();
      const esmValidatorKeys = Object.keys(esm.validators).sort();
      
      expect(cjsValidatorKeys).toEqual(esmValidatorKeys);
    });
  });

  describe('Type exports', () => {
    it('should export TypeScript types', async () => {
      const types = await import('../../dist/cjs/types.js');
      
      // Check that type guards are exported
      expect(typeof types.isSensorDataMessage).toBe('function');
      expect(typeof types.isGatewayMetricsMessage).toBe('function');
    });

    it('should export MessageTypeCodes', async () => {
      const types = await import('../../dist/cjs/types.js');
      
      expect(types.MessageTypeCodes).toBeDefined();
      expect(types.MessageTypeCodes.SENSOR_DATA).toBe(200);
      expect(types.MessageTypeCodes.GATEWAY_METRICS).toBe(301);
    });
  });
});
