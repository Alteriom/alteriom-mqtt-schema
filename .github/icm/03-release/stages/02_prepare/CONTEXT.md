# 02_prepare — the release pull request

One job: one pull request that sets the version, dates both changelogs, and passes every check, titled so that its merge publishes.

## Inputs
- Working (this run): `.github/icm/03-release/stages/01_plan/output/release-plan.md`
- Reference (every run): `.github/icm/_shared/release.md`
- Reference (every run): `.github/icm/_shared/build-and-test.md`
- Reference (every run): `PUBLISH_CHECKLIST.md` — "3. Build", "4. Test", "5. Optional Smoke Import".

Do NOT load: the other pipelines, other runs' output.

## Process
1. Branch `release/X.Y.Z` from current `origin/main` with a clean tree.
2. `npm run release:prepare -- X.Y.Z` sets `package.json` and the lockfile. Ignore the "Next steps" it prints: tagging and publishing are the workflow's and the person's ([release.md](../../../_shared/release.md) "Not used, and why").
3. Put the approved dated sections in place of the unreleased ones in both changelogs; leave an empty `## [Unreleased]` in `CHANGELOG.md`. Check `git grep -n "<previous version>"`: a document that keeps the version by hand is noted for a separate correction, not updated here.
4. `npm ci && npm run build && npm run verify && npm run verify:all && npm run test:ota`, the smoke import, and `npm pack --dry-run` (size under 100 KB, the files expected). Fix what fails; never skip a check.
5. Open the pull request against `main` titled `release: mqtt-schema vX.Y.Z`, the body the changelog section plus the checks' output. Say in the body that merging it tags and publishes.

## Outputs
- release-pr.md → output/ — the pull request link and title, the files changed, the checks' output, the state of every check on the final commit.

## Human check
A maintainer reviews the final commit with every check green and the title exactly `release: mqtt-schema vX.Y.Z`. Merging it is the publish decision; the maintainer makes it, squash-merging so that the title is the commit's first line.
