/* eslint-disable no-console */
import yargs from 'yargs'
import {
  findTypescriptConfigPaths,
  checkForAnyTypeErrors,
} from '../common/typescript'
import {
  fixWorkspacePackageNonConformants,
  getConformanceConfigRulesFromFile,
  verifyWorkspacePackageConformancy,
} from '../common/conformingPackages'
import { runTestCommands } from '../common/testCommands'
import { toAbsolutePaths } from '../common/packages'

// eslint-disable-next-line no-unused-expressions
yargs
  .usage('Usage: $0 <command> [options]')
  .command(
    'package-conformance',
    'check if packages across mono repo conform to the provided configuration',
    (builder: yargs.Argv) => {
      return builder
        .example(
          '$0 package-conformance --check --config packages.conformance.jsonc',
          'checks if all packages conform to config defined in packages.conformance.jsonc'
        )
        .alias('c', 'check')
        .describe('c', 'checks if all packages conform to provided config')
        .alias('f', 'fix')
        .describe(
          'f',
          "fix all packages's non-conformaties as defined in the config"
        )
        .alias('cfg', 'config')
        .describe(
          'cfg',
          'provide config json in which the dependency rules are defined'
        )
    },
    argv => {
      const { config, fix } = argv
      const rules = config
        ? getConformanceConfigRulesFromFile(config as string | undefined)
        : undefined
      if (fix) {
        fixWorkspacePackageNonConformants(rules)
      } else {
        const result = verifyWorkspacePackageConformancy(rules)
        process.exit(result ? 0 : 1)
      }
    }
  )
  .command(
    'check-types [files...]',
    'check for any diagnostic errors resulting from the typescript compiler',
    (builder: yargs.Argv) => {
      return builder
        .example(
          '$0 check-types file1.ts file2.tsx',
          'checks type errors for the given files'
        )
        .positional('files', {
          describe: 'file path for the files to be type checked',
        })
    },
    async argv => {
      const files = argv.files as string[] | undefined
      if (!files) {
        console.error('At least one file path needs to be provided')
        return process.exit(1)
      }
      const filePaths = toAbsolutePaths(files)
      const configPaths = findTypescriptConfigPaths(filePaths)
      if (configPaths.notFound.length > 0) {
        const joinedFiles = configPaths.notFound.join('\n-\t')
        console.error(
          `No project configuration file, 'tsconfig.json', found for the following file(s):\n-\t${joinedFiles}`
        )
        process.exit(1)
      }
      const anyTypeErrors = await checkForAnyTypeErrors(configPaths)
      return process.exit(anyTypeErrors ? 1 : 0)
    }
  )
  .command(
    'test [files...]',
    'find related tests per package and run those tests',
    (builder: yargs.Argv) => {
      return builder
        .example(
          '$0 test file1.ts file2.tsx',
          'find related tests per package that file1 and file2 belong to and run those tests'
        )
        .positional('files', {
          describe: 'file path for the files to be type checked',
        })
    },
    async argv => {
      const files = argv.files as string[] | undefined
      if (!files) {
        console.error('At least one file path needs to be provided')
        return process.exit(1)
      }
      const filePaths = toAbsolutePaths(files)
      try {
        await runTestCommands(filePaths)
        return process.exit(0)
      } catch (err) {
        if (typeof err[Symbol.iterator] === 'function') {
          // eslint-disable-next-line no-restricted-syntax
          for (const e of err) {
            console.error(e)
          }
        }
        console.error(err)
        return process.exit(1)
      }
    }
  )
  .demandCommand()
  .help('h')
  .alias('h', 'help').argv
