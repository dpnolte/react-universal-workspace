/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

module.exports = {
  /** resolves from test to snapshot path */
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    return (
      testPath.replace(
        '__tests__',
        path.resolve('__tests__/__snapshots_dom__')
      ) + snapshotExtension
    )
  },

  /** resolves from snapshot to test path */
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    return snapshotFilePath
      .replace(path.resolve('__tests__/__snapshots_dom__'), '__tests__')
      .slice(0, -snapshotExtension.length)
  },
  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: 'src/screens/Home.tsx',
}
