declare module '*.css' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}
declare module '*.woff'
declare module '*.woff2'
declare module '*.ttf'
