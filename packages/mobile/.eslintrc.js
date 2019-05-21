const defaultConfig = require('../../.eslintrc.base.js')
const config = {
  extends: '../../.eslintrc.base.js',
  env: {
    jest: true,
    'react-native/react-native': true,
  },
  plugins: [...defaultConfig.plugins, 'react-native'],
}

module.exports = config
