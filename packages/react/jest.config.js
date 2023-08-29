module.exports = {
  preset: '@flatfile/jest-preset-platform-sdk',
  moduleNameMapper: {
    '\\.(css|less|sass|scss|otf)$': '<rootDir>/src/test/styleMock.js',
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.env.js',
  ],
}
