import { version } from '../package.json';

export const repositoryUrl = 'https://github.com/Oddmash/oddmash-ui';
export const npmPackageUrl = 'https://www.npmjs.com/package/@oddmash/ui';

export const packageVersion = version;
export const packageMinorVersion = version.split('.').slice(0, 2).join('.');
