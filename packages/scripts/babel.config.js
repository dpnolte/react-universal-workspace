module.exports = function babelConfig(api) {
  api.cache.forever()
  return {
    presets: ['@babel/preset-env', '@babel/preset-typescript'],
    plugins: [
      '@babel/syntax-dynamic-import',
      '@babel/plugin-proposal-object-rest-spread',
      '@babel/transform-runtime',
    ],
  }
}
