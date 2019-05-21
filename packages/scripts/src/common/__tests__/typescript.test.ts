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
import { findTypescriptConfigPaths } from '../typescript'

const mockedTsConfig = `
{
  "target": "es5" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017','ES2018' or 'ESNEXT'. */,
  "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', or 'ESNext'. */,
  "jsx": "react" /* Specify JSX code generation: 'preserve', 'react-native', or 'react'. */,
  "noEmit": true,
  "downlevelIteration": true /* Provide full support for iterables in 'for-of', spread, and destructuring when targeting 'ES5' or 'ES3'. */,
  "strict": true /* Enable all strict type-checking options. */,
  "noImplicitAny": true /* Raise error on expressions and declarations with an implied 'any' type. */,
  "strictNullChecks": true /* Enable strict null checks. */,
  "noImplicitThis": true /* Raise error on 'this' expressions with an implied 'any' type. */,
  "noUnusedLocals": true /* Report errors on unused locals. */,
  "noImplicitReturns": true /* Report error when not all code paths in function return a value. */,
  "noFallthroughCasesInSwitch": true /* Report errors for fallthrough cases in switch statement. */,
  "moduleResolution": "node" /* Specify module resolution strategy: 'node' (Node.js) or 'classic' (TypeScript pre-1.6). */,    
  "allowSyntheticDefaultImports": true /* Allow default imports from modules with no default export. This does not affect code emit, just typechecking. */,
  "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,    
  "allowUnreachableCode": false,
  "forceConsistentCasingInFileNames": true,
  "pretty": true,
  "suppressImplicitAnyIndexErrors": true,
  "skipLibCheck": true,
}
`

const mockedComponentFileContents = `
import React from 'react'
export const TestComponent = () => <div />
`

describe('typescript script test suite', () => {
  beforeEach(() => (fs as any).reset()) // optional, cleans up the whole filesystem

  it('should find tsconfig for typescript file', () => {
    fs.writeFileSync('/tsconfig.json', mockedTsConfig)
    fs.mkdirSync('/src')
    fs.mkdirSync('/src/components')
    fs.writeFileSync(
      '/src/components/componentA.tsx',
      mockedComponentFileContents
    )

    const configPath = findTypescriptConfigPaths([
      '/src/components/componentA.tsx',
    ])
    expect(configPath).toEqual({
      found: {
        '/tsconfig.json': ['/src/components/componentA.tsx'],
      },
      notFound: [],
    })
  })
  it('should find nearest tsconfig, and ignore deeper tsconfigs', () => {
    fs.mkdirSync('/level1')
    fs.writeFileSync('/level1/tsconfig.json', mockedTsConfig)
    fs.mkdirSync('/level1/level2')
    fs.writeFileSync('/level1/level2/tsconfig.json', mockedTsConfig)
    fs.mkdirSync('/level1/level2/level3')
    fs.writeFileSync('/level1/level2/level3/tsconfig.json', mockedTsConfig)
    fs.mkdirSync('/level1/level2/level3/src')
    fs.mkdirSync('/level1/level2/level3/src/components')
    fs.writeFileSync(
      '/level1/level2/level3/src/components/componentA.tsx',
      mockedComponentFileContents
    )
    fs.writeFileSync('/tsconfig.json', mockedTsConfig)
    const configPath = findTypescriptConfigPaths([
      '/level1/level2/level3/src/components/componentA.tsx',
    ])
    expect(configPath).toEqual({
      found: {
        '/level1/level2/level3/tsconfig.json': [
          '/level1/level2/level3/src/components/componentA.tsx',
        ],
      },
      notFound: [],
    })
  })
  it('finds and normalizes multiple files per tsconfig', () => {
    fs.mkdirSync('/other_project')
    fs.writeFileSync(
      '/other_project/ComponentWithoutConfig.tsx',
      mockedComponentFileContents
    )
    fs.mkdirSync('/level1')
    fs.writeFileSync('/level1/tsconfig.json', mockedTsConfig)
    fs.mkdirSync('/level1/src')
    fs.mkdirSync('/level1/src/components')
    fs.writeFileSync(
      '/level1/src/components/componentA.tsx',
      mockedComponentFileContents
    )

    fs.mkdirSync('/level1/level2')
    fs.writeFileSync('/level1/level2/tsconfig.json', mockedTsConfig)
    fs.mkdirSync('/level1/level2/src')
    fs.mkdirSync('/level1/level2/src/components')
    fs.writeFileSync(
      '/level1/level2/src/components/componentB.tsx',
      mockedComponentFileContents
    )

    fs.mkdirSync('/level1/level2/level3')
    fs.writeFileSync('/level1/level2/level3/tsconfig.json', mockedTsConfig)
    fs.mkdirSync('/level1/level2/level3/src')
    fs.mkdirSync('/level1/level2/level3/src/components')
    fs.writeFileSync(
      '/level1/level2/level3/src/components/componentC.tsx',
      mockedComponentFileContents
    )
    fs.writeFileSync(
      '/level1/level2/level3/src/components/componentD.tsx',
      mockedComponentFileContents
    )

    const configPaths = findTypescriptConfigPaths([
      '/other_project/ComponentWithoutConfig.tsx',
      '/level1/src/components/componentA.tsx',
      '/level1/level2/level3/src/components/componentC.tsx',
      '/level1/level2/src/components/componentB.tsx',
      '/level1/level2/level3/src/components/componentD.tsx',
    ])

    const expectedResult: ITypescriptConfigPathsSearchResult = {
      found: {
        '/level1/tsconfig.json': ['/level1/src/components/componentA.tsx'],
        '/level1/level2/tsconfig.json': [
          '/level1/level2/src/components/componentB.tsx',
        ],
        '/level1/level2/level3/tsconfig.json': [
          '/level1/level2/level3/src/components/componentC.tsx',
          '/level1/level2/level3/src/components/componentD.tsx',
        ],
      },
      notFound: ['/other_project/ComponentWithoutConfig.tsx'],
    }
    expect(configPaths).toEqual(expectedResult)
  })

  it('exit with error in case of typescript compiler errors', () => {})
})
