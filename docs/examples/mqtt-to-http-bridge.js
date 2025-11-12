/**
 * MQTT-to-HTTP Bridge Example
 * 
 * Demonstrates how to bridge MQTT messages from a mesh network to 
 * a cloud HTTP REST API while preserving message structure and validation.
 * 
 * Architecture:
 * [Sensor Devices] --MQTT--> [Gateway Bridge] --HTTP--> [Cloud API]
 * 
 * This example shows:
 * 1. Subscribing to MQTT topics from mesh devices
 * 2. Validating incoming MQTT messages
 * 3. Adding transport metadata for HTTP delivery
 * 4. Forwarding to cloud REST API with retry logic
 * 5. Offline message queuing
 * 
 * Usage:
 *   npm install mqtt axios @alteriom/mqtt-schema
 *   CLOUD_API_URL=https://api.example.com CLOUD_API_KEY=xxx node mqtt-to-http-bridge.js
 */

const mqtt = require('mqtt');
const axios = require('axios');
const { classifyAndValidate } = require('@alteriom/mqtt-schema');

// Configuration
const MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
const CLOUD_API_URL = process.env.CLOUD_API_URL || 'https://api.example.com';
const CLOUD_API_KEY = process.env.CLOUD_API_KEY || 'your-api-key';

// Message queue for offline mode
const messageQueue = [];
let isOnline = true;
let mqttClient = null;

// Statistics
const stats = {
  messagesReceived: 0,
  messagesForwarded: 0,
  messagesFailed: 0,
  messagesQueued: 0,
  validationErrors: 0
};

/**
 * Initialize MQTT client and subscribe to device topics
 */
function initializeMQTT() {
  console.log('Connecting to MQTT broker:', MQTT_BROKER);
  
  mqttClient = mqtt.connect(MQTT_BROKER, {
    clientId: `gateway-bridge-${Date.now()}`,
    clean: true,
    reconnectPeriod: 5000,
  });

  mqttClient.on('connect', () => {
    console.log('✓ Connected to MQTT broker');
    
    // Subscribe to all device data topics
    mqttClient.subscribe('alteriom/nodes/+/data', { qos: 1 }, (err) => {
      if (err) {
        console.error('Failed to subscribe to data topics:', err);
      } else {
        console.log('✓ Subscribed to alteriom/nodes/+/data');
      }
    });
    
    // Subscribe to status topics
    mqttClient.subscribe('alteriom/nodes/+/status', { qos: 1 }, (err) => {
      if (err) {
        console.error('Failed to subscribe to status topics:', err);
      } else {
        console.log('✓ Subscribed to alteriom/nodes/+/status');
      }
    });
  });

  mqttClient.on('message', handleMQTTMessage);
  
  mqttClient.on('error', (error) => {
    console.error('MQTT error:', error);
  });
}

/**
 * Handle incoming MQTT messages
 */
async function handleMQTTMessage(topic, message) {
  stats.messagesReceived++;
  
  try {
    // Parse message
    const mqttPayload = JSON.parse(message.toString());
    
    // Validate against schema
    const { kind, result } = classifyAndValidate(mqttPayload);
    
    if (!result.valid) {
      stats.validationErrors++;
      console.error(`❌ Invalid ${kind} message:`, result.errors);
      return;
    }
    
    console.log(`✓ Received valid ${kind} from ${mqttPayload.device_id}`);
    
    // Add transport metadata
    const httpPayload = {
      ...mqttPayload,
      transport_metadata: {
        protocol: 'https',
        correlation_id: `mqtt-bridge-${Date.now()}-${mqttPayload.device_id}`,
        mqtt: {
          topic: topic,
          qos: 1,
          retained: false,
        },
        http: {
          method: 'POST',
          path: `/api/v1/devices/${mqttPayload.device_id}/telemetry`,
        }
      }
    };
    
    // Forward to HTTP API
    if (isOnline) {
      await forwardToHTTP(httpPayload);
    } else {
      queueMessage(httpPayload);
    }
    
  } catch (error) {
    stats.messagesFailed++;
    console.error('Error handling MQTT message:', error.message);
  }
}

/**
 * Forward message to HTTP API with retry logic
 */
async function forwardToHTTP(payload, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        `${CLOUD_API_URL}${payload.transport_metadata.http.path}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CLOUD_API_KEY}`,
            'X-Correlation-ID': payload.transport_metadata.correlation_id,
          },
          timeout: 10000,
        }
      );
      
      payload.transport_metadata.http.status_code = response.status;
      stats.messagesForwarded++;
      console.log(`✓ Forwarded to HTTP (${response.status}): ${payload.device_id}`);
      return response;
      
    } catch (error) {
      if (attempt === retries) {
        console.error(`❌ HTTP delivery failed:`, error.message);
        queueMessage(payload);
        throw error;
      }
      
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.warn(`⚠ Retry ${attempt}/${retries} in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Queue message for later delivery
 */
function queueMessage(payload) {
  const MAX_QUEUE_SIZE = 1000;
  
  if (messageQueue.length >= MAX_QUEUE_SIZE) {
    messageQueue.shift();
  }
  
  messageQueue.push({ payload, timestamp: Date.now() });
  stats.messagesQueued++;
  console.log(`📦 Queued message (${messageQueue.length} in queue)`);
}

/**
 * Monitor connectivity
 */
async function monitorConnectivity() {
  try {
    await axios.get(`${CLOUD_API_URL}/health`, { timeout: 5000 });
    
    if (!isOnline) {
      console.log('✓ Connectivity restored');
      isOnline = true;
      await processQueuedMessages();
    }
  } catch (error) {
    if (isOnline) {
      console.warn('⚠ Offline mode');
      isOnline = false;
    }
  }
}

/**
 * Process queued messages
 */
async function processQueuedMessages() {
  if (messageQueue.length === 0) return;
  
  console.log(`Processing ${messageQueue.length} queued messages...`);
  
  while (messageQueue.length > 0 && isOnline) {
    const { payload } = messageQueue[0];
    
    try {
      await forwardToHTTP(payload, 1);
      messageQueue.shift();
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      isOnline = false;
      break;
    }
  }
}

/**
 * Print statistics
 */
function printStats() {
  console.log('\n=== Statistics ===');
  console.log(`Received: ${stats.messagesReceived}`);
  console.log(`Forwarded: ${stats.messagesForwarded}`);
  console.log(`Failed: ${stats.messagesFailed}`);
  console.log(`Queued: ${messageQueue.length}`);
  console.log(`Status: ${isOnline ? '✓ Online' : '✗ Offline'}`);
  console.log('==================\n');
}

// Initialize
console.log('Alteriom MQTT-to-HTTP Bridge');
console.log(`MQTT: ${MQTT_BROKER}`);
console.log(`HTTP: ${CLOUD_API_URL}\n`);

initializeMQTT();
setInterval(monitorConnectivity, 30000);
setInterval(printStats, 60000);

process.on('SIGINT', () => {
  console.log('\nShutting down...');
  if (mqttClient) mqttClient.end();
  process.exit(0);
});
