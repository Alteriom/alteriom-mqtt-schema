# HTTP Transport Guide

## Overview

The Alteriom MQTT Schema supports **multi-protocol transport** via the `transport_metadata` field (introduced in v0.8.0). This enables seamless integration with HTTP REST APIs while maintaining the same message structure and validation used for MQTT.

This guide covers:
1. HTTP transport fundamentals
2. MQTT-to-HTTP bridge patterns
3. HTTP-to-MQTT bridge patterns
4. REST API integration examples
5. Best practices and security considerations

## Table of Contents

1. [Transport Metadata Field](#transport-metadata-field)
2. [HTTP Transport Fundamentals](#http-transport-fundamentals)
3. [MQTT-to-HTTP Bridge Implementation](#mqtt-to-http-bridge-implementation)
4. [HTTP-to-MQTT Bridge Implementation](#http-to-mqtt-bridge-implementation)
5. [REST API Integration Patterns](#rest-api-integration-patterns)
6. [Security Considerations](#security-considerations)
7. [Performance Optimization](#performance-optimization)
8. [Troubleshooting](#troubleshooting)

## Transport Metadata Field

### Schema Definition

The `transport_metadata` field is **optional** at the envelope level:

```json
{
  "transport_metadata": {
    "protocol": "mqtt" | "http" | "https",
    "correlation_id": "string",  // Optional: Request/response tracking
    
    "http": {
      "method": "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
      "path": "string",           // e.g., /api/v1/devices/{id}/telemetry
      "status_code": 100-599,     // HTTP response status
      "request_id": "string",     // Unique request identifier
      "headers": {                // Sanitized headers (no auth tokens)
        "Content-Type": "string",
        // ... other headers
      }
    },
    
    "mqtt": {
      "topic": "string",          // MQTT topic
      "qos": 0 | 1 | 2,           // Quality of Service
      "retained": boolean,        // Retain flag
      "message_id": 0-65535       // MQTT message identifier
    }
  }
}
```

### Key Principles

1. **Optional Field:** Existing MQTT-only messages continue to work without modification
2. **Protocol Agnostic:** Same message structure for both MQTT and HTTP
3. **Context Preservation:** Transport details preserved for debugging and auditing
4. **Bi-directional:** Supports both MQTT→HTTP and HTTP→MQTT bridges

## HTTP Transport Fundamentals

### Basic HTTP Message Example

```json
{
  "schema_version": 1,
  "message_type": 101,
  "device_id": "SN001",
  "device_type": "sensor",
  "timestamp": "2025-11-12T10:30:00.000Z",
  "firmware_version": "SN 2.1.5",
  
  "sensors": {
    "temperature": { "value": 22.5, "unit": "C" },
    "humidity": { "value": 55, "unit": "%" }
  },
  
  "transport_metadata": {
    "protocol": "https",
    "correlation_id": "req-2025-11-12-103001",
    
    "http": {
      "method": "POST",
      "path": "/api/v1/devices/SN001/telemetry",
      "status_code": 201,
      "request_id": "uuid-12345-abcde-67890"
    }
  }
}
```

### When to Use HTTP Transport

**Use HTTP when:**
- ✅ Implementing RESTful APIs for web dashboards
- ✅ Batch/bulk operations more efficient than real-time MQTT
- ✅ Request/response pattern needed (vs MQTT publish/subscribe)
- ✅ HTTP infrastructure already in place (load balancers, CDN, etc.)
- ✅ Polling-based data collection (periodic device check-ins)

**Use MQTT when:**
- ✅ Real-time telemetry streaming required
- ✅ Bi-directional messaging (commands from server to device)
- ✅ Bandwidth-constrained environments
- ✅ Persistent connections preferred over per-request overhead
- ✅ Publish/subscribe pattern beneficial

**Use Both (Hybrid):**
- ✅ MQTT for real-time telemetry, HTTP for bulk historical queries
- ✅ MQTT for commands, HTTP for firmware downloads
- ✅ Bridge at gateway level for protocol translation

## MQTT-to-HTTP Bridge Implementation

### Use Case: Mesh Network to Cloud REST API

**Scenario:** Devices communicate via MQTT on mesh network, but gateway forwards telemetry to cloud REST API over HTTP.

### Architecture

```
[Sensor Device] --MQTT--> [Gateway/Bridge] --HTTP--> [Cloud REST API]
    (mesh)                  (protocol translation)        (backend)
```

### Implementation Pattern

#### Step 1: Subscribe to MQTT Topics

```javascript
// Gateway/Bridge Node.js implementation
const mqtt = require('mqtt');
const axios = require('axios');
const { classifyAndValidate } = require('@alteriom/mqtt-schema');

const mqttClient = mqtt.connect('mqtt://mesh-broker:1883', {
  clientId: 'gateway-bridge-01',
  clean: true,
});

// Subscribe to all device telemetry
mqttClient.subscribe('alteriom/nodes/+/data', { qos: 1 });
mqttClient.subscribe('alteriom/nodes/+/status', { qos: 1 });
```

#### Step 2: Transform MQTT to HTTP

```javascript
mqttClient.on('message', async (topic, message) => {
  try {
    // Parse MQTT message
    const mqttPayload = JSON.parse(message.toString());
    
    // Validate against schema
    const { kind, result } = classifyAndValidate(mqttPayload);
    if (!result.valid) {
      console.error(`Invalid ${kind} message:`, result.errors);
      return;
    }
    
    // Add transport metadata for HTTP delivery
    const httpPayload = {
      ...mqttPayload,
      transport_metadata: {
        protocol: 'https',
        correlation_id: `mqtt-${Date.now()}-${mqttPayload.device_id}`,
        
        // Preserve original MQTT context
        mqtt: {
          topic: topic,
          qos: 1,
          retained: false,
        },
        
        // HTTP delivery target
        http: {
          method: 'POST',
          path: `/api/v1/devices/${mqttPayload.device_id}/telemetry`,
        }
      }
    };
    
    // Forward to cloud REST API
    const response = await forwardToHTTP(httpPayload);
    
    // Update with response details
    httpPayload.transport_metadata.http.status_code = response.status;
    httpPayload.transport_metadata.http.request_id = response.headers['x-request-id'];
    
    console.log(`Forwarded ${kind} message from ${mqttPayload.device_id} to HTTP`);
    
  } catch (error) {
    console.error('MQTT-to-HTTP bridge error:', error);
  }
});
```

#### Step 3: HTTP Delivery with Retry

```javascript
async function forwardToHTTP(payload, retries = 3) {
  const cloudApiUrl = process.env.CLOUD_API_URL || 'https://api.example.com';
  const apiKey = process.env.CLOUD_API_KEY;
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await axios.post(
        `${cloudApiUrl}${payload.transport_metadata.http.path}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'X-Correlation-ID': payload.transport_metadata.correlation_id,
          },
          timeout: 10000, // 10 second timeout
        }
      );
      
      return response;
      
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
      console.warn(`HTTP delivery failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### Advanced: Message Queuing for Offline Mode

```javascript
const messageQueue = [];
let isOnline = true;

// Monitor internet connectivity
setInterval(async () => {
  try {
    await axios.get('https://api.example.com/health', { timeout: 5000 });
    isOnline = true;
    await processQueuedMessages();
  } catch (error) {
    isOnline = false;
    console.warn('Cloud API unreachable, queuing messages...');
  }
}, 30000); // Check every 30 seconds

mqttClient.on('message', async (topic, message) => {
  const payload = preparePayload(topic, message);
  
  if (isOnline) {
    try {
      await forwardToHTTP(payload);
    } catch (error) {
      console.error('HTTP delivery failed, queuing message');
      messageQueue.push({ payload, timestamp: Date.now() });
    }
  } else {
    messageQueue.push({ payload, timestamp: Date.now() });
    console.log(`Queued message (${messageQueue.length} in queue)`);
  }
});

async function processQueuedMessages() {
  while (messageQueue.length > 0 && isOnline) {
    const { payload, timestamp } = messageQueue[0];
    
    // Skip messages older than 24 hours
    if (Date.now() - timestamp > 86400000) {
      console.warn('Dropping old queued message');
      messageQueue.shift();
      continue;
    }
    
    try {
      await forwardToHTTP(payload);
      messageQueue.shift();
      console.log(`Processed queued message (${messageQueue.length} remaining)`);
    } catch (error) {
      console.error('Failed to process queued message, stopping queue processing');
      isOnline = false;
      break;
    }
  }
}
```

## HTTP-to-MQTT Bridge Implementation

### Use Case: Cloud REST API to Device Commands

**Scenario:** Web dashboard sends commands via HTTP, gateway bridge translates to MQTT for device delivery.

### Architecture

```
[Web Dashboard] --HTTP--> [Gateway/Bridge] --MQTT--> [Sensor Device]
   (REST API)           (protocol translation)          (mesh)
```

### Implementation Pattern

#### Step 1: HTTP Endpoint Handler

```javascript
const express = require('express');
const mqtt = require('mqtt');
const { validators } = require('@alteriom/mqtt-schema');

const app = express();
app.use(express.json());

const mqttClient = mqtt.connect('mqtt://mesh-broker:1883');

// HTTP endpoint to send commands to devices
app.post('/api/v1/devices/:deviceId/commands', async (req, res) => {
  const { deviceId } = req.params;
  const command = req.body;
  
  try {
    // Validate command structure
    const result = validators.command(command);
    if (!result.valid) {
      return res.status(400).json({
        error: 'Invalid command format',
        validation_errors: result.errors
      });
    }
    
    // Add transport metadata
    const mqttPayload = {
      ...command,
      transport_metadata: {
        protocol: 'https',
        correlation_id: `http-${Date.now()}-${deviceId}`,
        
        http: {
          method: 'POST',
          path: `/api/v1/devices/${deviceId}/commands`,
          request_id: req.headers['x-request-id'] || `req-${Date.now()}`,
        },
        
        // Target MQTT delivery
        mqtt: {
          topic: `alteriom/nodes/${deviceId}/commands`,
          qos: 1,
          retained: false,
        }
      }
    };
    
    // Publish to MQTT
    await publishToMQTT(mqttPayload);
    
    res.status(202).json({
      message: 'Command queued for delivery',
      correlation_id: mqttPayload.transport_metadata.correlation_id,
      device_id: deviceId
    });
    
  } catch (error) {
    console.error('HTTP-to-MQTT bridge error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

function publishToMQTT(payload) {
  return new Promise((resolve, reject) => {
    const topic = payload.transport_metadata.mqtt.topic;
    const qos = payload.transport_metadata.mqtt.qos;
    
    mqttClient.publish(
      topic,
      JSON.stringify(payload),
      { qos, retain: false },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      }
    );
  });
}

app.listen(3000, () => {
  console.log('HTTP-to-MQTT bridge listening on port 3000');
});
```

#### Step 2: Response Handling

```javascript
// Subscribe to command responses
mqttClient.subscribe('alteriom/nodes/+/responses', { qos: 1 });

const pendingCommands = new Map(); // correlation_id -> { res, timeout }

mqttClient.on('message', (topic, message) => {
  const response = JSON.parse(message.toString());
  
  // Validate response
  const result = validators.commandResponse(response);
  if (!result.valid) {
    console.error('Invalid command response:', result.errors);
    return;
  }
  
  // Match with pending HTTP request
  const pending = pendingCommands.get(response.correlation_id);
  if (pending) {
    clearTimeout(pending.timeout);
    
    // Send HTTP response back to client
    pending.res.json({
      success: response.success,
      result: response.result,
      device_id: response.device_id,
      correlation_id: response.correlation_id,
      latency_ms: response.latency_ms
    });
    
    pendingCommands.delete(response.correlation_id);
  }
});
```

## REST API Integration Patterns

### Pattern 1: Device Registration

```javascript
// POST /api/v1/devices/register
app.post('/api/v1/devices/register', async (req, res) => {
  const deviceInfo = req.body;
  
  // Validate device info message
  const result = validators.deviceInfo(deviceInfo);
  if (!result.valid) {
    return res.status(400).json({ errors: result.errors });
  }
  
  // Add transport metadata
  deviceInfo.transport_metadata = {
    protocol: 'https',
    http: {
      method: 'POST',
      path: '/api/v1/devices/register',
      request_id: req.headers['x-request-id']
    }
  };
  
  // Store in database
  await db.devices.insert(deviceInfo);
  
  res.status(201).json({
    message: 'Device registered',
    device_id: deviceInfo.device_id
  });
});
```

### Pattern 2: Telemetry Ingestion

```javascript
// POST /api/v1/devices/:deviceId/telemetry
app.post('/api/v1/devices/:deviceId/telemetry', async (req, res) => {
  const { deviceId } = req.params;
  const telemetry = req.body;
  
  // Classify and validate
  const { kind, result } = classifyAndValidate(telemetry);
  if (!result.valid) {
    return res.status(400).json({ 
      error: `Invalid ${kind} message`,
      validation_errors: result.errors 
    });
  }
  
  // Verify device_id match
  if (telemetry.device_id !== deviceId) {
    return res.status(400).json({ 
      error: 'Device ID mismatch' 
    });
  }
  
  // Store telemetry
  await db.telemetry.insert({
    ...telemetry,
    received_at: new Date(),
    transport_protocol: 'https'
  });
  
  res.status(201).json({
    message: 'Telemetry stored',
    message_type: kind
  });
});
```

### Pattern 3: Batch Upload

```javascript
// POST /api/v1/devices/:deviceId/telemetry/batch
app.post('/api/v1/devices/:deviceId/telemetry/batch', async (req, res) => {
  const { deviceId } = req.params;
  const batch = req.body;
  
  // Validate batch envelope
  const result = validators.batchEnvelope(batch);
  if (!result.valid) {
    return res.status(400).json({ errors: result.errors });
  }
  
  const results = {
    total: batch.messages.length,
    accepted: 0,
    rejected: 0,
    errors: []
  };
  
  // Validate each message in batch
  for (const msg of batch.messages) {
    const { kind, result: msgResult } = classifyAndValidate(msg);
    
    if (msgResult.valid && msg.device_id === deviceId) {
      await db.telemetry.insert(msg);
      results.accepted++;
    } else {
      results.rejected++;
      results.errors.push({
        device_id: msg.device_id,
        message_type: kind,
        errors: msgResult.errors
      });
    }
  }
  
  const statusCode = results.rejected === 0 ? 201 : 207; // Multi-status
  res.status(statusCode).json(results);
});
```

### Pattern 4: Configuration Management

```javascript
// GET /api/v1/devices/:deviceId/config
app.get('/api/v1/devices/:deviceId/config', async (req, res) => {
  const { deviceId } = req.params;
  
  // Fetch current config
  const config = await db.deviceConfig.findOne({ device_id: deviceId });
  
  if (!config) {
    return res.status(404).json({ error: 'Device not found' });
  }
  
  res.json(config);
});

// PUT /api/v1/devices/:deviceId/config
app.put('/api/v1/devices/:deviceId/config', async (req, res) => {
  const { deviceId } = req.params;
  const configUpdate = req.body;
  
  // Validate config update
  const result = validators.deviceConfig(configUpdate);
  if (!result.valid) {
    return res.status(400).json({ errors: result.errors });
  }
  
  // Store and publish to MQTT for device to receive
  await db.deviceConfig.update(
    { device_id: deviceId },
    configUpdate
  );
  
  mqttClient.publish(
    `alteriom/nodes/${deviceId}/config`,
    JSON.stringify(configUpdate),
    { qos: 1, retain: true }
  );
  
  res.json({
    message: 'Configuration updated and published to device',
    device_id: deviceId
  });
});
```

## Security Considerations

### 1. Authentication and Authorization

```javascript
const jwt = require('jsonwebtoken');

// Middleware for HTTP endpoints
function authenticateDevice(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.device = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
}

app.post('/api/v1/devices/:deviceId/telemetry', 
  authenticateDevice,
  async (req, res) => {
    // Verify device can only send data for itself
    if (req.device.device_id !== req.params.deviceId) {
      return res.status(403).json({ 
        error: 'Cannot send data for other devices' 
      });
    }
    
    // Process telemetry...
  }
);
```

### 2. Rate Limiting

```javascript
const rateLimit = require('express-rate-limit');

// Limit telemetry uploads
const telemetryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute per device
  keyGenerator: (req) => req.params.deviceId,
  handler: (req, res) => {
    res.status(429).json({ 
      error: 'Rate limit exceeded',
      retry_after: 60 
    });
  }
});

app.post('/api/v1/devices/:deviceId/telemetry', 
  telemetryLimiter,
  async (req, res) => {
    // Process telemetry...
  }
);
```

### 3. Transport Security

```javascript
// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (!req.secure) {
      return res.status(400).json({ 
        error: 'HTTPS required' 
      });
    }
    next();
  });
}

// CORS configuration
const cors = require('cors');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [],
  credentials: true
}));
```

### 4. Data Sanitization

```javascript
// Remove sensitive data from transport_metadata
function sanitizeTransportMetadata(payload) {
  if (payload.transport_metadata?.http?.headers) {
    const sanitized = { ...payload.transport_metadata.http.headers };
    
    // Remove auth tokens
    delete sanitized['Authorization'];
    delete sanitized['X-API-Key'];
    delete sanitized['Cookie'];
    
    payload.transport_metadata.http.headers = sanitized;
  }
  
  return payload;
}
```

## Performance Optimization

### 1. Connection Pooling

```javascript
const axios = require('axios');
const http = require('http');
const https = require('https');

