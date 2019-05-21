import React from 'react'
import { View, StyleSheet, Platform } from 'react-native'
import { ReactIcon } from '../ReactIcon'
import { H1 } from './H1'
import { isDom } from '../platforms'

interface IProps {
  title: string
}
const domProps = {
  accessibilityRole: isDom ? 'banner' : undefined,
}

export const Banner: React.FunctionComponent<IProps> = (props: IProps) => {
  const { title } = props
  return (
    <View style={styles.header} {...domProps as any}>
      <ReactIcon style={styles.reactIcon} />
      <H1 style={styles.headerText}>{title}</H1>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#222',
    height: 100,
    padding: 20,
  },
  headerText: {
    color: '#fff',
    textAlign: 'left',
    marginLeft: 100,
    marginVertical: 20,
  },
  reactIcon: {
    height: 96,
    width: 96,
  },
})
