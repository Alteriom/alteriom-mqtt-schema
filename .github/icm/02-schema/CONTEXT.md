# 02-schema — the pipeline

Decide the wire change and its cost, make it everywhere it lives, prove old payloads still pass.

| Stage | Job | Input | Output | Human check |
|---|---|---|---|---|
| [`01_spec`](stages/01_spec/CONTEXT.md) | the wire change and its cost | the request | `output/spec.md` | A maintainer approves the schema text, the code and the version class. A code or a required field is permanent once published: a mistake later costs a major version, never an edit. |
| [`02_change`](stages/02_change/CONTEXT.md) | make the change everywhere it lives | 01_spec's `spec.md` | `output/change.md` | A person reads the schema diff beside the approved spec: nothing more, nothing less, and no existing fixture or test edited to pass. Edit `change.md` if it is wrong; stage 03 reads it. |
| [`03_verify`](stages/03_verify/CONTEXT.md) | compatibility proven, changelogs, pull request | 02_change's `change.md` | `output/pull-request.md` | A person reads `pull-request.md`, confirms the old fixtures passed against the new build, and says whether to open it. The reviewer merges once every check is green; a breaking change waits for the release that carries its migration. |
