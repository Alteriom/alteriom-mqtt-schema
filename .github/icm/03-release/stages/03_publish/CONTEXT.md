# 03_publish — the person publishes, the agent confirms

One job: follow the merged version through the release workflow, hand the person each dispatch that is theirs to run, and confirm the version in every destination. The agent runs no publishing command.

## Inputs
- Working (this run): `.github/icm/03-release/stages/02_prepare/output/release-pr.md` — or, for a repair (route `publish-repair`), only the tag `mqtt-schema-vX.Y.Z` the person names; start at step 3.
- Reference (every run): `.github/icm/_shared/release.md`

Do NOT load: the other pipelines, other runs' output, the source tree.

## Process
1. After the person's merge, find the `mqtt-schema-release.yml` run on the merge commit (`gh run list --workflow mqtt-schema-release.yml --branch main --limit 3`) and read its summary: the version, "Tag existed", "Auto-publish". If it skipped the publish, stop and tell the person why ([release.md](../../../_shared/release.md) "From merge to registries"): nothing reached npm.
2. If the run failed before the tag, nothing was released: the fix is a `01-fix` run and a new release plan, never a re-run that skips a check.
3. Check each destination for `X.Y.Z`: the tag (`git ls-remote --tags origin mqtt-schema-vX.Y.Z`); npm (`npm view @alteriom/mqtt-schema@X.Y.Z version`); GitHub Packages (`PUBLISH_CHECKLIST.md` "9. Post-Publish Verification"); the GitHub release (`gh release view mqtt-schema-vX.Y.Z`).
4. For each destination missing, write the exact command for the person: the GitHub release is `gh workflow run mqtt-schema-create-release.yml -f tag=mqtt-schema-vX.Y.Z`; a missing package is the manual publish, run on the tag ([release.md](../../../_shared/release.md) "A version tagged but not published"). The person runs it; the agent checks again after.

## Outputs
- publication.md → output/ — the workflow run with its result; each destination with the version seen and a link; each dispatch handed to the person and what it changed.

## Human check
A person confirms the version is on npm, on GitHub Packages and in the GitHub releases before it is announced, and has run every dispatch the agent listed.
