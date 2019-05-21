/* eslint-disable no-console */
import { diff } from 'deep-diff'
import fs from 'fs'
import path from 'path'
import stripJsonComments from 'strip-json-comments'
import { getWorkspacePackages } from './packages'

interface IKeyValueString {
  [dependencyName: string]: string
}
export interface IPackageConformanceRule {
  key: string
  matcher: RegExp
  config: IPackageConfig
}
export enum DependencyType {
  Normal = 'Normal',
  Dev = 'Dev',
}

interface IPackageConfig {
  [property: string]: any
  name?: string
  scripts?: IKeyValueString
  dependencies?: IKeyValueString
  devDependencies?: IKeyValueString
}

const getPackageConfig = (packagePath: string): IPackageConfig => {
  if (!fs.existsSync(packagePath)) {
    throw Error(`package path file does not exist: ${packagePath}`)
  }
  return JSON.parse(fs.readFileSync(packagePath).toString())
}

const getConformanceRulesForPackageConfig = (
  packageConfig: IPackageConfig,
  rules: IPackageConformanceRule[]
) => {
  if (!packageConfig.name) {
    throw Error(`Invalid package config, it is missing a name`)
  }
  const packageName = packageConfig.name as string
  const relevantRules: IPackageConformanceRule[] = rules.reduce(
    (acc, rule) => {
      if (rule.matcher.test(packageName)) {
        acc.push(rule)
      }
      return acc
    },
    [] as IPackageConformanceRule[]
  )
  return relevantRules
}

export const getConformanceRulesForPackage = (
  configPath: string,
  rules: IPackageConformanceRule[]
) => {
  const packageConfig = getPackageConfig(configPath)
  return getConformanceRulesForPackageConfig(packageConfig, rules)
}

interface INonConformingConfigItem {
  ruleKey: string
  path: string[]
  propertyName: string
  requiredValue: any
  foundValue?: any
  missingValue: boolean
}
interface INonConformingConfigMap {
  [joinedPath: string]: INonConformingConfigItem
}

const getConformancePropertyPaths = (config: IPackageConfig): Set<string> => {
  const propertyPaths: Set<string> = new Set<string>()
  traverseForConformancePropertyPaths(config, propertyPaths)
  return propertyPaths
}
const traverseForConformancePropertyPaths = (
  config: any,
  paths: Set<string>,
  currentPath: string[] = []
) => {
  if (typeof config === 'object' && !Array.isArray(config)) {
    Object.keys(config).forEach(propertyName => {
      const nextPath = [...currentPath, propertyName]
      paths.add(`/${nextPath.join('/')}`)
      traverseForConformancePropertyPaths(config[propertyName], paths, nextPath)
    })
  }
}

const getNonConformingConfig = (
  packageConfig: IPackageConfig,
  rules: IPackageConformanceRule[]
): INonConformingConfigMap => {
  const relevantRules = getConformanceRulesForPackageConfig(
    packageConfig,
    rules
  )

  return relevantRules.reduce((acc, rule) => {
    const conformancePropertyPaths = getConformancePropertyPaths(rule.config)
    const differences = diff<IPackageConfig>(
      rule.config,
      packageConfig,
      (propertyPath, propertyName) => {
        const joinedP =
          propertyPath.length > 0
            ? `/${propertyPath.join('/')}/${propertyName}`
            : `/${propertyName}`
        return !conformancePropertyPaths.has(joinedP)
      }
    )
    if (differences) {
      const items: INonConformingConfigMap = differences.reduce(
        (itemsFromThisRule, difference) => {
          const configItemPath = `/${difference.path.join('/')}`
          if (difference.kind === 'D' || difference.kind === 'E') {
            const item = {
              ruleKey: rule.key,
              propertyName: difference.path[difference.path.length - 1],
              path: difference.path as string[],
              requiredValue: difference.lhs,
              foundValue: difference.kind !== 'D' ? difference.rhs : undefined,
              missingValue: difference.kind === 'D',
            }
            return {
              ...itemsFromThisRule,
              [configItemPath]: item,
            }
          }
          if (difference.kind === 'A') {
            // for arrays, we don't have the value
            // look it up
            let requiredValue = rule.config
            let foundValue = packageConfig
            let missingValue = false
            difference.path.forEach(pathPart => {
              requiredValue = requiredValue[pathPart]
              if (!missingValue && foundValue[pathPart]) {
                foundValue = foundValue[pathPart]
              } else {
                missingValue = true
              }
            })
            const item = {
              ruleKey: rule.key,
              propertyName: difference.path[difference.path.length - 1],
              path: difference.path as string[],
              requiredValue,
              foundValue: !missingValue ? foundValue : undefined,
              missingValue,
            }

            return { ...itemsFromThisRule, [configItemPath]: item }
          }
          // ignore newly added items
          return itemsFromThisRule
        },
        {}
      )
      return { ...acc, ...items }
    }
    return acc
  }, {})
}

export const getNonConformingConfigAtPath = (
  configPath: string,
  rules: IPackageConformanceRule[]
): INonConformingConfigMap => {
  const packageConfig = getPackageConfig(configPath)
  return getNonConformingConfig(packageConfig, rules)
}

