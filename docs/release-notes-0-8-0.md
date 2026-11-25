# Oddmash UI 0.8.0

## Highlights

- [DateSelect (#132)](https://github.com/Oddmash/oddmash-ui/pull/132) provides six native, labelled date-and-time controls down to seconds.
- It supports controlled and uncontrolled values, required and disabled fields, optional clearing, valid Gregorian calendar dates, day adjustment on month/year changes, and native form reset.
- The `YYYY-MM-DDTHH:mm:ss` value has no timezone. Consumers own timezone conversion.
- Root and `@oddmash/ui/date-select` entry points, token-based styles, and interactive English, Korean, Japanese, and Simplified Chinese documentation are included.

## Installation

```sh
pnpm add @oddmash/ui@0.8.0
```

Import `@oddmash/ui/styles.css` and create a DateSelect with a label:

```tsx
<DateSelect label="Date and time" defaultValue="2026-11-25T14:30:42" />
```

## Compatibility

React 18.3.1 and React 19 remain supported. No new runtime dependency, global reset, existing public API change, or consumer migration is required.

**Full changelog:** https://github.com/Oddmash/oddmash-ui/compare/v0.7.0...v0.8.0
