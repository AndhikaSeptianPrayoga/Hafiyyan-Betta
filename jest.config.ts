import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.test.json', useESM: true }],
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
      useESM: true,
    },
  },
  testMatch: ['<rootDir>/src/**/*.(test|spec).(ts|tsx)'],
  clearMocks: true,
}

export default config