/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const defaultConfig = require('../../../jest.base')

const projectDir = path.resolve(__dirname, '..')

module.exports = {
  ...defaultConfig,
  rootDir: projectDir,
  moduleNameMapper: {
    ...defaultConfig.moduleNameMapper,
    '^react-native$': 'react-native-web',
  },
  testEnvironment: 'jsdom',
  snapshotResolver: path.resolve(__dirname, 'snapshotResolver.dom.js'),
}
