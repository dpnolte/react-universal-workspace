function save<TSnapshot>(key: string, snapshot: TSnapshot): Promise<void> {
  return new Promise(resolve => {
    try {
      localStorage.setItem(key, JSON.stringify(snapshot))
      resolve()
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('error in load task', err)
      }
      resolve(undefined)
    }
  })
}

function load<TSnapshot>(key: string): Promise<TSnapshot | undefined> {
  return new Promise<TSnapshot | undefined>(resolve => {
    try {
      const json = localStorage.getItem(key)
      if (json) {
        resolve(JSON.parse(json) as TSnapshot)
      } else {
        resolve(undefined)
      }
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('error in load task', err)
      }
      resolve(undefined)
    }
  })
}

export const persistSnapshot = {
  save,
  load,
}
