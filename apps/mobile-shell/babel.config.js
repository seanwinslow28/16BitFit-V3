module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: [
            '.ios.js',
            '.android.js',
            '.js',
            '.ts',
            '.tsx',
            '.json',
            '.png',
            '.jpg',
            '.jpeg',
          ],
          alias: {
            '@': './src',
            '@/design-system': './src/design-system',
            '@/components': './src/components',
            '@/assets': './assets',
          },
        },
      ],
      // Required for Reanimated (MUST be the last plugin)
      'react-native-reanimated/plugin',
    ],
  };
};
