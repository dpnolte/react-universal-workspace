/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * For more info regarding metro config:
 * @see https://facebook.github.io/metro/docs/en/configuration
 * @see https://raw.githubusercontent.com/facebook/metro/ba01db616f3371a9832825afa42506643b7b173f/packages/metro-config/src/defaults/defaults.js
 * @format
 */

const blacklist = require('metro-config/src/defaults/blacklist')
const { packages } = require('@mono/scripts')
const path = require('path')
const escapeStringRegexp = require('escape-string-regexp')

const workspacePackages = packages.getWorkspacePackages()
const dependencies = packages.getWorkspaceDependenciesForPackage(
  __dirname,
  workspacePackages
)
const dependencyNames = Object.keys(dependencies)
const dependencyPaths = dependencyNames.map(n => dependencies[n].path)
const watchFolders = [packages.workspaceRootPath, ...dependencyPaths]

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
      },
    }),
  },
  watch: true /* watch all files */,
  watchFolders,
  resolver: {
    // Blacklist any react native references not from mobile package to prevent any duplicate haste modules
    // and ensure that we only refer to one react copy to prevent hook issues
    blacklistRE: blacklist([
      new RegExp(
        `^(?!(${escapeStringRegexp(__dirname)})).*\\/(react-native|react)\\/.*`
      ),
      // ignore other platform extensions
      /\.(desktop|dom|web)\.(js|ts|tsx)$/,
    ]),
    // The metro resolver resolves module names to file paths.
    // When using extraNodeModules, the provided extra path will be added
    // as a potential resolvement for the given module name.
    // @see: https://github.com/facebook/metro/blob/4bb996994e0d138652a8580f1bf5effc0291866b/packages/metro-resolver/src/resolve.js#L113-L138
    extraNodeModules: {
      // Ensure the path to mobile's react-native node module is always available to the resolver,
      // even if react native is referenced from workspace root package or another workspace package
      'react-native': require.resolve('react-native'), // points to mobile package's react native module
      // enable react always to resolve to the one in mobile's node modules
      react: require.resolve('react'),
      // @see https://github.com/zalmoxisus/remote-redux-devtools/issues/39
      ws: path.resolve(
        path.dirname(require.resolve('socketcluster-client')),
        'lib/ws-browser.js'
      ),
    },
  },
}

module.exports = config
