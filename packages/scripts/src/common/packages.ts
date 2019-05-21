/* eslint-disable no-console */
import path from 'path'
import fs from 'fs'
import { findUp } from './findUp'

export const scriptsPackagePath = path.resolve(__dirname, '..', '..')
export const packagesPath = path.resolve(scriptsPackagePath, '..')
export const workspaceRootPath = path.resolve(packagesPath, '..')

export interface IPackage {
  name: string
  version: string
  path: string
  main: string
}

export interface IPackages {
  [name: string]: IPackage
}

export const parseJsonConfig = (jsonPath: string) =>
  JSON.parse(fs.readFileSync(jsonPath).toString())

export const getWorkspacePackages = (): IPackages => {
  return fs
    .readdirSync(packagesPath)
    .reduce((acc: IPackages, filePath: string) => {
      const packageJsonPath = path.join(packagesPath, filePath, 'package.json')
      if (fs.existsSync(packageJsonPath)) {
        const config = JSON.parse(fs.readFileSync(packageJsonPath).toString())
        acc[config.name] = {
          name: config.name,
          version: config.version,
          path: path.resolve(packagesPath, filePath),
          main: config.main,
        }
      }
      return acc
    }, {})
}

export const getWorkspaceDependenciesForPackage = (
  targetPackagePath: string,
  providedPackages?: IPackages
): IPackages => {
  const packages = providedPackages || getWorkspacePackages()
  const packageJsonPath = path.join(targetPackagePath, 'package.json')
  if (!fs.existsSync(packageJsonPath)) {
    console.error(`no package.json found @ ${packageJsonPath}`)
    return {}
  }
  const config = parseJsonConfig(packageJsonPath)
  if (!config.dependencies) {
    return {}
  }
  return Object.keys(config.dependencies).reduce(
    (acc: IPackages, dependencyName: string) => {
      if (packages[dependencyName]) {
        acc[dependencyName] = packages[dependencyName]
      }
      return acc
    },
    {}
  )
}

export interface IFilesPerPackage {
  [packageDirPath: string]: IPackage & { filePaths: string[] }
}
export const findPackagesForFiles = (
  filePaths: string[],
  workspacePackagesRetriever: () => IPackages = getWorkspacePackages
): IFilesPerPackage => {
  const workspacePackages = workspacePackagesRetriever()
  const packageDirPaths: string[] = []
  const workspacePackagesPerPath = Object.values(workspacePackages).reduce(
    (acc, workspacePackage) => {
      acc[workspacePackage.path] = workspacePackage
      packageDirPaths.push(workspacePackage.path)
      return acc
    },
    {}
  )
  return filePaths.reduce((acc, filePath) => {
    const packageDirPath = packageDirPaths.find(packagePath =>
      filePath.startsWith(packagePath)
    )
    if (!packageDirPath) {
      throw Error(`File is not in workspace package: ${filePath}`)
    }
    if (!acc[packageDirPath]) {
      acc[packageDirPath] = workspacePackagesPerPath[packageDirPath]
      acc[packageDirPath].filePaths = []
    }
    acc[packageDirPath].filePaths.push(filePath)
    return acc
  }, {})
}

export const toAbsolutePaths = (filePaths: string[]): string[] => {
  return filePaths.map(filePath => {
    if (path.isAbsolute(filePath)) {
      return filePath
    }
    return path.resolve(filePath)
  })
}

// Many OSS React Native packages are not compiled to ES5 before being
// published. Add such packages here to transpile them
export const transpileNonES5Modules = ['react-native-vector-icons']
export const includeNonES5Modules = () => {
  return transpileNonES5Modules.map(moduleName => {
    const pathToMainEntryDir = path.dirname(require.resolve(moduleName))
    const pathToPackageJson = findUp('package.json', {
      cwd: path.dirname(pathToMainEntryDir),
    })
    return pathToPackageJson
      ? path.dirname(pathToPackageJson)
      : pathToMainEntryDir
  })
}
