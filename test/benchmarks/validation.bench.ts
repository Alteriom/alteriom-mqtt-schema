import { Bench } from 'tinybench';
import { validators } from '../../src/validators';

const bench = new Bench({ time: 1000 });

// Sample valid messages for each validator type
const validSensorData = {
  schema_version: 1,
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'SN 2.1.0',
  sensors: {
    temperature: { value: 22.5, unit: 'C' },
    humidity: { value: 45.2, unit: '%' },
    pressure: { value: 1013.25, unit: 'hPa' },
  },
};

const validGatewayMetrics = {
  schema_version: 1,
  device_id: 'GW001',
  device_type: 'gateway',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'GW 1.0.0',
  metrics: {
    uptime_s: 86400,
    cpu_usage_pct: 15.3,
    memory_usage_pct: 45.2,
    connected_devices: 42,
  },
};

const validCommand = {
  schema_version: 1,
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'WEB 1.0.0',
  event: 'command',
  command: 'read_sensors',
  correlation_id: 'cmd-123',
  parameters: {
    sensors: ['temperature', 'humidity'],
  },
};

const validFirmwareStatus = {
  schema_version: 1,
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: '2.0.0',
  status: 'downloading',
  progress_pct: 42,
  download_size_bytes: 524288,
  bytes_downloaded: 220200,
};

const validMeshBridge = {
  schema_version: 1,
  message_type: 603,
  device_id: 'GW-MESH-01',
  device_type: 'gateway',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'GW 3.2.0',
  event: 'mesh_bridge',
  mesh_protocol: 'painlessMesh',
  mesh_message: {
    from_node_id: 123456789,
    to_node_id: 987654321,
    hop_count: 2,
  },
};

// Invalid messages (missing required fields)
const invalidSensorData = {
  schema_version: 1,
  device_id: 'SN001',
  // Missing required fields
};

// Benchmark: Individual validator performance
bench
  .add('validate: sensorData (valid)', () => {
    validators.sensorData(validSensorData);
  })
  .add('validate: sensorData (invalid)', () => {
    validators.sensorData(invalidSensorData);
  })
  .add('validate: gatewayMetrics (valid)', () => {
    validators.gatewayMetrics(validGatewayMetrics);
  })
  .add('validate: command (valid)', () => {
    validators.command(validCommand);
  })
  .add('validate: firmwareStatus (valid)', () => {
    validators.firmwareStatus(validFirmwareStatus);
  })
  .add('validate: meshBridge (valid)', () => {
    validators.meshBridge(validMeshBridge);
  });

async function run() {
  console.log('🏃 Running validation benchmarks...\n');
  await bench.run();

  console.table(
    bench.tasks.map((task) => ({
      'Task Name': task.name,
      'ops/sec': task.result?.hz?.toFixed(0) || 'N/A',
      'Average (ms)': task.result?.mean ? (task.result.mean * 1000).toFixed(3) : 'N/A',
      'Margin': task.result?.rme ? `±${task.result.rme.toFixed(2)}%` : 'N/A',
      Samples: task.result?.samples?.length || 0,
    }))
  );

  // Find fastest and slowest validators
  const results = bench.tasks
    .filter((t) => t.result?.hz)
    .sort((a, b) => (b.result?.hz || 0) - (a.result?.hz || 0));

  if (results.length > 0) {
    console.log(`\n⚡ Fastest: ${results[0].name} (${results[0].result?.hz?.toFixed(0)} ops/sec)`);
    console.log(
      `🐢 Slowest: ${results[results.length - 1].name} (${results[results.length - 1].result?.hz?.toFixed(0)} ops/sec)`
    );

    if (results.length > 1) {
      const ratio = (results[0].result?.hz || 0) / (results[results.length - 1].result?.hz || 1);
      console.log(`📊 Performance ratio: ${ratio.toFixed(2)}x`);
    }
  }
}

run().catch(console.error);
