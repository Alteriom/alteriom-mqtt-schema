---
name: Schema Update
about: Propose changes to existing schemas or new message types
title: '[SCHEMA] '
labels: schema, enhancement
assignees: ''
---

## Schema Change Type

- [ ] New message type
- [ ] Modify existing schema
- [ ] Add optional fields
- [ ] Breaking change
- [ ] Deprecate fields

## Message Type

Which message type does this affect?
- [ ] sensor_data / sensor_heartbeat / sensor_status / sensor_info / sensor_metrics
- [ ] gateway_info / gateway_metrics / gateway_data / gateway_heartbeat / gateway_status
- [ ] firmware_status / command / command_response
- [ ] mesh_node_list / mesh_topology / mesh_alert / mesh_bridge / mesh_status / mesh_metrics
- [ ] device_config
- [ ] New message type (specify below)

## Proposed Changes

Describe the schema changes in detail.

## Rationale

Why is this change needed?

## Backward Compatibility

- **Breaking Change**: Yes/No
- **Migration Path**: Describe how existing users would migrate

## Checklist

- [ ] Schema follows JSON Schema Draft 2020-12
- [ ] Backward compatibility considered
- [ ] Examples provided
- [ ] TypeScript types defined
