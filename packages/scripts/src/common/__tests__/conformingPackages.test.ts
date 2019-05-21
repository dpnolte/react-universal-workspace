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
import {
  getConformanceRulesForPackage,
  getConformanceConfigRulesFromFile,
  fixAnyInvalidDependenciesForPackage,
  getNonConformingConfigAtPath,
} from '../conformingPackages'

describe('conform packages test suite', () => {
  // eslint-disable-next-line global-require
  beforeEach(() => (fs as any).reset()) // optional, cleans up the whole filesystem
  it('should get relevant config for given package to conform to', () => {
    fs.writeFileSync(
      '/packages.consistency.jsonc',
      JSON.stringify(
        {
          '/test_package/i': {
            dependencies: {
              '@mono/scripts': '0.0.1',
            },
          },
          '/other_package/i': {
            dependencies: {
              '@mono/blaat': '0.0.1',
            },
          },
          '/test_(?!package)/i': {
            dependencies: {
              '@mono/blub': '0.0.1',
            },
          },
        },
        null,
        2
      )
    )
    const requiredConfig = getConformanceConfigRulesFromFile(
      '/packages.consistency.jsonc'
    )

    fs.writeFileSync(
      '/package.json',
      JSON.stringify(
        {
          name: 'test_package',
        },
        null,
        2
      )
    )
    const relevantRules = getConformanceRulesForPackage(
      '/package.json',
      requiredConfig
    )
    expect(relevantRules).toHaveLength(1)
    expect(relevantRules[0].key).toBe(/test_package/i.toString())
    expect(relevantRules[0].config).toEqual({
      dependencies: {
        '@mono/scripts': '0.0.1',
      },
    })
  })
  it('should verify conforming package config as valid', () => {
    fs.writeFileSync(
      '/packages.consistency.jsonc',
      JSON.stringify(
        {
          '/test_package/i': {
            dependencies: {
              '@mono/common': '0.0.1',
            },
            devDependencies: {
              '@mono/scripts': '0.0.1',
            },
            scripts: {
              lint: 'eslint --ext .js,.jsx,.ts,.tsx  src/',
            },
          },
        },
        null,
        2
      )
    )
    const requiredConfig = getConformanceConfigRulesFromFile(
      '/packages.consistency.jsonc'
    )

    fs.writeFileSync(
      '/package.json',
      JSON.stringify(
        {
          name: 'test_package',
          dependencies: {
            '@mono/common': '0.0.1',
          },
          devDependencies: {
            '@mono/scripts': '0.0.1',
          },
          scripts: {
            lint: 'eslint --ext .js,.jsx,.ts,.tsx  src/',
          },
        },
        null,
        2
      )
    )
    const relevantConfig = getConformanceRulesForPackage(
      '/package.json',
      requiredConfig
    )
    expect(relevantConfig).toHaveLength(1)

    const nonConformingItems = getNonConformingConfigAtPath(
      '/package.json',
      requiredConfig
    )
    expect(Object.keys(nonConformingItems)).toHaveLength(0)
  })
  it('should verify non-conforming package config as invalid', () => {
    fs.writeFileSync(
      '/packages.consistency.jsonc',
      JSON.stringify(
        {
          '/test_package/i': {
            dependencies: {
              '@mono/common': '0.0.2',
              '@mono/conforming': '0.0.4',
            },
            devDependencies: {
              '@mono/scripts': '0.0.1',
            },
            scripts: {
              lint: 'eslint --ext .js,.jsx,.ts,.tsx  src/',
            },
          },
        },
        null,
        2
      )
    )
    const requiredConfig = getConformanceConfigRulesFromFile(
      '/packages.consistency.jsonc'
    )

    fs.writeFileSync(
      '/package.json',
      JSON.stringify(
        {
          name: 'test_package',
          dependencies: {
            '@mono/conforming': '0.0.4',
            '@mono/non_relevant_package': '0.0.3',
          },
          devDependencies: {
            '@mono/scripts': '0.0.2',
          },
          scripts: {
            linter: 'eslint --ext .js,.jsx,.ts,.tsx  src/',
          },
        },
        null,
        2
      )
    )
    const relevantConfig = getConformanceRulesForPackage(
      '/package.json',
      requiredConfig
    )
    expect(relevantConfig).toHaveLength(1)

    const nonConformingItems = getNonConformingConfigAtPath(
      '/package.json',
      requiredConfig
    )
    expect(Object.keys(nonConformingItems)).toHaveLength(3)
    // console.log(nonConformingItems)
    // TODO: add more expects here
  })
  it('should fix non-conforming config in package.json', () => {
    const invalidPackageConfig = JSON.stringify(
      {
        name: 'test_package',
        devDependencies: {
          '@mono/scripts': '0.0.1',
        },
      },
      null,
      2
    )

    fs.writeFileSync('/package.json', invalidPackageConfig)

    fs.writeFileSync(
      '/packages.consistency.jsonc',
      JSON.stringify(
        {
          '/test_package/i': {
            devDependencies: {
              '@mono/scripts': '0.0.2',
            },
          },
        },
        null,
        2
      )
    )
    const requiredConfig = getConformanceConfigRulesFromFile(
      '/packages.consistency.jsonc'
    )

    fixAnyInvalidDependenciesForPackage('/package.json', requiredConfig)

    const json = fs.readFileSync('/package.json').toString()
    const updatedConfig = JSON.parse(json)

    expect(updatedConfig.devDependencies['@mono/scripts']).toBe('0.0.2')
  })
})
