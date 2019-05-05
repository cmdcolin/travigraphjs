module.exports = {
    presets: [
      '@babel/preset-typescript',
      'react-app',
      [
        '@babel/preset-env',
        {
          targets: {
            node: 8,
            browsers: ['> 0.5%', 'last 2 versions'],
          },
        },
      ],
    ]
}
