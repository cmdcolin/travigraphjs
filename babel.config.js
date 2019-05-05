module.exports = {
  presets: [
    '@babel/preset-typescript',
    'react-app',
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions'],
        },
      },
    ],
  ],
}
