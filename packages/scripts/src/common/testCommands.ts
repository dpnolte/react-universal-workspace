import execa from 'execa'
import fs from 'fs'
import path from 'path'
import {
  findPackagesForFiles,
  workspaceRootPath,
  IFilesPerPackage,
} from './packages'
import { pMap } from './pmap'

export interface ITestCommand {
  cwd: string
  bin: string
  args: string[]
}
export const getTestCommandsForFiles = (
  filePaths: string[],
  commandArgs: string[] = [],
  filesPerPackageRetriever: (
    filePaths: string[]
  ) => IFilesPerPackage = findPackagesForFiles
): ITestCommand[] => {
  const workspacePackages = filesPerPackageRetriever(filePaths)
  return Object.values(workspacePackages).reduce(
    (acc, workspacePackage) => {
      const configPath = path.resolve(workspacePackage.path, 'package.json')
      const packageConfig = JSON.parse(fs.readFileSync(configPath).toString())
      const jestDependency =
        packageConfig.dependencies.jest || packageConfig.devDependencies.jest
      if (!jestDependency) {
        throw Error(
          `Package '${path.relative(
            workspaceRootPath,
            configPath
          )}' has no jest dependency. Don't know how to run test`
        )
      }
      acc.push({
        cwd: workspacePackage.path,
        bin: 'yarn',
        args: [
          'run',
          'jest',
          ...commandArgs,
          '--findRelatedTests',
          ...workspacePackage.filePaths,
        ],
      })
      return acc
    },
    [] as ITestCommand[]
  )
}

const createTestTask = (testCommand: ITestCommand) => {
  return execa(testCommand.bin, testCommand.args, {
    cwd: testCommand.cwd,
    reject: false,
  })
}

export const runTestCommands = async (
  filePaths: string[],
  commandArgs: string[] = []
) => {
  const testCommands = getTestCommandsForFiles(filePaths, commandArgs)
  const results = await pMap(testCommands, createTestTask, {
    concurrency: testCommands.length,
    aggregateError: false,
  })
  const killed = results.some(res => res.killed)
  const signal = results
    .map(res => res.signal)
    .filter(Boolean)
    .join(', ')
  if (killed || (signal && signal !== '')) {
    throw Error(`Testing was terminated with ${signal}`)
  }
  const failed = results.some(res => res.failed)
  if (failed) {
    const errors = results.filter(res => res.failed || res.killed)
    throw Error(
      `Test resulted in some errors. Please fix them and try committing again.${errors
        .map(err => err.stdout)
        .join('')}${errors.map(err => err.stderr).join('')}`
    )
  }
}
