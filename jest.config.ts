import type { Config } from 'jest';
const esModules = ['lodash-es'].join('|');

globalThis.ngJest = {
  skipNgcc: false,
  tsconfig: 'tsconfig.spec.json',
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};

const config: Config = {
  verbose: false,
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
  testMatch: ['<rootDir>/src/**/**.spec.ts'],
  globalSetup: 'jest-preset-angular/global-setup',
  collectCoverage: true,
  coverageReporters: ['lcov', 'text', 'cobertura'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!**/*.module.ts',
  ],
  moduleNameMapper: {
  },
  modulePathIgnorePatterns: [],
  transformIgnorePatterns: [`node_modules/(?!.*\\.mjs$|${esModules})`],
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './reports',
        filename: 'index.html',
        pageTitle: 'Report Jest',
      },
    ],
  ],
};

export default config;
