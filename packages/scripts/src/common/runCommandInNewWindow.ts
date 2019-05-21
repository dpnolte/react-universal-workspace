/* eslint-disable no-console */
// based on: https://github.com/react-native-community/cli/blob/90a587e5832d2b8a484814fba1d6039979f0205e/packages/platform-android/src/commands/runAndroid/index.js
// please check their license (MIT)

import fs from 'fs'
import childProcess, { SpawnOptions } from 'child_process'
import tmp from 'tmp'
import { scriptsPackagePath } from './packages'

const createShellScript = (command: string, cwd: string): tmp.FileResult => {
  const content = `#!/bin/bash
# Set terminal title
echo -en "\\033]0;Universal workspace\\a"
clear

cd "${cwd}"

# shellcheck source=/dev/null
${command}


echo "Process terminated. Press <enter> to close the window"
read -r  
`
  const file = tmp.fileSync({
    mode: 0o777,
    postfix: '.command',
  })
  fs.appendFileSync(file.name, content, { mode: 0o777 })
  return file
}

const createBatchScript = (command: string, cwd: string): tmp.FileResult => {
  const content = `@echo off
title Universal workspace
cd ${cwd}
start ${command}
pause
exit
`
  const file = tmp.fileSync({
    mode: 0o777,
  })
  console.log(file.name)
  fs.appendFileSync(file.name, content, { mode: 0o777 })
  return file
}

export const runCommandInNewWindow = (
  command: string,
  cwd: string = scriptsPackagePath,
  terminal?: string
) => {
  const procConfig: SpawnOptions = { cwd: __dirname }

  if (process.platform === 'darwin') {
    const script = createShellScript(command, cwd)
    if (terminal) {
      return childProcess.spawnSync(
        'open',
        ['-a', terminal, script.name],
        procConfig
      )
    }
    return childProcess.spawnSync('open', [script.name], procConfig)
  }
  if (process.platform === 'linux') {
    const script = createShellScript(command, cwd)
    if (terminal) {
      procConfig.detached = true
      return childProcess.spawn(
        terminal,
        ['-e', `sh ${script.name}`],
        procConfig
      )
    }
    // By default, the child shell process will be attached to the parent
    procConfig.detached = false
    return childProcess.spawn('sh', [script.name], procConfig)
  }
  if (/^win/.test(process.platform)) {
    procConfig.detached = true
    procConfig.stdio = 'ignore'
    const script = createBatchScript(command, cwd)
    return childProcess.spawn('cmd.exe', ['/C', script.name], procConfig)
  }
  console.error(
    `Cannot start the packager. Unknown platform ${process.platform}`
  )
  return null
}
