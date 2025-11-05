import { Bench } from 'tinybench';
import { classifyAndValidate } from '../../src/validators';

const bench = new Bench({ time: 1000 });

// Sample messages for benchmarking
const sensorDataWithType = {
  schema_version: 1,
  message_type: 200,
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'SN 2.1.0',
  sensors: {
    temperature: { value: 22.5, unit: 'C' },
    humidity: { value: 45.2, unit: '%' },
  },
};

const sensorDataWithoutType = {
  schema_version: 1,
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'SN 2.1.0',
  sensors: {
    temperature: { value: 22.5, unit: 'C' },
    humidity: { value: 45.2, unit: '%' },
  },
};

const gatewayMetricsWithType = {
  schema_version: 1,
  message_type: 301,
  device_id: 'GW001',
  device_type: 'gateway',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'GW 1.0.0',
  metrics: {
    uptime_s: 86400,
    cpu_usage_pct: 15.3,
    memory_usage_pct: 45.2,
  },
};

const gatewayMetricsWithoutType = {
  schema_version: 1,
  device_id: 'GW001',
  device_type: 'gateway',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'GW 1.0.0',
  metrics: {
    uptime_s: 86400,
    cpu_usage_pct: 15.3,
    memory_usage_pct: 45.2,
  },
};

const commandWithType = {
  schema_version: 1,
  message_type: 400,
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'WEB 1.0.0',
  event: 'command',
  command: 'read_sensors',
  correlation_id: 'cmd-123',
};

const commandWithoutType = {
  schema_version: 1,
  device_id: 'SN001',
  device_type: 'sensor',
  timestamp: '2025-11-04T23:00:00.000Z',
  firmware_version: 'WEB 1.0.0',
  event: 'command',
  command: 'read_sensors',
  correlation_id: 'cmd-123',
};

// Benchmark: Fast path classification (with message_type)
bench
  .add('classify + validate: sensorData with message_type (fast path)', () => {
    classifyAndValidate(sensorDataWithType);
  })
  .add('classify + validate: sensorData without message_type (heuristic)', () => {
    classifyAndValidate(sensorDataWithoutType);
  })
  .add('classify + validate: gatewayMetrics with message_type (fast path)', () => {
    classifyAndValidate(gatewayMetricsWithType);
  })
  .add('classify + validate: gatewayMetrics without message_type (heuristic)', () => {
    classifyAndValidate(gatewayMetricsWithoutType);
  })
  .add('classify + validate: command with message_type (fast path)', () => {
    classifyAndValidate(commandWithType);
  })
  .add('classify + validate: command without message_type (heuristic)', () => {
    classifyAndValidate(commandWithoutType);
  });

async function run() {
  console.log('🏃 Running classification benchmarks...\n');
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

  // Calculate speedup of fast path vs heuristic
  const fastPathTask = bench.tasks.find((t) =>
    t.name.includes('sensorData with message_type')
  );
  const heuristicTask = bench.tasks.find((t) =>
    t.name.includes('sensorData without message_type')
  );

  if (fastPathTask?.result?.hz && heuristicTask?.result?.hz) {
    const speedup = ((fastPathTask.result.hz / heuristicTask.result.hz) * 100 - 100).toFixed(1);
    console.log(
      `\n📊 Fast path is ${speedup}% ${speedup > 0 ? 'faster' : 'slower'} than heuristic classification`
    );
  }
}

run().catch(console.error);
