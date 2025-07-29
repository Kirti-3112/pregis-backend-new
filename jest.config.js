module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: [
    'node_modules',
    'src/config',
    'src/app.js',
    'src/index.js',
    'tests',
    'src/docs',
    'src/validations',
    'src/routes',
    'src/models',
    'src/middleware',
    'src/utils/socketHandler.js',
  ],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**'],
  coverageThreshold: {
    global: {
      statements: 83,
      branches: 70,
      functions: 82,
      lines: 82,
    },
  },
};
