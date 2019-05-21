import React from 'react'
import iconFont from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'

export const getVectorIconFontStyle = () => {
  const iconFontStyles = `@font-face {
    src: url(${iconFont});
    font-family: MaterialCommunityIcons;
  }`
  return iconFontStyles
}

export const createVectorIconFontStyleElement = (): React.ReactElement => {
  return <style type="text/css">{getVectorIconFontStyle()}</style>
}

export const injectVectorIconFontStyle = () => {
  // Create stylesheet
  const style = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(getVectorIconFontStyle()))
  // Inject stylesheet
  document.head.appendChild(style)
}
