/* eslint-disable no-console */
import React from 'react'
import {
  StyleSheet,
  TextStyle,
  StyleProp,
  Text,
  TouchableOpacity,
} from 'react-native'
// eslint-disable-next-line import/no-extraneous-dependencies
import { shell } from 'electron'

interface IProps {
  style?: StyleProp<TextStyle>
  url: string
  title?: string
}

export const ExternalLink = (props: IProps) => {
  const { url, title, style } = props
  const label = title || url
  return (
    <TouchableOpacity onPress={() => shell.openExternal(url)}>
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
