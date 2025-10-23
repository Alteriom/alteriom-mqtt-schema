# PainlessMesh Integration Guide

## Overview

This guide demonstrates how to integrate ESP32/ESP8266 mesh networks using the painlessMesh library with the Alteriom MQTT Schema v1 infrastructure. The mesh bridge schema (v0.7.1+) standardizes the translation between mesh protocols and MQTT.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ Mesh Node 1 │     │ Mesh Node 2 │     │ Mesh Node 3 │
│  (Sensor)   │────▶│  (Router)   │────▶│  (Sensor)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       └───────────────────┴───────────────────┘
                           │
                  PainlessMesh Network
                           │
                  ┌────────▼────────┐
                  │ Gateway/Bridge  │
                  │  (ESP32 + WiFi) │
                  └────────┬────────┘
                           │
                      MQTT Broker
                           │
                  ┌────────▼────────┐
                  │  Cloud Backend  │
                  │   (Node.js)     │
                  └─────────────────┘
```

## PainlessMesh Message Types

PainlessMesh uses numeric message type codes:

| Code | Name | Description |
|------|------|-------------|
| 3 | NODE_SYNC_REQUEST | Topology sync request |
| 4 | NODE_SYNC_REPLY | Topology sync response |
| 5 | TIME_SYNC | Time synchronization |
| 6 | NODE_DELAY | Latency measurement |
| 8 | SINGLE | Direct node-to-node message |
| 9 | BROADCAST | Broadcast to all nodes |

## Gateway Firmware Implementation

### Setup (Arduino/PlatformIO)

```cpp
#include <painlessMesh.h>
#include <PubSubClient.h>
#include <WiFi.h>
#include <ArduinoJson.h>

// Mesh configuration
#define MESH_PREFIX "alteriom"
#define MESH_PASSWORD "mesh_password"
#define MESH_PORT 5555

// WiFi configuration (for MQTT bridge)
#define WIFI_SSID "your_wifi"
#define WIFI_PASSWORD "your_password"

// MQTT configuration
#define MQTT_SERVER "mqtt.example.com"
#define MQTT_PORT 1883
#define MQTT_TOPIC_PREFIX "alteriom/mesh"

painlessMesh mesh;
WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);

String gatewayId = "GW-MESH-01";
uint32_t gatewayNodeId = 0;
```

### Mesh Event Handlers

```cpp
void receivedCallback(uint32_t from, String &msg) {
  Serial.printf("Received from %u: %s\n", from, msg.c_str());
  
  // Bridge to MQTT
  bridgeToMqtt(from, mesh.getNodeId(), msg);
}

void newConnectionCallback(uint32_t nodeId) {
  Serial.printf("New Connection, nodeId = %u\n", nodeId);
  
  // Optional: Publish node join event
  publishNodeEvent(nodeId, "connected");
}

void changedConnectionCallback() {
  Serial.printf("Changed connections\n");
  
  // Optional: Publish topology update
  publishTopology();
}

void nodeTimeAdjustedCallback(int32_t offset) {
  Serial.printf("Adjusted time by %u us\n", offset);
}
```

### Mesh-to-MQTT Bridge

```cpp
void bridgeToMqtt(uint32_t from, uint32_t to, String &payload) {
  // Create mesh bridge message
  StaticJsonDocument<1536> doc;
  
  // Envelope fields
  doc["schema_version"] = 1;
  doc["message_type"] = 603; // MESH_BRIDGE
  doc["device_id"] = gatewayId;
  doc["device_type"] = "gateway";
  doc["timestamp"] = getISOTimestamp();
  doc["firmware_version"] = "GW 3.2.0";
  doc["event"] = "mesh_bridge";
  doc["mesh_protocol"] = "painlessMesh";
  
  // Mesh message details
  JsonObject meshMsg = doc.createNestedObject("mesh_message");
  meshMsg["from_node_id"] = from;
  meshMsg["to_node_id"] = to;
  meshMsg["mesh_type"] = 8; // SINGLE
  meshMsg["mesh_type_name"] = "SINGLE";
  
  // Store raw payload (base64 encoded for binary safety)
  meshMsg["raw_payload"] = base64::encode(payload);
  
  // Try to decode as JSON MQTT v1 message
  StaticJsonDocument<512> decoded;
  DeserializationError error = deserializeJson(decoded, payload);
  
  if (error == DeserializationError::Ok) {
    // Valid JSON - check if it's MQTT v1 format
    if (decoded.containsKey("schema_version") && decoded["schema_version"] == 1) {
      meshMsg["payload_decoded"] = decoded;
    }
  }
  
  // Add network metrics
  // Note: painlessMesh doesn't directly provide RSSI, but can be estimated
  // meshMsg["rssi"] = estimateRssi(from);
  meshMsg["hop_count"] = calculateHops(from);
  meshMsg["mesh_timestamp"] = mesh.getNodeTime();
  
  // Gateway context
  doc["gateway_node_id"] = gatewayNodeId;
  doc["mesh_network_id"] = "alteriom-mesh-01";
  
  // Serialize and publish to MQTT
  String json;
  serializeJson(doc, json);
  
  String topic = String(MQTT_TOPIC_PREFIX) + "/bridge/" + String(from);
  mqttClient.publish(topic.c_str(), json.c_str());
  
  Serial.printf("Bridged message to MQTT: %s\n", topic.c_str());
}

