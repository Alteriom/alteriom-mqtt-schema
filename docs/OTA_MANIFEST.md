# OTA Firmware Manifest Reference

This document specifies the structure and usage of the OTA firmware manifest supported by `@alteriom/mqtt-schema`.

## Variants

The schema permits two root-level variants (mutually exclusive via `oneOf`):

1. Rich Manifest
2. Minimal Environment Map

### Rich Manifest
```jsonc
{
  "environment": "universal-sensor",
  "branch": "main",
  "manifests": {
    "dev": { /* Rich Entry */ },
    "prod": { /* Rich Entry */ }
  }
}
```

A Rich Entry has:
```jsonc
{
  "build_type": "dev",                // "dev" | "prod"
  "file": "firmware-dev.bin",         // enforced pattern
  "size": 123456,                      // total bytes
  "sha256": "<64 hex>",              // full firmware hash
  "firmware_version": "1.2.3-dev+45", // semantic / build version
  "built": "2025-09-27T12:00:00Z",    // ISO8601
  "ota_url": "https://.../firmware-dev.bin",
  "chunk_size": 8192,                  // optional
  "chunks": [                          // OPTIONAL: choose one representation
    // Either array of objects:
    { "index": 0, "offset": 0, "size": 8192, "sha256": "<64 hex>" },
    { "index": 1, "offset": 8192, "size": 8192, "sha256": "<64 hex>" }
    // OR array of hash strings:
    // "<64 hex>", "<64 hex>", ...
  ],
  
  // NEW: Security & Authenticity
  "signature": "base64-encoded-signature",           // Digital signature for verification
  "signature_algorithm": "ECDSA-SHA256",             // RSA-SHA256 | ECDSA-SHA256 | Ed25519
  "signing_key_id": "prod-signing-key-2025",         // Key identifier for rotation
  
  // NEW: Version Constraints & Dependencies
  "min_version": "1.5.0",                            // Minimum version required to upgrade
  "max_version": "1.9.99",                           // Maximum version (prevent downgrades)
  
  // NEW: Release Management
  "release_notes_url": "https://.../release-notes",  // Link to changelog/documentation
  "criticality": "high",                             // low | medium | high | critical
  "mandatory": true,                                 // Whether update must be installed
  "deprecated": false,                               // Mark version as deprecated
  "expiry_date": "2026-12-31T23:59:59Z",            // When firmware expires
  
  // NEW: Staged Rollout & A/B Testing
  "rollout_percentage": 25,                          // Percentage of fleet (0-100)
  "rollout_target_groups": ["beta-testers"],         // Specific device groups
  
  // NEW: Delta/Patch Updates
  "delta_from_version": "2.0.0",                     // Source version for delta
  "delta_patch_url": "https://.../patch.bin",        // Delta patch URL
  "delta_patch_size": 45678,                         // Patch size in bytes
  "delta_patch_sha256": "<64 hex>"                   // Patch checksum
}
```

### Minimal Environment Map
```jsonc
{
  "universal-sensor": {
    "dev": {
      "file": "firmware-dev.bin",
      "size": 123456,
      "sha256": "<64 hex>",
      "version": "1.2.3-dev+45",
      "timestamp": "2025-09-27T12:00:00Z",
      
      // NEW: Security fields (optional)
      "signature": "base64-encoded-signature",
      "signature_algorithm": "ECDSA-SHA256",
      
      // NEW: Version control (optional)
      "min_version": "1.5.0",
      
      // NEW: Update metadata (optional)
      "criticality": "medium",
      "mandatory": false
    }
  }
}
```

## Chunk Hash Strategy

Two representations exist to balance introspection detail vs payload compactness:
- Structured Object Array: Provides offsets & sizes (good for progressive verification, partial resume, advanced diagnostics)
- Hash String Array: Minimal form when only integrity verification is needed.

The schema ensures only one form is used at a time for any given firmware entry.

## Best Practices for OTA Management

### Security & Authenticity

**Digital Signatures (Highly Recommended)**
- Always include `signature` and `signature_algorithm` fields for production firmware
- Use ECDSA-SHA256 or Ed25519 for efficient signature verification on embedded devices
- Implement key rotation using `signing_key_id` to manage signing key lifecycle
- Devices should verify signatures before flashing to prevent unauthorized firmware

**Integrity Verification**
- SHA256 hashes are required for all firmware files
- Use chunk hashes for progressive verification during download
- Devices should verify checksums before and after flashing

### Rollback & Fail-Safe Updates

**Version Constraints**
- Use `min_version` to prevent upgrades from too-old firmware (breaking changes)
- Use `max_version` to prevent accidental downgrades or skip incompatible versions
- Ensure devices maintain a backup partition with last-known-good firmware

**Update Recovery**
- Devices should support atomic updates (all-or-nothing)
- Implement automatic rollback on boot failures or verification errors
- Use the enhanced `firmware_status` schema to report rollback events

### Delta/Patch Updates

**Bandwidth Optimization**
- Use delta updates (`delta_patch_*` fields) when upgrading between consecutive versions
- Delta patches can reduce download size by 60-90% for minor updates
- Always provide full firmware as fallback if delta fails
- Include both full and delta options in manifest for maximum flexibility

### Staged Rollout Strategy

