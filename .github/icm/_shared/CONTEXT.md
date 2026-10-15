# Shared reference

What every job on this repository draws on. Each file points at the repository file that owns a fact; follow the pointer for the detail.

| File | Answers |
|---|---|
| [architecture.md](architecture.md) | where each part of the package lives, what is generated, who consumes it |
| [build-and-test.md](build-and-test.md) | how to build and test, where a test belongs, what CI runs and what it skips |
| [schema-rules.md](schema-rules.md) | what a schema change costs in version, the message codes, the field rules, what a new type touches |
| [release.md](release.md) | how a version is chosen and published, what is the person's to do, how a missing publication is repaired |
| [gotchas.md](gotchas.md) | traps that have already cost a build, a release or a dependency bump, each with its source |
| [documents.md](documents.md) | the repository documents pinned for agents, and those known to disagree with the code |

Each stage's contract names the files it loads.
