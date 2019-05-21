import React from 'react'
import { StyleSheet, TextStyle, StyleProp, Text } from 'react-native'
import { isDom } from '../platforms'

interface IProps {
  style?: StyleProp<TextStyle>
  children: React.ReactNode
}

const domProps = {
  accessibilityRole: isDom ? 'heading' : undefined,
}
export const H1 = (props: IProps) => {
  const { children, style } = props
  return (
    <Text style={[styles.h1, style]} {...domProps as any}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
  },
})
