import { defineConfig } from 'jest'

export default defineConfig({
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: [
        '**/test/**/*.test.ts'
    ],
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: ['.ts'],
    testEnvironment: 'node',
});
