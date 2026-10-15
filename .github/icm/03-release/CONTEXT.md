# 03-release — the pipeline

Choose the number, prepare one pull request, let a person publish it, and confirm where it landed.

| Stage | Job | Input | Output | Human check |
|---|---|---|---|---|
| [`01_plan`](stages/01_plan/CONTEXT.md) | choose what ships and its number | the unreleased changes | `output/release-plan.md` | A maintainer approves the version number and the changelog wording. The number is permanent once tagged: a mistake later costs a new version, never a retag. |
| [`02_prepare`](stages/02_prepare/CONTEXT.md) | the release pull request | 01_plan's `release-plan.md` | `output/release-pr.md` | A maintainer reviews the final commit with every check green and the title exactly `release: mqtt-schema vX.Y.Z`. Merging it is the publish decision; the maintainer makes it, squash-merging so that the title is the commit's first line. |
| [`03_publish`](stages/03_publish/CONTEXT.md) | the person publishes, the agent confirms | 02_prepare's `release-pr.md` | `output/publication.md` | A person confirms the version is on npm, on GitHub Packages and in the GitHub releases before it is announced, and has run every dispatch the agent listed. |
