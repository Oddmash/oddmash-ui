# Mobile workspace

The existing UI package remains at the repository root. The Mobile interaction package lives in `packages/mobile` and retains its package name `@oddmash/mobile-interactions`, public exports, CSS entry, experimental alpha status and existing component tests.

## Work on both packages

Use Node 24 and the pnpm version pinned in the root manifest.

```sh
pnpm install --frozen-lockfile --ignore-scripts
pnpm run build
pnpm --filter @oddmash/mobile-interactions run verify
pnpm --filter @oddmash/mobile-interactions run test:browser
pnpm --filter @oddmash/mobile-interactions pack
```

The workspace links the UI package into Mobile development via `workspace:*`. Independent lockfiles preserve the root React 18 compatibility checkout and Mobile dependency inputs. Build UI before Mobile docs or tests that consume its distribution. Do not publish the Mobile package from this migration branch.

## Documentation and evidence

- [Mobile product introduction](../packages/mobile/README.md)
- [Mobile planning and implementation docs](../packages/mobile/docs/README.md)
- [Alpha usage and limitations](../packages/mobile/docs/alpha.md)
- [Alpha verification](../packages/mobile/docs/alpha-verification.md)

The existing Mobile site and source repository remain available during migration. Public integrated navigation, URL compatibility and independent release configuration are tracked in #196. Remaining device and registry verification is tracked in #197.

## History and retirement

The initial import preserves the exact source develop and main histories. Original source tree content is under `packages/mobile`; workspace-specific adjustments are separate commits. The first import run verified source tree equality and ancestry before pushing the feature branch. Additional archival refs were rejected by GitHub because the source branch histories contain workflow files and the runner token does not have workflows permission. Do not bypass that restriction. Keep the source repository until full branch/tag/issue/PR backup and retirement gates in #198 are verified. No registry publication or source deletion is implied.
