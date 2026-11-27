import { copyFile } from 'node:fs/promises';
await Promise.all(['styles.css', 'styles.css.d.ts'].map((name) =>
  copyFile(new URL(`../src/${name}`, import.meta.url), new URL(`../dist/${name}`, import.meta.url)),
));
