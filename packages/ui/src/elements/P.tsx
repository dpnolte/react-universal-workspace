import React from 'react'
import { StyleSheet, TextStyle, StyleProp, Text } from 'react-native'

interface IProps {
  style?: StyleProp<TextStyle>
  children: React.ReactNode
}
export const P = (props: IProps) => {
  const { children, style } = props
  return <Text style={[styles.p, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  p: {
    fontSize: 14,
    lineHeight: 21, // 14 * 1.5
  },
})
