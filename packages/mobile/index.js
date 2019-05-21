/**
 * @format
 */

import { AppRegistry } from 'react-native'
// eslint-disable-next-line import/no-unresolved
import { useScreens } from 'react-native-screens'
import { App } from './src/App'
import { name as appName } from './app.json'
// eslint-disable-next-line import/no-unresolved

// expose native navigation container components to React Native (e.g, fragment activity)
// @see https://reactnavigation.org/docs/en/react-native-screens.html
useScreens()

AppRegistry.registerComponent(appName, () => App)
