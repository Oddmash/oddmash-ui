# Oddmash UI 0.4.1

## Toast refinements

- Center notification icons and dismiss controls vertically, including multiline messages.
- Give neutral, success, information, warning, error and loading notifications distinct visual indicators.
- Support custom decorative icons with `icon`, or hide the icon with `icon={null}`.
- Add a non-urgent loading tone with reduced-motion-aware animation.
- Keep notification insets balanced on narrow viewports, including classic scrollbars.

The existing controlled Toast API, danger/error aliases, and live-region behavior remain compatible.

## Regression coverage

The changes include component and browser tests for icon semantics, alignment, narrow viewport insets and reduced motion.

Related: #81, #84.
