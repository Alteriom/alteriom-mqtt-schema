# 04-deps — review a dependency bump

One run is one dependency change, usually a Dependabot pull request: what moves, what it can break, and whether to merge it now. Dependabot opens them weekly for npm and monthly for GitHub Actions (`.github/dependabot.yml`); 22 have merged (#20 to #69), and one was blocked for weeks by the CI matrix rather than by its own change (issue #78).

One stage; its input, output and check are in [CONTEXT.md](CONTEXT.md):

1. [Review](stages/01_review/CONTEXT.md) — what the bump changes, and a recommendation.
