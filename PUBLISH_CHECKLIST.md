# @alteriom/mqtt-schema Publish Checklist

Reliable, repeatable release process for the MQTT schema + validators package.

---

## 1. Preconditions

- [ ] On `main` & working tree clean
- [ ] Node >= 16, npm >= 8
- [ ] `npm whoami` ok & scope access
- [ ] Schemas updated in `docs/mqtt_schema/`
- [ ] CHANGELOG updated
- [ ] `npm audit` reports zero known vulnerabilities
- [ ] Confirm the intended version is not already present with `npm view @alteriom/mqtt-schema@X.Y.Z version`

## 2. Version Decision

| Change | Bump | Notes |
|--------|------|-------|
| Docs / tooling / perf only | Patch | No schema impact |
| Add optional fields/enums | Minor | Backward compatible |
| Breaking schema | Major | Coordinate firmware + services |

Edit `package.json` version & CHANGELOG.

## 3. Build

```powershell
npm ci
npm run clean
npm run build
```

Expect: `dist/cjs`, `dist/esm`, `dist/esm/package.json`, `schemas/`.

Optional comprehensive validation check (recommended for releases):

```powershell
npm run verify        # Core validation (schema sync + changelog + fixtures)
npm run verify:all    # Extended validation (schema compilation + OTA manifests)
npm audit             # Dependency advisory check
```

## 4. Test

```powershell
npm test              # Enhanced CJS/ESM fixture validation with detailed reporting
npm run test:ota      # OTA manifest validation
```

Expect all fixtures valid under both CJS and ESM with detailed success reporting.

## 5. Optional Smoke Import

```powershell
node -e "(async () => { const cjs = require('./dist/cjs'); const esm = await import('./dist/esm/index.js'); console.log('CJS', Object.keys(cjs.validators)); console.log('ESM', Object.keys(esm.validators)); })()"
```

## 6. Commit & Tag (Manual Path)

Do not commit, tag or push a release by hand. The tag `mqtt-schema-vX.Y.Z` is created by `.github/workflows/mqtt-schema-release.yml` when the release pull request merges into `main` (section 8). That workflow skips the build, tag and publish when the tag already exists, so a tag pushed by hand before the merge leaves the version unpublished.

## 7. Publish (Manual Path)

`npm publish` is not run by hand. To check the tarball locally:

```powershell
npm publish --access public --dry-run
```

To repair a version that was tagged but never published (its merge title did not start with `release:`), a maintainer dispatches `.github/workflows/mqtt-schema-publish-manual.yml` from the tag:

```powershell
gh workflow run mqtt-schema-publish-manual.yml --ref mqtt-schema-vX.Y.Z -f version=X.Y.Z
```

Its `version` input must equal `package.json` at that ref. It builds, runs `verify:schemas` and `verify:release`, publishes to npm with provenance and mirrors to GitHub Packages, skipping a registry that already has the version (`-f mirrorOnly=true` mirrors only).

## 8. Automated Path

1. Bump version + CHANGELOG
2. Commit: `release: mqtt-schema vX.Y.Z`
3. Push to `main`

Workflow: build → tag → npm publish (provenance) → GitHub Packages mirror.

Built-in guard rails:

- Schema diff guard ensures copied `src/schemas` matches `docs/mqtt_schema` sources.
- CHANGELOG must contain the target version (heading may be marked Pending until release commit).

## 9. Post-Publish Verification

```powershell
npm view @alteriom/mqtt-schema version
npm view @alteriom/mqtt-schema version --registry=https://npm.pkg.github.com
```

Checklist:

- [ ] npm version correct
- [ ] Files include dist/, schemas/, README.md, LICENSE
- [ ] sideEffects false visible
- [ ] GitHub Packages entry exists

## 10. Consumer Test (Optional)

```powershell
mkdir tmp-consume; cd tmp-consume
npm init -y
npm install @alteriom/mqtt-schema ajv ajv-formats
node -e "console.log(Object.keys(require('@alteriom/mqtt-schema').validators))"
```

## 11. Rollback

```powershell
npm deprecate @alteriom/mqtt-schema@X.Y.Z "Superseded: <reason>; upgrade to X.Y.Z+1"
```

Then fix → bump patch → republish → note in CHANGELOG.

## 12. Release Template

```text
Release: @alteriom/mqtt-schema vX.Y.Z
Date: YYYY-MM-DD
- [ ] Version bumped
- [ ] CHANGELOG updated
- [ ] Build OK
- [ ] Tests pass (CJS+ESM)
- [ ] Tag pushed
- [ ] Published to npm
- [ ] Mirrored to GitHub Packages
- [ ] Registry versions verified
- [ ] Consumer smoke test (optional)
- [ ] If public npm skipped earlier repository tags, confirm release notes include all intervening changes
```

## 13. Dual Publish Notes

| Aspect | npm (primary) | GitHub Packages (mirror) |
|--------|---------------|--------------------------|
| Auth install | None | Token required |
| Order | First | Second |
| Provenance | Enabled | Ignored currently |
| Failure | Blocks release | Non-blocking (investigate) |
| Artifact | Same tarball | Same tarball |

Optional `.npmrc` to test mirror:

```ini
@alteriom:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

## 14. Principles

- Single build reused across registries
- Keep runtime deps minimal (`ajv` and `ajv-formats` only)
- Never edit generated `schema_data.ts`

## 15. Future Enhancements

- Provenance verification helper
- Automated schema diff guard
- CHANGELOG format linter

---
End of checklist.
