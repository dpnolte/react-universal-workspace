import AsyncStorage from '@react-native-community/async-storage'
import { NavigationState } from '@react-navigation/core'

const PERSISTED_NAVIGATION_STATE_KEY = 'PERSISTED_NAVIGATION_STATE'
const getPersistenceFunctions = () => {
  return __DEV__
    ? {
        persistNavigationState: async (navState: NavigationState) => {
          try {
            await AsyncStorage.setItem(
              PERSISTED_NAVIGATION_STATE_KEY,
              JSON.stringify(navState)
            )
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(
              'persisting navigation state failed',
              err,
              PERSISTED_NAVIGATION_STATE_KEY,
              navState
            )
          }
        },
        loadNavigationState: async () => {
          try {
            const jsonString = await AsyncStorage.getItem(
              PERSISTED_NAVIGATION_STATE_KEY
            )
            if (jsonString) {
              return JSON.parse(jsonString)
            }
            return null
          } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(
              'loading navigation state failed',
              err,
              PERSISTED_NAVIGATION_STATE_KEY
            )
            return null
          }
        },
      }
    : undefined
}

export const persistNavState = {
  getPersistenceFunctions,
}
