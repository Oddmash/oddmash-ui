import manifest from '../package.json' with { type: 'json' };

export const repositoryUrl = 'https://github.com/Oddmash/oddmash-ui';
export const npmPackageUrl = 'https://www.npmjs.com/package/@oddmash/ui';

export const packageVersion = manifest.version;
export const packageMinorVersion = packageVersion.split('.').slice(0, 2).join('.');
