# @alteriom/mqtt-schema Publish Checklist

Purpose: Reliable, repeatable release process for the MQTT schema + validators package with embedded schemas.

## 1. Preconditions

- [ ] On `main` (or release branch) and working tree clean: `git status` shows no changes
- [ ] Node >= 16 and npm >= 8 installed
- [ ] Logged into npm: `npm whoami` returns expected org/user
- [ ] Have permission to publish `@alteriom` scope
- [ ] Firmware repo schemas updated (if needed) and committed

## 2. Decide Version Bump

Guidance:

- Patch (x.y.+1): Internal tooling improvements, README/docs, validator optimizations (NO schema changes)
- Minor (x.+1.0): Backward-compatible schema additions (new optional properties / enums)
- Major (+1.0.0): Breaking schema changes (requires new `schema_version` and parallel schema path)

Update version in `package.json` (and add a CHANGELOG entry under `docs/mqtt_schema/CHANGELOG.md`).

## 3. Clean & Build

```powershell
cd packages/alteriom-mqtt-schema
npm ci
npm run clean
npm run build
```
Expect:
- `dist/cjs` & `dist/esm` populated
- `dist/esm/package.json` exists with `{ "type": "module" }`
- `schemas/` directory present (raw JSON assets) (optional for most consumers)

## 4. Run Validation Tests

```powershell
npm test
```
Expect:
[CJS] validating 4 fixtures
 
```text
....
All fixtures valid under CJS
[ESM] validating 4 fixtures
....
All fixtures valid under ESM
```

## 5. Local Import Smoke Test (Optional but Recommended)

Create a temporary test script:

```powershell
node -e "(async () => { const cjs = require('./dist/cjs'); const esm = await import('./dist/esm/index.js'); console.log(Object.keys(cjs.validators)); console.log(Object.keys(esm.validators)); })()"
```
Should list identical validator keys.

## 6. Git Tag Preparation

```powershell
git add packages/alteriom-mqtt-schema/package.json docs/mqtt_schema/CHANGELOG.md packages/alteriom-mqtt-schema/README.md
git commit -m "release: mqtt-schema vX.Y.Z"
git tag -a mqtt-schema-vX.Y.Z -m "@alteriom/mqtt-schema vX.Y.Z"
```
Push (tags included):
```powershell
git push origin main --tags
```

## 7. Publish

Dry run first (optional):

```powershell
npm publish --access public --dry-run
```
Then publish:
```powershell
npm publish --access public
```
Expect output containing `+ @alteriom/mqtt-schema@X.Y.Z`.

## 8. Post-Publish Verification

- [ ] Visit <https://www.npmjs.com/package/@alteriom/mqtt-schema>
- [ ] Confirm version matches
- [ ] Check "Files" tab includes: `dist/`, `schemas/`, `README.md`, `LICENSE`
- [ ] Confirm `package.json` on npm shows `sideEffects: false`

## 9. Consumer Test (Optional)

In a separate sandbox project:

```powershell
npm init -y
npm install @alteriom/mqtt-schema ajv ajv-formats
node -e "const { validators } = require('@alteriom/mqtt-schema'); console.log('validators:', Object.keys(validators));"
```
Should print validator names.

## 10. Rollback Plan

If a bad release is published:

1. Deprecate the version:
   
   
   ```powershell
   npm deprecate @alteriom/mqtt-schema@X.Y.Z "Superseded due to <reason>; upgrade to X.Y.Z+1"
   ```

2. Fix issue; bump patch version; republish.
3. Communicate in repo (issue + CHANGELOG note).

## 11. Checklist Summary (Copy/Paste Template)

```text
Release: @alteriom/mqtt-schema vX.Y.Z
Date: YYYY-MM-DD
- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] Clean build successful
- [ ] Tests (CJS + ESM) passed
- [ ] Tag created & pushed
- [ ] Published to npm
- [ ] Verified on npm site
- [ ] Sandbox install validated
```

## 12. Notes

- Embedded schemas mean no runtime filesystem access; bundlers tree-shake unused validators.
- Keep Ajv as a peer dependency to avoid duplicate copies in larger apps.
- Avoid adding heavy dependencies—package should stay lean.

## 13. Future Enhancements

- Automate steps (version + tag + publish) via an npm script or GitHub Action.
- Add provenance / integrity signature (npm provenance / Sigstore) when desired.
- Add automated diff check ensuring generated schema_data matches source docs.

---
End of checklist.
