// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: true,                  // enables type-aware rules (requires tsconfig.json)
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.js',                      // ignore plain JS if you want only TS linted
      '**/*.d.ts',
      '**/*.spec.ts',                 // optional: ignore tests if you prefer
    ],
  }
);
