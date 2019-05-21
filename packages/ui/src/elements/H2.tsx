import React from 'react'
import { StyleSheet, TextStyle, StyleProp, Text } from 'react-native'
import { isDom } from '../platforms'

interface IProps {
  style?: StyleProp<TextStyle>
  children: React.ReactNode
}

const domProps = {
  accessibilityRole: isDom ? 'heading' : undefined,
  'aria-level': isDom ? '2' : undefined,
}
export const H2 = (props: IProps) => {
  const { children, style } = props
  return (
    <Text style={[styles.h2, style]} {...domProps as any}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  h2: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})
