'use strict';

module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['import'],
  extends: ['eslint:recommended', 'plugin:import/recommended'],
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js'],
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  rules: {
    // ── Style ──────────────────────────────────────────────────────────
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    eqeqeq: ['error', 'always'],
    curly: ['error', 'all'],
    'consistent-return': 'error',

    // ── Import hygiene ─────────────────────────────────────────────────
    // Detect circular dependencies (import A -> B -> A)
    'import/no-cycle': ['error', { maxDepth: 4, ignoreExternal: true }],

    // Disallow importing from outside a module's public boundary.
    // Each module under src/modules/* should only be accessed via its
    // index.js (or routes file). Cross-module deep imports are forbidden.
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // DB layer must not import from modules
          {
            target: './src/db',
            from: './src/modules',
            message: 'DB layer must not import from application modules.',
          },
          // Config must not import from modules or db
          {
            target: './src/config',
            from: './src/modules',
            message: 'Config must not import from application modules.',
          },
          {
            target: './src/config',
            from: './src/db',
            message: 'Config must not import from the db layer.',
          },
          // Utils must not import from modules, db, or middleware
          {
            target: './src/utils',
            from: './src/modules',
            message: 'Utils must not import from application modules.',
          },
          {
            target: './src/utils',
            from: './src/middleware',
            message: 'Utils must not import from middleware.',
          },
          // Middleware must not import from modules
          {
            target: './src/middleware',
            from: './src/modules',
            message: 'Middleware must not import from application modules.',
          },
        ],
      },
    ],

    // Enforce module members are resolved
    'import/named': 'error',
    'import/no-unresolved': ['error', { ignore: ['^@/'] }],
    'import/order': [
      'warn',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
      },
    ],
  },
  overrides: [
    {
      // Relax rules for migration and seed files which use knex's callback patterns
      files: ['src/db/migrations/**/*.js', 'src/db/seeds/**/*.js'],
      rules: {
        'consistent-return': 'off',
      },
    },
    {
      // Test files may use require() and relaxed no-unused-vars
      files: ['**/*.test.js', '**/*.spec.js'],
      rules: {
        'no-unused-vars': 'warn',
      },
    },
  ],
};
