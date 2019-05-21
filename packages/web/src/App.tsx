import { createBrowserApp } from '@react-navigation/web'
import { AppNavigator } from './AppNavigator'

// Note: this can only be invoked from client (needs DOM history)
export const App = createBrowserApp(AppNavigator)
