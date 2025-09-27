// Type definitions for Alteriom OTA Manifest (rich + minimal variants)
// Generated manually alongside schema at schemas/ota/ota-manifest.schema.json

export interface OtaChunkObject {
  index: number;        // 0-based sequential index
  offset: number;       // byte offset within firmware binary
  size: number;         // chunk size in bytes
  sha256: string;       // lowercase hex sha256 of the chunk
}

// Rich manifest build entry (dev or prod)
export interface OtaRichEntryBase {
  build_type: 'dev' | 'prod';
  file: string;              // firmware-dev.bin or firmware-prod.bin
  size: number;              // total firmware size (bytes)
  sha256: string;            // full firmware binary sha256
  firmware_version: string;  // semantic or build version string
  built: string;             // ISO8601 timestamp
  ota_url: string;           // absolute or relative fetch URL
  chunk_size?: number;       // size each chunk except possibly last
  // Either structured objects OR array of sha256 strings
  chunks?: OtaChunkObject[] | string[];
}

export type OtaRichEntry = OtaRichEntryBase;

export interface OtaRichManifest {
  environment: string;   // e.g. universal-sensor
  branch: string;        // source control branch build originated from
  manifests: {
    dev?: OtaRichEntry;
    prod?: OtaRichEntry;
  };
}

// Minimal variant channel entry
export interface OtaMinimalChannel {
  file: string;      // firmware-dev.bin / firmware-prod.bin
  size: number;      // bytes
  sha256: string;    // full firmware sha256
  version: string;   // version string
  timestamp: string; // ISO8601 build time
  chunk_size?: number;
  chunks?: string[]; // hash-only list (no structured offsets)
}

export interface OtaMinimalEnv {
  dev?: OtaMinimalChannel;
  prod?: OtaMinimalChannel;
}

// Root minimal map: environment -> channels
export type OtaMinimalManifest = Record<string, OtaMinimalEnv>;

export type OtaManifest = OtaRichManifest | OtaMinimalManifest;

export function isRichManifest(m: OtaManifest): m is OtaRichManifest {
  return (m as OtaRichManifest).manifests !== undefined && typeof (m as any).environment === 'string';
}

export function isMinimalManifest(m: OtaManifest): m is OtaMinimalManifest {
  return !isRichManifest(m);
}
