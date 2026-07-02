import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';

export default defineConfig([
  {
    files: ['**/*.js'],
    plugins: { js },
    extends: ['js/recommended'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.bunBuiltin,
      },
    },

    rules: {
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
]);
