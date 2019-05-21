/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path')

module.exports = {
  // ...typescriptPreset,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': path.resolve(
      __dirname,
      'test/identityObjProxy.js'
    ),
    '\\.(css|less|scss)$': path.resolve(__dirname, 'test/identityObjProxy.js'),
  },
  transform: {
    '^.+\\.[tj]sx?$': path.resolve(__dirname, 'test/babelJestTransformer.js'),
  },
}
