export { testEnvironment: 'node', clearMocks, transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json', diagnostics };],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['controllers/**/*.ts', 'utils/**/*.ts'],
};
