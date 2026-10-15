# 01_reproduce — reproduce the reported defect

One job: turn the report into a test that fails on demand, for the reason reported.

## Inputs
- Working (this run): the report — read whole with what it links: an issue (`gh issue view <n> --comments`), a red run (`gh run view <run-id> --log-failed`), or the payload a consumer says was validated or classified wrongly.
- Reference (every run): `.github/icm/_shared/architecture.md`
- Reference (every run): `.github/icm/_shared/build-and-test.md`
- Reference (only when the report involves a schema, a field or a message code): `.github/icm/_shared/schema-rules.md`
- Reference (only when the report is a red workflow or the release tooling): `.github/icm/_shared/gotchas.md`

Do NOT load: the other pipelines, `.github/icm/_shared/release.md`, other runs' output, the changelogs beyond the entries the report names.

## Process
1. If the report could be a vulnerability (`SECURITY.md` "Reporting a Vulnerability"), stop before writing anything: this pipeline ends in a public pull request, and the private advisory is the route.
2. Restate the report as observed versus expected: the payload (shortened to what matters), the version it was seen on, the result (`kind`, `valid`, `errors`) and what it should have been.
3. Find the path with [architecture.md](../../../_shared/architecture.md): the schema in `docs/mqtt_schema/`, the validator, or the classifier branch in `src/validators.ts`. Name the suspected cause as `path:line`; a suspicion is not a finding until something fails.
4. `npm ci && npm run build`, then write the failing test where [build-and-test.md](../../../_shared/build-and-test.md) "Where a test belongs" says. It calls the package's own validators, never a copy. A valid payload that is rejected may also become a fixture; an invalid one never does.
5. Run it (`npx vitest run <file>`) and keep the failing output. If it passes, the reproduction or the report is wrong: say which, and stop.
6. If the expected behaviour would change the contract (a field required or no longer required, a code moved, a range narrowed), say so: the person may move this to `02-schema`.

## Outputs
- reproduction.md → output/ — the restated report; the suspected cause (`path:line`); the test file and the command; the failing output; whether the fix keeps the contract.

## Human check
A person runs the command or reads its output and confirms it fails for the reported reason and not a neighbouring one, and agrees whether the contract stays as it is.
