# 02_change — make the change everywhere it lives

One job: the approved spec, applied to every file that carries the contract, with fixtures and tests that pin it.

## Inputs
- Working (this run): `.github/icm/02-schema/stages/01_spec/output/spec.md`
- Reference (every run): `.github/icm/_shared/schema-rules.md`
- Reference (every run): `.github/icm/_shared/build-and-test.md`
- Reference (only when the change adds a message type): `DEVELOPMENT.md` "Adding a New Message Type"

Do NOT load: the other pipelines, other runs' output.

## Process
1. Branch from current `origin/main`. Change the schema in `docs/mqtt_schema/` exactly as the spec's text says; anything the spec did not say goes back to the person.
2. Follow "What one new message type touches" in [schema-rules.md](../../../_shared/schema-rules.md) for every file the spec listed: `copyList`, `types.ts` (interface and type guard), `src/validators.ts` (validator, `MESSAGE_TYPE_MAP`, a heuristic only if needed, placed so it captures nothing that classified elsewhere), the envelope enum, `docs/SCHEMA_MAP.md`.
3. Add a valid fixture per new shape in `docs/mqtt_schema/fixtures/`, and vitest cases for what must be rejected and for classification with and without `message_type` ([build-and-test.md](../../../_shared/build-and-test.md) "Where a test belongs").
4. `npm run build`, then commit the regenerated `src/schemas/`. Run `npm test` and `npm run verify:schemas`; every existing fixture must still pass unchanged. A fixture edited to make it pass is a breaking change the spec did not approve: stop and say so.

## Outputs
- change.md → output/ — each file changed and why; the fixtures and tests added; the test and schema-sync output; confirmation that no existing fixture changed.

## Human check
A person reads the schema diff beside the approved spec: nothing more, nothing less, and no existing fixture or test edited to pass. Edit `change.md` if it is wrong; stage 03 reads it.
