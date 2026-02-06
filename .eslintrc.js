module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react-hooks'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react-native/no-raw-text': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
      },
      extends: [
        '@react-native-community',
      ],
    },
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '19.0.0',
    },
  },
  ignorePatterns: ['src/template-js', 'src/template-ts', 'lib', 'dist'],
};
