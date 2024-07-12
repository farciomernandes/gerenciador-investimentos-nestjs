/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
export default {
  clearMocks: true,
  testTimeout: 30000,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  coverageProvider: 'v8',
  globals: {
    NODE_ENV: 'test',
  },
  moduleNameMapper: {
    'src/(.*)$': '<rootDir>/src/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@infra/(.*)$': '<rootDir>/src/infra/$1',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    './src/infra/*',
    './src/modules/main/*',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    './src/infra/*',
    './src/modules/main/*',
  ],
  testRegex: '.*\\.spec\\.ts$',
  testResultsProcessor: 'jest-sonar-reporter',
  transform: {
    '^.+\\.(t|j)sx?$': 'ts-jest',
  },
};
