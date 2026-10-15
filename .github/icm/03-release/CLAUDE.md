# 03-release — release a version

One run is one version of `@alteriom/mqtt-schema`, from the unreleased changelog sections to the same number on npm, GitHub Packages and the GitHub releases. Releases recur here (#7, #8, #10, #19, #76), and the history shows how they go wrong: two tagged versions never reached npm ([release.md](../_shared/release.md) "A version tagged but not published").

The person decides the number, merges the release pull request (its `release:` title is what publishes) and dispatches any workflow. The agent prepares and then verifies; it never pushes a tag, publishes, or dispatches a publishing workflow. `PUBLISH_CHECKLIST.md` is the procedure; this pipeline does not restate it.

Stages, in order; inputs, outputs and checks for each are in [CONTEXT.md](CONTEXT.md):

1. [Plan](stages/01_plan/CONTEXT.md) — what ships, and which number.
2. [Prepare](stages/02_prepare/CONTEXT.md) — the release pull request.
3. [Publish](stages/03_publish/CONTEXT.md) — the person merges and dispatches; the agent confirms every registry.
