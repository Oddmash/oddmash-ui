# Oddmash UI 0.9.0

## Highlights

- [Calendar and date range pickers (#138)](https://github.com/Oddmash/oddmash-ui/pull/138) add DateCalendar, DatePicker and DateRangePicker to the existing date selection family.
- DateCalendar provides month navigation, a keyboard-operable day grid, Today, distinct current and selected days, and localized day and month names.
- DatePicker supports `date` using `YYYY-MM-DD`, `year-month` using `YYYY-MM`, and `date-time` using `YYYY-MM-DDTHH:mm:ss`. Calendar selection preserves time through seconds.
- DateRangePicker accepts independently clearable start and end bounds. Reversed periods retain both draft values and visibly report invalid order. Set `withTime` for exact second precision.
- Root and component subpath exports are available, with token-based light/dark styling and interactive documentation in English, Korean, Japanese, and Simplified Chinese.

## Installation

```sh
pnpm add @oddmash/ui@0.9.0
```

Import `@oddmash/ui/styles.css` and the desired component from the package root or the `date-calendar`, `date-picker` or `date-range-picker` subpath:

```tsx
<DateRangePicker
  label="Activity period"
  withTime
  defaultValue={{ start: "2026-11-01T00:00:00", end: "" }}
/>
```

Consumers own timezone conversion and draft application.

## Compatibility

React 18.3.1 and React 19 remain supported. No new runtime dependency, global reset, existing DateSelect API change, or migration is required.

**Full changelog:** https://github.com/Oddmash/oddmash-ui/compare/v0.8.0...v0.9.0
