import React from 'react'
import { StyleSheet, TextStyle, StyleProp, Text } from 'react-native'
import { isDom } from '../platforms'

interface IProps {
  style?: StyleProp<TextStyle>
  children: React.ReactNode
}

const accessibilityProps = {
  accessibilityRole: isDom ? 'heading' : undefined,
  'aria-level': isDom ? '3' : undefined,
}
export const H3 = (props: IProps) => {
  const { children, style } = props
  return (
    <Text style={[styles.h3, style]} {...accessibilityProps as any}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  h3: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
