# alteriom-mqtt-schema

`@alteriom/mqtt-schema` on npm: the MQTT v1 message contract the Alteriom firmware and backend share, as JSON Schemas, TypeScript types and Ajv validators with a message classifier (MIT, CJS and ESM). Alteriom/alteriom-firmware and Alteriom/alteriom-sugarshack declare it, so a schema or message-code change is a wire change for both. What leaves this repository is a reviewed pull request or a version on npm.

## Where things live

| Path | What it holds |
|---|---|
| `docs/mqtt_schema/` | the source of truth: schemas, `types.ts`, fixtures, `validation_rules.md`, the schema changelog |
| `src/`, `scripts/`, `types/` | validators and classifier; the build, sync and release scripts; OTA manifest types — mapped in [architecture.md](.github/icm/_shared/architecture.md) |
| `test/` | vitest unit and integration tests, fixture validation, OTA artifacts, benchmarks |
| `.github/workflows/` | PR validation, schema verify, OTA validation, auto tag and publish, manual publish, GitHub release, wiki sync |
| `CONTRIBUTING.md`, `DEVELOPMENT.md`, `TESTING.md`, `PUBLISH_CHECKLIST.md`, `SECURITY.md` | how to contribute; the build and schema procedures; tests and fixtures; the release; private vulnerability reports |
| `CHANGELOG.md`, `docs/mqtt_schema/CHANGELOG.md` | what changed, for package users; per schema, the one the release check reads |
| [`.github/icm/_shared/`](.github/icm/_shared/CONTEXT.md) | what every job below draws on, one file per question |
| [`.github/icm/01-fix/`](.github/icm/01-fix/CLAUDE.md) | fix a defect in a validator, the classifier, a schema or the tooling |
| [`.github/icm/02-schema/`](.github/icm/02-schema/CLAUDE.md) | change the contract: a message type, field, code or enum value |
| [`.github/icm/03-release/`](.github/icm/03-release/CLAUDE.md) | release a version to npm; a person executes the publish |
| [`.github/icm/04-deps/`](.github/icm/04-deps/CLAUDE.md) | review a dependency bump |

## Route by what just happened

| Route | If | Go to | Then stop at |
|---|---|---|---|
| triage | an issue arrives and its kind is unclear | read it whole (`gh issue view <n> --comments`) and take the row below that fits | the row chosen, said to the person |
| fix | a defect is reported (issue, failing test, a payload validated or classified wrongly) | [01_reproduce](.github/icm/01-fix/stages/01_reproduce/CONTEXT.md) | a person has seen the reproduction fail |
| ci-red | a workflow is red on `main` or on a pull request for a reason not in its diff | [01_reproduce](.github/icm/01-fix/stages/01_reproduce/CONTEXT.md), with the run log as the report | a person has seen the reproduction fail |
| security | a report may be a vulnerability | [SECURITY.md](SECURITY.md) "Reporting a Vulnerability": a private advisory, never a public issue or pull request | the maintainer has the private report |
| schema | a message type, field, code or enum value is to be added or changed | [01_spec](.github/icm/02-schema/stages/01_spec/CONTEXT.md) | a person approves the spec and its version class |
| fix-to-schema | a fix turns out to need a contract change | [01_spec](.github/icm/02-schema/stages/01_spec/CONTEXT.md), with the fix run's `reproduction.md` as the request | a person approves the spec and its version class |
| release | a version is to be released | [01_plan](.github/icm/03-release/stages/01_plan/CONTEXT.md) | a person approves the version number |
| publish-repair | a tagged version is missing from npm, GitHub Packages or the GitHub releases | [03_publish](.github/icm/03-release/stages/03_publish/CONTEXT.md), from step 3, for that tag | a person has dispatched the repair and seen the version |
| deps | Dependabot opened a pull request, or a dependency is to move | [01_review](.github/icm/04-deps/stages/01_review/CONTEXT.md) | a person decides to merge it or not |
| message-code | asked what a message type code means or which to use | [schema-rules.md](.github/icm/_shared/schema-rules.md) "Message type codes" | the answer, with the file and line that proves it |
| next | a stage's output was approved | the next numbered stage of the same job | a person reads that stage's output |
| status | asked for status | scan `.github/icm/*/stages/*/output/` | report what exists |

## Agents connecting remotely

This repository is to be the ICM workspace `alteriom-mqtt-schema` on MemoryRelay. A person creates it from this repository's `main`; the Alteriom hub then delegates to it. Until it exists, and on any clone, an agent needs nothing: this file is the entry, the table above is the route, and the files it links are read directly.

- Once the workspace exists, an agent that is not on a clone reaches the same files over MCP at `https://api.memoryrelay.net/mcp` and starts with `icm_context_build` for the route that fits (`{kind: "route", id: "fix"}`), not with the whole repository.
- Report what you read with `icm_report_reads` when a stage ends, and what the task came to with `icm_report_outcome`.
- Never write through MCP: a change is a branch and a pull request here, read and merged by a person.

## Rules

- Nothing moves to the next stage until a person has read the output of the last one.
- A stage writes to its own `output/`, which is not committed: one run per worktree or branch, and clear that job's `stages/*/output/` when its pull request merges or is abandoned.
- A job reads only its own run's output; moving to another job is a route above, started by the person.
- No agent pushes a tag, publishes a package or dispatches a publishing workflow: a merge titled `release:` publishes, and a person makes it.
- `.github/icm/` points at the files that own each fact. When they disagree, the owning file is right: correct `.github/icm/` in the same pull request, and bump its `verified_commit`.
