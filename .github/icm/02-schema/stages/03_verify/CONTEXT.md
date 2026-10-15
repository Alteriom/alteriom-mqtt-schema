# 03_verify — compatibility proven, changelogs, pull request

One job: the pull request a reviewer can merge, with the proof that the version class in the spec is the true one.

## Inputs
- Working (this run): `.github/icm/02-schema/stages/02_change/output/change.md`
- Reference (every run): `.github/icm/_shared/build-and-test.md`
- Reference (every run): `.github/icm/_shared/gotchas.md`
- Reference (every run): `.github/icm/_shared/release.md`

Do NOT load: the other pipelines, other runs' output.

## Process
1. Run the full local set: `npm run build`, `npm run verify`, `npm run verify:all`, `npm run test:ota` if OTA changed, `npm run lint` and `npm run format:check`, and `npm pack` with its size against the 100 KB limit.
2. Prove the class: check out the previous tag's fixtures (`git show mqtt-schema-v<previous>:docs/mqtt_schema/fixtures/<file>`) for each touched schema and validate them against the new build. All must pass for a patch or minor.
3. Make sure CI will run: the diff includes `src/schemas/` or another path outside `docs/` ([gotchas.md](../../../_shared/gotchas.md) "A schema change that CI never sees").
4. Add the entries under the unreleased headings of `docs/mqtt_schema/CHANGELOG.md` (keep `## Unreleased (vX.Y.Z - title)` form, [release.md](../../../_shared/release.md)) and `CHANGELOG.md` (`### Added` or `### Changed`; a breaking change says so first). Update `README.md`'s message code table if a code was added. Do not bump `package.json`: that is a release.
5. Write the pull request: the need, the schema change, the class and its proof, the consumers to tell, the checks and results. Title: `feat(schema): <the outcome>` (or `fix(schema): ...` from route `fix-to-schema`). After the human check the agent opens it (`gh pr create --base main --body-file <this stage's output/pull-request.md>`); it never merges.

## Outputs
- pull-request.md → output/ — title and body, the compatibility proof, the checks with results, the changelog entries as written, the consumers to notify.

## Human check
A person reads `pull-request.md`, confirms the old fixtures passed against the new build, and says whether to open it. The reviewer merges once every check is green; a breaking change waits for the release that carries its migration.
