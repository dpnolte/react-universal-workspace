import React from 'react'
import {
  createBottomTabNavigator,
  BottomTabNavigatorConfig,
} from 'react-navigation-tabs'
import { Screens } from '@mono/ui'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { withSafeArea } from '../../screens'

export const RouteNames = {
  Home: 'Home',
  Docs: 'Docs',
  TodoList: 'TodoList',
  About: 'About',
}

export const TabBarTestIds = {
  Home: 'tab-button-home',
  Docs: 'tab-button-docs',
  TodoList: 'tab-button-todo-list',
  About: 'tab-button-about',
}

export const createSimpleTabs = (options: BottomTabNavigatorConfig = {}) => {
  return createBottomTabNavigator(
    {
      [RouteNames.Home]: {
        screen: withSafeArea(Screens.Home),
        params: { title: 'Home' },
        navigationOptions: {
          tabBarTestID: TabBarTestIds.Home,
          tabBarIcon: ({ tintColor }: { tintColor: string }) => (
            <Icon name="home" size={20} color={tintColor} />
          ),
        },
      },
      [RouteNames.Docs]: {
        screen: withSafeArea(Screens.Docs),
        params: { title: 'Docs' },
        navigationOptions: {
          tabBarTestID: TabBarTestIds.Docs,
          tabBarIcon: ({ tintColor }: { tintColor: string }) => (
            <Icon name="file-document-outline" size={20} color={tintColor} />
          ),
        },
      },
      [RouteNames.TodoList]: {
        screen: withSafeArea(Screens.TodoList),
        params: { title: 'Todos' },
        navigationOptions: {
          tabBarTestID: TabBarTestIds.TodoList,
          tabBarIcon: ({ tintColor }: { tintColor: string }) => (
            <Icon name="format-list-checkbox" size={20} color={tintColor} />
          ),
        },
      },
      [RouteNames.About]: {
        screen: withSafeArea(Screens.About),
        params: { title: 'About' },
        navigationOptions: {
          tabBarTestID: TabBarTestIds.About,
          tabBarIcon: ({ tintColor }: { tintColor: string }) => (
            <Icon name="vector-arrange-above" size={20} color={tintColor} />
          ),
        },
      },
    },
    {
      backBehavior: 'history',
      ...options,
      tabBarOptions: {
        ...options.tabBarOptions,
      },
    }
  )
}
export const TabNavigator = createSimpleTabs()
