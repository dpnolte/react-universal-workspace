import path from 'path'
import fs from 'fs'
import rimraf from 'rimraf'
import { ncp } from 'ncp'
import { workspaceRootPath, parseJsonConfig } from '../common/packages'

const desktopPackagePath = path.resolve(workspaceRootPath, 'packages/desktop')
const targetPath = path.join(desktopPackagePath, 'dist')
const buildPath = path.join(desktopPackagePath, 'build')
const indexFilePath = path.join(desktopPackagePath, 'index.js')
const { name, version, license } = parseJsonConfig(
  path.join(desktopPackagePath, 'package.json')
)

const packageJsonContents = `
{
  "name": "${name}",
  "version": "${version}",
  "private": true,
  "license": "${license}",
  "homepage": "./",
  "main": "index.js",
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
`

const packageApp = async () => {
  if (fs.existsSync(targetPath)) {
    await new Promise((resolve, reject) => {
      rimraf(targetPath, error => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }
  fs.mkdirSync(targetPath)
  fs.writeFileSync(path.join(targetPath, 'package.json'), packageJsonContents)
  await new Promise((resolve, reject) => {
    ncp(buildPath, path.join(targetPath, 'build'), error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
  fs.copyFileSync(indexFilePath, path.join(targetPath, 'index.js'))
}

packageApp()