// Create persistent connection pool
const httpClient = axios.create({
  baseURL: process.env.CLOUD_API_URL,
  timeout: 10000,
  httpAgent: new http.Agent({ 
    keepAlive: true,
    maxSockets: 50 
  }),
  httpsAgent: new https.Agent({ 
    keepAlive: true,
    maxSockets: 50,
    rejectUnauthorized: true
  })
});
```

### 2. Batch Processing

```javascript
const messageBuffer = [];
const BATCH_SIZE = 100;
const BATCH_TIMEOUT = 5000; // 5 seconds

mqttClient.on('message', (topic, message) => {
  const payload = JSON.parse(message.toString());
  messageBuffer.push(payload);
  
  if (messageBuffer.length >= BATCH_SIZE) {
    flushBatch();
  }
});

setInterval(() => {
  if (messageBuffer.length > 0) {
    flushBatch();
  }
}, BATCH_TIMEOUT);

async function flushBatch() {
  const batch = messageBuffer.splice(0, BATCH_SIZE);
  
  try {
    await httpClient.post('/api/v1/telemetry/batch', {
      messages: batch,
      batch_metadata: {
        count: batch.length,
        timestamp: new Date().toISOString()
      }
    });
    console.log(`Sent batch of ${batch.length} messages`);
  } catch (error) {
    console.error('Batch send failed:', error);
    // Re-queue failed messages
    messageBuffer.unshift(...batch);
  }
}
```

### 3. Compression

```javascript
const zlib = require('zlib');

