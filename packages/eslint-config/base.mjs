import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/**', 'coverage/**', '.next/**', '.turbo/**'],
  },

  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  {
    rules: {
      'no-console': 'warn',
    },
  },
);