int calculateHops(uint32_t nodeId) {
  // Simple implementation - use mesh routing table
  auto route = mesh.findRoute(nodeId);
  return route.size();
}

String getISOTimestamp() {
  // Get NTP time and format as ISO 8601
  time_t now = time(nullptr);
  struct tm timeinfo;
  gmtime_r(&now, &timeinfo);
  
  char buffer[30];
  strftime(buffer, sizeof(buffer), "%Y-%m-%dT%H:%M:%S.000Z", &timeinfo);
  return String(buffer);
}
```

### MQTT-to-Mesh Bridge

```cpp
void mqttCallback(char* topic, byte* payload, unsigned int length) {
  Serial.printf("MQTT message on %s\n", topic);
  
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, payload, length);
  
  if (error) {
    Serial.println("Failed to parse MQTT message");
    return;
  }
  
  // Check if this is a command for a mesh node
  if (doc.containsKey("device_id")) {
    String deviceId = doc["device_id"].as<String>();
    
    // Extract node ID from device_id (e.g., "MESH-NODE-123456789")
    if (deviceId.startsWith("MESH-NODE-")) {
      uint32_t targetNodeId = deviceId.substring(10).toInt();
      
      // Forward to mesh node
      String json;
      serializeJson(doc, json);
      mesh.sendSingle(targetNodeId, json);
      
      Serial.printf("Forwarded MQTT message to mesh node %u\n", targetNodeId);
    }
  }
}
```

### Setup and Loop

```cpp
void setup() {
  Serial.begin(115200);
  
  // Initialize mesh
  mesh.setDebugMsgTypes(ERROR | STARTUP);
  mesh.init(MESH_PREFIX, MESH_PASSWORD, MESH_PORT);
  mesh.onReceive(&receivedCallback);
  mesh.onNewConnection(&newConnectionCallback);
  mesh.onChangedConnections(&changedConnectionCallback);
  mesh.onNodeTimeAdjusted(&nodeTimeAdjustedCallback);
  
  gatewayNodeId = mesh.getNodeId();
  Serial.printf("Gateway Node ID: %u\n", gatewayNodeId);
  
  // Connect to WiFi for MQTT bridge
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nWiFi connected");
  
  // Setup MQTT
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setCallback(mqttCallback);
  mqttClient.setBufferSize(2048); // Increase for larger messages
  
  // Connect to MQTT broker
  reconnectMqtt();
  
  // Subscribe to command topics
  String commandTopic = String(MQTT_TOPIC_PREFIX) + "/commands/#";
  mqttClient.subscribe(commandTopic.c_str());
}

void loop() {
  mesh.update();
  
  if (!mqttClient.connected()) {
    reconnectMqtt();
  }
  mqttClient.loop();
}

void reconnectMqtt() {
  while (!mqttClient.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    String clientId = "gateway-" + String(gatewayNodeId);
    if (mqttClient.connect(clientId.c_str())) {
      Serial.println("connected");
      
      // Resubscribe
      String commandTopic = String(MQTT_TOPIC_PREFIX) + "/commands/#";
      mqttClient.subscribe(commandTopic.c_str());
    } else {
      Serial.print("failed, rc=");
      Serial.print(mqttClient.state());
      Serial.println(" retrying in 5 seconds");
      delay(5000);
    }
  }
}
```

## Mesh Node Firmware

### Sensor Node Example

```cpp
#include <painlessMesh.h>
#include <ArduinoJson.h>

