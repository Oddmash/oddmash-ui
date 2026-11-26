import { defineConfig, type Plugin } from 'vite';
import { createReferencePages, resolveReferenceAsset } from './reference-pages';

const referencePages = (): Plugin => ({
  name: 'oddmash-static-reference',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const path = new URL(req.url ?? '/', 'http://localhost').pathname;
      if (!path.startsWith('/reference/') && path !== '/sitemap.xml') return next();
      const asset = resolveReferenceAsset(path);
      res.statusCode = asset ? 200 : 404;
      res.setHeader('Content-Type', (asset?.type ?? 'text/plain') + '; charset=utf-8');
      res.end(asset?.body ?? 'Reference not found.');
    });
  },
  generateBundle() {
    for (const [fileName, source] of Object.entries(createReferencePages())) {
      this.emitFile({ type: 'asset', fileName, source });
    }
  },
});
export default defineConfig({ root: 'demo', base: './', plugins: [referencePages()], build: { outDir: '../demo-dist', emptyOutDir: true } });
