# 01_review — what the bump changes

One job: a review of one dependency bump that says what changes, what it can break, and whether it is safe to merge now.

## Inputs
- Working (this run): the bump — read whole: the pull request (`gh pr view <n> --comments` and `gh pr diff <n>`) with the upstream release notes it links, or the dependency a person wants to move.
- Reference (every run): `.github/icm/_shared/gotchas.md`
- Reference (every run): `.github/icm/_shared/build-and-test.md`
- Reference (only when the change moves `package.json`'s version or touches a release workflow): `.github/icm/_shared/release.md`

Do NOT load: the other pipelines, other runs' output, the source tree beyond what the bump touches.

## Process
1. Say what moves and in which group: runtime (`ajv`, `ajv-formats`: it reaches every consumer), development (build, lint, test tooling), or a GitHub Action. `.github/dependabot.yml` says how they are grouped and that majors are ignored, so a major arrives only by hand.
2. Runtime: does it close or open an advisory (`npm audit --omit=dev` before and after, on the branch)? Does Ajv's behaviour change for `strict: false` or `allowUnionTypes`? Any validator result that changes is a contract change, not a bump.
3. Development: read the checks. A job red only on Node 18 is the matrix, not the bump ([gotchas.md](../../../_shared/gotchas.md) "Node 18 in the CI matrix"): say so, name the jobs, and leave the matrix to the person.
4. GitHub Actions: a bump must not change a workflow's name, trigger, permissions or the release logic; a pinned SHA bump says which tag it is.
5. Run locally what CI does not: `npm ci && npm run build && npm run verify && npm run verify:all`, and `npm pack --dry-run` when a build tool moved.

## Outputs
- review.md → output/ — what moves, from and to; what upstream changed that matters here; the advisory before and after; each check and whether it exercised the bump; merge now, merge after something, or decline, with the reason.

## Human check
A person reads `review.md` and decides: merge, wait, or close. A runtime bump that changes any validator's result is never merged from here.
