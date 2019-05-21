/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-extraneous-dependencies */
const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
// Module to control application life.
const { app } = electron
// Module to create native browser window.
const { BrowserWindow, ipcMain } = electron

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let backgroundWindow

function createWindow() {
  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 1024,
    defaultHeight: 768,
  })

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
  })

  mainWindowState.manage(mainWindow)

  // and load the index.html of the app.
  const url = process.env.ELECTRON_URL || `file://${__dirname}/build/index.html`
  mainWindow.loadURL(url, {
    webPreferences: {
      nodeIntegration: true, // needed to access file system
    },
  })

  // Open the DevTools.
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// Create a hidden background window
function createBackgroundWindow() {
  backgroundWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  })
  backgroundWindow.loadURL(`file://${__dirname}/public/background.html`)

  backgroundWindow.on('closed', event => {
    backgroundWindow = null
  })
}

function installExtensions() {
  // install extensions
  if (process.env.NODE_ENV === 'development') {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
      // REACT_PERF,
      // MOBX_DEVTOOLS,
      // eslint-disable-next-line global-require
    } = require('electron-devtools-installer')
    const extensions = [
      REACT_DEVELOPER_TOOLS,
      REDUX_DEVTOOLS,
      // REACT_PERF,
      // MOBX_DEVTOOLS,
    ]
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    for (const extension of extensions) {
      installExtension(extension, forceDownload)
        .then(name => console.log(`Added Extension:  ${name}`))
        .catch(err => console.log('An error occurred: ', err))
    }
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  if (!process.env.PROFILING) {
    installExtensions()
  }
  createWindow()
  createBackgroundWindow()

  // Renderers can talk to each other via main
  ipcMain.on('for-renderer', (event, arg) => {
    const { command } = arg
    if (!command) {
      console.log('no command provided')
    } else {
      mainWindow.webContents.send(command, arg)
    }
  })
  ipcMain.on('for-background', (event, arg) => {
    const { command } = arg
    if (!command) {
      console.log('no command provided')
    } else {
      backgroundWindow.webContents.send(command, arg)
    }
  })
  // Main thread can receive directly from windows
  ipcMain.on('to-main', (event, arg) => {
    console.log(arg)
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
module.exports = {
  electronApp: app,
}
