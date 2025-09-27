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
  ]
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
      "chunk_size": 8192,
      "chunks": ["<64 hex>", "<64 hex>"]
    }
  }
}
```

## Chunk Hash Strategy

Two representations exist to balance introspection detail vs payload compactness:
- Structured Object Array: Provides offsets & sizes (good for progressive verification, partial resume, advanced diagnostics)
- Hash String Array: Minimal form when only integrity verification is needed.

The schema ensures only one form is used at a time for any given firmware entry.

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

| Feature | Purpose |
|---------|---------|
| Digital signature block | Authenticity verification |
| Delta patch metadata | Bandwidth optimization |
| Compression metadata | Enable pre-compressed transfers |
| Multi-artifact grouping | Bootloader + partition set deployments |

## Relation to Firmware Repository

The firmware repository may generate manifests during build, but canonical schema lives here. Downstream tools should depend on `@alteriom/mqtt-schema` rather than copying the schema file.

## FAQ

**Why two variants?**  Rich mode captures build provenance & dual channel (dev/prod) in one document. Minimal mode is compact for constrained distribution channels or simple hosting.

**Why allow two chunk list formats?**  Object detail assists advanced OTA workflows (resume, offset verification). Hash-only lists are sufficient for straightforward integrity checks.

**Can both dev and prod appear together?**  Yes for rich manifests; in minimal variant each environment key can hold `dev`, `prod`, or both.

**Are chunk hashes required?**  No. Omit `chunks` entirely for single-hash validation scenarios.

## Change Log Reference
See `CHANGELOG.md` entry for version `0.3.0`.
