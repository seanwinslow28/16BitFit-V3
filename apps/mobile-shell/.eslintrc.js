module.exports = {
  root: true,
  extends: '@react-native-community',
  rules: {
    // Prevent web library imports in React Native
    // React Native uses @testing-library/react-native, NOT @testing-library/react
    // This rule prevents Error #1 type issues (see: BUILD_ISSUES_ANALYSIS.md)
    // Added: 2025-11-15 after overnight autonomous dev session failure
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@testing-library/react',
            message: 'Use @testing-library/react-native for React Native projects. See: https://callstack.github.io/react-native-testing-library/',
          },
          {
            name: 'react-dom',
            message: 'Do not use react-dom in React Native projects. React Native uses native components, not DOM.',
          },
          {
            name: '@testing-library/react-hooks',
            message: 'Use renderHook from @testing-library/react-native instead (React 18+). See: https://callstack.github.io/react-native-testing-library/docs/api/#renderhook',
          },
          {
            name: 'enzyme',
            message: 'Enzyme is deprecated for React 18+. Use @testing-library/react-native instead.',
          },
        ],
      },
    ],
  },
};
