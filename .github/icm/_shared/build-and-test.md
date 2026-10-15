---
verified_at: 2026-10-15
verified_commit: e5f0862bf733f7847ce67b653b66ab23468e071b
---

# Build and test — the commands, and what CI runs

## Locally

- `npm ci`, then `npm run build` before anything else. Its `prebuild` (`package.json:95`) cleans and runs `scripts/copy-schemas.cjs`, which generates `src/schema_data.ts`; without it `src/validators.ts` does not compile and every test fails. `npm run build:cjs` or `build:esm` alone skip `prebuild`.
- `npm test` (`package.json:105`) runs vitest (`vitest.config.mts`; `test/unit/`, `test/integration/`), then `test/validate-fixtures.cjs`, which classifies and validates every `docs/mqtt_schema/fixtures/*.json` through `dist/cjs` and `dist/esm`: every fixture there must be valid, so it needs the build.
- `npm run verify` (`package.json:117`) is schema sync, the changelog check and the tests; `npm run verify:all` (`scripts/verify_all.cjs`) compiles every schema in `schemas/`, checks `$id`s and local `$ref`s and runs the OTA manifests; `npm run test:ota` (`scripts/validate-ota-manifest.js`) validates `test/artifacts/ota/`.
- `npm run lint` and `npm run format:check` cover `src/` only (`package.json:101`, `package.json:104`; `eslint.config.mjs`, `.prettierrc.json`); `.prettierignore` excludes all JSON and Markdown.

## Where a test belongs

`TESTING.md` "Test Structure" and "Fixture-Based Testing" are the guide. In short: a validator's accept/reject case is a vitest case in `test/unit/validators.test.ts`; which validator a payload reaches, with or without `message_type`, is `test/unit/classification.test.ts`; transport metadata across envelopes is `test/unit/transport-schema-coverage.test.ts` and `test/integration/http-transport.test.ts`; a valid example payload is a fixture in `docs/mqtt_schema/fixtures/`, named as `TESTING.md` "Fixture Naming Convention" says. An invalid payload never goes in `fixtures/`.

## What CI runs

- `pr-validation.yml`: lint and format check, build and test on Node 18, 20 and 22 (`.github/workflows/pr-validation.yml:32`), build artifacts, `npm run verify`, and a 100 KB limit on the packed tarball. It is skipped when every changed file is Markdown or under `docs/` (`paths-ignore`).
- `schema-verify.yml` (`verify` and `verify:all` on Node 18 and 20) and `validate-ota-manifest.yml` run on a pull request only when their `paths` match: scripts, tests, `package.json`, the lockfile, `types/`, the OTA files.
- `metadata-compliance.yml` runs on every pull request; `icm-check.yml` when an entry file or `.github/icm/` changes; CodeQL on its schedule.
- On `main`: `mqtt-schema-release.yml` (see [release.md](release.md)) and `wiki-sync.yml`, which regenerates the wiki from `README.md`, `PUBLISH_CHECKLIST.md` and `docs/mqtt_schema/` (`scripts/generate-wiki.cjs`).
