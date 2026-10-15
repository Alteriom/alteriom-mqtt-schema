# 01_spec — the wire change and its cost

One job: a spec that says exactly what changes in the contract, whether a payload valid today stays valid, and the version class that follows.

## Inputs
- Working (this run): the request — an issue (`gh issue view <n> --comments`), a firmware or backend need described by a person, or a `01-fix` run's `reproduction.md` (route `fix-to-schema`).
- Reference (every run): `.github/icm/_shared/schema-rules.md`
- Reference (every run): `.github/icm/_shared/architecture.md`
- Reference (only when the change adds a transport, a mesh or bridge message, or touches OTA): `docs/HTTP_TRANSPORT_GUIDE.md`

Do NOT load: the other pipelines, other runs' output, the changelogs beyond the latest section, `docs/releases/`.

## Process
1. Restate the need: which device role sends or receives the message, over which transport, and what the receiver does with it.
2. Check whether the contract already carries it: an existing schema, an optional field, `additional_data`, or an unused code ([schema-rules.md](../../../_shared/schema-rules.md); `docs/SCHEMA_MAP.md`). Prefer extending over adding.
3. Write the change as schema text: the new or changed properties with types, ranges and `required`; for a new type, its file name and its code, chosen in the range of its family and confirmed free in the envelope enum and `MESSAGE_TYPE_MAP`.
4. Classify it against "What a change costs in version": for each existing schema touched, say whether every payload valid today stays valid, and name the fixture that proves it. Anything that does not is breaking.
5. For a breaking change, draft the migration the way `V080_BREAKING_CHANGES.md` did (translation, parallel support, the deprecation window) and name who must move: Alteriom/alteriom-firmware, Alteriom/alteriom-sugarshack, Alteriom/painlessMesh.
6. List the files stage 02 will touch ("What one new message type touches").

## Outputs
- spec.md → output/ — the need; the schema change as text; the code chosen; the compatibility finding per schema with its proving fixture; the version class and why; the migration if breaking; the file list.

## Human check
A maintainer approves the schema text, the code and the version class. A code or a required field is permanent once published: a mistake later costs a major version, never an edit.
