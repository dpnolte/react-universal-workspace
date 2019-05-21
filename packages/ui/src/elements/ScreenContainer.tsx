import React from 'react'
import { StyleSheet, StyleProp, ViewStyle, View } from 'react-native'
import { isDom } from '../platforms'

interface IProps {
  testID?: string
  style?: StyleProp<ViewStyle>
  children: React.ReactNode
}

const domProps = {
  accessibilityRole: isDom ? 'main' : undefined,
}
export const ScreenContainer = (props: IProps) => {
  const { children, style, testID } = props
  return (
    <View
      testID={testID}
      style={[styles.container, style]}
      {...domProps as any}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 0,
    padding: 0,
    flex: isDom ? 1 : undefined,
    height: '100%',
    width: '100%',
  },
})
