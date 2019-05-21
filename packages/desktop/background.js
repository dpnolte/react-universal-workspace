/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
const electron = require('electron')
const Datastore = require('nedb')
const path = require('path')

const { ipcRenderer } = electron

const DATABASE_FILE_NAME = 'key_value_pairs.db'

// Send logs as messages to the main thread to show on the console
function log(value) {
  ipcRenderer.send('to-main', `@background-renderer ${process.pid}: ${value}`)
}
// let the main thread know this thread is ready to process something
function ready() {
  log('process is ready')
  ipcRenderer.send('ready')
}

const userDataPath = (electron.app || electron.remote.app).getPath('userData')
const databasePath = path.resolve(userDataPath, DATABASE_FILE_NAME)
const db = new Datastore({ filename: databasePath, autoload: true })
db.ensureIndex({ fieldName: 'key', unique: true })

ipcRenderer.on('loadKeyValuePair', (event, args) => {
  const { key } = args
  const returningCommand = {
    command: 'loadedKeyValuePair',
    key,
    success: false,
  }
  if (!key) {
    log(`no key argument provided, required for command ${args.command}`)
    ipcRenderer.send('for-renderer', returningCommand)
    return
  }
  db.findOne({ key }, (err, doc) => {
    if (err) {
      log(`error finding document with key ${key}, err: ${err}`)
      return
    }
    returningCommand.success = !!doc
    returningCommand.value = returningCommand.success ? doc.value : undefined
    ipcRenderer.send('for-renderer', returningCommand)
  })
})

ipcRenderer.on('saveKeyValuePair', (event, args) => {
  const { key, value } = args
  if (!key || !value) {
    log(
      `no 'key' or/and 'value' argument provided, required for command ${
        args.command
      }`
    )
    ipcRenderer.send('for-renderer', {
      command: 'savedKeyValuePair',
      key,
      success: false,
    })
    return
  }
  db.update({ key }, { key, value }, { upsert: true }, err => {
    if (err) {
      log(`error finding document with key ${key}, err: ${err}`)
      return
    }
    ipcRenderer.send('for-renderer', {
      command: 'savedKeyValuePair',
      key,
      success: true,
    })
  })
})

// if message is received, pass it back to the renderer via the main thread
ipcRenderer.on('message', (event, arg) => {
  ipcRenderer.send('for-renderer', `${process.pid}: reply to ${arg}`)
  ready()
})

ready()