#define MESH_PREFIX "alteriom"
#define MESH_PASSWORD "mesh_password"
#define MESH_PORT 5555

painlessMesh mesh;
Scheduler taskScheduler;

uint32_t nodeId = 0;

void sendSensorData() {
  // Create MQTT v1 sensor data message
  StaticJsonDocument<512> doc;
  
  doc["schema_version"] = 1;
  doc["message_type"] = 200; // SENSOR_DATA
  doc["device_id"] = "MESH-NODE-" + String(nodeId);
  doc["device_type"] = "sensor";
  doc["timestamp"] = getISOTimestamp();
  doc["firmware_version"] = "SN 2.0.0";
  
  // Add sensor readings
  JsonObject sensors = doc.createNestedObject("sensors");
  
  JsonObject temp = sensors.createNestedObject("temperature");
  temp["value"] = readTemperature();
  temp["unit"] = "C";
  
  JsonObject humidity = sensors.createNestedObject("humidity");
  humidity["value"] = readHumidity();
  humidity["unit"] = "%";
  
  // Add battery level
  doc["battery_level"] = readBatteryLevel();
  
  // Serialize and broadcast to mesh
  String json;
  serializeJson(doc, json);
  mesh.sendBroadcast(json);
  
  Serial.printf("Sent sensor data: %s\n", json.c_str());
}

float readTemperature() {
  // Read from sensor (DHT22, DS18B20, etc.)
  return 22.5;
}

float readHumidity() {
  return 45.2;
}

int readBatteryLevel() {
  // Read battery voltage and convert to percentage
  return 85;
}

String getISOTimestamp() {
  // Use mesh sync time
  uint32_t meshTime = mesh.getNodeTime();
  // Convert to ISO format (simplified)
  return "2025-10-23T20:30:00.000Z"; // In production, use NTP
}

Task taskSendMessage(30000, TASK_FOREVER, &sendSensorData);

void setup() {
  Serial.begin(115200);
  
  mesh.setDebugMsgTypes(ERROR | STARTUP);
  mesh.init(MESH_PREFIX, MESH_PASSWORD, &taskScheduler, MESH_PORT);
  
  nodeId = mesh.getNodeId();
  Serial.printf("Node ID: %u\n", nodeId);
  
  taskScheduler.addTask(taskSendMessage);
  taskSendMessage.enable();
}

void loop() {
  mesh.update();
}
```

## Backend Processing (Node.js)

### Message Handler

```typescript
import mqtt from 'mqtt';
import { classifyAndValidate, isMeshBridgeMessage, MessageTypeCodes } from '@alteriom/mqtt-schema';

const client = mqtt.connect('mqtt://mqtt.example.com:1883');

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe('alteriom/mesh/bridge/#');
});

client.on('message', (topic, payload) => {
  const message = JSON.parse(payload.toString());
  
  // Fast classification using message_type
  const { kind, result } = classifyAndValidate(message);
  
  if (!result.valid) {
    console.error('Invalid message:', result.errors);
    return;
  }
  
  if (isMeshBridgeMessage(message)) {
    console.log(`Mesh bridge message from node ${message.mesh_message.from_node_id}`);
    console.log(`Protocol: ${message.mesh_protocol}`);
    console.log(`RSSI: ${message.mesh_message.rssi} dBm`);
    console.log(`Hop count: ${message.mesh_message.hop_count}`);
    
    // Process decoded payload if available
    if (message.mesh_message.payload_decoded) {
      const innerMsg = message.mesh_message.payload_decoded;
      
      // Classify and validate inner message
      const innerResult = classifyAndValidate(innerMsg);
      
      if (innerResult.valid && innerResult.kind === 'sensorData') {
        // Process sensor data from mesh node
        console.log('Sensor data from mesh:', innerMsg);
        storeSensorData(innerMsg);
      }
    }
    
    // Store mesh network metrics
    storeMeshMetrics({
      nodeId: message.mesh_message.from_node_id,
      rssi: message.mesh_message.rssi,
      hopCount: message.mesh_message.hop_count,
      timestamp: message.timestamp
    });
  }
});

function storeSensorData(data: any) {
  // Store in database
  console.log('Storing sensor data:', data.device_id, data.sensors);
}

