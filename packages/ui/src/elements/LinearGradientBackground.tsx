import React from 'react'
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native'
import Svg, {
  Defs,
  Stop,
  LinearGradient,
  Rect,
  StopProps,
  LinearGradientProps,
} from 'react-native-svg'

interface IProps extends LinearGradientProps {
  children?: React.ReactNode
  stops: StopProps[]
  style?: StyleProp<ViewStyle>
}

const createStopKey = (stopProps: StopProps) =>
  Object.values(stopProps).join('|')

export const LinearGradientBackground = (props: IProps) => {
  const { children, stops, style, id, ...restProps } = props
  return (
    <View style={{ position: 'relative', flex: 1 }}>
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
          <Defs>
            <LinearGradient id={id} {...restProps}>
              {stops.map(stop => (
                <Stop key={createStopKey(stop)} {...stop} />
              ))}
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill={`url(#${id})`} />
        </Svg>
      </View>
      <View style={style}>{children}</View>
    </View>
  )
}

// Top left = 0,0
// Bottom right = 1,1
export const DiagonalLinearGradientBackground = (props: IProps) => {
  return <LinearGradientBackground x1={0} y1={0} x2={1} y2={1} {...props} />
}

export const VerticalLinearGradientBackground = (props: IProps) => {
  return <LinearGradientBackground x1={0} y1={0} x2={0} y2={1} {...props} />
}
