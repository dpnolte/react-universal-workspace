import { Screens } from '@mono/ui'
import { createNavigator, SwitchRouter } from '@react-navigation/core'
import { TopMenuView } from '../views'

export const RouteNames = {
  Home: 'Home',
  About: 'About',
  Docs: 'Docs',
  TodoList: 'TodoList',
}

export const TopMenuNavigator = createNavigator(
  TopMenuView,
  SwitchRouter({
    [RouteNames.Home]: {
      screen: Screens.Home,
      navigationOptions: {
        title: 'Home',
      },
    },
    [RouteNames.About]: {
      screen: Screens.About,
      navigationOptions: {
        title: 'About',
      },
    },
    [RouteNames.Docs]: {
      screen: Screens.Docs,
      navigationOptions: {
        title: 'Docs',
      },
    },
    [RouteNames.TodoList]: {
      screen: Screens.TodoList,
      navigationOptions: {
        title: 'Todo List',
      },
    },
  }),
  {}
)
