import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';

const result = await build({
  configFile: false,
  logLevel: 'silent',
  build: {
    write: false,
    minify: true,
    target: 'es2022',
    lib: { entry: fileURLToPath(new URL('../dist/index.js', import.meta.url)), formats: ['es'] },
    rolldownOptions: { external: [/^react(?:-dom)?(?:\/|$)/] },
  },
});
const chunks = (Array.isArray(result) ? result : [result]).flatMap(({ output }) => output)
  .filter((item) => item.type === 'chunk');
if (!chunks.length) throw new Error('The package entry produced no JavaScript chunks');
const javascript = chunks.reduce((size, chunk) => size + gzipSync(chunk.code).length, 0);
const css = gzipSync(await readFile(new URL('../dist/styles.css', import.meta.url))).length;
for (const [name, size, limit] of [['JavaScript', javascript, 8 * 1024], ['CSS', css, 2 * 1024]]) {
  console.log(`${name}: ${size} / ${limit} gzip bytes`);
  if (size > limit) process.exitCode = 1;
}
