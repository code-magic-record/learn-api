module.exports = {
  env: {
    node: true
  },
  extends: 'standard-with-typescript',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    camelcase: [0, { ignoreDestructuring: true }]
  }
}
