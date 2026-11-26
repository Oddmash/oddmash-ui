import { defineConfig, type Plugin } from 'vite';
import { createReferencePages } from './reference-pages';

const referencePages = (): Plugin => ({
  name: 'oddmash-static-reference',
  apply: 'build',
  generateBundle() {
    for (const [fileName, source] of Object.entries(createReferencePages())) {
      this.emitFile({ type: 'asset', fileName, source });
    }
  },
});
export default defineConfig({ root: 'demo', base: './', plugins: [referencePages()], build: { outDir: '../demo-dist', emptyOutDir: true } });
