import type { Config } from 'jest';

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'babel',
  moduleNameMapper: {
    // если есть alias в import
    '^@/(.*)$': '<rootDir>/src/$1'
    // Добавьте другие алиасы, если необходимо
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)']
};

export default config;
