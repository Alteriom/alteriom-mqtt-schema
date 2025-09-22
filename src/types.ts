/**
 * Base MQTT message interface
 */
export interface MqttMessage {
  timestamp: number;
  messageId?: string;
  version?: string;
}

/**
 * Device status message
 */
export interface DeviceStatusMessage extends MqttMessage {
  deviceId: string;
  status: 'online' | 'offline' | 'error';
  metadata?: Record<string, any>;
}

/**
 * Sensor data message
 */
export interface SensorDataMessage extends MqttMessage {
  deviceId: string;
  sensorType: string;
  value: number | string | boolean;
  unit?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * Command message
 */
export interface CommandMessage extends MqttMessage {
  deviceId: string;
  command: string;
  parameters?: Record<string, any>;
  responseRequired?: boolean;
}

/**
 * Event message
 */
export interface EventMessage extends MqttMessage {
  deviceId: string;
  eventType: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  description: string;
  data?: Record<string, any>;
}

/**
 * Union type for all message types
 */
export type AlteriomMqttMessage = 
  | DeviceStatusMessage 
  | SensorDataMessage 
  | CommandMessage 
  | EventMessage;