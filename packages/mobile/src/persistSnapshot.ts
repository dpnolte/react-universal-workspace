import AsyncStorage from '@react-native-community/async-storage'

function save<TSnapshot>(key: string, snapshot: TSnapshot): Promise<void> {
  return AsyncStorage.setItem(key, JSON.stringify(snapshot)).catch(err => {
    if (__DEV__) {
      console.warn('Retrieving snapshot failed', key, err)
    }
  })
}

function load<TSnapshot>(key: string): Promise<TSnapshot | undefined> {
  return AsyncStorage.getItem(key)
    .then(json => {
      if (json) {
        return JSON.parse(json) as TSnapshot
      }
      return undefined
    })
    .catch(err => {
      if (__DEV__) {
        console.warn('Retrieving snapshot failed', key, err)
      }
      return undefined
    })
}

export const persistSnapshot = {
  save,
  load,
}