function storeMeshMetrics(metrics: any) {
  // Store mesh network health metrics
  console.log('Mesh metrics:', metrics);
}
```

### Send Command to Mesh Node

```typescript
function sendCommandToMeshNode(nodeId: number, command: string) {
  const message = {
    schema_version: 1,
    message_type: MessageTypeCodes.COMMAND,
    device_id: `MESH-NODE-${nodeId}`,
    device_type: 'sensor',
    timestamp: new Date().toISOString(),
    firmware_version: 'WEB 1.0.0',
    event: 'command',
    command: command,
    correlation_id: `cmd-${Date.now()}`,
    parameters: {
      immediate: true
    },
    priority: 'high'
  };
  
  const topic = `alteriom/mesh/commands/${nodeId}`;
  client.publish(topic, JSON.stringify(message));
  
  console.log(`Sent command to mesh node ${nodeId}: ${command}`);
}

// Example: Read sensors from node 123456789
sendCommandToMeshNode(123456789, 'read_sensors');
```

## Best Practices

### 1. Message Size Optimization

PainlessMesh has message size limits (~1500 bytes). Keep payloads compact:

```cpp
// Good: Minimal sensor data
{
  "schema_version": 1,
  "message_type": 200,
  "device_id": "MESH-NODE-123",
  "device_type": "sensor",
  "timestamp": "2025-10-23T20:30:00Z",
  "firmware_version": "SN 2.0",
  "sensors": {
    "t": {"value": 22.5, "unit": "C"},
    "h": {"value": 45.2, "unit": "%"}
  }
}

// Avoid: Excessive optional fields
```

### 2. Network Topology

- **Star Topology**: All nodes connect to gateway directly (minimal hops)
- **Mesh Topology**: Nodes route through each other (resilient but slower)
- **Hybrid**: Critical nodes direct to gateway, others use mesh

### 3. Battery Optimization

For battery-powered mesh nodes:

```cpp
// Use deep sleep between readings
void loop() {
  sendSensorData();
  
  // Deep sleep for 5 minutes
  ESP.deepSleep(5 * 60 * 1000000);
}
```

### 4. Error Handling

Always include error handling for mesh operations:

```cpp
bool success = mesh.sendSingle(targetNodeId, message);
if (!success) {
  // Retry or log error
  Serial.println("Failed to send mesh message");
  // Try broadcast as fallback
  mesh.sendBroadcast(message);
}
```

### 5. Time Synchronization

Use painlessMesh's built-in time sync:

```cpp
void setup() {
  mesh.init(...);
  mesh.setTimeSync(true); // Enable automatic time sync
}

uint32_t meshTime = mesh.getNodeTime(); // Synchronized across mesh
```

## Troubleshooting

### Issue: Messages not reaching gateway

**Solution**: Check mesh connectivity

```cpp
void printMeshConnections() {
  Serial.println("Connected nodes:");
  SimpleList<uint32_t> nodes = mesh.getNodeList();
  for (auto node : nodes) {
    Serial.printf("Node: %u\n", node);
  }
}
```

### Issue: High message loss

**Solution**: Reduce mesh size or increase transmission power

```cpp
mesh.setContainsRoot(true); // Gateway is root
WiFi.setTxPower(WIFI_POWER_19_5dBm); // Increase TX power
```

### Issue: MQTT buffer overflow

**Solution**: Increase MQTT buffer size

```cpp
mqttClient.setBufferSize(4096); // Increase to 4KB
```

## Performance Metrics

| Metric | Typical Value | Notes |
|--------|--------------|-------|
| Mesh nodes | 10-50 | Larger networks may fragment |
| Message latency | 100-500ms | Depends on hop count |
| Gateway throughput | 10-20 msg/s | Limited by WiFi/MQTT |
| Battery life (mesh node) | 6-12 months | With 5-minute intervals |
| Message delivery rate | >95% | In good conditions |

## Additional Resources

- [PainlessMesh Documentation](https://gitlab.com/painlessMesh/painlessMesh)
- [ESP32 Mesh Development Guide](https://docs.espressif.com/projects/esp-idf/en/latest/esp32/api-guides/mesh.html)
- [Alteriom MQTT Schema Repository](https://github.com/Alteriom/alteriom-mqtt-schema)

## Support

For questions or issues with mesh integration:
- GitHub Issues: [alteriom-mqtt-schema/issues](https://github.com/Alteriom/alteriom-mqtt-schema/issues)
- Documentation: `docs/mqtt_schema/CHANGELOG.md` (v0.7.1+ section)

---

**Document Version:** 1.0  
**Date:** 2025-10-23  
**Compatibility:** Alteriom MQTT Schema v0.7.1+
