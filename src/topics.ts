/**
 * Topic patterns for Alteriom MQTT communication
 */
export const TOPIC_PATTERNS = {
  // Device status topics
  DEVICE_STATUS: 'alteriom/devices/{deviceId}/status',
  DEVICE_HEARTBEAT: 'alteriom/devices/{deviceId}/heartbeat',
  
  // Sensor data topics
  SENSOR_DATA: 'alteriom/devices/{deviceId}/sensors/{sensorType}',
  SENSOR_BULK: 'alteriom/devices/{deviceId}/sensors/bulk',
  
  // Command topics
  COMMAND_REQUEST: 'alteriom/devices/{deviceId}/commands/request',
  COMMAND_RESPONSE: 'alteriom/devices/{deviceId}/commands/response',
  
  // Event topics
  DEVICE_EVENTS: 'alteriom/devices/{deviceId}/events',
  SYSTEM_EVENTS: 'alteriom/system/events',
  
  // Configuration topics
  DEVICE_CONFIG: 'alteriom/devices/{deviceId}/config',
  FIRMWARE_UPDATE: 'alteriom/devices/{deviceId}/firmware'
} as const;

/**
 * QoS levels for different message types
 */
export const QOS_LEVELS = {
  SENSOR_DATA: 0,        // At most once - sensor data can be lossy
  DEVICE_STATUS: 1,      // At least once - status updates are important
  COMMANDS: 2,           // Exactly once - commands must be delivered
  EVENTS: 1,             // At least once - events should be delivered
  CONFIG: 2              // Exactly once - configuration changes are critical
} as const;

/**
 * Helper function to build topic string from pattern
 */
export function buildTopic(pattern: string, variables: Record<string, string>): string {
  let topic = pattern;
  for (const [key, value] of Object.entries(variables)) {
    topic = topic.replace(`{${key}}`, value);
  }
  return topic;
}

/**
 * Helper function to validate topic matches pattern
 */
export function matchesTopic(topic: string, pattern: string): boolean {
  const regexPattern = pattern.replace(/\{[^}]+\}/g, '[^/]+');
  const regex = new RegExp(`^${regexPattern}$`);
  return regex.test(topic);
}