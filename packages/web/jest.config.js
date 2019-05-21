/* eslint-disable @typescript-eslint/no-var-requires */
const reactNativeWebPreset = require('react-native-web/jest-preset')
const defaultConfig = require('../../jest.base')

const transpileModules = ['react-native-vector-icons'].join('|')

module.exports = {
  ...defaultConfig,
  ...reactNativeWebPreset,
  moduleNameMapper: {
    ...defaultConfig.moduleNameMapper,
    ...reactNativeWebPreset.moduleNameMapper,
    '^react-native-svg$': require.resolve('react-native-svg-web'),
  },
  transformIgnorePatterns: [`node_modules/(?!(${transpileModules})/)`],
}
