declare module 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'
declare module 'react-native-vector-icons/dist/MaterialCommunityIcons' {
  import * as React from 'react'

  export interface IIconProps extends TextProps {
    /**
     * Size of the icon, can also be passed as fontSize in the style object.
     *
     * @default 12
     */
    size?: number

    /**
     * Name of the icon to show
     *
     * See Icon Explorer app
     * {@link https://github.com/oblador/react-native-vector-icons/tree/master/Examples/IconExplorer}
     */
    name: string

    /**
     * Color of the icon
     *
     */
    color?: string
  }

  export class Icon extends React.Component<IIconProps, any> {
    static getImageSource(
      name: string,
      size?: number,
      color?: string
    ): Promise<ImageSource>

    static loadFont(file?: string): Promise<void>

    static hasIcon(name: string): boolean
  }

  export default Icon
}
