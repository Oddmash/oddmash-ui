import { defineConfig } from 'vite';
import { guidePages, renderGuide } from './scripts/render-guide.mjs';

const routes = new Set(guidePages.map(([slug]) => slug));

export default defineConfig({
  plugins: [{
    name: 'mobile-guide',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const { pathname, search } = new URL(request.url ?? '/', 'http://localhost');
        const match = pathname.match(/^\/guide(?:\/([a-z-]+))?\/?$/);
        const slug = match?.[1] ?? '';
        if (!match || !routes.has(slug)) return next();
        if (!pathname.endsWith('/')) {
          response.writeHead(308, { Location: `${pathname}/${search}` });
          response.end();
          return;
        }
        renderGuide(slug).then((html) => {
          response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          response.end(html);
        }).catch(next);
      });
    },
  }],
});
