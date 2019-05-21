import React from 'react'
import { StyleSheet, StyleProp, ViewStyle, ScrollView } from 'react-native'
import { isDom } from '../platforms'

interface IProps {
  testID?: string
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  children: React.ReactNode
}
const domProps = {
  accessibilityRole: isDom ? 'main' : undefined,
}
export const ScrollScreenContainer = (props: IProps) => {
  const { children, style, contentContainerStyle, testID } = props
  return (
    <ScrollView
      testID={testID}
      style={[styles.scrollView, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      {...domProps as any}
    >
      {children}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    margin: 0,
    padding: 0,
    flex: isDom ? 1 : undefined,
    height: '100%',
    width: '100%',
  },
  contentContainer: {},
})
