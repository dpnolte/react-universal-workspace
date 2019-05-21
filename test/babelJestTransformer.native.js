/* eslint-disable @typescript-eslint/no-var-requires, import/no-extraneous-dependencies */
const { createTransformer } = require('babel-jest')

module.exports = createTransformer({
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 2,
        targets: {
          browsers: ['> 1%'],
        },
      },
    ],
    '@babel/preset-typescript',
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/syntax-dynamic-import',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-object-rest-spread',
  ],
})
