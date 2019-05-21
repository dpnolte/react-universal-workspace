const config = {
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  overrides: [
    {
      files: '*.jsonc',
      options: { parser: 'json' },
    },
  ],
}

module.exports = config
