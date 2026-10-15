# 01-fix — fix a defect

One run is one defect in a validator, the classifier, a schema that rejects what it should accept (or the reverse), or the build and release tooling: reproduced, fixed at its cause, and proposed as a pull request with the evidence. `fix(...)` pull requests are the most frequent hand-written change here (#58, #61, #63, #75).

A fix keeps the contract: if it needs a new field, code or a narrower rule, it stops and the person starts `02-schema` (route `fix-to-schema` in the root `CLAUDE.md`).

Stages, in order; inputs, outputs and checks for each are in [CONTEXT.md](CONTEXT.md):

1. [Reproduce](stages/01_reproduce/CONTEXT.md) — make it fail on purpose.
2. [Fix](stages/02_fix/CONTEXT.md) — change the cause, watch the reproduction pass.
3. [Verify](stages/03_verify/CONTEXT.md) — the full checks, the changelogs, the pull request.
