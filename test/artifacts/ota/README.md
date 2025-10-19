# OTA Manifest Test Fixtures

This directory contains test fixtures demonstrating the various OTA manifest formats supported by the schema.

## File Descriptions

### Basic Examples

**minimal-dev.json**
- Minimal environment map format
- Bare minimum required fields
- No optional enhancements

**rich-dev.json**
- Rich manifest format
- Basic dev build entry
- No chunks or advanced features

### Chunk Format Variations

**rich-prod-chunks.json**
- Structured chunk objects with metadata
- Each chunk includes: index, offset, size, sha256
- Best for progressive verification and partial resume

**rich-prod-chunks-array.json**
- Simple SHA256 string array format
- Minimal payload size
- Sufficient for basic integrity checking

**Note:** Both chunk formats are intentionally supported by the schema (oneOf constraint). The difference allows users to choose between detailed metadata (objects) vs. compact representation (strings).

### Enhanced OTA Features

**minimal-signed.json**
- Minimal format with security features
- Includes digital signature and algorithm
- Demonstrates security in compact format

**rich-delta-update.json**
- Delta/patch update example
- Shows delta_patch_* fields
- Uses simple chunk array format (demonstrates flexibility)
- Includes version constraints

**rich-signed-with-rollout.json**
- Full-featured production example
- Digital signatures with key rotation
- Staged rollout configuration
- Release management fields
- Uses structured chunk objects (demonstrates detail)

## Chunk Format Decision Guide

Choose **Structured Objects** when:
- You need progressive download verification
- Partial resume capability is required
- Detailed diagnostics are important
- You have advanced OTA workflows

Choose **String Array** when:
- Minimizing manifest size is priority
- Simple integrity checking is sufficient
- Basic OTA workflow is adequate
- Bandwidth is constrained

Both formats are valid and can be mixed across different firmware entries within the same manifest.
