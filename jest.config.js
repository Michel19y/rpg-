

  module.exports = {
    preset: 'react-native',
    testEnvironment: 'node',
    collectCoverageFrom: [
      '**/*.{js,jsx}',
      '!**/node_modules/**',
      '!**/coverage/**',
      '!**/*.test.js'
    ],
    coverageReporters: ['text', 'lcov'],
    coverageDirectory: 'coverage',
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
   
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
  };