import React from 'react'
import {
  StyleSheet,
  TextStyle,
  StyleProp,
  Text,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
  TouchableNativeFeedbackProps,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// eslint-disable-next-line import/no-unresolved
import { IconProps } from 'react-native-vector-icons/Icon'
import { isAndroid, isDom } from '../platforms'

interface IProps {
  title: string
  titleStyle?: StyleProp<TextStyle>
  containerStyle?: StyleProp<ViewStyle>
  icon?: string
  iconProps?: IconProps
  disabled?: boolean
  iconOnly?: boolean
  onPress: () => void
}

const TouchableComponent: React.ComponentType<
  TouchableOpacityProps | TouchableNativeFeedbackProps
> = isAndroid ? TouchableNativeFeedback : TouchableOpacity
const touchableProps =
  isAndroid && Platform.Version >= 21
    ? {
        background: TouchableNativeFeedback.Ripple('ThemeAttrAndroid', false),
      }
    : {
        background: isAndroid
          ? TouchableNativeFeedback.SelectableBackground()
          : undefined,
      }

const domProps = (title: string) => {
  return isDom
    ? {
        accessible: true,
        accessibilityRole: 'button',
        accessibilityLabel: `Tap to ${title}`,
      }
    : undefined
}
export const Button = (props: IProps) => {
  const {
    title,
    titleStyle,
    onPress,
    disabled,
    icon,
    containerStyle,
    iconProps,
    iconOnly,
  } = props
  return (
    <TouchableComponent
      {...touchableProps}
      onPress={onPress}
      disabled={disabled}
      {...domProps(title) as any}
    >
      <View
        style={[
          styles.buttonContents,
          iconOnly ? styles.iconOnly : undefined,
          containerStyle,
        ]}
      >
        {icon && <Icon name={icon} color="white" size={16} {...iconProps} />}
        {!iconOnly && <Text style={[styles.title, titleStyle]}>{title}</Text>}
      </View>
    </TouchableComponent>
  )
}

Button.defaultProps = {
  disabled: false,
  iconOnly: false,
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    paddingLeft: 4,
  },
  icon: {},
  buttonContents: {
    backgroundColor: 'rgb(33, 150, 243)',
    borderRadius: 2,
    flexDirection: 'row',
    paddingTop: 8,
    paddingLeft: 4,
    paddingRight: 8,
    paddingBottom: 8,
  },
  iconOnly: {
    paddingLeft: 8,
  },
})
