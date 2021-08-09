module.exports = {
  extends: ["eslint:recommended", "prettier"],
  plugins: [],
  globals: {
    window: true
  },
  rules: {
    semi: false
  },
  parserOptions: {
    ecmaVersion: 2017
  },
  env: {
    es6: true,
    browser: true,
    node: true
  }
};
