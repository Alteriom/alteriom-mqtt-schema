# 03_verify — checks, changelogs, pull request

One job: the pull request a reviewer can merge, with the evidence CI will look for. Running the checks and writing the changelog entries are its steps, not separate jobs.

## Inputs
- Working (this run): `.github/icm/01-fix/stages/02_fix/output/change.md`
- Reference (every run): `.github/icm/_shared/build-and-test.md`
- Reference (every run): `.github/icm/_shared/gotchas.md`
- Reference (only when the fix touches the release tooling or a changelog heading): `.github/icm/_shared/release.md`

Do NOT load: the other pipelines, other runs' output.

## Process
1. Run what CI runs that the change can affect ([build-and-test.md](../../../_shared/build-and-test.md) "What CI runs"): `npm run verify`, `npm run verify:all`, `npm run test:ota` if OTA files changed, lint and format if `src/` changed, `npm pack` and its size if the shipped files changed. If the diff touches only `docs/`, say how CI will still see it ([gotchas.md](../../../_shared/gotchas.md) "A schema change that CI never sees").
2. Add the entry under the unreleased heading of both changelogs: `CHANGELOG.md` (`### Fixed` under `## [Unreleased]`) and `docs/mqtt_schema/CHANGELOG.md` when a schema or validator changed, in the wording of the entries around it. Update any document that described the old behaviour. Do not change `package.json`'s version: that is a release.
3. Write the pull request: what was wrong, how you know (the reproduction), what the change does; the checks run and their results. Title: `fix(<area>): <the outcome>`, never starting with `release:`, which is reserved for the merge that publishes a version.
4. After the human check, the agent opens it against `main` from this file (`gh pr create --base main --title "<title>" --body-file <this stage's output/pull-request.md>`). The agent never merges.

## Outputs
- pull-request.md → output/ — the title and body, the checks run with their results, the changelog entries as written.

## Human check
A person reads `pull-request.md` and its evidence, then says whether to open it. The reviewer, not the author, merges, once every check on the last commit is green.
