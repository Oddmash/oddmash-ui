# Oddmash UI working agreements

Oddmash UI is an evolving pre-1.0 package. Use the current visuals and APIs as the baseline for incremental changes.

Treat every localized README as a product introduction, not a repository setup guide. Explain what Oddmash UI is, who it serves, the problem it solves, its main capabilities, and its current product status. Do not put clone, install, local-run, build, test, release, or contributor workflows in a README; keep all development and verification details in `CONTRIBUTING.md`. Keep all four README translations, language links, claims, and visuals synchronized.

- Use `.agents/skills/oddmash-ui-development/SKILL.md` for substantive token, component, export, demo, documentation, or test work.
- Use the folded ribbon in the Oddmash logo as the visual reference. Use neutral surfaces, paired diagonals, and high-contrast text. Reserve blue for focus and red for errors.
- Keep the documentation in English, Korean, Japanese, and Simplified Chinese. Localize navigation, prose, and accessible labels together. Keep public API identifiers and copyable code recognizable.
- Let users reveal alerts, dialogs, toasts, and loading states from an explicit preview control. Keep breadcrumb and pagination demos on the current page. Use shared controls in playground settings and verify keyboard focus, component motion, and reduced motion.
- Keep JSON under `tokens/` as the token source of truth. Never hand-edit `src/generated/` or `dist/`.
- Preserve ESM-only output, React 18/19 peer support, component entry points, native prop/ref behavior, accessibility contracts, and the no-global-reset boundary unless the task explicitly changes them.
- Keep product-specific layout and palettes in consumer overrides or the demo. Add them to the shared package only when more than one product needs the same behavior.
- Do not publish to npm, create a release, or change consumer repositories without explicit authorization.

For code or build changes, run the relevant subset of `pnpm run tokens:check`, `pnpm run typecheck`, `pnpm run lint`, `pnpm test`, `pnpm run build`, and `pnpm run test:bundle`. For interaction, theme, responsive, or visual changes, also run `pnpm run test:browser` and `pnpm run build:demo`.

Use a focused branch and reviewable commits for each change. Verify the relevant CI before merging. For an authorized npm release, use the GitHub Release and OIDC workflow documented in `CONTRIBUTING.md`.

## Public contribution language

Write issue and pull request titles, bodies, public review discussions, commit messages, and changelog entries in English. Use the shared English issue and PR templates from [Oddmash](https://github.com/Oddmash/.github/blob/main/CONTRIBUTING.md). Preserve existing product documentation localization and provide translation help when needed.
