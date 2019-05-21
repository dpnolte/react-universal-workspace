/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const defaultConfig = require('../../../jest.base')

const projectDir = path.resolve(__dirname, '..')

module.exports = {
  ...defaultConfig,
  rootDir: projectDir,
  preset: 'react-native',
  snapshotResolver: path.resolve(__dirname, 'snapshotResolver.native.js'),
}
