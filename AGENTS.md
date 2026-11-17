# Oddmash UI working agreements

Oddmash UI is an evolving pre-1.0 package. Treat the current visuals and APIs as reviewed working decisions, not permanent standards.

- Use `.agents/skills/oddmash-ui-development/SKILL.md` for substantive token, component, export, demo, documentation, or test work.
- Keep JSON under `tokens/` as the token source of truth. Never hand-edit `src/generated/` or `dist/`.
- Preserve ESM-only output, React 18/19 peer support, component entry points, native prop/ref behavior, accessibility contracts, and the no-global-reset boundary unless the task explicitly changes them.
- Keep product-specific layout and palettes in consumer overrides or the demo. Add them to the shared package only when more than one product needs the same behavior.
- Do not publish to npm, create a release, or change consumer repositories without explicit authorization.

For code or build changes, run the relevant subset of `npm run tokens:check`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:bundle`. For interaction, theme, responsive, or visual changes, also run `npm run test:browser`, `npm run build-storybook`, and `npm run build:demo`.

Keep shared behavior claims aligned across the English, Korean, Japanese, and Simplified Chinese READMEs.
