# 02-schema — change the message contract

One run is one change to what the firmware and the backend agree on: a new message type, a new field, a new code or enum value, a changed rule. It is the job this repository exists for: most feature pull requests here are schema additions (#3, #11, #13, #15, #16, #17, #29, #63, #75), and each reaches Alteriom/alteriom-firmware and Alteriom/alteriom-sugarshack through the published package.

The spec fixes the version class before any file changes, because a breaking change costs a major version and a migration (`V080_BREAKING_CHANGES.md` is the precedent).

Stages, in order; inputs, outputs and checks for each are in [CONTEXT.md](CONTEXT.md):

1. [Spec](stages/01_spec/CONTEXT.md) — what changes on the wire, and what it costs.
2. [Change](stages/02_change/CONTEXT.md) — every file the change touches, with fixtures and tests.
3. [Verify](stages/03_verify/CONTEXT.md) — compatibility proven, changelogs, the pull request.
