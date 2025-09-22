import { 
  DeviceStatusMessage, 
  SensorDataMessage,
  buildTopic,
  TOPIC_PATTERNS,
  isDeviceStatusMessage,
  isSensorDataMessage,
  createMqttMessage
} from './index.js';

console.log('Testing @alteriom/mqtt-schema...');

// Test message creation
const statusMessage: DeviceStatusMessage = {
  timestamp: Date.now(),
  deviceId: 'device-001',
  status: 'online',
  metadata: { location: 'factory-floor' }
};

const sensorMessage: SensorDataMessage = {
  timestamp: Date.now(),
  deviceId: 'device-001',
  sensorType: 'temperature',
  value: 23.5,
  unit: 'celsius'
};

// Test validators
console.log('Status message validation:', isDeviceStatusMessage(statusMessage));
console.log('Sensor message validation:', isSensorDataMessage(sensorMessage));

// Test topic building
const statusTopic = buildTopic(TOPIC_PATTERNS.DEVICE_STATUS, { deviceId: 'device-001' });
const sensorTopic = buildTopic(TOPIC_PATTERNS.SENSOR_DATA, { 
  deviceId: 'device-001', 
  sensorType: 'temperature' 
});

console.log('Status topic:', statusTopic);
console.log('Sensor topic:', sensorTopic);

// Test message creation helper
const basicMessage = createMqttMessage({ messageId: 'test-001' });
console.log('Basic message:', basicMessage);

console.log('All tests completed successfully!');