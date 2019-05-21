declare module 'react-native-web' {
  import * as React from 'react'

  type ComponentProvider = () => React.ComponentType<any>
  interface IApplication {
    element: React.ReactElement
    getStyleElement: (props?: React.HTMLAttributes) => React.ReactElement
  }
  interface IAppRegistry {
    registerComponent: (
      appKey: string,
      componentProvider: ComponentProvider
    ) => string
    getApplication: (appKey: string, appParameters?: any) => IApplication
  }
  export const AppRegistry: IAppRegistry
}
