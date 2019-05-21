import React from 'react'
import { StyleSheet, Animated, Easing } from 'react-native'
import { AnimatedReactIcon } from '../ReactIcon'
import { H1, P, ScreenContainer } from '../elements'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IProps {}

interface IState {
  spinValue: Animated.Value
}

export class Home extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)

    this.state = {
      spinValue: new Animated.Value(0),
    }
  }

  componentDidMount() {
    const { spinValue } = this.state
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
      })
    ).start()
  }

  render() {
    const { spinValue } = this.state
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    })

    return (
      <ScreenContainer testID={HomeScreenTestId} style={styles.container}>
        <P style={styles.mediumText}>Welcome to this mono repo</P>
        <H1 style={styles.bigText}>ONE REPO TO RULE THEM ALL</H1>
        <AnimatedReactIcon style={{ transform: [{ rotate: spin }] }} />
      </ScreenContainer>
    )
  }
}

export const HomeScreenTestId = 'home-screen'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  mediumText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  bigText: {
    color: '#fff',
    backgroundColor: 'rgba(34, 34, 34, 0.5)',
    textAlign: 'center',
    fontSize: 32,
    marginVertical: 20,
    zIndex: 999,
  },
})
