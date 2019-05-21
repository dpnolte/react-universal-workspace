/* eslint-disable no-console */
import path from 'path'
import fs from 'fs'
import ts from 'typescript'
import { IFoundUpMultipleResult, findUpMultiple } from './findUp'
import { pMap } from './pmap'
import { workspaceRootPath } from './packages'

export const findTypescriptConfigPaths = (
  filePaths: string[]
): IFoundUpMultipleResult => {
  return findUpMultiple('tsconfig.json', filePaths)
}

interface IDiagnosticMessages {
  [filePathOrGeneric: string]: string[]
}
export interface ITypescriptCompileResult {
  success: boolean
  numberOfFailedFiles: number
  diagnosticMessages: IDiagnosticMessages
  configPath: string
}

const runTsc = (
  configPath: string,
  filePaths: string[],
  options: ts.CompilerOptions,
  initialConfigPath: string
): ITypescriptCompileResult => {
  const program = ts.createProgram(filePaths, options)
  const emitResult = program.emit()

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics)

  const failedFiles = new Set<string>()
  const diagnosticMessages: IDiagnosticMessages = {}

  allDiagnostics.forEach(diagnostic => {
    if (diagnostic.file) {
      failedFiles.add(diagnostic.file.fileName)
      const { line, character } = diagnostic.file.getLineAndCharacterOfPosition(
        diagnostic.start as number
      )
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      )
      const relativePath = path.relative(
        workspaceRootPath,
        path.resolve(path.dirname(configPath), diagnostic.file.fileName)
      )
      if (!diagnosticMessages[relativePath]) {
        diagnosticMessages[relativePath] = []
      }
      diagnosticMessages[relativePath].push(
        `${relativePath} (${line + 1},${character + 1}): ${message}`
      )
    } else {
      if (!diagnosticMessages.generic) {
        diagnosticMessages.generic = []
      }
      diagnosticMessages.generic.push(
        `${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`
      )
    }
  })

  return {
    success: allDiagnostics.length === 0,
    numberOfFailedFiles: failedFiles.size,
    diagnosticMessages,
    configPath: initialConfigPath,
  }
}

const getTypescriptCompileDiagnostics = (
  providedConfigPath: string,
  filePaths: string[]
) => {
  const optionsList: ts.CompilerOptions[] = []
  let canExtend = true
  let configPath = providedConfigPath
  while (canExtend) {
    const configContents = fs.readFileSync(configPath).toString()
    const { config, error } = ts.parseConfigFileTextToJson(
      configPath,
      configContents
    )

    if (error) {
      throw Error(error.messageText as string)
    }

    const settings = ts.convertCompilerOptionsFromJson(
      config.compilerOptions || {},
      path.dirname(configPath)
    )
    optionsList.unshift(settings.options)
    if (config.extends && typeof config.extends === 'string') {
      canExtend = true
      configPath = path.resolve(path.dirname(configPath), config.extends)
    } else {
      canExtend = false
    }
  }
  const options = optionsList.reduce((acc, o) => ({ ...acc, ...o }), {})
  options.noEmit = true
  return runTsc(configPath, filePaths, options, providedConfigPath)
}

interface ICompileTaskArgs {
  configPath: string
  filePaths: string[]
  printOut: boolean
}
export const createTypescriptCompileTask = ({
  configPath,
  filePaths,
  printOut,
}: ICompileTaskArgs) => {
  return new Promise<ITypescriptCompileResult>((resolve, reject) => {
    if (printOut === true) {
      console.log(
        `Compiling project '${path.relative(workspaceRootPath, configPath)}'...`
      )
    }
    const results = getTypescriptCompileDiagnostics(configPath, filePaths)
    if (results.success === true) {
      resolve(results)
    } else {
      reject(results)
    }
  })
}

export const checkForAnyTypeErrors = async (
  configPaths: IFoundUpMultipleResult,
  printOut: boolean = true
): Promise<boolean> => {
  const taskArgs = Object.keys(configPaths.found).map(configPath => ({
    configPath,
    filePaths: configPaths.found[configPath],
    printOut,
  }))

  try {
    await pMap(taskArgs, createTypescriptCompileTask, {
      concurrency: taskArgs.length,
      aggregateError: printOut,
    })
    return true
  } catch (errors) {
    if (printOut === true) {
      // eslint-disable-next-line no-restricted-syntax
      for (const result of errors as ITypescriptCompileResult[]) {
        const files = `${result.numberOfFailedFiles} ${
          result.numberOfFailedFiles > 1 ? 'files' : 'file'
        }`
        const relativeConfigPath = path.relative(
          workspaceRootPath,
          result.configPath
        )
        console.log(
          `@project ${relativeConfigPath}: Type errors identified in ${files}`
        )
        Object.keys(result.diagnosticMessages).forEach(
          (filePathOrGeneric, index) => {
            const messages = result.diagnosticMessages[filePathOrGeneric]
            if (filePathOrGeneric === 'generic') {
              console.log(`${index + 1}) @generic: diagnostic errors found`)
            } else {
              console.log(
                `${index + 1}) @file ${filePathOrGeneric}: type errors`
              )
            }
            console.log('-'.repeat(20))
            console.log(`-\t${messages.join('\n-\t')}`)
            console.log('-'.repeat(20))
          }
        )
      }
    }
    return false
  }
}
