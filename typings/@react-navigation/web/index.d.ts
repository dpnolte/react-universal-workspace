/* eslint-disable */

declare module '@react-navigation/web' {
  import {
    NavigationInjectedProps,
    NavigationParams,
    NavigationScreenProp,
    NavigationRouter,
    NavigationRoute,
  } from '@react-navigation/core'

  export const Link: React.ComponentType<
    Pick<NavigationInjectedProps<NavigationParams>, never> & {
      routeName: string
      navigation: NavigationScreenProp<any, any>
      anchorProps?: React.HTMLAttributes
    }
  >
  export const createBrowserApp: (app: any) => React.ComponentType

  interface IHandledServerRequest {
    navigation: NavigationScreenProp<NavigationRoute>
    title: string
    options: any
  }
  export const handleServerRequest: (
    router: NavigationRouter,
    pathWithLeadingSlash: string,
    query: any
  ) => IHandledServerRequest
}
