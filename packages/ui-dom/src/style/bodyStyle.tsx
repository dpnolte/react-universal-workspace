import React from 'react'
import css from './body.css'

export const getBodyStyleMarkup = () => {
  return css.toString()
}
export const createBodyStyleElement = (): React.ReactElement => {
  return <style type="text/css">{getBodyStyleMarkup()}</style>
}
