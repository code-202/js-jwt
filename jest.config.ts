import { defineConfig } from 'jest'
import { TS_EXT_TO_TREAT_AS_ESM, ESM_TS_TRANSFORM_PATTERN } from 'ts-jest'

export default defineConfig({
    transform: {
        [ESM_TS_TRANSFORM_PATTERN]: [
            'ts-jest',
            {
                useESM: true,
            }
        ],
    },
    testMatch: [
        '**/test/**/*.test.ts'
    ],
    preset: 'ts-jest/presets/default-esm',
    extensionsToTreatAsEsm: [...TS_EXT_TO_TREAT_AS_ESM],
    testEnvironment: 'node',
});
