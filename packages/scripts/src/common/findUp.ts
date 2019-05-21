import path from 'path'
import fs from 'fs'

type Matcher = (
  directoryPath: string,
  visitedDirectoryPaths: string[]
) => string | undefined
const isMatcher = (name: string | Matcher): name is Matcher => {
  return typeof name === 'function'
}
interface IFindUpOptions {
  cwd?: string
}

export const findUp = (
  name: Matcher | string,
  options: IFindUpOptions = {}
) => {
  let directoryPath = path.resolve(options.cwd || '')
  const directoryPaths: string[] = [directoryPath]
  const { root } = path.parse(directoryPath)

  const useMatcher = isMatcher(name)
  let canGoUpwards = true
  while (canGoUpwards) {
    let foundPath: string | undefined
    if (useMatcher) {
      foundPath = (name as Matcher)(directoryPath, directoryPaths)
    } else {
      const targetPath = path.resolve(directoryPath, name as string)
      foundPath = fs.existsSync(targetPath) ? targetPath : undefined
    }

    if (foundPath) {
      return path.resolve(directoryPath, foundPath)
    }

    canGoUpwards = directoryPath !== root
    if (canGoUpwards) {
      directoryPath = path.dirname(directoryPath)
      directoryPaths.push(directoryPath)
    }
  }
  return undefined
}

interface IResolvedDirs {
  [dirPath: string]: string
}
export const findUpAndRemember = (
  fileName: string,
  filePath: string,
  providedResolvedDirs?: IResolvedDirs
) => {
  const resolvedDirs = providedResolvedDirs || {}
  return findUp(
    (directoryPath: string, visitedDirectoryPaths: string[]) => {
      if (resolvedDirs[directoryPath]) {
        visitedDirectoryPaths.forEach(visitedPath => {
          if (visitedPath !== directoryPath) {
            resolvedDirs[visitedPath] = resolvedDirs[directoryPath]
          }
        })
        return resolvedDirs[directoryPath]
      }
      const configFilePath = path.resolve(directoryPath, fileName)
      if (fs.existsSync(configFilePath)) {
        visitedDirectoryPaths.forEach(visitedPath => {
          resolvedDirs[visitedPath] = configFilePath
        })
        return configFilePath
      }

      return undefined
    },
    {
      cwd: path.dirname(filePath),
    }
  )
}

export interface IFoundUpMultipleResult {
  found: {
    [configPath: string]: string[]
  }
  notFound: string[]
}

export const findUpMultiple = (
  fileName: string,
  filePaths: string[]
): IFoundUpMultipleResult => {
  const resolvedDirs = {}
  return filePaths.reduce(
    (acc, filePath) => {
      const matchingPath = findUpAndRemember(fileName, filePath, resolvedDirs)
      if (matchingPath) {
        if (!acc.found[matchingPath]) {
          acc.found[matchingPath] = []
        }
        acc.found[matchingPath].push(filePath)
      } else {
        acc.notFound.push(filePath)
      }
      return acc
    },
    // eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    { found: {}, notFound: [] } as IFoundUpMultipleResult
  )
}