async function forwardCompressed(payload) {
  // Compress payload
  const compressed = await new Promise((resolve, reject) => {
    zlib.gzip(JSON.stringify(payload), (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
  
  // Send with compression indicator
  await httpClient.post('/api/v1/telemetry', compressed, {
    headers: {
      'Content-Type': 'application/json',
      'Content-Encoding': 'gzip'
    }
  });
}
```

## Troubleshooting

### Common Issues

#### Issue 1: Message Validation Failures

```javascript
// Debug validation errors
const { kind, result } = classifyAndValidate(payload);
if (!result.valid) {
  console.error('Validation failed for message type:', kind);
  console.error('Errors:', JSON.stringify(result.errors, null, 2));
  console.error('Payload:', JSON.stringify(payload, null, 2));
}
```

#### Issue 2: HTTP Delivery Timeouts

```javascript
// Add retry logic with exponential backoff
async function forwardWithRetry(payload, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await httpClient.post('/api/v1/telemetry', payload, {
        timeout: 5000 * (i + 1) // Increase timeout with each retry
      });
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      const delay = Math.pow(2, i) * 1000;
      console.warn(`Retry ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

#### Issue 3: Correlation ID Mismatches

```javascript
// Track correlation IDs for debugging
const correlationTracker = new Map();

function trackCorrelation(payload) {
  const corrId = payload.transport_metadata?.correlation_id;
  if (corrId) {
    correlationTracker.set(corrId, {
      timestamp: Date.now(),
      device_id: payload.device_id,
      message_type: payload.message_type
    });
  }
}

// Cleanup old tracking entries
setInterval(() => {
  const now = Date.now();
  for (const [corrId, data] of correlationTracker.entries()) {
    if (now - data.timestamp > 300000) { // 5 minutes
      correlationTracker.delete(corrId);
    }
  }
}, 60000); // Every minute
```

## Summary

The Alteriom MQTT Schema HTTP transport support enables:

✅ **Seamless Protocol Translation:** Same message structure for MQTT and HTTP
✅ **Bi-directional Bridging:** MQTT→HTTP and HTTP→MQTT conversions
✅ **Context Preservation:** Transport metadata maintains full audit trail
✅ **REST API Integration:** Standard HTTP endpoints for web dashboards
✅ **Hybrid Architectures:** Leverage strengths of both protocols

**Key Takeaways:**
- Use `transport_metadata` to preserve protocol context
- Validate messages on both sides of the bridge
- Implement proper authentication and rate limiting
- Consider batching and compression for performance
- Handle offline scenarios with message queuing

For related documentation:
- [SCHEMA_EXTENSIBILITY_GUIDE.md](./SCHEMA_EXTENSIBILITY_GUIDE.md) - Schema extension patterns
- [PAINLESHMESH_INTEGRATION.md](./PAINLESHMESH_INTEGRATION.md) - Mesh network integration
- [API_MONITOR_GUIDE.md](../API_MONITOR_GUIDE.md) - API monitoring integration
