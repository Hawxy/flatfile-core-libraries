module.exports = {
  bail: 0,
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testRegex: '.*\\.spec\\.[tj]s$',
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/dist/', '<rootDir>/coverage/'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
//    '@flatfile/api/(.*)': '<rootDir>/src/$1',
    '@flatfile/platform-sdk/(.*)': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFiles: ['<rootDir>/test/jest-init.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/jest-env-init.ts'],
  collectCoverage: true,
  // Temporarily commented out due to https://github.com/facebook/jest/issues/12751
  // coverageThreshold: {
  //   global: {
  //     branches: 50,
  //     functions: 60,
  //     lines: 70,
  //     statements: 70,
  //   },
  // },
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/src/types/'],
}