**Gradual Deployment**
- Start with small `rollout_percentage` (e.g., 5-10%) for new releases
- Use `rollout_target_groups` for A/B testing with specific device cohorts
- Monitor error rates and rollback metrics before expanding rollout
- Increase rollout percentage gradually: 10% → 25% → 50% → 100%

**Update Prioritization**
- Use `criticality` field to indicate update importance:
  - `critical`: Security patches, must install immediately
  - `high`: Important bug fixes, install within 24 hours
  - `medium`: Feature updates, install within 1 week
  - `low`: Optional improvements, install at convenience
- Set `mandatory: true` for security updates and critical fixes
- Use `expiry_date` to sunset old firmware versions with known vulnerabilities

### Release Management

**Documentation & Communication**
- Always provide `release_notes_url` for production releases
- Document breaking changes, new features, and bug fixes
- Include migration guides for major version updates
- Track firmware deployment metrics and success rates

**Deprecation Strategy**
- Mark old versions with `deprecated: true` to signal end-of-life
- Set `expiry_date` to enforce upgrade deadlines
- Provide sufficient notice before expiring firmware versions
- Maintain security patches for deprecated versions during transition period

## Validation

Use Ajv (peer dependency) with the shipped schema:
```ts
import Ajv from 'ajv';
import schema from '@alteriom/mqtt-schema/schemas/ota/ota-manifest.schema.json';

const ajv = new Ajv({ allErrors: true });
const validate = ajv.compile(schema);
if (!validate(manifest)) {
  console.error(validate.errors);
}
```

## TypeScript Types

Type helpers are provided:
```ts
import { OtaManifest, OtaRichManifest, OtaMinimalManifest, isRichManifest } from '@alteriom/mqtt-schema/types/ota-manifest';
```

## Versioning & Compatibility

- Additive, optional properties → minor version bump of package
- Breaking structural changes → introduce a parallel `v2` schema path (future)
- Chunk model expansion (e.g., additional fields) can be additive if optional

## Future Extensions (Planned)

| Feature | Purpose | Status |
|---------|---------|--------|
| ✅ Digital signature block | Authenticity verification | **Implemented** |
| ✅ Delta patch metadata | Bandwidth optimization | **Implemented** |
| ✅ Staged rollout controls | Gradual deployment | **Implemented** |
| Compression metadata | Enable pre-compressed transfers | Planned |
| Multi-artifact grouping | Bootloader + partition set deployments | Planned |
| Automatic rollback triggers | Device-side fail-safe rules | Planned |

## Firmware Update Status Schema

The `firmware_status.schema.json` has been enhanced to support comprehensive OTA lifecycle tracking:

### Enhanced Status Values
- `pending`: Update scheduled but not started
- `downloading`: Firmware download in progress
- `flashing`: Writing firmware to device storage
- `verifying`: Verifying firmware integrity
- `rebooting`: Device restart to apply update
- `completed`: Update successful
- `failed`: Update failed
- **NEW:** `rolled_back`: Automatic rollback completed
- **NEW:** `rollback_pending`: Rollback in progress
- **NEW:** `rollback_failed`: Rollback unsuccessful (critical)

### Progress Tracking Fields
```jsonc
{
  "status": "downloading",
  "progress_pct": 42,
  "download_speed_kbps": 125.5,      // Current download speed
  "bytes_downloaded": 196608,         // Bytes received so far
  "bytes_total": 456789,             // Total firmware size
  "eta_seconds": 28,                 // Estimated time remaining
  "retry_count": 0                   // Number of retry attempts
}
```

### Security Verification
```jsonc
{
  "status": "verifying",
  "signature_verified": true,         // Digital signature check passed
  "checksum_verified": true,          // SHA256 hash verified
  "update_type": "delta"             // full | delta | patch
}
```

### Rollback Support
```jsonc
{
  "status": "rolled_back",
  "rollback_available": true,         // Can revert to previous version
  "previous_version": "2.0.8",       // Version to rollback to
  "error": "Verification failed",
  "error_code": "VERIFY_CHECKSUM_MISMATCH"  // Machine-readable code
}
```

### Operational Context
```jsonc
{
  "update_started_at": "2025-10-19T14:29:00Z",
  "update_completed_at": "2025-10-19T14:35:00Z",
  "free_space_kb": 2048,             // Storage space before update
  "battery_level_pct": 85            // Battery level (critical for battery devices)
}
```

## Relation to Firmware Repository

The firmware repository may generate manifests during build, but canonical schema lives here. Downstream tools should depend on `@alteriom/mqtt-schema` rather than copying the schema file.

## FAQ

**Why two variants?**  Rich mode captures build provenance & dual channel (dev/prod) in one document. Minimal mode is compact for constrained distribution channels or simple hosting.

**Why allow two chunk list formats?**  Object detail assists advanced OTA workflows (resume, offset verification). Hash-only lists are sufficient for straightforward integrity checks.

**Can both dev and prod appear together?**  Yes for rich manifests; in minimal variant each environment key can hold `dev`, `prod`, or both.

**Are chunk hashes required?**  No. Omit `chunks` entirely for single-hash validation scenarios.

## Change Log Reference
See `CHANGELOG.md` entry for version `0.3.0`.
