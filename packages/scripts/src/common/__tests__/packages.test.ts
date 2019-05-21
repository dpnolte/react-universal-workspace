import { IPackages, findPackagesForFiles } from '../packages'

describe('packages test suite', () => {
  it('find package paths for files', () => {
    const packagesRetriever = (): IPackages => {
      return {
        package1: {
          name: 'package1',
          main: 'src/index.ts',
          version: '0.0.1',
          path: '/package1',
        },
      }
    }
    const result = findPackagesForFiles(
      ['/package1/src/testA.tsx', '/package1/index.ts'],
      packagesRetriever
    )
    expect(result).toEqual({
      '/package1': {
        name: 'package1',
        main: 'src/index.ts',
        version: '0.0.1',
        path: '/package1',
        filePaths: ['/package1/src/testA.tsx', '/package1/index.ts'],
      },
    })
  })
  it('throw error when file is not in a package path', () => {
    const packagesRetriever = (): IPackages => {
      return {
        package1: {
          name: 'package1',
          main: 'src/index.ts',
          version: '0.0.1',
          path: '/package1',
        },
      }
    }
    expect(() => {
      findPackagesForFiles(['/package2/src/testA.tsx'], packagesRetriever)
    }).toThrow()
  })
})
