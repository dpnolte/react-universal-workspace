// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig = require('../../jest.base')

const transpileModules = [
  'react-native',
  'react-navigation-tabs',
  'react-native-screens',
  'react-native-svg',
  'react-native-reanimated',
  '@react-navigation/native',
  'react-native-safe-area-view',
  'react-native-vector-icons',
  '@react-native-community/async-storage',
].join('|')

module.exports = {
  ...defaultConfig,
  preset: 'react-native',
  transformIgnorePatterns: [`node_modules/(?!(${transpileModules})/)`],
  setupFiles: ['<rootDir>/test/setup.ts'],
}
