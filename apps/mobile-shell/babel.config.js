module.exports = {
  presets: ['babel-preset-expo'],
  plugins: [
    // NOTE: NativeWind babel plugin temporarily disabled due to compatibility issues with RN 0.71.8
    // TODO: Re-enable after upgrading to RN 0.74+
    // 'nativewind/babel',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json', '.png', '.jpg', '.jpeg'],
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
