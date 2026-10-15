# 01_plan — choose what ships and its number

One job: a release plan that names the version, justifies its class, and drafts both dated changelog sections.

## Inputs
- Working (this run): the unreleased changes — the unreleased sections of `CHANGELOG.md` and `docs/mqtt_schema/CHANGELOG.md`, and `main` since the previous tag (`git log --oneline mqtt-schema-v<previous>..origin/main`).
- Reference (every run): `.github/icm/_shared/release.md`
- Reference (every run): `.github/icm/_shared/schema-rules.md`
- Reference (every run): `PUBLISH_CHECKLIST.md` — "1. Preconditions", "2. Version Decision", "12. Release Template".

Do NOT load: the other pipelines, other runs' output, released changelog sections beyond the previous one, `docs/releases/` beyond the latest summary.

## Process
1. Find the previous tag (`git tag --list 'mqtt-schema-v*' --sort=-v:refname | head -3`) and what npm has (`npm view @alteriom/mqtt-schema dist-tags versions`). If tags exist that npm does not have, say which: the notes must cover them, and the person may want them repaired first (route `publish-repair`).
2. List every merged change since the previous tag and match each to an unreleased entry in both changelogs. A user-visible change with no entry is a gap to fill now; an entry with no change is a mistake to remove.
3. Classify against "What a change costs in version" in [schema-rules.md](../../../_shared/schema-rules.md) and `PUBLISH_CHECKLIST.md` "2. Version Decision". Say which entry decides the class.
4. Confirm `main` is green (`gh run list --branch main --limit 10`) and that the runtime tree has no open advisory (`npm audit --omit=dev`), or name what is pending.
5. Draft both dated sections: `## YYYY-MM-DD (vX.Y.Z - title)` for `docs/mqtt_schema/CHANGELOG.md`, `## [X.Y.Z] - YYYY-MM-DD` for `CHANGELOG.md`, keeping the entries' wording unless it is wrong. Name the branch (`release/X.Y.Z`) and the pull request title (`release: mqtt-schema vX.Y.Z`).

## Outputs
- release-plan.md → output/ — the version and the entry that decides its class; the changes included; tags not on npm; the state of `main` and the runtime audit; both drafted sections; branch and title.

## Human check
A maintainer approves the version number and the changelog wording. The number is permanent once tagged: a mistake later costs a new version, never a retag.
