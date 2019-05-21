/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const { packages } = require('@mono/scripts')
const makeLoaderFinder = require('razzle-dev-utils/makeLoaderFinder')

const modules = [
  'node_modules',
  path.resolve(__dirname, 'node_modules'),
  path.resolve(packages.workspaceRootPath, 'node_modules'),
]

const workspaceDependencies = packages.getWorkspaceDependenciesForPackage(
  __dirname
)
const webSourceFolder = path.resolve(__dirname, 'src')

const babelLoaderFinder = makeLoaderFinder('babel-loader')

module.exports = {
  modify(config, { dev }) {
    const appConfig = { ...config } // stay immutable here
    // Safely locate Babel-Loader in Razzle's webpack internals
    const babelLoader = appConfig.module.rules.find(babelLoaderFinder)
    if (!babelLoader) {
      throw new Error(
        `'babel-loader' is not in razzle config, but we need it for babel+typescript.`
      )
    }
    // We will use our own babel config (see babel.config.js)
    // so that we can add typescript preset
    babelLoader.test = /\.(js|jsx|mjs|ts|tsx)$/
    if (
      !Array.isArray(babelLoader.use) ||
      babelLoader.use.length === 0 ||
      !babelLoader.use[0].options
    ) {
      throw new Error(
        `'babel-loader' options is not in razzle config, but we need it for babel+typescript.`
      )
    }
    // We want to use babel+typescript because babel - amongst others - better supports monorepos
    babelLoader.use[0].options.presets.push('@babel/preset-typescript')
    // include all mono packages
    babelLoader.include = [
      webSourceFolder,
      ...Object.values(workspaceDependencies).map(dependency =>
        path.dirname(path.resolve(dependency.path, dependency.main))
      ),
      ...packages.includeNonES5Modules(),
    ]

    if (dev) {
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      appConfig.module.rules.push({
        enforce: 'pre',
        test: /\.js$/,
        loader: require.resolve('source-map-loader'),
      })
    }
    appConfig.resolve.modules = modules
    appConfig.resolve.alias['react-native-svg'] = require.resolve(
      'react-native-svg-web'
    )
    // ensure we are only using one copy of react
    appConfig.resolve.alias.react = require.resolve('react')

    appConfig.resolve.extensions = [
      '.web.js',
      '.web.ts',
      '.web.tsx',
      '.dom.js',
      '.dom.ts',
      '.dom.tsx',
      ...appConfig.resolve.extensions,
      '.ts',
      '.tsx',
    ]
    // ignore other platform extensions
    appConfig.module.rules.push({
      test: /\.(native|android|ios|desktop).(js|ts|tsx)$/,
      loader: require.resolve('ignore-loader'),
    })

    appConfig.resolve.symlinks = true
    // react-native-vector-icons
    appConfig.module.rules.push({
      test: /\.ttf$/,
      loader: require.resolve('url-loader'),
      include: require.resolve('react-native-vector-icons'),
    })

    return appConfig
  },
}