const printNonConformingItems = (
  packagePath: string,
  packageConfig: IPackageConfig,
  nonConformingItems: INonConformingConfigMap,
  fix: boolean = false
) => {
  const packageName = packageConfig.name || 'unnamed package'
  const prefix = fix ? 'Fixed' : 'Invalid'
  console.log(`${prefix} package '${packageName}', path: ${packagePath}`)
  console.log('-'.repeat(20))
  Object.keys(nonConformingItems).forEach(propertyPath => {
    const nonConformingItem = nonConformingItems[propertyPath]
    let reason: string
    if (fix) {
      reason = nonConformingItem.missingValue
        ? `added property with value '${
            nonConformingItem.requiredValue
          }' to config`
        : `updated property value from '${nonConformingItem.foundValue}' to '${
            nonConformingItem.requiredValue
          }'`
    } else {
      reason = nonConformingItem.missingValue
        ? 'property not found'
        : `'${nonConformingItem.requiredValue}' is not same as '${
            nonConformingItem.foundValue
          }'`
    }
    console.log(
      `-\t${propertyPath}: ${reason}, (matcher: '${nonConformingItem.ruleKey}')`
    )
  })
  console.log('-'.repeat(20))
}

export const verifyIfPackageIsConformant = (
  packageConfigPath: string,
  rules: IPackageConformanceRule[],
  printOut: boolean = true
) => {
  const packageConfig = getPackageConfig(packageConfigPath)
  const nonConformingItems = getNonConformingConfig(packageConfig, rules)
  const valid = Object.keys(nonConformingItems).length === 0

  if (!valid && printOut) {
    printNonConformingItems(
      packageConfigPath,
      packageConfig,
      nonConformingItems
    )
  }
  return valid
}

export const fixAnyInvalidDependenciesForPackage = (
  packageConfigPath: string,
  rules: IPackageConformanceRule[],
  printOut: boolean = true
) => {
  const packageConfig = getPackageConfig(packageConfigPath)
  const nonConformingItems = getNonConformingConfig(packageConfig, rules)
  const propertyPaths = Object.keys(nonConformingItems)
  if (propertyPaths.length > 0) {
    const updatedPackageConfig = { ...packageConfig }
    propertyPaths.forEach(propertyPath => {
      const nonConformingItem = nonConformingItems[propertyPath]
      let reference = updatedPackageConfig
      if (nonConformingItem.path.length > 1) {
        nonConformingItem.path.slice(0, -1).forEach(pathPart => {
          reference = reference[pathPart]
        })
      }
      reference[nonConformingItem.propertyName] =
        nonConformingItem.requiredValue
    })

    fs.writeFileSync(
      packageConfigPath,
      JSON.stringify(updatedPackageConfig, null, 2)
    )
    if (printOut) {
      printNonConformingItems(
        packageConfigPath,
        packageConfig,
        nonConformingItems,
        true
      )
    }
  }
  return false
}

interface IDependencyJson {
  [matcher: string]: {
    dependencies?: IKeyValueString
    devDependencies?: IKeyValueString
  }
}

const regExpFromString = (q: string) => {
  let flags = q.replace(/.*\/([gimuy]*)$/, '$1')
  if (flags === q) flags = ''
  const pattern = flags ? q.replace(new RegExp(`^/(.*?)/${flags}$`), '$1') : q
  try {
    return new RegExp(pattern, flags)
  } catch (e) {
    return null
  }
}
export const getConformanceConfigRulesFromFile = (providedPath?: string) => {
  const rulesConfigPath =
    providedPath || path.resolve(process.cwd(), 'packages.conformance.jsonc')

  if (!fs.existsSync(rulesConfigPath)) {
    throw Error(`No package conformance config file found @ ${rulesConfigPath}`)
  }
  const jsonContent = stripJsonComments(
    fs.readFileSync(rulesConfigPath).toString()
  )
  let json: IDependencyJson
  try {
    json = JSON.parse(jsonContent)
  } catch (err) {
    throw Error(`${err.message}\nJson:\n${jsonContent}`)
  }
  const matchers = Object.keys(json)
  if (matchers.length === 0) {
    throw Error(
      `Package conformance config file has no contents @ ${rulesConfigPath}`
    )
  }
  return matchers.reduce(
    (acc, matcher) => {
      const regexp = regExpFromString(matcher)
      if (!regexp) {
        throw Error(`invalid regexp: ${matcher} `)
      }
      const config = json[matcher]
      if (Object.keys(config).length === 0) {
        throw Error(`matcher '${matcher}' has no contents`)
      }
      acc.push({
        key: matcher,
        matcher: regexp,
        config,
      })
      return acc
    },
    [] as IPackageConformanceRule[]
  )
}

export const verifyWorkspacePackageConformancy = (
  providedRules?: IPackageConformanceRule[]
) => {
  const rules = providedRules || getConformanceConfigRulesFromFile()

  const packageConfigs = getWorkspacePackages()
  const invalidPackages = Object.values(packageConfigs).filter(
    packageConfig => {
      return !verifyIfPackageIsConformant(
        path.resolve(packageConfig.path, 'package.json'),
        rules
      )
    }
  )
  return invalidPackages.length === 0
}

export const fixWorkspacePackageNonConformants = (
  providedRules?: IPackageConformanceRule[]
) => {
  const rules = providedRules || getConformanceConfigRulesFromFile()
  const packageConfigs = getWorkspacePackages()
  Object.values(packageConfigs).every(packageConfig => {
    fixAnyInvalidDependenciesForPackage(
      path.resolve(packageConfig.path, 'package.json'),
      rules
    )
    return true
  })
}
