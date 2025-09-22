import { 
  MqttMessage, 
  DeviceStatusMessage, 
  SensorDataMessage, 
  CommandMessage, 
  EventMessage,
  AlteriomMqttMessage 
} from './types.js';

/**
 * Validates if an object matches the base MQTT message structure
 */
export function isValidMqttMessage(obj: any): obj is MqttMessage {
  return obj && 
    typeof obj === 'object' && 
    typeof obj.timestamp === 'number' &&
    (obj.messageId === undefined || typeof obj.messageId === 'string') &&
    (obj.version === undefined || typeof obj.version === 'string');
}

/**
 * Validates if an object is a valid device status message
 */
export function isDeviceStatusMessage(obj: any): obj is DeviceStatusMessage {
  return isValidMqttMessage(obj) &&
    typeof (obj as any).deviceId === 'string' &&
    typeof (obj as any).status === 'string' &&
    ['online', 'offline', 'error'].includes((obj as any).status);
}

/**
 * Validates if an object is a valid sensor data message
 */
export function isSensorDataMessage(obj: any): obj is SensorDataMessage {
  return isValidMqttMessage(obj) &&
    typeof (obj as any).deviceId === 'string' &&
    typeof (obj as any).sensorType === 'string' &&
    (typeof (obj as any).value === 'number' || typeof (obj as any).value === 'string' || typeof (obj as any).value === 'boolean');
}

/**
 * Validates if an object is a valid command message
 */
export function isCommandMessage(obj: any): obj is CommandMessage {
  return isValidMqttMessage(obj) &&
    typeof (obj as any).deviceId === 'string' &&
    typeof (obj as any).command === 'string';
}

/**
 * Validates if an object is a valid event message
 */
export function isEventMessage(obj: any): obj is EventMessage {
  return isValidMqttMessage(obj) &&
    typeof (obj as any).deviceId === 'string' &&
    typeof (obj as any).eventType === 'string' &&
    typeof (obj as any).severity === 'string' &&
    ['info', 'warning', 'error', 'critical'].includes((obj as any).severity) &&
    typeof (obj as any).description === 'string';
}

/**
 * Creates a standardized MQTT message with timestamp
 */
export function createMqttMessage(partial: Omit<MqttMessage, 'timestamp'>): MqttMessage {
  return {
    timestamp: Date.now(),
    ...partial
  };
}