import React from 'react'
import { View, StyleSheet } from 'react-native'
import { P, ScreenContainer, Banner, ExternalLink } from '../elements'

export const About = () => {
  return (
    <ScreenContainer testID={AboutScreenTestId} style={styles.container}>
      <Banner title="About" />
      <View style={styles.contentContainer}>
        <P style={styles.contentText}>For more info, please visit </P>
        <ExternalLink
          style={styles.link}
          url="https://github.com/dpnolte/react-universal-workspace"
        />
      </View>
    </ScreenContainer>
  )
}

export const AboutScreenTestId = 'about-screen'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fefefe',
  },
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
  contentContainer: {
    backgroundColor: '#fefefe',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  contentText: {
    color: '#666',
  },
  link: {
    lineHeight: 21,
  },
})
