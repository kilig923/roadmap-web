module.exports = {
  env: {
    browser: true,
    amd: true,
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/prop-types': 0,
    'react-hooks/exhaustive-deps': 1,
    "no-console": ["error", { "allow": ["log"] }],
    "no-unused-vars": 0
  },
};
