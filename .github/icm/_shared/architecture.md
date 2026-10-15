---
verified_at: 2026-10-15
verified_commit: e5f0862bf733f7847ce67b653b66ab23468e071b
---

# Architecture — where each part of the package lives

## The source of truth and its copies

- `docs/mqtt_schema/` holds the authoritative JSON Schemas, `types.ts`, the fixtures and `validation_rules.md`. A schema is edited there and nowhere else.
- `scripts/copy-schemas.cjs:18` (`copyList`) copies them into `src/schemas/`, which is committed and must match (`scripts/check-schema-sync.cjs`, `npm run verify:schemas`), and into `schemas/`, the copy the package ships, which is ignored (`.gitignore:4`). A schema missing from `copyList` is neither validated nor published.
- The same script generates `src/schema_data.ts` (`scripts/copy-schemas.cjs:130`), the schemas embedded as constants so no file is read at runtime, and copies `types.ts` to `src/generated/types.ts` (`scripts/copy-schemas.cjs:66`). Both are ignored (`.gitignore:8`, `.gitignore:9`) and never edited by hand.

## The code

- `src/validators.ts` — one Ajv instance (`src/validators.ts:98`: `strict: false`, `allErrors`, `allowUnionTypes`, ajv-formats, the envelope registered so `$ref`s resolve); every validator compiled at module load; `classifyAndValidate` (`src/validators.ts:274`) tries the `message_type` code first (`MESSAGE_TYPE_MAP`, `src/validators.ts:225`, after translating legacy 300/301 at `src/validators.ts:219`), then event and shape heuristics in order, and falls back to the sensor heartbeat. A result's `errors` are `instancePath message` strings (`toResult`).
- `src/index.ts` is the export surface; `src/types.ts` re-exports `src/generated/types.ts`; `types/ota-manifest.d.ts` is hand-written.
- What the package exports and ships: `package.json` `exports` and `files` (`package.json:72`); `sideEffects: false`.

## The build

The dual CJS/ESM build and the schema embedding are explained in `DEVELOPMENT.md` "Understanding the Dual-Build System" and "Schema Embedding Strategy": `tsconfig.json` builds `dist/cjs/` with declarations, `tsconfig.esm.json` builds `dist/esm/`, and `scripts/post-esm.cjs` marks it `type: module`. ESM imports in `src/` carry `.js` extensions.

## Who consumes it

Alteriom/alteriom-firmware and Alteriom/alteriom-sugarshack declare `@alteriom/mqtt-schema` in their `package.json`, and Alteriom/painlessMesh does too. A change to a required field, an enum or a message code reaches all of them: [schema-rules.md](schema-rules.md) says what that costs.
