# @alteriom/mqtt-schema

TypeScript schema definitions and utilities for Alteriom MQTT communication protocol.

## Installation

```bash
npm install @alteriom/mqtt-schema
```

## Usage

### Basic Message Types

```typescript
import { 
  DeviceStatusMessage, 
  SensorDataMessage, 
  CommandMessage, 
  EventMessage 
} from '@alteriom/mqtt-schema';

// Device status message
const statusMessage: DeviceStatusMessage = {
  timestamp: Date.now(),
  deviceId: 'device-001',
  status: 'online',
  metadata: { location: 'factory-floor' }
};

// Sensor data message
const sensorMessage: SensorDataMessage = {
  timestamp: Date.now(),
  deviceId: 'device-001',
  sensorType: 'temperature',
  value: 23.5,
  unit: 'celsius'
};
```

### Topic Patterns

```typescript
import { TOPIC_PATTERNS, buildTopic } from '@alteriom/mqtt-schema';

// Build device status topic
const statusTopic = buildTopic(TOPIC_PATTERNS.DEVICE_STATUS, { 
  deviceId: 'device-001' 
});
// Result: 'alteriom/devices/device-001/status'

// Build sensor data topic
const sensorTopic = buildTopic(TOPIC_PATTERNS.SENSOR_DATA, { 
  deviceId: 'device-001', 
  sensorType: 'temperature' 
});
// Result: 'alteriom/devices/device-001/sensors/temperature'
```

### Message Validation

```typescript
import { 
  isDeviceStatusMessage, 
  isSensorDataMessage,
  createMqttMessage 
} from '@alteriom/mqtt-schema';

// Validate incoming messages
if (isDeviceStatusMessage(message)) {
  console.log(`Device ${message.deviceId} is ${message.status}`);
}

// Create standardized messages
const message = createMqttMessage({ 
  messageId: 'msg-001' 
});
```

## API Reference

### Message Types

- `MqttMessage` - Base interface for all MQTT messages
- `DeviceStatusMessage` - Device online/offline status updates
- `SensorDataMessage` - Sensor readings and measurements
- `CommandMessage` - Commands sent to devices
- `EventMessage` - System and device events

### Topic Utilities

- `TOPIC_PATTERNS` - Predefined topic patterns for different message types
- `QOS_LEVELS` - Recommended QoS levels for different message types
- `buildTopic()` - Helper to construct topics from patterns
- `matchesTopic()` - Helper to validate topics against patterns

### Validators

- `isValidMqttMessage()` - Validates base message structure
- `isDeviceStatusMessage()` - Validates device status messages
- `isSensorDataMessage()` - Validates sensor data messages
- `isCommandMessage()` - Validates command messages
- `isEventMessage()` - Validates event messages
- `createMqttMessage()` - Creates standardized messages with timestamps

## License

MIT