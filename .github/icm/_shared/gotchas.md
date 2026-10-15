---
verified_at: 2026-10-15
verified_commit: e5f0862bf733f7847ce67b653b66ab23468e071b
---

# Gotchas — traps with a history here

## A schema change that CI never sees

`pr-validation.yml` is skipped when every changed file is Markdown or under `docs/` (its `paths-ignore`), and `schema-verify.yml` watches `schemas/`, `scripts/`, `test/` and the package files, not `docs/mqtt_schema/` (its `paths`). A pull request that edits only `docs/mqtt_schema/` therefore runs no build, test or schema check. A schema change always commits the regenerated `src/schemas/` copy (`npm run build`; `scripts/check-schema-sync.cjs` fails without it), which brings `pr-validation.yml` in, and runs `npm run verify` locally first.

## Node 18 in the CI matrix

The test jobs still run Node 18 (`.github/workflows/pr-validation.yml:32`, `.github/workflows/schema-verify.yml:24`) and `package.json:89` declares `node >=16`. Current vitest needs Node 20.12 or later, so a devDependency bump that moves it fails `Run Tests (18)` and `verify (node 18.x)` while Node 20 and 22 pass: issue #78 records Dependabot pull request #77 blocked that way. Dropping Node 18 from the matrix and `engines` is a person's decision; a review says which red jobs are Node 18 only, and never "fixes" it inside a bump.

## Runtime advisories arrive through Ajv

`ajv` and `ajv-formats` are runtime dependencies (`package.json:158`), so an advisory in their tree (issue #78: `fast-uri` via `ajv`) reaches every consumer, while the development group's bumps do not touch it. `.github/dependabot.yml` groups production and development minor and patch updates separately and ignores every major; a transitive fix may need a lockfile refresh by hand (`npm audit --omit=dev` shows the runtime tree).

## The package's size and its file list

`pr-validation.yml` fails a packed tarball over 100 KB; the package was cut from 116 KB to 90 KB in #30 by shipping only the declarations listed in `package.json` `files` (`package.json:72`). A new entry point needs its line in `files`, `exports` and `typesVersions`, or it is missing from the package while every test passes against the local build.

## Files that look current and are not

`docs/mqtt_schema/mqtt_v1_bundle.json` lists 13 of the schemas and has not followed the later ones; `copyList` in `scripts/copy-schemas.cjs:18` is the real list. The documents that keep stale code lists or version numbers are under "Known drift" in [documents.md](documents.md).
