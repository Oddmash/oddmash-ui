import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';
const result = await build({ stdin: { contents: "export { Button } from '@oddmash/ui';", resolveDir: process.cwd() }, bundle: true, write: false, format: 'esm', minify: true, external: ['react', 'react-dom', 'react/jsx-runtime'], metafile: true });
const bytes = result.outputFiles[0].contents;
const included = Object.values(result.metafile.outputs).flatMap((output) => Object.entries(output.inputs).filter(([, value]) => value.bytesInOutput > 0).map(([name]) => name));
if (included.some((name) => name.includes('@radix-ui'))) throw new Error('Button-only bundle includes Radix');
if (bytes.length > 2000) throw new Error(`Button-only bundle exceeds 2 kB: ${bytes.length}`);
console.log(JSON.stringify({ buttonBytes: bytes.length, buttonGzipBytes: gzipSync(bytes).length, radixIncluded: false }));
