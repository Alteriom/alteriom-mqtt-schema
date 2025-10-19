#!/usr/bin/env node
/**
 * Enhanced Schema Features Validation Test
 * 
 * Tests new v0.6.0 features:
 * - Location and environment metadata
 * - Enhanced sensor metadata (accuracy, calibration, operational range)
 * - Enhanced gateway metrics (storage, network, errors)
 */

const { validators, classifyAndValidate } = require('../dist/cjs/index.js');

console.log('🧪 Testing Enhanced Schema Features (v0.6.0)\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(`   ${err.message}`);
    failed++;
  }
}

// Test 1: Location metadata in sensor data
test('Sensor data with full location metadata', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-001',
    device_type: 'sensor',
    timestamp: new Date().toISOString(),
    firmware_version: 'TEST 1.0.0',
    location: {
      latitude: 43.6532,
      longitude: -79.3832,
      altitude: 76.5,
      accuracy_m: 10.0,
      zone: 'warehouse_A',
      description: 'Shelf 3, Row B'
    },
    sensors: {
      temperature: { value: 22.3, unit: 'C' }
    }
  };
  
  const result = validators.sensorData(payload);
  if (!result.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 2: Environment metadata
test('Sensor data with environment metadata', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-002',
    device_type: 'sensor',
    timestamp: new Date().toISOString(),
    firmware_version: 'TEST 1.0.0',
    environment: {
      deployment_type: 'indoor',
      power_source: 'battery',
      expected_battery_life_days: 365
    },
    sensors: {
      humidity: { value: 50, unit: '%' }
    }
  };
  
  const result = validators.sensorData(payload);
  if (!result.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 3: Enhanced sensor metadata
test('Sensor with accuracy and calibration metadata', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-003',
    device_type: 'sensor',
    timestamp: new Date().toISOString(),
    firmware_version: 'TEST 1.0.0',
    sensors: {
      temperature: {
        value: 22.3,
        unit: 'C',
        timestamp: new Date(Date.now() - 1000).toISOString(),
        accuracy: 0.5,
        last_calibration: '2025-01-15',
        error_margin_pct: 2.0,
        operational_range: { min: -40, max: 85 },
        quality_score: 0.95
      }
    }
  };
  
  const result = validators.sensorData(payload);
  if (!result.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 4: Enhanced gateway metrics - storage
test('Gateway metrics with storage information', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-GW-001',
    device_type: 'gateway',
    timestamp: new Date().toISOString(),
    firmware_version: 'GW 1.0.0',
    metrics: {
      uptime_s: 86400,
      storage_usage_pct: 45.2,
      storage_total_mb: 512,
      storage_free_mb: 280.5
    }
  };
  
  const result = validators.gatewayMetrics(payload);
  if (!result.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 5: Enhanced gateway metrics - network
test('Gateway metrics with network bandwidth tracking', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-GW-002',
    device_type: 'gateway',
    timestamp: new Date().toISOString(),
    firmware_version: 'GW 1.0.0',
    metrics: {
      uptime_s: 3600,
      network_rx_kbps: 125.4,
      network_tx_kbps: 89.3,
      active_connections: 5
    }
  };
  
  const result = validators.gatewayMetrics(payload);
  if (!result.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 6: Enhanced gateway metrics - errors and restarts
test('Gateway metrics with error tracking and restart info', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-GW-003',
    device_type: 'gateway',
    timestamp: new Date().toISOString(),
    firmware_version: 'GW 1.0.0',
    metrics: {
      uptime_s: 7200,
      error_count_24h: 3,
      warning_count_24h: 12,
      restart_count: 2,
      last_restart_reason: 'firmware_update'
    }
  };
  
  const result = validators.gatewayMetrics(payload);
  if (!result.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 7: Combined enhanced features
test('Sensor with all enhanced features combined', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-004',
    device_type: 'sensor',
    timestamp: new Date().toISOString(),
    firmware_version: 'TEST 1.0.0',
    location: {
      latitude: 40.7128,
      longitude: -74.0060,
      zone: 'datacenter_1'
    },
    environment: {
      deployment_type: 'indoor',
      power_source: 'mains'
    },
    sensors: {
      temperature: {
        value: 21.5,
        unit: 'C',
        timestamp: new Date().toISOString(),
        accuracy: 0.3,
        last_calibration: '2025-10-01',
        operational_range: { min: -20, max: 60 }
      },
      humidity: {
        value: 50,
        unit: '%',
        accuracy: 2.0
      }
    },
    battery_level: 85,
    signal_strength: -65
  };
  
  const result = validators.sensorData(payload);
  if (!result.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 8: Backward compatibility - old format still works
test('Backward compatibility: old sensor data format still valid', () => {
  const payload = {
    schema_version: 1,
    device_id: 'OLD-001',
    device_type: 'sensor',
    timestamp: new Date().toISOString(),
    firmware_version: 'OLD 1.0.0',
    sensors: {
      temperature: { value: 22.3, unit: 'C' },
      humidity: { value: 44, unit: '%' }
    },
    battery_level: 78
  };
  
  const result = validators.sensorData(payload);
  if (!result.valid) {
    throw new Error(`Old format should still be valid: ${JSON.stringify(result.errors)}`);
  }
});

// Test 9: Classification with enhanced data
test('Classification works with enhanced sensor data', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-005',
    device_type: 'sensor',
    timestamp: new Date().toISOString(),
    firmware_version: 'TEST 1.0.0',
    location: { latitude: 51.5074, longitude: -0.1278 },
    sensors: {
      temperature: {
        value: 20.0,
        unit: 'C',
        accuracy: 0.5
      }
    }
  };
  
  const { kind, result } = classifyAndValidate(payload);
  if (kind !== 'sensorData') {
    throw new Error(`Expected sensorData, got ${kind}`);
  }
  if (!result.valid) {
    throw new Error(`Classification validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Test 10: Invalid location coordinates should fail
test('Invalid location coordinates are rejected', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-006',
    device_type: 'sensor',
    timestamp: new Date().toISOString(),
    firmware_version: 'TEST 1.0.0',
    location: {
      latitude: 91, // Invalid: > 90
      longitude: -79.3832
    },
    sensors: {
      temperature: { value: 22.3, unit: 'C' }
    }
  };
  
  const result = validators.sensorData(payload);
  if (result.valid) {
    throw new Error('Invalid latitude should be rejected');
  }
});

// Test 11: Invalid operational range format should fail
test('Invalid operational range is rejected', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-007',
    device_type: 'sensor',
    timestamp: new Date().toISOString(),
    firmware_version: 'TEST 1.0.0',
    sensors: {
      temperature: {
        value: 22.3,
        unit: 'C',
        operational_range: { min: -40 } // Missing 'max'
      }
    }
  };
  
  const result = validators.sensorData(payload);
  if (result.valid) {
    throw new Error('Incomplete operational range should be rejected');
  }
});

// Test 12: Gateway metrics with all enhanced fields
test('Gateway metrics with comprehensive enhanced metrics', () => {
  const payload = {
    schema_version: 1,
    device_id: 'TEST-GW-004',
    device_type: 'gateway',
    timestamp: new Date().toISOString(),
    firmware_version: 'GW 1.0.0',
    location: {
      zone: 'server_room_1',
      description: 'Main Gateway'
    },
    metrics: {
      uptime_s: 172800,
      cpu_usage_pct: 25.5,
      memory_usage_pct: 60.2,
      temperature_c: 42.0,
      storage_usage_pct: 35.8,
      storage_total_mb: 1024,
      storage_free_mb: 658,
      network_rx_kbps: 256.7,
      network_tx_kbps: 189.4,
      active_connections: 8,
      error_count_24h: 1,
      warning_count_24h: 5,
      restart_count: 0,
      connected_devices: 15,
      mesh_nodes: 10
    }
  };
  
  const result = validators.gatewayMetrics(payload);
  if (!result.valid) {
    throw new Error(`Validation failed: ${JSON.stringify(result.errors)}`);
  }
});

// Print results
console.log('\n' + '='.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n🎉 All enhanced feature tests passed!\n');
  process.exit(0);
}
