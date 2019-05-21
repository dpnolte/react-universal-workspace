// eslint-disable-next-line import/no-extraneous-dependencies
import { ipcRenderer } from 'electron'

function save<TSnapshot>(key: string, snapshot: TSnapshot): Promise<void> {
  return new Promise(resolve => {
    try {
      ipcRenderer.send('for-background', {
        command: 'saveKeyValuePair',
        key,
        value: snapshot,
      })
      resolve()
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('error in load task', err)
      }
      resolve(undefined)
    }
  })
}

interface IKeyValueCommandResult<TSnapshot> {
  success: boolean
  value?: TSnapshot
  key: string
}

interface ILoadedListeners {
  [key: string]: ((result: IKeyValueCommandResult<unknown>) => void) | null
}
const onLoadedListeners: ILoadedListeners = {}
ipcRenderer.on(
  'loadedKeyValuePair',
  (event: Event, result: IKeyValueCommandResult<unknown>) => {
    const { key } = result
    if (key) {
      const listener = onLoadedListeners[key]
      if (listener) {
        listener(result)
        onLoadedListeners[key] = null
      }
    }
  }
)

function load<TSnapshot>(key: string): Promise<TSnapshot | undefined> {
  const loadSnapshotTask = new Promise<TSnapshot | false>(resolve => {
    try {
      if (onLoadedListeners[key]) {
        // already listening
        resolve(false)
      }
      console.log('sending loadKeyValuePair command')
      ipcRenderer.send('for-background', {
        command: 'loadKeyValuePair',
        key,
      })
      onLoadedListeners[key] = result => {
        console.log('received loadedKeyValuePair command', result)
        if (result.success) {
          resolve(result.value as TSnapshot)
        } else {
          resolve(false)
        }
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('error in load task', err)
      }
      onLoadedListeners[key] = null
      resolve(false)
    }
  })
  const onTimeout = new Promise<'timed-out'>(resolve => {
    setTimeout(() => {
      resolve('timed-out')
    }, 5000)
  })
  return Promise.race([loadSnapshotTask, onTimeout]).then(res => {
    if (res === 'timed-out') {
      if (process.env.NODE_ENV === 'development') {
        console.warn('load snapshot task ran longer than 5000ms')
      }
      return undefined
    }
    if (res === false) {
      return undefined
    }
    return res
  })
}

export const persistSnapshot = {
  save,
  load,
}
