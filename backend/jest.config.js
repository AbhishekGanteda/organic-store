module.exports = {
  testEnvironment: 'node',
  clearMocks: true,
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json', diagnostics: false }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['controllers/**/*.ts', 'utils/**/*.ts'],
};
