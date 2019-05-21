/* eslint-disable import/no-extraneous-dependencies */
declare module '@react-navigation/native' {
  import {
    NavigationNavigator,
    NavigationContainer,
  } from '@react-navigation/core'
  /**
   * Create an app container to wrap the root navigator
   *
   * @see https://github.com/react-navigation/react-navigation-native/blob/098e2e52b349d37357109d5aee545fa74699d3d4/src/createAppContainer.js#L64
   */
  export function createAppContainer(
    Component: NavigationNavigator<any, any, any>
  ): NavigationContainer
}
