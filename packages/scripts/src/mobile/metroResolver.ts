import path from 'path'
import { IPackage, IPackages } from '../common/packages'

const isModuleNameBelongingToDependency = (
  moduleName: string,
  dependency: IPackage
) => {
  if (moduleName.startsWith(dependency.name)) {
    const afterDepStartsWithSlash =
      moduleName.length > dependency.name.length &&
      moduleName[dependency.name.length] === '/'
    if (afterDepStartsWithSlash) {
      return true
    }
  }
  return false
}

export const getAnyWorkspaceDependencyPath = (
  moduleName: string,
  dependencies: IPackages
) => {
  if (dependencies[moduleName]) {
    return path.resolve(dependencies[moduleName].path, 'src')
  }

  const dependency = Object.values(dependencies).find(dep =>
    isModuleNameBelongingToDependency(moduleName, dep)
  )
  return dependency ? { type: 'sourceFile', filePath: dependency.path } : null
}
