/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
// eslint-disable-next-line import/no-extraneous-dependencies
const { packages } = require('@mono/scripts')

const workspaceDependencies = packages.getWorkspaceDependenciesForPackage(
  __dirname
)
const desktopSourceFolder = path.resolve(__dirname, 'src')

const isBabelLoaderForInternalJs = rule => {
  return (
    rule.loader &&
    rule.loader.indexOf('/node_modules/babel-loader/') !== -1 &&
    rule.include === desktopSourceFolder
  )
}

module.exports = function override(providedConfig, env) {
  const config = providedConfig
  if (env === 'development') {
    // want to add source-map
    config.module.rules.push({
      enforce: 'pre',
      test: /\.js$/,
      loader: require.resolve('source-map-loader'),
    })
  }
  // want to add react-native-vector-icons
  config.module.rules.push({
    test: /\.ttf$/,
    loader: require.resolve('url-loader'),
    include: require.resolve('react-native-vector-icons'),
  })

  const oneOfRule = config.module.rules.find(rule => rule.oneOf)
  if (!oneOfRule) {
    console.log(
      'CRA\'s webpack config has changed. Cannot find "oneOf" rule in config.module.rules'
    )
    process.exit(1)
  }
  // include workspace dependency for babel loader and add typescript preset
  const babelLoaderForInternalJS = oneOfRule.oneOf.find(
    isBabelLoaderForInternalJs
  )
  if (!babelLoaderForInternalJS) {
    console.log(
      'CRA\'s webpack config has changed. Cannot find "babel loader" rule for javascript within package folder'
    )
    process.exit(1)
  }
  babelLoaderForInternalJS.include = [
    desktopSourceFolder,
    ...Object.values(workspaceDependencies).map(dependency =>
      path.dirname(path.resolve(dependency.path, dependency.main))
    ),
    ...packages.includeNonES5Modules(),
  ]
  babelLoaderForInternalJS.options.presets.push('@babel/preset-typescript')

  // Support React Native Web
  // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
  if (!config.resolve.alias) {
    config.resolve.alias = {}
  }
  config.resolve.alias['webpack/hot/poll'] = require.resolve('webpack/hot/poll')
  config.resolve.alias['react-native'] = require.resolve('react-native-web')
  config.resolve.alias['react-native-svg'] = require.resolve(
    'react-native-svg-web'
  )
  // ensure we are only using one copy of react
  config.resolve.alias.react = require.resolve('react')

  if (!config.resolve.extensions) {
    config.resolve.extensions = []
  }
  config.resolve.extensions.unshift(
    '.desktop.js',
    '.desktop.ts',
    '.desktop.tsx',
    '.dom.js',
    '.dom.ts',
    '.dom.tsx'
  )

  // ignore other platform extensions
  config.module.rules.push({
    test: /\.(native|android|ios|web).(js|ts|tsx)$/,
    loader: require.resolve('ignore-loader'),
  })

  // need to set target for electron
  config.target = 'electron-renderer'

  return config
}
