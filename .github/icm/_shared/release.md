---
verified_at: 2026-10-15
verified_commit: e5f0862bf733f7847ce67b653b66ab23468e071b
---

# Releasing — from the changelogs to npm

The procedure is `PUBLISH_CHECKLIST.md`; "8. Automated Path" is the one in use. This file adds the chain of workflows, what only a person does, and what has gone wrong.

## The version and the two changelogs

- The version lives in `package.json:3` and the lockfile, nowhere else: `npm run release:prepare -- <patch|minor|major|X.Y.Z>` sets both (`scripts/release-prepare.cjs:69`) and refuses a dirty tree. A document that keeps a "current version" by hand is drift ([documents.md](documents.md)), not something to keep in step.
- `docs/mqtt_schema/CHANGELOG.md` is the one the release check reads (`scripts/check-release-integrity.cjs:11`): it needs a line starting `## ` that contains `v<version>` (`scripts/check-release-integrity.cjs:26`); "Pending" in that heading only warns. The house style is `## Unreleased (vX.Y.Z - title)` until the release, then `## YYYY-MM-DD (vX.Y.Z - title)`. The GitHub release notes are cut from the same heading (`mqtt-schema-create-release.yml`, "Extract changelog section").
- `CHANGELOG.md` is Keep a Changelog (`## [Unreleased]`, then `## [X.Y.Z] - YYYY-MM-DD`) and ships in the package (`package.json:72`). A release dates both.

## From merge to registries

`mqtt-schema-release.yml` runs on pushes to `main` that touch `package.json`, `scripts/release-prepare.cjs`, `README.md` or `docs/mqtt_schema/CHANGELOG.md` (`.github/workflows/mqtt-schema-release.yml:6`). When the tag `mqtt-schema-v<version>` does not exist yet, it builds and runs `verify:schemas` and `verify:release`, then:

1. pushes the tag, whatever the commit title (`.github/workflows/mqtt-schema-release.yml:73`);
2. publishes to npm with provenance and mirrors to GitHub Packages, only when the head commit's first line starts with `release:` (`.github/workflows/mqtt-schema-release.yml:77`). Pull requests are squash-merged, so the pull request's title is that line: `release: mqtt-schema vX.Y.Z` (`PUBLISH_CHECKLIST.md` "8. Automated Path").

The tag is pushed with the workflow's own token, which does not start `mqtt-schema-create-release.yml` from its `push: tags` trigger: every GitHub release so far was made by dispatching it with the tag (`gh run list --workflow mqtt-schema-create-release.yml` lists only `workflow_dispatch` runs).

The merge, the dispatch of `mqtt-schema-create-release.yml` and any repair dispatch are a person's acts. No agent pushes a tag, runs `npm publish`, or dispatches a publishing workflow.

## A version tagged but not published

A version bump merged under any other title gets its tag and no package, and the existing tag then makes every later run skip that version. That is how `mqtt-schema-v0.8.1` and `mqtt-schema-v0.8.2` came to exist while npm's `latest` stayed at 0.8.0 (`npm view @alteriom/mqtt-schema dist-tags`, read 2026-10-15). The repair is `mqtt-schema-publish-manual.yml`: its `version` input must equal `package.json` at the ref it runs on, and it skips a registry that already has the version, so a person dispatches it with the tag as the ref (`gh workflow run mqtt-schema-publish-manual.yml --ref mqtt-schema-vX.Y.Z -f version=X.Y.Z`), never from a `main` that has moved on. The next release's notes cover the skipped tags (`PUBLISH_CHECKLIST.md:148`).

## Not used, and why

`PUBLISH_CHECKLIST.md` "6. Commit & Tag (Manual Path)" and "7. Publish (Manual Path)", and the "Next steps" that `scripts/release-prepare.cjs:116` prints, tag and publish by hand. A tag pushed before the merge makes `mqtt-schema-release.yml` skip the publish (its `tagcheck` step). A bad version is deprecated and followed by a new patch (`PUBLISH_CHECKLIST.md` "11. Rollback"); a published version is never reused.
