'use strict';

/** @type {import('jest').Config} */
module.exports = {
  // Run tests in a Node.js environment (no browser globals)
  testEnvironment: 'node',

  // Where to find test files
  testMatch: ['**/__tests__/**/*.test.js', '**/*.test.js', '**/*.spec.js'],

  // Files to exclude
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  // Collect coverage from source files only
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/db/migrations/**',
    '!src/db/seeds/**',
    '!src/server.js',
  ],

  // Coverage output directory
  coverageDirectory: 'coverage',

  // Reporters used in CI (text-summary for stdout, lcov for tooling)
  coverageReporters: ['text', 'text-summary', 'lcov'],

  // Enforce minimum coverage thresholds — build fails if these are not met
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },

  // Module name aliases so tests can use '@/' instead of long relative paths
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@db/(.*)$': '<rootDir>/src/db/$1',
    '^@middleware/(.*)$': '<rootDir>/src/middleware/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
  },

  // Global setup: load .env so process.env is available in tests
  globalSetup: undefined,

  // Run each test file in a dedicated worker (sequential with --runInBand flag)
  // maxWorkers is controlled at CLI level via `jest --runInBand`

  // Clear mock state between every test
  clearMocks: true,
  restoreMocks: true,

  // Verbose output per test
  verbose: true,
};
