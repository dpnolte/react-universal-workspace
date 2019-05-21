/* eslint-disable import/first */
// need to mock fs before importing other files that use fs
// use in-memory fs mock from metro
const mockedCurrentDir = __dirname
jest.mock('fs', () => {
  // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
  const MemoryFs = require('metro-memory-fs')
  return new MemoryFs({ cwd: () => mockedCurrentDir })
})
import fs from 'fs'
import { getTestCommandsForFiles } from '../testCommands'

describe('test test suite', () => {
  beforeEach(() => (fs as any).reset()) // optional, cleans up the whole filesystem
  it('get test commands for every package and only targeting files', () => {
    const filePaths = ['/package1/src/testA.tsx', '/package1/index.ts']
    fs.mkdirSync('/package1')
    fs.writeFileSync(
      '/package1/package.json',
      JSON.stringify({ dependencies: { jest: '1.0.0' } })
    )
    const filesPerPackageRetriever = () => ({
      '/package1': {
        name: 'package1',
        main: 'src/index.ts',
        version: '0.0.1',
        path: '/package1',
        filePaths,
      },
    })
    const testCommmands = getTestCommandsForFiles(
      filePaths,
      [],
      filesPerPackageRetriever
    )
    const expectedResult = {
      args: [
        'run',
        'jest',
        '--findRelatedTests',
        '/package1/src/testA.tsx',
        '/package1/index.ts',
      ],
      bin: 'yarn',
      cwd: '/package1',
    }

    expect(testCommmands).toEqual([expectedResult])
  })
  it('throws error that jest is not included as dependency', () => {
    const filePaths = ['/package1/src/testA.tsx', '/package1/index.ts']
    const filesPerPackageRetriever = () => ({
      '/package1': {
        name: 'package1',
        main: 'src/index.ts',
        version: '0.0.1',
        path: '/package1',
        filePaths,
      },
    })
    expect(() => {
      getTestCommandsForFiles(filePaths, [], filesPerPackageRetriever)
    }).toThrow()
  })
})
