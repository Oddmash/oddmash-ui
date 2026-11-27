# Alpha verification

These checks apply to the documentation preview and the packed alpha candidate for `@oddmash/mobile-interactions`.

| Area | Evidence |
| --- | --- |
| Install and package | Frozen pnpm install and build. Installed the tarball in clean React 18.3.1 and 19.3.1 projects. Verified public subpaths, server rendering, and CSS resolution. |
| Browser flows | Playwright runs shared scenarios for all six primitives in Chromium, Firefox and WebKit. CDP touch cases run in Chromium only. See [browser verification](browser-verification.md). |
| First use | Built the site and rendered its exact copyable Bottom Sheet example with the packed package in Next.js 16.4.6 App Router. |
| Accessibility checks | Checked the built demo at 320 CSS px with doubled root text size, reduced motion, and focus restoration in all three engines. axe-core 4.14.1 reported zero violations for the tested tags on the Chromium landing page and open sheet. |
| Physical devices and assistive technology | See the [device verification procedure](device-verification.md). The browser suite uses desktop browsers and emulation. |

## Current package budget

`pnpm build && pnpm verify:budget` measures a minified consumer bundle of the complete six-component `dist/index.js` export and the shipped stylesheet at gzip level 6. It uses the repository's pinned Vite, the existing React and React DOM peer externals, and the ES2022 target. The current result is 5,178 bytes of JavaScript and 1,613 bytes of CSS. CI budgets are 8,192 and 2,048 bytes respectively. They leave headroom for API-compatible changes to the six primitives while keeping the complete compressed entry below 10 KiB. The check excludes React and host app assets.

On the local Apple M5, headless Chromium 158.0.8127.18 at 390 × 844 recorded a p95 animation-frame interval of 16.7 ms both at idle (128 intervals) and while dragging the inbox row (237 intervals). No interval exceeded 34 ms in either sample. The drag used mouse input on the built demo. Treat this as a desktop baseline for comparison, with mobile-device latency recorded separately.

## Performance baseline

The historical measurements below describe the original four-primitive baseline. Use them for comparison with that candidate and its fixtures.

For a Vite 8.3.8 minified ESM build of the complete package entry with React peer imports externalized, gzip size was 4,149 bytes for JavaScript and 931 bytes for the shipped CSS. App code and React are outside this measurement.

A 390 × 844 headless Chromium viewport on the local machine recorded a p95 animation-frame interval of 16.7 ms at idle (47 intervals) and 16.8 ms during a pointer-driven swipe (95 intervals). This is an initial desktop measurement of the demo. Device results and a release performance budget remain open.

For the filtering comparison, both fixtures opened a modal sheet, changed between two snap points, accepted a text input, and restored trigger focus when applying the filter in Chromium at 390 × 844. Using a minified Vite 8.3.8 ESM build with React and React DOM externalized, the gzip JavaScript size was 3,267 bytes for the Oddmash Bottom Sheet fixture and 38,824 bytes for the [Base UI Drawer](https://base-ui.com/react/components/drawer) 1.9.0 fixture. These numbers compare the specific entry points and fixture JavaScript. They exclude CSS and do not measure feature parity or production application performance.

For the inbox comparison, both fixtures opened row actions by keyboard and pointer swipe and refreshed the list by pulling in the same Chromium viewport. Under the same build settings, the Oddmash Swipe Action and Pull to Refresh fixture was 2,157 gzip JavaScript bytes. A fixture using [use-gesture](https://use-gesture.netlify.app/docs/gestures/) React 10.3.1 with local action and refresh state was 9,105 bytes. Both fixtures are minimal and this comparison covers their tested behavior.
