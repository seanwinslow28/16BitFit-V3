module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    // NOTE: NativeWind babel plugin temporarily disabled due to compatibility issues with RN 0.71.8
    // TODO: Re-enable after upgrading to RN 0.74+
    // 'nativewind/babel',
    // Required for Reanimated (MUST be the last plugin)
    'react-native-reanimated/plugin',
  ],
};
