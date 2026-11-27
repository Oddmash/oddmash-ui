# Oddmash Mobile working agreements

Follow the [organization agreements](https://github.com/Oddmash/.github/blob/main/AGENTS.md), especially concurrent work claims, contributor protections and normal merge commits. Consult the [Oddmash skills catalog](https://github.com/Oddmash/oddmash-skills) for product, architecture, accessibility and QA guidance.

Follow the [Oddmash review follow-up guidance](https://github.com/Oddmash/.github/blob/main/docs/AI-CODE-REVIEW.md#following-up-on-review-findings) when addressing review findings.

- Integrate through develop; main is reserved for approved releases. Create issue-linked topic branches, claim work only when no overlapping session or contributor owns it, and verify exact-head CI and independent review before merge.
- Start authorized work in the same turn after preflight. Do not replace implementation with a promise or repeatedly ask for unchanged authorization.
- Use TypeScript, React 18/19, pnpm 11.25.0, Node 24 and independent ESM module exports. No mandatory router, CSS framework, global reset or telemetry.
- Keep DOM access inside client lifecycle. Public component modules and root entry preserve use client. Validate controlled state, pointer cancellation, modal focus, scrolling and viewport changes; keep gesture alternatives operable by keyboard.
- Keep APIs experimental until release evidence exists. Update docs, demos, tests and exported types together. Record physical device results separately from browser emulation.
- Run pnpm verify, pnpm test:browser and pnpm pack before review. Do not claim browser or accessibility conformance without evidence. The trusted aggregate CI job is verify.
- Publish only from approved main with the release gate in docs/quality-and-release.md; never embed npm credentials. Record support limitations, version and artifact evidence.

## GitHub account use

Follow the [Oddmash GitHub account policy](https://github.com/Oddmash/.github/blob/main/docs/github-account-policy.md). Use the verified maintainer account for authorized GitHub work, with command-scoped authentication and a separate checkout or worktree per session. Reserve the alternate account for isolated tests. Only `qtaghdi` gives final approval to and manually merges external contributions.
