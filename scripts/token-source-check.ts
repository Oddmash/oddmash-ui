import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

export const findRawDesignValues = (source: string) => {
  const stripped = source.replace(/"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\/\*[\s\S]*?\*\/|^\s*\/\/.*$/gm, '');
  return [...new Set(stripped.match(/-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|ms|s)\b/g) ?? [])];
};

export const checkTokenSources = async (root: string) => {
  const visit = async (directory: string): Promise<void> => {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (directory === root && entry.name === 'generated') continue;
        await visit(path);
      } else if (entry.isFile() && entry.name.endsWith('.scss')) {
        const match = findRawDesignValues(await readFile(path, 'utf8'));
        if (match.length) throw new Error(`src/${relative(root, path)}: raw design values ${match.join(', ')}; use JSON tokens`);
      }
    }
  };
  await visit(root);
};
