/* eslint-disable no-console */
import React from 'react'
import {
  StyleSheet,
  TextStyle,
  StyleProp,
  Text,
  Linking,
  TouchableOpacity,
} from 'react-native'
import { isDom } from '../platforms'

export interface IProps {
  style?: StyleProp<TextStyle>
  url: string
  title?: string
}

const openUrlNative = (url: string) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url)
    } else if (process.env.NODE_ENV === 'development') {
      console.warn(`Don't know how to open URI: ${url}`)
    }
  })
}

const platformSpecificProps = (url: string) => {
  if (isDom) {
    return {
      accessibilityRole: 'link',
      href: url,
      target: '_blank',
    }
  }
  return {
    onPress: () => openUrlNative(url),
  }
}

export const ExternalLink = (props: IProps) => {
  const { url, title, style } = props
  const label = title || url
  return (
    <TouchableOpacity {...platformSpecificProps(url) as any}>
      <Text style={[styles.link, style]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  link: {
    color: 'rgb(33, 150, 243)',
    fontSize: 14,
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
  },
})
